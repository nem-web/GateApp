'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import SidebarNav from '@/components/SidebarNav'
import { noteFolders } from '@/lib/mockData'

export default function NotesPage() {
  const [expandedFolders, setExpandedFolders] = useState<number[]>([1, 2])
  const [selectedNote, setSelectedNote] = useState<{ id: number; title: string } | null>(null)
  const [aiOutput, setAiOutput] = useState<{ type: string; content: string } | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your notes...',
      }),
    ],
    content: selectedNote
      ? `<h1>${selectedNote.title}</h1><p>Your notes content goes here...</p>`
      : '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  })

  const toggleFolder = (id: number) => {
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

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />

      <main className="lg:pl-[220px] pt-16 lg:pt-0 pb-20 lg:pb-0 h-screen">
        <div className="flex h-full">
          {/* Left Panel - Folder Tree */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-[260px] border-r border-border p-4 flex-shrink-0 overflow-y-auto hidden md:block"
          >
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all mb-4">
              <Plus size={16} />
              New Note
            </button>

            <div className="space-y-1">
              {noteFolders.map((folder) => (
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
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto bg-card/50">
              {selectedNote ? (
                <EditorContent editor={editor} className="h-full" />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Select a note to start editing</p>
                </div>
              )}
            </div>
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
      </main>
    </div>
  )
}
