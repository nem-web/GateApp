'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, Highlighter, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import PYQCard from '@/components/PYQCard'

type DifficultyLevel = 'easy' | 'medium' | 'hard'

type UiPaper = {
  id: string
  year: number
  subject: string
  difficulty: DifficultyLevel
  topics: string[]
}

function normalizeDifficulty(value: unknown): DifficultyLevel {
  const raw = typeof value === 'string' ? value.toLowerCase() : ''
  return raw === 'easy' || raw === 'medium' || raw === 'hard' ? raw : 'medium'
}

const difficulties = ['All', 'easy', 'medium', 'hard'] as const

export default function PYQPage() {
  const [papers, setPapers] = useState<UiPaper[]>([])
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [pdfDrawerOpen, setPdfDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [hotTopicsText, setHotTopicsText] = useState<string | null>(null)
  const [hotLoading, setHotLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/pyq')
        if (!res.ok) return
        const data = await res.json()
        const rows = Array.isArray(data.papers) ? data.papers : []
        if (cancelled) return
        setPapers(
          rows.map((p: Record<string, unknown>) => ({
            id: String(p.id ?? ''),
            year: Number(p.year ?? new Date().getFullYear()),
            subject: typeof p.subject === 'string' ? p.subject : 'Unknown',
            difficulty: normalizeDifficulty(p.difficulty),
            topics:
              typeof p.topic === 'string' && p.topic.trim()
                ? [p.topic.trim()]
                : typeof p.subject === 'string'
                  ? [`${p.subject} paper`]
                  : ['General'],
          })),
        )
      } catch {
        if (!cancelled) setPapers([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const yearOptions = useMemo(() => {
    const ys = [...new Set(papers.map((p) => String(p.year)))].sort((a, b) => Number(b) - Number(a))
    return ['All', ...ys]
  }, [papers])

  const subjectOptions = useMemo(() => {
    const subjects = [...new Set(papers.map((p) => p.subject))]
    subjects.sort((a, b) => a.localeCompare(b))
    return ['All', ...subjects]
  }, [papers])

  const topicFrequency = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of papers) {
      for (const t of p.topics) {
        const key = t.trim() || 'General'
        map.set(key, (map.get(key) ?? 0) + 1)
      }
    }
    return [...map.entries()]
      .map(([topic, frequency]) => ({ topic, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 12)
  }, [papers])

  const predictHotTopics = async () => {
    setHotLoading(true)
    setHotTopicsText(null)
    try {
      const res = await fetch('/api/ai/predict-hot-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frequencies: topicFrequency.map((t) => ({ topic: t.topic, freq: t.frequency })),
        }),
      })
      const data = await res.json()
      setHotTopicsText(typeof data.content === 'string' ? data.content : data.error ?? null)
    } catch {
      setHotTopicsText('Could not load prediction.')
    } finally {
      setHotLoading(false)
    }
  }

  const filteredPapers = papers.filter((paper) => {
    if (selectedYear !== 'All' && paper.year.toString() !== selectedYear) return false
    if (selectedSubject !== 'All' && paper.subject !== selectedSubject) return false
    if (selectedDifficulty !== 'All' && paper.difficulty !== selectedDifficulty) return false
    return true
  })

  return (
    <>
      <div className="mx-auto max-w-7xl p-4 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="mb-8"
            >
              <h1 className="text-2xl font-semibold text-foreground">PYQ Papers</h1>
              <p className="text-muted-foreground mt-1">Previous year questions with solutions</p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              {/* Year Dropdown */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year === 'All' ? 'All Years' : year}
                  </option>
                ))}
              </select>

              {/* Subject Pills */}
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSubject === subject
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>

              {/* Difficulty Badges */}
              <div className="flex gap-2 ml-auto">
                {difficulties.map((diff) => {
                  const colors: Record<string, string> = {
                    All: '#6C63FF',
                    easy: '#22C55E',
                    medium: '#F59E0B',
                    hard: '#EF4444',
                  }
                  return (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-secondary'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors[diff] }}
                      />
                      {diff === 'All' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  )
                })}
              </div>
            </motion.div>

            {/* PYQ Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {filteredPapers.map((paper, index) => (
                <PYQCard
                  key={paper.id}
                  year={paper.year}
                  subject={paper.subject}
                  difficulty={paper.difficulty}
                  topics={paper.topics}
                  onViewPDF={() => setPdfDrawerOpen(true)}
                  onViewSolution={() => {}}
                  delay={index * 0.05}
                />
              ))}
            </div>

            {filteredPapers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No papers match your filters</p>
              </div>
            )}

            {/* Topic Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut', delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <h2 className="text-base font-semibold text-foreground mb-4">Topic Frequency Heatmap</h2>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topicFrequency}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 100, bottom: 0 }}
                  >
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="topic"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      width={95}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1D27',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#E5E7EB' }}
                      itemStyle={{ color: '#6C63FF' }}
                    />
                    <Bar
                      dataKey="frequency"
                      fill="#6C63FF"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={predictHotTopics}
                  disabled={hotLoading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <Sparkles size={16} />
                  {hotLoading ? 'Analyzing…' : 'Predict hot topics (AI)'}
                </button>
                {hotTopicsText && (
                  <pre className="mt-4 text-xs text-foreground/90 whitespace-pre-wrap rounded-lg bg-muted/30 border border-border p-4">
                    {hotTopicsText}
                  </pre>
                )}
              </div>
            </motion.div>
          </div>

          {/* PDF Drawer */}
          <AnimatePresence>
            {pdfDrawerOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-full lg:w-1/2 bg-card border-l border-border z-50 shadow-2xl flex flex-col"
              >
                {/* PDF Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className="p-2 rounded hover:bg-secondary transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm text-foreground">
                      Page {currentPage} of 12
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(12, currentPage + 1))}
                      className="p-2 rounded hover:bg-secondary transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom(Math.max(50, zoom - 10))}
                      className="p-2 rounded hover:bg-secondary transition-colors"
                    >
                      <ZoomOut size={18} />
                    </button>
                    <span className="text-sm text-muted-foreground w-12 text-center">
                      {zoom}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(200, zoom + 10))}
                      className="p-2 rounded hover:bg-secondary transition-colors"
                    >
                      <ZoomIn size={18} />
                    </button>
                    <div className="w-px h-5 bg-border mx-2" />
                    <button className="p-2 rounded hover:bg-secondary transition-colors">
                      <Download size={18} />
                    </button>
                    <button className="p-2 rounded hover:bg-secondary transition-colors text-warning">
                      <Highlighter size={18} />
                    </button>
                    <button
                      onClick={() => setPdfDrawerOpen(false)}
                      className="p-2 rounded hover:bg-secondary transition-colors ml-2"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* PDF Preview */}
                <div className="flex-1 overflow-auto p-8 bg-muted/30 flex items-center justify-center">
                  <div
                    className="bg-white rounded-lg shadow-lg p-8"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                  >
                    <div className="w-[500px] h-[700px] flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <p className="text-lg font-medium">GATE 2024 - Computer Science</p>
                        <p className="text-sm mt-2">Page {currentPage}</p>
                        <p className="text-xs mt-4 text-gray-300">PDF preview placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    </>
  );
}

