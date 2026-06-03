'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'

type Paper = {
  id: string
  year: number
  subject: string
  topic?: string | null
  difficulty?: string | null
  questionPdfPath?: string | null
  solutionPdfPath?: string | null
  answerKeyPdfPath?: string | null
}

export default function PYQPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [difficulty, setDifficulty] = useState('')
  const [kind, setKind] = useState<'question' | 'solution' | 'key'>('question')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{
    url: string
    label: string
  } | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/pyq', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    const rows = Array.isArray(data.papers) ? data.papers : []
    setPapers(
      rows.map((p: Record<string, unknown>) => ({
        id: String(p.id ?? ''),
        year: Number(p.year ?? new Date().getFullYear()),
        subject: typeof p.subject === 'string' ? p.subject : 'Engineering Mathematics',
        topic: typeof p.topic === 'string' ? p.topic : null,
        difficulty: typeof p.difficulty === 'string' ? p.difficulty : null,
        questionPdfPath: typeof p.questionPdfPath === 'string' ? p.questionPdfPath : null,
        solutionPdfPath: typeof p.solutionPdfPath === 'string' ? p.solutionPdfPath : null,
        answerKeyPdfPath: typeof p.answerKeyPdfPath === 'string' ? p.answerKeyPdfPath : null,
      })),
    )
  }

  useEffect(() => {
    void load()
  }, [])

  const upload = async () => {
    if (!file) return
    setStatus('Uploading PDF...')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('kind', kind)
    fd.append('year', String(year))
    if (difficulty.trim()) fd.append('difficulty', difficulty.trim())
    const res = await fetch('/api/pyq', { method: 'POST', body: fd })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setStatus(typeof data.error === 'string' ? data.error : 'Upload failed.')
      return
    }
    setFile(null)
    setStatus(
      data.storageProvider === 'local'
        ? 'Uploaded locally and saved to PYQ table.'
        : 'Uploaded to storage and saved to PYQ table.',
    )
    await load()
    if (data.paper?.id) {
      await openSigned(String(data.paper.id), kind, `${year} - GATE EE - ${kindLabel(kind)}`)
    }
  }

  const deletePaper = async (id: string) => {
    setStatus('Deleting PYQ...')
    const res = await fetch(`/api/pyq/${id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setStatus(typeof data.error === 'string' ? data.error : 'Delete failed.')
      return
    }
    setPreview(null)
    setStatus('PYQ deleted.')
    await load()
  }

  const openSigned = async (id: string, which: 'question' | 'solution' | 'key', label?: string) => {
    const res = await fetch(`/api/pyq/${id}/signed-url?which=${which}`)
    const data = await res.json()
    if (typeof data.url === 'string') {
      setPreview({ url: data.url, label: label ?? kindLabel(which) })
    } else {
      setStatus(typeof data.error === 'string' ? data.error : 'Could not open PDF.')
    }
  }

  const kindLabel = (value: 'question' | 'solution' | 'key') =>
    value === 'question' ? 'Question paper' : value === 'solution' ? 'Solution' : 'Answer key'

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-foreground">PYQs</h1>
      <p className="text-muted-foreground mt-1 mb-6">Upload and open GATE-EE question/solution/answer-key PDFs</p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 grid gap-3 md:grid-cols-5">
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 rounded border border-border bg-input text-sm" />
        <input value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="Difficulty" className="px-3 py-2 rounded border border-border bg-input text-sm" />
        <select value={kind} onChange={(e) => setKind(e.target.value as 'question' | 'solution' | 'key')} className="px-3 py-2 rounded border border-border bg-input text-sm">
          <option value="question">Question paper</option>
          <option value="solution">Solution</option>
          <option value="key">Answer key</option>
        </select>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm md:col-span-1" />
        <button onClick={upload} disabled={!file} className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm disabled:opacity-50">Upload</button>
      </div>
      {status && (
        <div className="mb-4 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          {status}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1.35fr)]">
        <div className="space-y-3">
          {papers.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.year} - GATE EE</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.difficulty || 'Question paper set'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className={`rounded px-2 py-1 ${p.questionPdfPath ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>QP</span>
                  <span className={`rounded px-2 py-1 ${p.solutionPdfPath ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>Solution</span>
                  <span className={`rounded px-2 py-1 ${p.answerKeyPdfPath ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>Key</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button disabled={!p.questionPdfPath} onClick={() => void openSigned(p.id, 'question', `${p.year} - GATE EE - Question paper`)} className="px-3 py-1 rounded bg-secondary text-xs disabled:opacity-50">View QP</button>
                <button disabled={!p.solutionPdfPath} onClick={() => void openSigned(p.id, 'solution', `${p.year} - GATE EE - Solution`)} className="px-3 py-1 rounded bg-secondary text-xs disabled:opacity-50">View Solution</button>
                <button disabled={!p.answerKeyPdfPath} onClick={() => void openSigned(p.id, 'key', `${p.year} - GATE EE - Answer key`)} className="px-3 py-1 rounded bg-secondary text-xs disabled:opacity-50">View Key</button>
                <button onClick={() => void deletePaper(p.id)} className="inline-flex items-center gap-1 rounded border border-destructive/30 px-3 py-1 text-xs text-destructive hover:bg-destructive/10">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="min-h-[620px] rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">PDF preview</p>
              <p className="text-xs text-muted-foreground">{preview?.label ?? 'Select or upload a PDF to preview it here'}</p>
            </div>
            {preview && (
              <button onClick={() => setPreview(null)} className="rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary">
                Clear
              </button>
            )}
          </div>
          {preview ? (
            <iframe src={preview.url} title={preview.label} className="h-[620px] w-full bg-background" />
          ) : (
            <div className="flex h-[620px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
              Uploaded question papers, solutions, and answer keys open inside this panel.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
