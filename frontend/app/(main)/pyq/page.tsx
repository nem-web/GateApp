'use client'

import { useEffect, useState } from 'react'
import { GATE_EE_SUBJECTS } from '@/lib/gate-ee'

type Paper = {
  id: string
  year: number
  subject: string
  topic?: string | null
  difficulty?: string | null
}

export default function PYQPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [subject, setSubject] = useState(GATE_EE_SUBJECTS[0])
  const [kind, setKind] = useState<'question' | 'solution' | 'key'>('question')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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
      })),
    )
  }

  useEffect(() => {
    void load()
  }, [])

  const upload = async () => {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    fd.append('kind', kind)
    fd.append('year', String(year))
    fd.append('subject', subject)
    const res = await fetch('/api/pyq', { method: 'POST', body: fd })
    if (!res.ok) return
    setFile(null)
    await load()
  }

  const openSigned = async (id: string, which: 'question' | 'solution' | 'key') => {
    const res = await fetch(`/api/pyq/${id}/signed-url?which=${which}`)
    const data = await res.json()
    if (typeof data.url === 'string') setPreviewUrl(data.url)
  }

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-foreground">PYQs</h1>
      <p className="text-muted-foreground mt-1 mb-6">Upload and open GATE-EE question/solution/answer-key PDFs</p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 grid gap-3 md:grid-cols-5">
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 rounded border border-border bg-input text-sm" />
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="px-3 py-2 rounded border border-border bg-input text-sm">
          {GATE_EE_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value as 'question' | 'solution' | 'key')} className="px-3 py-2 rounded border border-border bg-input text-sm">
          <option value="question">Question paper</option>
          <option value="solution">Solution</option>
          <option value="key">Answer key</option>
        </select>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
        <button onClick={upload} className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Upload</button>
      </div>

      <div className="space-y-3">
        {papers.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-medium text-foreground">{p.year} - {p.subject}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => void openSigned(p.id, 'question')} className="px-3 py-1 rounded bg-secondary text-xs">Question PDF</button>
              <button onClick={() => void openSigned(p.id, 'solution')} className="px-3 py-1 rounded bg-secondary text-xs">Solution PDF</button>
              <button onClick={() => void openSigned(p.id, 'key')} className="px-3 py-1 rounded bg-secondary text-xs">Answer Key PDF</button>
            </div>
          </div>
        ))}
      </div>

      {previewUrl && (
        <div className="mt-6">
          <a href={previewUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline">Open signed PDF URL</a>
        </div>
      )}
    </div>
  )
}
