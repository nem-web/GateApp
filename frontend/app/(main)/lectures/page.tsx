'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, CheckCircle, ExternalLink, Sparkles } from 'lucide-react'
const lectures = [
  {
    id: 1,
    title: 'Data Structures - Arrays & Linked Lists',
    subject: 'Computer Science',
    duration: '45 min',
    watched: true,
    thumbnail: 'DS',
  },
  {
    id: 2,
    title: 'Linear Algebra - Eigenvalues',
    subject: 'Mathematics',
    duration: '52 min',
    watched: true,
    thumbnail: 'LA',
  },
  {
    id: 3,
    title: 'Operating Systems - Process Scheduling',
    subject: 'Computer Science',
    duration: '38 min',
    watched: false,
    thumbnail: 'OS',
  },
  {
    id: 4,
    title: 'DBMS - Normalization (1NF to BCNF)',
    subject: 'Computer Science',
    duration: '42 min',
    watched: false,
    thumbnail: 'DB',
  },
  {
    id: 5,
    title: 'Calculus - Differential Equations',
    subject: 'Engineering Maths',
    duration: '55 min',
    watched: false,
    thumbnail: 'CA',
  },
  {
    id: 6,
    title: 'Computer Networks - TCP/IP Model',
    subject: 'Computer Science',
    duration: '48 min',
    watched: false,
    thumbnail: 'CN',
  },
]

const subjectColors: Record<string, string> = {
  'Computer Science': '#F472B6',
  'Mathematics': '#818CF8',
  'Engineering Maths': '#60A5FA',
  'General Aptitude': '#34D399',
}

export default function LecturesPage() {
  const [filter, setFilter] = useState<'all' | 'watched' | 'unwatched'>('all')
  const [nextWatchText, setNextWatchText] = useState<string | null>(null)
  const [recLoading, setRecLoading] = useState(false)

  const fetchRecommendation = async () => {
    setRecLoading(true)
    setNextWatchText(null)
    try {
      const res = await fetch('/api/ai/lecture-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weakSubjects: ['Graph Theory', 'Computer Networks', 'Compiler Design'] }),
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
    if (filter === 'watched') return lecture.watched
    if (filter === 'unwatched') return !lecture.watched
    return true
  })

  const watchedCount = lectures.filter((l) => l.watched).length

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold text-foreground">Lectures</h1>
            <p className="text-muted-foreground mt-1">Video lectures organized by topic</p>
          </motion.div>

          {/* Progress & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-success" />
                <span className="text-foreground font-medium">{watchedCount}</span>
                <span className="text-muted-foreground">of {lectures.length} watched</span>
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

          {/* Lecture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLectures.map((lecture, index) => {
              const color = subjectColors[lecture.subject] || '#6C63FF'
              return (
                <motion.div
                  key={lecture.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut', delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="bg-card border border-border rounded-xl overflow-hidden group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative h-36 flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <span
                      className="text-4xl font-bold"
                      style={{ color }}
                    >
                      {lecture.thumbnail}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                        <Play size={20} fill="white" className="text-white ml-1" />
                      </div>
                    </div>
                    {lecture.watched && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${color}26`,
                          color,
                        }}
                      >
                        {lecture.subject}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                        <Clock size={12} />
                        {lecture.duration}
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-foreground line-clamp-2">
                      {lecture.title}
                    </h3>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredLectures.length === 0 && (
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

          {/* External Resources */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.3 }}
            className="mt-8 bg-card border border-border rounded-xl p-5"
          >
            <h2 className="text-base font-semibold text-foreground mb-4">External Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'NPTEL', desc: 'IIT Video Lectures' },
                { name: 'Gate Smashers', desc: 'YouTube Channel' },
                { name: 'Ravindrababu', desc: 'GATE Lectures' },
                { name: 'GeeksforGeeks', desc: 'Practice & Theory' },
              ].map((resource) => (
                <a
                  key={resource.name}
                  href="#"
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

