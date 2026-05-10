'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, Download, Sparkles, Upload } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import PYQCard from '@/components/PYQCard'
import { GATE_EE_SUBJECTS } from '@/lib/gate-ee'
import { toast } from 'sonner'

type DifficultyLevel = 'easy' | 'medium' | 'hard'

type UiPaper = {
  id: string
  year: number
  subject: string
  difficulty: DifficultyLevel
  topic?: string | null
  questionPdfPath?: string | null
  solutionPdfPath?: string | null
  answerKeyPdfPath?: string | null
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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLabel, setPdfLabel] = useState('Paper')
  const [zoom, setZoom] = useState(100)
  const [hotTopicsText, setHotTopicsText] = useState<string | null>(null)
  const [hotLoading, setHotLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    year: new Date().getFullYear().toString(),
    subject: GATE_EE_SUBJECTS[0],
    difficulty: 'medium' as DifficultyLevel,
    kind: 'question',
    topic: '',
    file: null as File | null,
  })

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
            subject: typeof p.subject === 'string' ? p.subject : 'EE',
            difficulty: normalizeDifficulty(p.difficulty),
            topic: typeof p.topic === 'string' ? p.topic : null,
            questionPdfPath: typeof p.questionPdfPath === 'string' ? p.questionPdfPath : null,
            solutionPdfPath: typeof p.solutionPdfPath === 'string' ? p.solutionPdfPath : null,
            answerKeyPdfPath: typeof p.answerKeyPdfPath === 'string' ? p.answerKeyPdfPath : null,
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
    const list = subjects.length ? subjects : [...GATE_EE_SUBJECTS]
    list.sort((a, b) => a.localeCompare(b))
    return ['All', ...list]
  }, [papers])

  const topicFrequency = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of papers) {
      const key = p.topic?.trim() || p.subject
      map.set(key, (map.get(key) ?? 0) + 1)
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

  const openPdf = async (paper: UiPaper, which: 'question' | 'solution' | 'key') => {
    try {
      const res = await fetch(`/api/pyq/${paper.id}/signed-url?which=${which}`)
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      if (!data?.url) throw new Error('bad')
      setPdfUrl(data.url)
      setPdfLabel(which === 'question' ? 'Question paper' : which === 'solution' ? 'Solution' : 'Answer key')
      setPdfDrawerOpen(true)
    } catch {
      toast.error('PDF unavailable for this paper.')
    }
  }

  const handleUpload = async () => {
    if (!uploadForm.file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('year', uploadForm.year)
      form.append('subject', uploadForm.subject)
      form.append('difficulty', uploadForm.difficulty)
      form.append('kind', uploadForm.kind)
      if (uploadForm.topic.trim()) form.append('topic', uploadForm.topic.trim())
      form.append('file', uploadForm.file)
      const res = await fetch('/api/pyq', { method: 'POST', body: form })
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      if (data?.paper) {
        setPapers((prev) => {
          const rest = prev.filter((p) => p.id !== data.paper.id)
          return [{ ...data.paper, difficulty: normalizeDifficulty(data.paper.difficulty) }, ...rest]
        })
      }
      setUploadForm((prev) => ({ ...prev, file: null }))
      toast.success('PYQ uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="mx-auto max-w-7xl p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold text-foreground">PYQ Papers</h1>
          <p className="text-muted-foreground mt-1">Previous year GATE EE questions with solutions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
          className="bg-card border border-border rounded-xl p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Year</label>
              <input
                value={uploadForm.year}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, year: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Subject</label>
              <select
                value={uploadForm.subject}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, subject: e.target.value }))}
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
              <label className="block text-xs text-muted-foreground mb-2">Difficulty</label>
              <select
                value={uploadForm.difficulty}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, difficulty: e.target.value as DifficultyLevel }))}
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                {difficulties
                  .filter((d) => d !== 'All')
                  .map((diff) => (
                    <option key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Kind</label>
              <select
                value={uploadForm.kind}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, kind: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="question">Question</option>
                <option value="solution">Solution</option>
                <option value="key">Answer Key</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Topic</label>
              <input
                value={uploadForm.topic}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, topic: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <Upload size={14} />
                <span>{uploadForm.file ? uploadForm.file.name : 'Select PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, file: e.target.files?.[0] ?? null }))}
                />
              </label>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadForm.file}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
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
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[diff] }} />
                  {diff === 'All' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredPapers.map((paper, index) => (
            <PYQCard
              key={paper.id}
              year={paper.year}
              subject={paper.subject}
              difficulty={paper.difficulty}
              topics={[paper.topic ?? paper.subject]}
              onViewPDF={() => openPdf(paper, 'question')}
              onViewSolution={() => openPdf(paper, 'solution')}
              onViewKey={() => openPdf(paper, 'key')}
              hasAnswerKey={Boolean(paper.answerKeyPdfPath)}
              delay={index * 0.05}
            />
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No papers match your filters</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut', delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h2 className="text-base font-semibold text-foreground mb-4">Topic Frequency Heatmap</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicFrequency} layout="vertical" margin={{ top: 0, right: 20, left: 100, bottom: 0 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
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
                <Bar dataKey="frequency" fill="#6C63FF" radius={[0, 4, 4, 0]} />
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

      <AnimatePresence>
        {pdfDrawerOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full lg:w-1/2 bg-card border-l border-border z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <p className="text-sm font-semibold text-foreground">{pdfLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className="p-2 rounded hover:bg-secondary transition-colors"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-sm text-muted-foreground w-12 text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  className="p-2 rounded hover:bg-secondary transition-colors"
                >
                  <ZoomIn size={18} />
                </button>
                <div className="w-px h-5 bg-border mx-2" />
                <button
                  onClick={() => pdfUrl && window.open(pdfUrl, '_blank', 'noopener,noreferrer')}
                  className="p-2 rounded hover:bg-secondary transition-colors"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => {
                    setPdfDrawerOpen(false)
                    setPdfUrl(null)
                    setZoom(100)
                  }}
                  className="p-2 rounded hover:bg-secondary transition-colors ml-2"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-muted/30">
              {pdfUrl ? (
                <div className="flex justify-center py-6">
                  <div
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                  >
                    <iframe title="PYQ PDF" src={pdfUrl} className="w-[720px] h-[960px]" />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No PDF loaded.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
