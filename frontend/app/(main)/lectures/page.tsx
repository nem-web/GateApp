'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, CheckCircle, ExternalLink, Sparkles, Plus } from 'lucide-react'
import { GATE_EE_SUBJECTS, SUBJECT_COLORS } from '@/lib/gate-ee'
import { toast } from 'sonner'

type LectureRow = {
  id: string
  title: string
  subject: string
  topic?: string | null
  youtubeVideoId?: string | null
  durationSeconds?: number | null
  watchedPercent: number
  completed: boolean
}

const RESOURCES = [
  { name: 'NPTEL EE', desc: 'IIT GATE EE lectures', href: 'https://nptel.ac.in' },
  { name: 'Gate Smashers EE', desc: 'YouTube playlists', href: 'https://www.youtube.com/@GateSmashers' },
  { name: 'Unacademy GATE EE', desc: 'Practice + notes', href: 'https://unacademy.com' },
  { name: 'Made Easy EE', desc: 'Test series', href: 'https://www.madeeasy.in' },
]

export default function LecturesPage() {
  const [lectures, setLectures] = useState<LectureRow[]>([])
  const [filter, setFilter] = useState<'all' | 'watched' | 'unwatched'>('all')
  const [nextWatchText, setNextWatchText] = useState<string | null>(null)
  const [recLoading, setRecLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    subject: GATE_EE_SUBJECTS[0],
    topic: '',
    youtubeVideoId: '',
    durationMinutes: '',
  })
  const saveTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const loadLectures = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/lectures')
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      const rows = Array.isArray(data.lectures) ? data.lectures : []
      setLectures(
        rows.map((l: Record<string, unknown>) => ({
          id: String(l.id ?? ''),
          title: String(l.title ?? ''),
          subject: typeof l.subject === 'string' ? l.subject : GATE_EE_SUBJECTS[0],
          topic: typeof l.topic === 'string' ? l.topic : null,
          youtubeVideoId: typeof l.youtubeVideoId === 'string' ? l.youtubeVideoId : null,
          durationSeconds: typeof l.durationSeconds === 'number' ? l.durationSeconds : null,
          watchedPercent: Number(l.watchedPercent ?? 0),
          completed: Boolean(l.completed),
        })),
      )
    } catch {
      setLectures([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadLectures()
  }, [loadLectures])

  const fetchRecommendation = async () => {
    setRecLoading(true)
    setNextWatchText(null)
    try {
      const dashboardRes = await fetch('/api/dashboard', { cache: 'no-store' })
      const dashboard = dashboardRes.ok ? await dashboardRes.json() : null
      const weakSubjects = Array.isArray(dashboard?.weakTopicAnalysis)
        ? dashboard.weakTopicAnalysis.map((w: { subject?: string }) => w.subject).filter(Boolean)
        : Array.isArray(dashboard?.weakSubjects)
          ? dashboard.weakSubjects
          : []
      const res = await fetch('/api/ai/lecture-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weakSubjects }),
      })
      const data = await res.json()
      setNextWatchText(typeof data.content === 'string' ? data.content : data.error ?? null)
    } catch {
      setNextWatchText('Could not load recommendations.')
    } finally {
      setRecLoading(false)
    }
  }

  const filteredLectures = lectures.filter((lecture) => {
    if (filter === 'watched') return lecture.completed
    if (filter === 'unwatched') return !lecture.completed
    return true
  })

  const watchedCount = lectures.filter((l) => l.completed).length

  const updateProgress = (id: string, watchedPercent: number) => {
    setLectures((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, watchedPercent, completed: watchedPercent >= 95 } : l,
      ),
    )
    const timers = saveTimers.current
    if (timers.has(id)) clearTimeout(timers.get(id)!)
    timers.set(
      id,
      setTimeout(async () => {
        try {
          await fetch(`/api/lectures/${id}/progress`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ watchedPercent }),
          })
        } catch {
          toast.error('Could not save lecture progress')
        }
      }, 700),
    )
  }

  const handleAddLecture = async () => {
    if (!form.title.trim()) return
    try {
      const res = await fetch('/api/lectures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          subject: form.subject,
          topic: form.topic.trim() || null,
          youtubeVideoId: form.youtubeVideoId.trim() || null,
          durationSeconds: form.durationMinutes ? Number(form.durationMinutes) * 60 : null,
        }),
      })
      if (!res.ok) throw new Error('bad')
      await loadLectures()
      setForm({
        title: '',
        subject: form.subject,
        topic: '',
        youtubeVideoId: '',
        durationMinutes: '',
      })
      toast.success('Lecture saved')
    } catch {
      toast.error('Could not save lecture')
    }
  }

  const lectureCountText = loading ? 'Loading…' : `${watchedCount} of ${lectures.length} watched`

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-foreground">Lectures</h1>
        <p className="text-muted-foreground mt-1">Video lectures organized by topic</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
        className="bg-card border border-border rounded-xl p-4 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs text-muted-foreground mb-2">Lecture title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Subject</label>
            <select
              value={form.subject}
              onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {GATE_EE_SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Topic</label>
            <input
              value={form.topic}
              onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-2">YouTube ID</label>
            <input
              value={form.youtubeVideoId}
              onChange={(e) => setForm((prev) => ({ ...prev, youtubeVideoId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs text-muted-foreground mb-2">Duration (min)</label>
            <input
              type="number"
              min={0}
              value={form.durationMinutes}
              onChange={(e) => setForm((prev) => ({ ...prev, durationMinutes: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        <button
          onClick={handleAddLecture}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110"
        >
          <Plus size={16} />
          Add lecture
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-success" />
            <span className="text-foreground font-medium">{lectureCountText}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'watched', 'unwatched'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLectures.map((lecture, index) => {
          const color = SUBJECT_COLORS[lecture.subject] || '#6C63FF'
          return (
            <motion.div
              key={lecture.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut', delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-card border border-border rounded-xl overflow-hidden group"
            >
              <div
                className="relative h-32 flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
              >
                <span className="text-3xl font-bold" style={{ color }}>
                  {lecture.subject.split(' ')[0]}
                </span>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all">
                  <a
                    href={lecture.youtubeVideoId ? `https://youtu.be/${lecture.youtubeVideoId}` : '#'}
                    target={lecture.youtubeVideoId ? '_blank' : undefined}
                    rel={lecture.youtubeVideoId ? 'noreferrer' : undefined}
                    className="w-11 h-11 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100"
                  >
                    <Play size={18} fill="white" className="text-white ml-1" />
                  </a>
                </div>
                {lecture.completed && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${color}26`, color }}
                  >
                    {lecture.subject}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Clock size={12} />
                    {lecture.durationSeconds ? `${Math.round(lecture.durationSeconds / 60)} min` : '—'}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-foreground line-clamp-2">{lecture.title}</h3>
                {lecture.topic && (
                  <p className="text-xs text-muted-foreground">Topic: {lecture.topic}</p>
                )}

                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{Math.round(lecture.watchedPercent)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={lecture.watchedPercent}
                    onChange={(e) => updateProgress(lecture.id, Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {!loading && filteredLectures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No lectures found</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut', delay: 0.25 }}
        className="mt-8 bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-foreground">What to watch next (AI)</h2>
        </div>
        <button
          type="button"
          onClick={fetchRecommendation}
          disabled={recLoading}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 disabled:opacity-50"
        >
          {recLoading ? 'Thinking…' : 'Suggest next lectures'}
        </button>
        {nextWatchText && (
          <pre className="mt-4 text-xs text-foreground/90 whitespace-pre-wrap rounded-lg bg-muted/30 border border-border p-4">
            {nextWatchText}
          </pre>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut', delay: 0.3 }}
        className="mt-8 bg-card border border-border rounded-xl p-5"
      >
        <h2 className="text-base font-semibold text-foreground mb-4">External Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {RESOURCES.map((resource) => (
            <a
              key={resource.name}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-secondary transition-all group"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{resource.name}</p>
                <p className="text-xs text-muted-foreground">{resource.desc}</p>
              </div>
              <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
