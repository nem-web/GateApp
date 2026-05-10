'use client'

import { useEffect, useState } from 'react'
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
  Underline,
  Heading1,
  Heading2,
  List,
  Code,
  Image,
  Sparkles,
  Layers,
  HelpCircle,
  Trash2,
  Upload,
} from 'lucide-react'

type NoteFolder = {
  id: string
  name: string
  icon: string
  notes: { id: string; title: string; lastEdited: string }[]
}

export default function NotesPage() {
  const [folders, setFolders] = useState<NoteFolder[]>([])
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [selectedNote, setSelectedNote] = useState<{ id: string; title: string } | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>('Engineering Mathematics')
  const [aiOutput, setAiOutput] = useState<{ type: string; content: string } | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  const loadNotes = async () => {
    const res = await fetch('/api/notes', { cache: 'no-store' })
    if (!res.ok) throw new Error('load failed')
    const data = await res.json()
    const rows = Array.isArray(data.notes) ? data.notes : []
    const map = new Map<string, { id: string; title: string; lastEdited: string }[]>()
    for (const n of rows as Array<Record<string, unknown>>) {
      const subject =
        typeof n.subject === 'string' ? n.subject : typeof n.subjectId === 'string' ? 'Subject' : 'Notes'
      if (!map.has(subject)) map.set(subject, [])
      const updatedRaw = n.updatedAt
      let lastEdited = ''
      try {
        if (updatedRaw instanceof Date) lastEdited = updatedRaw.toLocaleDateString()
        else if (typeof updatedRaw === 'string') lastEdited = new Date(updatedRaw).toLocaleDateString()
      } catch {
        lastEdited = ''
      }
      map.get(subject)!.push({
        id: String(n.id ?? ''),
        title: typeof n.title === 'string' ? n.title : 'Untitled',
        lastEdited,
      })
    }
    const nextFolders: NoteFolder[] = [...map.entries()].map(([name, notes]) => ({
      id: name,
      name,
      icon: '📘',
      notes,
    }))
    nextFolders.sort((a, b) => a.name.localeCompare(b.name))
    setFolders(nextFolders)
    setExpandedFolders((prev) => {
      if (prev.length > 0) return prev
      return nextFolders.slice(0, 2).map((f) => f.id)
    })
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await loadNotes()
        if (cancelled) return
      } catch {
        if (!cancelled) setFolders([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your notes...',
      }),
    ],
    content: selectedNote ? noteContent : '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
    onUpdate: ({ editor: ed }) => {
      setNoteContent(ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.commands.setContent(selectedNote ? noteContent : '', false)
  }, [editor, noteContent, selectedNote?.id])

  useEffect(() => {
    if (!selectedNote) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/notes/${selectedNote.id}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) {
          setNoteContent(typeof data.content === 'string' ? data.content : '')
          if (typeof data.subject === 'string') setSelectedSubject(data.subject)
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [selectedNote?.id])

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const handleAiAction = async (action: string) => {
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
      setAiOutput({ type: action, content })
    } catch {
      setAiOutput({ type: action, content: 'Request failed. Try again.' })
    } finally {
      setIsAiLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedNote) return
    const timer = setTimeout(async () => {
      try {
        setSaving(true)
        const res = await fetch(`/api/notes/${selectedNote.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: selectedNote.title,
            content: noteContent,
            subject: selectedSubject,
          }),
        })
        if (!res.ok) return
        setLastSavedAt(new Date().toLocaleTimeString())
      } finally {
        setSaving(false)
      }
    }, 900)
    return () => clearTimeout(timer)
  }, [noteContent, selectedNote?.id, selectedSubject, selectedNote?.title])

  const createNote = async () => {
    const title = `New note ${new Date().toLocaleDateString()}`
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content: '<p></p>',
        subject: selectedSubject || 'Engineering Mathematics',
      }),
    })
    if (!res.ok) return
    const note = await res.json()
    await loadNotes()
    setSelectedNote({ id: note.id, title: note.title })
    setNoteContent(note.content ?? '<p></p>')
  }

  const deleteCurrentNote = async () => {
    if (!selectedNote) return
    const res = await fetch(`/api/notes/${selectedNote.id}`, { method: 'DELETE' })
    if (!res.ok) return
    setSelectedNote(null)
    setNoteContent('')
    await loadNotes()
  }

  const uploadPdfForCurrentNote = async (file: File) => {
    if (!selectedNote) return
    const form = new FormData()
    form.append('file', file)
    await fetch(`/api/notes/${selectedNote.id}/pdf`, {
      method: 'POST',
      body: form,
    })
    await loadNotes()
  }

  return (
    <div className="flex h-[calc(100dvh-9rem)] w-full max-w-[100vw] overflow-hidden lg:h-[calc(100vh-7rem)]">
          {/* Left Panel - Folder Tree */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-[260px] border-r border-border p-4 flex-shrink-0 overflow-y-auto hidden md:block"
          >
            <button
              onClick={createNote}
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
                          onClick={() => setSelectedNote(note)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all ${
                            selectedNote?.id === note.id
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

          {/* Center Panel - Editor */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
            className="flex-1 flex flex-col min-w-0"
          >
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-border">
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
              <button className="p-2 rounded hover:bg-secondary transition-colors text-muted-foreground">
                <Underline size={16} />
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
              <button className="p-2 rounded hover:bg-secondary transition-colors text-muted-foreground">
                <Image size={16} />
              </button>
              <div className="ml-auto flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border text-xs text-muted-foreground hover:bg-secondary cursor-pointer">
                  <Upload size={13} />
                  PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) void uploadPdfForCurrentNote(file)
                    }}
                  />
                </label>
                <button
                  onClick={deleteCurrentNote}
                  disabled={!selectedNote}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border text-xs text-muted-foreground hover:bg-secondary disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto bg-card/50">
              {selectedNote ? (
                <EditorContent editor={editor} className="h-full" />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Create or select a note to start editing</p>
                </div>
              )}
            </div>
            {selectedNote && (
              <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
                {saving ? 'Saving...' : `Saved${lastSavedAt ? ` at ${lastSavedAt}` : ''}`}
              </div>
            )}
          </motion.div>

          {/* Right Panel - AI Tools */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
            className="w-[220px] border-l border-border p-4 flex-shrink-0 hidden lg:block"
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
                  disabled={isAiLoading || !selectedNote}
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
                  disabled={isAiLoading || !selectedNote}
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
                  disabled={isAiLoading || !selectedNote}
                  className="w-full py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50"
                >
                  Generate Quiz
                </button>
              </div>
            </div>

            {/* AI Output */}
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

