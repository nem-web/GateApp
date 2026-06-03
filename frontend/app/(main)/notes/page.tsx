'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  FolderPlus,
  Pencil,
  MousePointer2,
  PenLine,
  Highlighter,
  Eraser,
  X,
} from 'lucide-react'

type NoteFolder = {
  id: string
  name: string
  icon: string
  notes: NoteListItem[]
}

type NoteListItem = {
  id: string
  title: string
  lastEdited: string
  folder: string
}

type NotePdf = {
  id: string
  fileName: string
  createdAt?: string
}

type PdfTool = 'select' | 'pen' | 'highlighter' | 'eraser'
type StrokePoint = { x: number; y: number }
type PdfStroke = {
  id: string
  tool: Exclude<PdfTool, 'select'>
  color: string
  width: number
  points: StrokePoint[]
}
type AnnotationRow = { page?: number; payload?: unknown }
type PdfPageView = { pageNumber: number; width: number; height: number }

function annotationPayload(value: unknown): { strokes?: PdfStroke[] } | null {
  if (!value || typeof value !== 'object') return null
  const strokes = (value as { strokes?: unknown }).strokes
  return Array.isArray(strokes) ? { strokes: strokes as PdfStroke[] } : null
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseFlashcardJson(value: string): Array<{ front: string; back: string }> {
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : value
  try {
    const parsed = JSON.parse(raw.trim()) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const row = item as { front?: unknown; back?: unknown }
        if (typeof row.front !== 'string' || typeof row.back !== 'string') return null
        return { front: row.front, back: row.back }
      })
      .filter(Boolean) as Array<{ front: string; back: string }>
  } catch {
    return []
  }
}

export default function NotesPage() {
  const [folders, setFolders] = useState<NoteFolder[]>([])
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [selectedNote, setSelectedNote] = useState<{ id: string; title: string; folder?: string } | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>('Engineering Mathematics')
  const [aiOutput, setAiOutput] = useState<{ type: string; content: string } | null>(null)
  const [aiActionStatus, setAiActionStatus] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [currentPdf, setCurrentPdf] = useState<NotePdf | null>(null)
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null)
  const [pdfWorkspaceOpen, setPdfWorkspaceOpen] = useState(false)
  const [pdfTool, setPdfTool] = useState<PdfTool>('select')
  const [pdfColor, setPdfColor] = useState('#facc15')
  const [pdfPages, setPdfPages] = useState<PdfPageView[]>([])
  const [pdfStrokesByPage, setPdfStrokesByPage] = useState<Record<number, PdfStroke[]>>({})
  const [annotationStatus, setAnnotationStatus] = useState('Marks saved')
  const [annotationDirty, setAnnotationDirty] = useState(false)
  const [closingPdf, setClosingPdf] = useState(false)
  const pdfDocumentRef = useRef<{ numPages: number; getPage: (pageNumber: number) => Promise<unknown> } | null>(null)
  const pageCanvasRefs = useRef(new Map<number, HTMLCanvasElement>())
  const annotationCanvasRefs = useRef(new Map<number, HTMLCanvasElement>())
  const drawingRef = useRef(false)
  const activeStrokeRef = useRef<PdfStroke | null>(null)
  const activePageRef = useRef<number>(1)

  const loadNotes = async () => {
    const res = await fetch('/api/notes', { cache: 'no-store' })
    if (!res.ok) throw new Error('load failed')
    const data = await res.json()
    const rows = Array.isArray(data.notes) ? data.notes : []
    const map = new Map<string, NoteListItem[]>()
    for (const n of rows as Array<Record<string, unknown>>) {
      const subject =
        typeof n.subject === 'string' ? n.subject : typeof n.subjectId === 'string' ? 'Subject' : 'Notes'
      const folder = typeof n.topic === 'string' && n.topic.trim() ? n.topic.trim() : subject
      if (!map.has(folder)) map.set(folder, [])
      const updatedRaw = n.updatedAt
      let lastEdited = ''
      try {
        if (updatedRaw instanceof Date) lastEdited = updatedRaw.toLocaleDateString()
        else if (typeof updatedRaw === 'string') lastEdited = new Date(updatedRaw).toLocaleDateString()
      } catch {
        lastEdited = ''
      }
      map.get(folder)!.push({
        folder,
        id: String(n.id ?? ''),
        title: typeof n.title === 'string' ? n.title : 'Untitled',
        lastEdited,
      })
    }
    const nextFolders: NoteFolder[] = [...map.entries()].map(([name, notes]) => ({
      id: name,
      name,
      icon: 'Folder',
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
    immediatelyRender: false,
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
    editor.commands.setContent(selectedNote ? noteContent : '', { emitUpdate: false })
  }, [editor, selectedNote?.id])

  const drawPageStrokes = useCallback((pageNumber: number, strokes: PdfStroke[]) => {
    const canvas = annotationCanvasRefs.current.get(pageNumber)
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const width = Math.max(1, Math.floor(rect.width * dpr))
    const height = Math.max(1, Math.floor(rect.height * dpr))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue
      ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
      ctx.globalAlpha = stroke.tool === 'highlighter' ? 0.35 : 1
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.beginPath()
      ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y)
      for (const point of stroke.points.slice(1)) ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }
    ctx.restore()
  }, [])

  const drawAllPageStrokes = useCallback(
    (strokesByPage: Record<number, PdfStroke[]>) => {
      for (const page of pdfPages) {
        drawPageStrokes(page.pageNumber, strokesByPage[page.pageNumber] ?? [])
      }
    },
    [drawPageStrokes, pdfPages],
  )

  useEffect(() => {
    drawAllPageStrokes(pdfStrokesByPage)
  }, [drawAllPageStrokes, pdfStrokesByPage, pdfWorkspaceOpen])

  useEffect(() => {
    const onResize = () => drawAllPageStrokes(pdfStrokesByPage)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [drawAllPageStrokes, pdfStrokesByPage])

  useEffect(() => {
    if (!pdfWorkspaceOpen || !pdfPages.length) return
    let cancelled = false
    ;(async () => {
      const doc = pdfDocumentRef.current
      if (!doc) return
      for (const pageMeta of pdfPages) {
        if (cancelled) return
        const canvas = pageCanvasRefs.current.get(pageMeta.pageNumber)
        if (!canvas) continue
        const page = (await doc.getPage(pageMeta.pageNumber)) as {
          getViewport: (args: { scale: number }) => { width: number; height: number }
          render: (args: {
            canvasContext: CanvasRenderingContext2D
            viewport: { width: number; height: number }
          }) => { promise: Promise<void> }
        }
        const viewport = page.getViewport({ scale: 1.35 })
        const ctx = canvas.getContext('2d')
        if (!ctx) continue
        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.floor(viewport.width * dpr)
        canvas.height = Math.floor(viewport.height * dpr)
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        await page.render({ canvasContext: ctx, viewport }).promise
        drawPageStrokes(pageMeta.pageNumber, pdfStrokesByPage[pageMeta.pageNumber] ?? [])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [drawPageStrokes, pdfPages, pdfStrokesByPage, pdfWorkspaceOpen])

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
          setSelectedNote((prev) =>
            prev
              ? {
                  ...prev,
                  title: typeof data.title === 'string' ? data.title : prev.title,
                  folder:
                    typeof data.topic === 'string' && data.topic.trim()
                      ? data.topic.trim()
                      : prev.folder,
                }
              : prev,
          )
          const pdfs = Array.isArray(data.pdfs) ? data.pdfs : []
          const latestPdf = pdfs[0]
          setCurrentPdf(
            latestPdf && typeof latestPdf.id === 'string' && typeof latestPdf.fileName === 'string'
              ? { id: latestPdf.id, fileName: latestPdf.fileName, createdAt: latestPdf.createdAt }
              : null,
          )
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
    setAiActionStatus(null)
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
            topic: selectedNote.folder ?? null,
          }),
        })
        if (!res.ok) return
        setLastSavedAt(new Date().toLocaleTimeString())
      } finally {
        setSaving(false)
      }
    }, 900)
    return () => clearTimeout(timer)
  }, [noteContent, selectedNote?.id, selectedSubject, selectedNote?.title, selectedNote?.folder])

  const createNote = async (folderName?: string) => {
    const title = `New note ${new Date().toLocaleDateString()}`
    const folder = folderName ?? selectedNote?.folder
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content: '<p></p>',
        subject: selectedSubject || 'Engineering Mathematics',
        topic: folder ?? null,
      }),
    })
    if (!res.ok) return
    const note = await res.json()
    await loadNotes()
    setSelectedNote({ id: note.id, title: note.title, folder: typeof note.topic === 'string' ? note.topic : folder })
    setNoteContent(note.content ?? '<p></p>')
    setCurrentPdf(null)
    setUploadStatus(null)
  }

  const appendAiOutputToNote = (heading: string, content: string) => {
    if (!selectedNote) return
    const html = [
      noteContent,
      `<h2>${escapeHtml(heading)}</h2>`,
      `<pre><code>${escapeHtml(content)}</code></pre>`,
    ].join('')
    setNoteContent(html)
    editor?.commands.setContent(html, { emitUpdate: false })
    setAiActionStatus('Saved into this note.')
  }

  const createFlashcardsFromAi = async () => {
    if (!selectedNote || !aiOutput) return
    const cards = parseFlashcardJson(aiOutput.content)
    if (!cards.length) {
      setAiActionStatus('Could not find JSON flashcards in the AI response.')
      return
    }
    setAiActionStatus('Creating flashcards...')
    let created = 0
    for (const card of cards) {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId: selectedNote.id,
          subject: selectedSubject,
          topic: selectedNote.folder ?? null,
          front: card.front,
          back: card.back,
          source: 'ai-note',
        }),
      })
      if (res.ok) created += 1
    }
    setAiActionStatus(`Created ${created} flashcard${created === 1 ? '' : 's'}.`)
  }

  const createFolder = async () => {
    const name = window.prompt('Folder name')?.trim()
    if (!name) return
    await createNote(name)
    setExpandedFolders((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }

  const renameFolder = async (folder: NoteFolder) => {
    const nextName = window.prompt('Rename folder', folder.name)?.trim()
    if (!nextName || nextName === folder.name) return
    await Promise.all(
      folder.notes.map((note) =>
        fetch(`/api/notes/${note.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: nextName }),
        }),
      ),
    )
    setSelectedNote((prev) =>
      prev?.folder === folder.name ? { ...prev, folder: nextName } : prev,
    )
    setExpandedFolders((prev) => [...prev.filter((id) => id !== folder.name), nextName])
    await loadNotes()
  }

  const deleteCurrentNote = async () => {
    if (!selectedNote) return
    const res = await fetch(`/api/notes/${selectedNote.id}`, { method: 'DELETE' })
    if (!res.ok) return
    setSelectedNote(null)
    setNoteContent('')
    setCurrentPdf(null)
    setUploadStatus(null)
    await loadNotes()
  }

  const uploadPdfForCurrentNote = async (file: File) => {
    if (!selectedNote) return
    setUploadStatus('Uploading PDF...')
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`/api/notes/${selectedNote.id}/pdf`, {
      method: 'POST',
      body: form,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setUploadStatus(typeof data.error === 'string' ? data.error : 'PDF upload failed.')
      return
    }
    const pdf = data.pdf
    if (pdf && typeof pdf.id === 'string' && typeof pdf.fileName === 'string') {
      const attachedPdf = { id: pdf.id, fileName: pdf.fileName, createdAt: pdf.createdAt }
      setCurrentPdf(attachedPdf)
      await openPdfInWorkspace(attachedPdf)
    }
    setUploadStatus(
      data.storageProvider === 'local'
        ? 'PDF attached to this note and opened in the workspace.'
        : 'PDF attached to this note and opened in the workspace.',
    )
    await loadNotes()
  }

  const loadPdfAnnotations = async (pdfId: string) => {
    const res = await fetch(`/api/notes/pdf/${pdfId}/annotations`, { cache: 'no-store' })
    const data = await res.json().catch(() => ({}))
    const rows: AnnotationRow[] = Array.isArray(data.annotations) ? data.annotations : []
    const next: Record<number, PdfStroke[]> = {}
    for (const row of rows) {
      const page = Math.max(1, Number(row.page ?? 1))
      const payload = annotationPayload(row.payload)
      if (payload?.strokes) next[page] = payload.strokes
    }
    setPdfStrokesByPage(next)
  }

  const loadPdfPages = async (url: string) => {
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url,
    ).toString()
    const loadingTask = pdfjs.getDocument(url)
    const doc = (await loadingTask.promise) as {
      numPages: number
      getPage: (pageNumber: number) => Promise<{
        getViewport: (args: { scale: number }) => { width: number; height: number }
      }>
    }
    pdfDocumentRef.current = doc
    const pages: PdfPageView[] = []
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 1.35 })
      pages.push({ pageNumber, width: viewport.width, height: viewport.height })
    }
    setPdfPages(pages)
  }

  const openPdfInWorkspace = async (pdf = currentPdf) => {
    if (!pdf) return
    const res = await fetch(`/api/notes/pdf/${pdf.id}/signed-url`)
    const data = await res.json().catch(() => ({}))
    if (typeof data.url === 'string') {
      setPdfViewerUrl(data.url)
      setPdfWorkspaceOpen(true)
      setPdfTool('select')
      setAnnotationStatus('Marks saved')
      setAnnotationDirty(false)
      setPdfPages([])
      setPdfStrokesByPage({})
      await loadPdfAnnotations(pdf.id)
      await loadPdfPages(data.url)
    } else {
      setUploadStatus(typeof data.error === 'string' ? data.error : 'Could not open PDF.')
    }
  }

  const savePdfAnnotations = useCallback(
    async (strokesByPage = pdfStrokesByPage) => {
      if (!currentPdf) return true
      setAnnotationStatus('Saving marks...')
      const pagesToSave = new Set<number>([
        ...pdfPages.map((page) => page.pageNumber),
        ...Object.keys(strokesByPage).map(Number),
      ])
      for (const page of pagesToSave) {
        const res = await fetch(`/api/notes/pdf/${currentPdf.id}/annotations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page,
            payload: { strokes: strokesByPage[page] ?? [], updatedAt: new Date().toISOString() },
          }),
        })
        if (!res.ok) {
          setAnnotationStatus('Mark save failed')
          return false
        }
      }
      setAnnotationStatus('Marks saved')
      setAnnotationDirty(false)
      return true
    },
    [currentPdf, pdfPages, pdfStrokesByPage],
  )

  const closePdfWorkspace = async () => {
    if (closingPdf) return
    setClosingPdf(true)
    try {
      if (annotationDirty) await savePdfAnnotations()
      setPdfWorkspaceOpen(false)
    } finally {
      setClosingPdf(false)
    }
  }

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    }
  }

  const startAnnotation = (pageNumber: number, event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentPdf || pdfTool === 'select') return
    event.currentTarget.setPointerCapture(event.pointerId)
    drawingRef.current = true
    activePageRef.current = pageNumber
    const stroke: PdfStroke = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      tool: pdfTool,
      color: pdfTool === 'eraser' ? '#000000' : pdfColor,
      width: pdfTool === 'highlighter' ? 0.018 : pdfTool === 'eraser' ? 0.03 : 0.006,
      points: [pointFromEvent(event)],
    }
    activeStrokeRef.current = stroke
    setPdfStrokesByPage((prev) => ({
      ...prev,
      [pageNumber]: [...(prev[pageNumber] ?? []), stroke],
    }))
  }

  const moveAnnotation = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !activeStrokeRef.current) return
    const point = pointFromEvent(event)
    activeStrokeRef.current = {
      ...activeStrokeRef.current,
      points: [...activeStrokeRef.current.points, point],
    }
    const active = activeStrokeRef.current
    const pageNumber = activePageRef.current
    setPdfStrokesByPage((prev) => ({
      ...prev,
      [pageNumber]: (prev[pageNumber] ?? []).map((stroke) => (stroke.id === active.id ? active : stroke)),
    }))
  }

  const endAnnotation = () => {
    if (!drawingRef.current) return
    drawingRef.current = false
    const active = activeStrokeRef.current
    activeStrokeRef.current = null
    if (!active) return
    const pageNumber = activePageRef.current
    setPdfStrokesByPage((prev) => ({
      ...prev,
      [pageNumber]: (prev[pageNumber] ?? []).map((stroke) => (stroke.id === active.id ? active : stroke)),
    }))
    setAnnotationDirty(true)
    setAnnotationStatus('Unsaved marks - close PDF to save')
  }

  const clearAnnotations = () => {
    setPdfStrokesByPage({})
    setAnnotationDirty(true)
    setAnnotationStatus('Unsaved marks - close PDF to save')
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
              onClick={() => void createNote()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all mb-4"
            >
              <Plus size={16} />
              New Note
            </button>
            <button
              onClick={() => void createFolder()}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
            >
              <FolderPlus size={16} />
              New Folder
            </button>

            <div className="space-y-1">
              {folders.map((folder) => (
                <div key={folder.id}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-all hover:bg-secondary"
                    >
                      {expandedFolders.includes(folder.id) ? (
                        <ChevronDown size={14} className="text-muted-foreground" />
                      ) : (
                        <ChevronRight size={14} className="text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">{folder.icon}</span>
                      <span className="truncate font-medium">{folder.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {folder.notes.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void renameFolder(folder)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      title="Rename folder"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>

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
                <button
                  type="button"
                  onClick={() => void openPdfInWorkspace()}
                  disabled={!currentPdf}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border text-xs text-muted-foreground hover:bg-secondary disabled:opacity-50"
                >
                  View PDF
                </button>
                <label className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border text-xs text-muted-foreground hover:bg-secondary cursor-pointer">
                  <Upload size={13} />
                  PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    disabled={!selectedNote}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) void uploadPdfForCurrentNote(file)
                      e.target.value = ''
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

            {selectedNote && (
              <div className="border-b border-border bg-background/40 px-4 py-3">
                <input
                  value={selectedNote.title}
                  onChange={(event) =>
                    setSelectedNote((prev) =>
                      prev ? { ...prev, title: event.target.value } : prev,
                    )
                  }
                  onBlur={() => void loadNotes()}
                  className="w-full bg-transparent text-xl font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Untitled note"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Folder: {selectedNote.folder ?? selectedSubject}
                </p>
              </div>
            )}

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
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-t border-border text-xs text-muted-foreground">
                <span>{saving ? 'Saving...' : `Saved${lastSavedAt ? ` at ${lastSavedAt}` : ''}`}</span>
                <span className="truncate">
                  {uploadStatus ??
                    (currentPdf ? `PDF note attached: ${currentPdf.fileName}` : 'No PDF note attached')}
                </span>
              </div>
            )}
          </motion.div>

          {pdfWorkspaceOpen && (
            <div className="fixed inset-3 z-[80] flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl lg:left-[236px]">
              <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{currentPdf?.fileName ?? 'PDF note'}</p>
                  <p className="text-xs text-muted-foreground">
                    {closingPdf ? 'Saving before close...' : annotationStatus}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
                  <button
                    type="button"
                    onClick={() => setPdfTool('select')}
                    className={`rounded p-2 ${pdfTool === 'select' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                    title="Select / pan"
                  >
                    <MousePointer2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfTool('pen')}
                    className={`rounded p-2 ${pdfTool === 'pen' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                    title="Pen"
                  >
                    <PenLine size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfTool('highlighter')}
                    className={`rounded p-2 ${pdfTool === 'highlighter' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                    title="Highlighter"
                  >
                    <Highlighter size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfTool('eraser')}
                    className={`rounded p-2 ${pdfTool === 'eraser' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                    title="Eraser"
                  >
                    <Eraser size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
                  {['#facc15', '#fb7185', '#38bdf8', '#34d399', '#ffffff'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPdfColor(color)}
                      className={`h-6 w-6 rounded-full border ${pdfColor === color ? 'border-primary ring-2 ring-primary/40' : 'border-border'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clearAnnotations}
                  className="rounded border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary"
                >
                  Clear marks
                </button>
                <button
                  type="button"
                  onClick={() => void closePdfWorkspace()}
                  disabled={closingPdf}
                  className="rounded p-2 text-muted-foreground hover:bg-secondary disabled:opacity-50"
                  title="Close PDF"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto bg-black/40 px-4 py-6">
                {pdfViewerUrl ? (
                  <div className="mx-auto flex w-fit flex-col gap-6">
                    {pdfPages.length === 0 ? (
                      <div className="flex h-[60vh] w-[min(920px,80vw)] items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
                        Loading PDF pages...
                      </div>
                    ) : (
                      pdfPages.map((page) => (
                        <div
                          key={page.pageNumber}
                          className="relative overflow-hidden rounded-lg bg-white shadow-xl"
                          style={{ width: page.width, height: page.height }}
                        >
                          <canvas
                            ref={(node) => {
                              if (node) pageCanvasRefs.current.set(page.pageNumber, node)
                              else pageCanvasRefs.current.delete(page.pageNumber)
                            }}
                            className="absolute inset-0 h-full w-full"
                          />
                          <canvas
                            ref={(node) => {
                              if (node) annotationCanvasRefs.current.set(page.pageNumber, node)
                              else annotationCanvasRefs.current.delete(page.pageNumber)
                            }}
                            className={`absolute inset-0 h-full w-full ${
                              pdfTool === 'select' ? 'pointer-events-none' : 'touch-none cursor-crosshair'
                            }`}
                            onPointerDown={(event) => startAnnotation(page.pageNumber, event)}
                            onPointerMove={moveAnnotation}
                            onPointerUp={endAnnotation}
                            onPointerCancel={endAnnotation}
                            onPointerLeave={endAnnotation}
                          />
                          <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/55 px-2 py-1 text-[11px] text-white">
                            {page.pageNumber}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Loading PDF...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Panel - AI Tools */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
            className="hidden w-[260px] flex-shrink-0 flex-col border-l border-border p-4 lg:flex"
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
              <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-lg border border-primary/30 bg-primary/10 p-3">
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
                  <div className="flex min-h-0 flex-1 flex-col">
                    <p className="text-xs text-primary font-medium mb-2 capitalize">{aiOutput.type}</p>
                    <div className="min-h-[180px] flex-1 overflow-y-auto rounded border border-primary/20 bg-background/35 p-2">
                      <p className="text-xs text-foreground/80 whitespace-pre-line">{aiOutput.content}</p>
                    </div>
                    <div className="mt-3 space-y-2">
                      {aiOutput.type === 'summarize' && (
                        <button
                          type="button"
                          onClick={() => appendAiOutputToNote('AI Summary', aiOutput.content)}
                          className="w-full rounded bg-primary px-3 py-2 text-xs text-primary-foreground"
                        >
                          Save summary to note
                        </button>
                      )}
                      {aiOutput.type === 'flashcards' && (
                        <button
                          type="button"
                          onClick={() => void createFlashcardsFromAi()}
                          className="w-full rounded bg-primary px-3 py-2 text-xs text-primary-foreground"
                        >
                          Create flashcards
                        </button>
                      )}
                      {aiOutput.type === 'quiz' && (
                        <button
                          type="button"
                          onClick={() => appendAiOutputToNote('AI Quiz', aiOutput.content)}
                          className="w-full rounded bg-primary px-3 py-2 text-xs text-primary-foreground"
                        >
                          Save quiz to note
                        </button>
                      )}
                      {aiActionStatus && (
                        <p className="text-xs text-muted-foreground">{aiActionStatus}</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </motion.div>
    </div>
  )
}
