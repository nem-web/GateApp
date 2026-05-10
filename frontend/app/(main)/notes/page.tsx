'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Code,
  Sparkles,
  Layers,
  HelpCircle,
  Trash2,
  Upload,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { GATE_EE_SUBJECTS } from '@/lib/gate-ee'
import { useTheme } from 'next-themes'

type NoteSummary = {
  id: string
  title: string
  subject: string
  updatedAt?: string
}

type NotePdf = {
  id: string
  fileName: string
}

type NoteDetail = {
  id: string
  title: string
  subject: string
  content: string
  topic?: string | null
  pdfs?: NotePdf[]
}

type NoteFolder = {
  id: string
  name: string
  icon: string
  notes: { id: string; title: string; lastEdited: string }[]
}

const folderIcon = '📘'

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteSummary[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [folders, setFolders] = useState<NoteFolder[]>([])
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [noteDetail, setNoteDetail] = useState<NoteDetail | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [aiOutput, setAiOutput] = useState<{ type: string; content: string } | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const saveTimer = useRef<NodeJS.Timeout | null>(null)
  const { resolvedTheme } = useTheme()

  const editorClass = useMemo(
    () =>
      `prose ${resolvedTheme === 'dark' ? 'prose-invert' : ''} max-w-none focus:outline-none min-h-[400px] px-4 py-3`,
    [resolvedTheme],
  )

  const buildFolders = useCallback((rows: NoteSummary[]) => {
    const map = new Map<string, { id: string; title: string; lastEdited: string }[]>()
    for (const n of rows) {
      const subject = n.subject || 'Notes'
      if (!map.has(subject)) map.set(subject, [])
      const lastEdited = n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : ''
      map.get(subject)!.push({ id: n.id, title: n.title, lastEdited })
    }
    const nextFolders: NoteFolder[] = [...map.entries()].map(([name, entries]) => ({
      id: name,
      name,
      icon: folderIcon,
      notes: entries,
    }))
    nextFolders.sort((a, b) => a.name.localeCompare(b.name))
    setFolders(nextFolders)
    setExpandedFolders((prev) => (prev.length ? prev : nextFolders.slice(0, 2).map((f) => f.id)))
  }, [])

  const loadNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/notes')
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      const rows = Array.isArray(data.notes) ? data.notes : []
      const summaries: NoteSummary[] = rows.map((n: Record<string, unknown>) => ({
        id: String(n.id ?? ''),
        title: typeof n.title === 'string' ? n.title : 'Untitled',
        subject: typeof n.subject === 'string' ? n.subject : 'Notes',
        updatedAt: typeof n.updatedAt === 'string' ? n.updatedAt : undefined,
      }))
      setNotes(summaries)
      setSubjects(Array.isArray(data.subjects) && data.subjects.length ? data.subjects : [...GATE_EE_SUBJECTS])
      buildFolders(summaries)
    } catch {
      setNotes([])
      setSubjects([...GATE_EE_SUBJECTS])
      setFolders([])
    }
  }, [buildFolders])

  const loadNoteDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`)
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      setNoteDetail({
        id: String(data.id ?? id),
        title: typeof data.title === 'string' ? data.title : 'Untitled',
        subject: typeof data.subject === 'string' ? data.subject : 'Notes',
        content: typeof data.content === 'string' ? data.content : '',
        topic: typeof data.topic === 'string' ? data.topic : null,
        pdfs: Array.isArray(data.pdfs)
          ? data.pdfs.map((p: Record<string, unknown>) => ({
              id: String(p.id ?? ''),
              fileName: typeof p.fileName === 'string' ? p.fileName : 'PDF',
            }))
          : [],
      })
      setDirty(false)
      setSaveState('idle')
    } catch {
      setNoteDetail(null)
    }
  }, [])

  useEffect(() => {
    void loadNotes()
  }, [loadNotes])

  useEffect(() => {
    if (notes.length) buildFolders(notes)
  }, [notes, buildFolders])

  useEffect(() => {
    if (selectedId) void loadNoteDetail(selectedId)
  }, [selectedId, loadNoteDetail])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your notes...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: editorClass,
      },
    },
    onUpdate: ({ editor }) => {
      if (!noteDetail) return
      const html = editor.getHTML()
      setNoteDetail((prev) => (prev ? { ...prev, content: html } : prev))
      setDirty(true)
    },
  })

  useEffect(() => {
    if (!editor || !noteDetail) return
    editor.commands.setContent(noteDetail.content || '<p></p>', false)
  }, [editor, noteDetail?.id])

  useEffect(() => {
    if (!editor) return
    editor.setOptions({
      editorProps: {
        attributes: {
          class: editorClass,
        },
      },
    })
  }, [editor, editorClass])

  useEffect(() => {
    if (!noteDetail || !dirty) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaveState('saving')
      try {
        const res = await fetch(`/api/notes/${noteDetail.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: noteDetail.title,
            content: noteDetail.content,
            subject: noteDetail.subject,
            topic: noteDetail.topic ?? null,
          }),
        })
        if (!res.ok) throw new Error('bad')
        const data = await res.json()
        setNotes((prev) =>
          prev.map((n) => (n.id === noteDetail.id ? { ...n, title: data.title, subject: data.subject, updatedAt: data.updatedAt } : n)),
        )
        setSaveState('saved')
        setDirty(false)
      } catch {
        setSaveState('error')
      }
    }, 800)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [noteDetail, dirty])

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const handleCreateNote = async () => {
    const subject = subjects[0] ?? GATE_EE_SUBJECTS[0]
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New note', subject, content: '' }),
      })
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      const newNote: NoteSummary = {
        id: String(data.id),
        title: typeof data.title === 'string' ? data.title : 'New note',
        subject: typeof data.subject === 'string' ? data.subject : subject,
        updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
      }
      setNotes((prev) => [newNote, ...prev])
      setSelectedId(newNote.id)
    } catch {
      toast.error('Could not create note')
    }
  }

  const handleDeleteNote = async () => {
    if (!noteDetail) return
    const id = noteDetail.id
    setSelectedId(null)
    setNoteDetail(null)
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    } catch {
      toast.error('Could not delete note')
    }
    const remaining = notes.filter((n) => n.id !== id)
    setNotes(remaining)
    buildFolders(remaining)
  }

  const handlePdfUpload = async (file: File | null) => {
    if (!file || !noteDetail) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`/api/notes/${noteDetail.id}/pdf`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('bad')
      await loadNoteDetail(noteDetail.id)
      toast.success('PDF uploaded')
    } catch {
      toast.error('PDF upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleOpenPdf = async (pdfId: string) => {
    try {
      const res = await fetch(`/api/notes/pdf/${pdfId}/signed-url`)
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      if (data?.url) window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Unable to open PDF')
    }
  }

  const handleAiAction = async (action: 'summarize' | 'flashcards' | 'quiz') => {
    if (!noteDetail) return
    const text = editor?.getText() ?? ''
    if (!text.trim()) {
      setAiOutput({ type: action, content: 'Write something in the editor first.' })
      return
    }
    const endpoints: Record<string, string> = {
      summarize: '/api/ai/summarize-note',
      flashcards: '/api/ai/generate-flashcards',
      quiz: '/api/ai/generate-quiz',
    }
    const url = endpoints[action]
    if (!url) return
    setIsAiLoading(true)
    setAiOutput(null)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      const content = typeof data.content === 'string' ? data.content : data.error ?? 'AI unavailable.'
      if (action === 'flashcards') {
        try {
          const parsed = JSON.parse(content) as Array<{ front: string; back: string }>
          if (Array.isArray(parsed) && parsed.length) {
            await Promise.all(
              parsed.slice(0, 12).map((card) =>
                fetch('/api/flashcards', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    noteId: noteDetail.id,
                    subject: noteDetail.subject,
                    front: card.front,
                    back: card.back,
                    source: 'note-ai',
                  }),
                }),
              ),
            )
            setAiOutput({ type: action, content: `Saved ${parsed.length} flashcards.` })
            return
          }
        } catch {
          /* fall back to raw output */
        }
      }
      setAiOutput({ type: action, content })
    } catch {
      setAiOutput({ type: action, content: 'Request failed. Try again.' })
    } finally {
      setIsAiLoading(false)
    }
  }

  const selectedFolderNotes = useMemo(() => {
    if (!noteDetail) return []
    return noteDetail.pdfs ?? []
  }, [noteDetail])

  return (
    <div className="flex h-[calc(100dvh-9rem)] w-full max-w-[100vw] overflow-hidden lg:h-[calc(100vh-7rem)]">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="w-[260px] border-r border-border p-4 flex-shrink-0 overflow-y-auto hidden md:block"
      >
        <button
          onClick={handleCreateNote}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all mb-4"
        >
          <Plus size={16} />
          New Note
        </button>

        <div className="space-y-1">
          {folders.map((folder) => (
            <div key={folder.id}>
              <button
                onClick={() => toggleFolder(folder.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-all"
              >
                {expandedFolders.includes(folder.id) ? (
                  <ChevronDown size={14} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground" />
                )}
                <span>{folder.icon}</span>
                <span className="font-medium">{folder.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {folder.notes.length}
                </span>
              </button>

              {expandedFolders.includes(folder.id) && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {folder.notes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => setSelectedId(note.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all ${
                        selectedId === note.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <span className="truncate">{note.title}</span>
                      <span className="text-[10px] opacity-60">{note.lastEdited}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
        className="flex-1 flex flex-col min-w-0"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border">
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-secondary transition-colors ${
                editor?.isActive('bold') ? 'bg-secondary text-primary' : 'text-muted-foreground'
              }`}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-secondary transition-colors ${
                editor?.isActive('italic') ? 'bg-secondary text-primary' : 'text-muted-foreground'
              }`}
            >
              <Italic size={16} />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-secondary transition-colors ${
                editor?.isActive('heading', { level: 1 }) ? 'bg-secondary text-primary' : 'text-muted-foreground'
              }`}
            >
              <Heading1 size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-secondary transition-colors ${
                editor?.isActive('heading', { level: 2 }) ? 'bg-secondary text-primary' : 'text-muted-foreground'
              }`}
            >
              <Heading2 size={16} />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-secondary transition-colors ${
                editor?.isActive('bulletList') ? 'bg-secondary text-primary' : 'text-muted-foreground'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-secondary transition-colors ${
                editor?.isActive('code') ? 'bg-secondary text-primary' : 'text-muted-foreground'
              }`}
            >
              <Code size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {noteDetail && (
              <button
                onClick={handleDeleteNote}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-destructive/40 text-destructive text-xs font-medium hover:bg-destructive/10"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
            <span className="text-[11px] text-muted-foreground">
              {saveState === 'saving'
                ? 'Saving…'
                : saveState === 'saved'
                  ? 'Saved'
                  : saveState === 'error'
                    ? 'Save failed'
                    : noteDetail
                      ? 'Auto-save on'
                      : ''}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 py-3 border-b border-border bg-card/40">
          <input
            type="text"
            value={noteDetail?.title ?? ''}
            onChange={(e) => {
              setNoteDetail((prev) => (prev ? { ...prev, title: e.target.value } : prev))
              setDirty(true)
            }}
            placeholder="Note title"
            className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            disabled={!noteDetail}
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={noteDetail?.subject ?? ''}
              onChange={(e) => {
                setNoteDetail((prev) => (prev ? { ...prev, subject: e.target.value } : prev))
                setDirty(true)
              }}
              className="px-3 py-2 rounded-lg bg-input border border-border text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={!noteDetail}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={noteDetail?.topic ?? ''}
              onChange={(e) => {
                setNoteDetail((prev) => (prev ? { ...prev, topic: e.target.value } : prev))
                setDirty(true)
              }}
              placeholder="Topic (optional)"
              className="flex-1 min-w-[140px] px-3 py-2 rounded-lg bg-input border border-border text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={!noteDetail}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-card/50">
          {noteDetail ? (
            <EditorContent editor={editor} className="h-full" />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Select or create a note to start editing</p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
        className="w-[240px] border-l border-border p-4 flex-shrink-0 hidden lg:flex flex-col"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">AI Tools</h3>

        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Summarize</span>
            </div>
            <button
              onClick={() => handleAiAction('summarize')}
              disabled={isAiLoading || !noteDetail}
              className="w-full py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50"
            >
              Generate Summary
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Flashcards</span>
            </div>
            <button
              onClick={() => handleAiAction('flashcards')}
              disabled={isAiLoading || !noteDetail}
              className="w-full py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50"
            >
              Make Flashcards
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Quiz</span>
            </div>
            <button
              onClick={() => handleAiAction('quiz')}
              disabled={isAiLoading || !noteDetail}
              className="w-full py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50"
            >
              Generate Quiz
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">PDF Attachments</h4>
          {noteDetail ? (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <Upload size={14} />
                <span>{uploading ? 'Uploading…' : 'Upload PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => handlePdfUpload(e.target.files?.[0] ?? null)}
                />
              </label>
              {selectedFolderNotes.length ? (
                <div className="space-y-1">
                  {selectedFolderNotes.map((pdf) => (
                    <button
                      key={pdf.id}
                      onClick={() => handleOpenPdf(pdf.id)}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <FileText size={12} />
                      <span className="truncate">{pdf.fileName}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">No PDFs yet.</p>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">Select a note to manage PDFs.</p>
          )}
        </div>

        {(isAiLoading || aiOutput) && (
          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
            {isAiLoading ? (
              <p className="text-sm text-primary">
                Thinking
                <span className="thinking-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </p>
            ) : aiOutput ? (
              <div>
                <p className="text-xs text-primary font-medium mb-2 capitalize">{aiOutput.type}</p>
                <p className="text-xs text-foreground/80 whitespace-pre-line">{aiOutput.content}</p>
              </div>
            ) : null}
          </div>
        )}
      </motion.div>
    </div>
  )
}
