'use client'

import { useEffect, useState } from 'react'
import { GATE_EE_SUBJECTS } from '@/lib/gate-ee'

export default function AdminPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [lectureTitle, setLectureTitle] = useState('')
  const [lectureSubject, setLectureSubject] = useState(GATE_EE_SUBJECTS[0])

  useEffect(() => {
    ;(async () => {
      const [pyq, notes, lectures, flashcards] = await Promise.all([
        fetch('/api/pyq').then((r) => r.json()).catch(() => ({})),
        fetch('/api/notes').then((r) => r.json()).catch(() => ({})),
        fetch('/api/lectures').then((r) => r.json()).catch(() => ({})),
        fetch('/api/flashcards').then((r) => r.json()).catch(() => ({})),
      ])
      setCounts({
        pyq: Array.isArray(pyq.papers) ? pyq.papers.length : 0,
        notes: Array.isArray(notes.notes) ? notes.notes.length : 0,
        lectures: Array.isArray(lectures.lectures) ? lectures.lectures.length : 0,
        flashcards: Array.isArray(flashcards.cards) ? flashcards.cards.length : 0,
      })
    })()
  }, [])

  const addLecture = async () => {
    if (!lectureTitle.trim()) return
    await fetch('/api/lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: lectureTitle.trim(), subject: lectureSubject }),
    })
    setLectureTitle('')
  }

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Admin Panel</h1>
      <p className="text-muted-foreground mt-1 mb-6">Single-user dynamic content management</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase">{k}</p>
            <p className="text-2xl font-semibold text-foreground">{v}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3">Quick add lecture</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <input value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} placeholder="Lecture title" className="px-3 py-2 rounded border border-border bg-input text-sm" />
          <select value={lectureSubject} onChange={(e) => setLectureSubject(e.target.value)} className="px-3 py-2 rounded border border-border bg-input text-sm">
            {GATE_EE_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={addLecture} className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Create</button>
        </div>
      </div>
    </div>
  )
}
