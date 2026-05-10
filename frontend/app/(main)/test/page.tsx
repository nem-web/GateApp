'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  FileText,
  Upload,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

type SampleQ = {
  id: string
  subject: string
  topic: string
  text: string
  options: string[]
  correctIndex: number
}

export default function TestPage() {
  const [tab, setTab] = useState('take')

  return (
    <div className="mx-auto max-w-3xl p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold text-foreground">Tests</h1>
            <p className="text-muted-foreground mt-1">
              Take a quick practice test or start building your own from a question PDF (upload skeleton).
            </p>
          </motion.div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/60">
              <TabsTrigger value="take">Give test</TabsTrigger>
              <TabsTrigger value="create">Create test</TabsTrigger>
            </TabsList>

            <TabsContent value="take">
              <TakeTestPanel />
            </TabsContent>

            <TabsContent value="create">
              <CreateTestPanel />
            </TabsContent>
          </Tabs>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-xs text-muted-foreground text-center max-w-lg mx-auto"
          >
            Full mock analytics, timed full-length papers, and AI-generated explanations ship in a later release.
          </motion.p>
    </div>
  )
}

function TakeTestPanel() {
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<SampleQ[]>([])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [started, setStarted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(15 * 60)
  const timeUpHandled = useRef(false)

  const finalizeScore = useCallback(
    (answerSlice: number[]) => {
      let correct = 0
      questions.forEach((q, i) => {
        const a = answerSlice[i]
        if (a !== undefined && a >= 0 && a === q.correctIndex) correct += 1
      })
      setScore(Math.round((correct / Math.max(questions.length, 1)) * 100))
    },
    [questions],
  )

  useEffect(() => {
    fetch('/api/test/sample')
      .then((r) => r.json())
      .then((d) => {
        setTitle(d.title ?? 'Practice test')
        setQuestions(Array.isArray(d.questions) ? d.questions : [])
      })
      .catch(() => toast.error('Could not load sample test'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const n = questions.length
    setAnswers(Array.from({ length: n }, () => -1))
    setPicked(null)
    setIdx(0)
    setScore(null)
    setStarted(false)
    setSecondsLeft(15 * 60)
    timeUpHandled.current = false
  }, [questions])

  useEffect(() => {
    if (!started || score !== null) return
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [started, score])

  useEffect(() => {
    if (!started || score !== null || secondsLeft > 0) return
    if (timeUpHandled.current) return
    timeUpHandled.current = true
    const merged = [...answers]
    if (picked !== null) merged[idx] = picked
    setAnswers(merged)
    finalizeScore(merged)
    toast.message("Time's up — submitting answers.")
  }, [secondsLeft, started, score, answers, picked, idx, finalizeScore])

  const selectOption = (optionIndex: number) => {
    setPicked(optionIndex)
    setAnswers((prev) => {
      const next = [...prev]
      next[idx] = optionIndex
      return next
    })
  }

  const nextQ = () => {
    const merged = [...answers]
    if (picked !== null) merged[idx] = picked
    if (idx < questions.length - 1) {
      const ni = idx + 1
      setIdx(ni)
      setPicked(merged[ni] >= 0 ? merged[ni] : null)
      setAnswers(merged)
    } else {
      setAnswers(merged)
      finalizeScore(merged)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    )
  }

  if (questions.length === 0) {
    return <p className="text-muted-foreground text-sm">No questions available.</p>
  }

  if (score !== null) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">Result</h2>
        <p className="text-4xl font-bold text-primary mb-4">{score}%</p>
        <button
          type="button"
          onClick={() => {
            setScore(null)
            setIdx(0)
            setPicked(null)
            setAnswers(Array.from({ length: questions.length }, () => -1))
            setStarted(false)
            setSecondsLeft(15 * 60)
            timeUpHandled.current = false
          }}
          className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          Retry
        </button>
      </div>
    )
  }

  const q = questions[idx]
  const mm = Math.floor(secondsLeft / 60)
  const ss = secondsLeft % 60

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {questions.length} questions · sample drill (not persisted)
            </p>
          </div>
          {started && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
              <Clock size={16} />
              {mm}:{`${ss}`.padStart(2, '0')}
            </span>
          )}
        </div>

        {!started ? (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110"
          >
            Start test
          </button>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-1">
              {q.subject} · {q.topic}
            </p>
            <p className="text-sm text-foreground mb-4">{q.text}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectOption(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    picked === i
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border hover:bg-secondary/80 text-foreground'
                  }`}
                >
                  <span className="font-medium text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <span className="text-xs text-muted-foreground">
                {idx + 1} / {questions.length}
              </span>
              <button
                type="button"
                onClick={nextQ}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80"
              >
                {idx >= questions.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {questions.map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={!started}
            onClick={() => {
              setIdx(i)
              setPicked(answers[i] >= 0 ? answers[i] : null)
            }}
            className="p-1"
          >
            {answers[i] >= 0 ? (
              <CheckCircle2 size={18} className="text-primary" />
            ) : (
              <Circle size={18} className="text-muted-foreground/40" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function CreateTestPanel() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const file = fd.get('file')
    if (!(file instanceof File) || file.size === 0) {
      toast.error('Choose a PDF file')
      return
    }
    setUploading(true)
    setResult(null)
    try {
      const up = new FormData()
      up.append('file', file)
      up.append('title', file.name)
      const res = await fetch('/api/test/upload-pdf', { method: 'POST', body: up })
      const data = await res.json()
      setResult(data)
      if (data.ok) toast.success('Upload registered (skeleton)')
      else toast.error(data.error ?? 'Upload failed')
    } catch {
      toast.error('Network error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Upload size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-foreground">Upload question PDF</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Stub endpoint: your PDF is validated and optionally logged to the database. Automatic MCQ extraction will be
          added later (PDF text → LLM → <code className="text-xs">Question</code> rows).
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs text-muted-foreground mb-2 block">PDF file (max ~4MB on Vercel Hobby)</span>
            <input
              name="file"
              type="file"
              accept="application/pdf"
              className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground"
            />
          </label>
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
            Upload & queue for parsing (skeleton)
          </button>
        </form>
      </div>

      {result && (
        <pre className="text-xs bg-muted/40 border border-border rounded-xl p-4 overflow-auto whitespace-pre-wrap text-foreground/90">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-5">
        <li>Production path: upload to Vercel Blob → background job → structured questions.</li>
        <li>Hobby functions have a ~4.5MB request body limit; use client-side Blob upload for larger files.</li>
      </ul>
    </div>
  )
}

