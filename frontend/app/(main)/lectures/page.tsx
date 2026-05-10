'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Plus, Trash2 } from 'lucide-react'
import { GATE_EE_SUBJECTS } from '@/lib/gate-ee'

type Lecture = {
  id: string
  title: string
  subject: string
  topic?: string | null
  youtubeVideoId?: string | null
  watchedPercent: number
  completed: boolean
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [filter, setFilter] = useState<'all' | 'watched' | 'unwatched'>('all')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState<string>(GATE_EE_SUBJECTS[0])
  const [youtubeLink, setYoutubeLink] = useState('')

  const loadLectures = async () => {
    const res = await fetch('/api/lectures', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    const rows = Array.isArray(data.lectures) ? data.lectures : []
    setLectures(
      rows.map((l: Record<string, unknown>) => ({
        id: String(l.id ?? ''),
        title: String(l.title ?? ''),
        subject: typeof l.subject === 'string' ? l.subject : 'Engineering Mathematics',
        topic: typeof l.topic === 'string' ? l.topic : null,
        youtubeVideoId: typeof l.youtubeVideoId === 'string' ? l.youtubeVideoId : null,
        watchedPercent: Number(l.watchedPercent ?? 0),
        completed: Boolean(l.completed),
      })),
    )
  }

  useEffect(() => {
    void loadLectures()
  }, [])

  const createLecture = async () => {
    if (!title.trim()) return
    const vid = youtubeLink.includes('v=') ? youtubeLink.split('v=')[1]?.split('&')[0] : youtubeLink.trim()
    const res = await fetch('/api/lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        subject,
        youtubeVideoId: vid || null,
      }),
    })
    if (!res.ok) return
    setTitle('')
    setYoutubeLink('')
    await loadLectures()
  }

  const updateProgress = async (id: string, watchedPercent: number) => {
    await fetch(`/api/lectures/${id}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        watchedPercent,
        completed: watchedPercent >= 95,
      }),
    })
    await loadLectures()
  }

  const deleteLecture = async (id: string) => {
    await fetch(`/api/lectures/${id}`, { method: 'DELETE' })
    await loadLectures()
  }

  const filtered = useMemo(() => {
    if (filter === 'watched') return lectures.filter((l) => l.completed)
    if (filter === 'unwatched') return lectures.filter((l) => !l.completed)
    return lectures
  }, [lectures, filter])

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Lectures</h1>
        <p className="text-muted-foreground mt-1">GATE-EE lectures with watch progress</p>
      </motion.div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 grid gap-3 md:grid-cols-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lecture title" className="px-3 py-2 rounded border border-border bg-input text-sm" />
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="px-3 py-2 rounded border border-border bg-input text-sm">
          {GATE_EE_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="YouTube video/playlist link" className="px-3 py-2 rounded border border-border bg-input text-sm" />
        <button onClick={createLecture} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground text-sm"><Plus size={16} />Add lecture</button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'watched', 'unwatched'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded text-sm ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((lecture) => (
          <div key={lecture.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{lecture.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{lecture.subject}</p>
              </div>
              {lecture.completed ? <CheckCircle size={18} className="text-emerald-500" /> : <Clock size={18} className="text-muted-foreground" />}
            </div>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">Progress: {Math.round(lecture.watchedPercent)}%</p>
              <input type="range" min={0} max={100} value={Math.round(lecture.watchedPercent)} onChange={(e) => void updateProgress(lecture.id, Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={() => void deleteLecture(lecture.id)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"><Trash2 size={14} />Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
