'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileUp,
  Flag,
  Play,
  Sparkles,
  UploadCloud,
  XCircle,
} from 'lucide-react'

type SampleQ = {
  id: string
  subject: string
  topic: string
  text: string
  options: string[]
}

type SavedTest = {
  slug: string
  title: string
  durationMinutes: number
  questionCount: number
  answerKeyBound: boolean
  status: 'ready' | 'needs_answer_key'
  subjects: string[]
  lastAttempt: null | {
    score: number
    totalQuestions: number
    accuracy: number
    createdAt: string
  }
}

type SubmitResult = {
  score: number
  totalQuestions: number
  accuracy: number
  weakTopics: string[]
  comparisons: Array<{
    questionId: string
    subject: string
    topic: string
    correctAnswerIndex: number
    userAnswerIndex: number | null
    ok: boolean
  }>
}

type MakerSubject = {
  id: string
  title: string
  slug: string
}

type MakerTopicGroup = {
  subjectId: string
  subject: string
  topic: string
  lectureCount: number
  lectureTitles: string[]
}

type MakerContext = {
  subjects: MakerSubject[]
  topicGroups: MakerTopicGroup[]
}

async function readJsonResponse(res: Response) {
  const text = await res.text()
  if (!text.trim()) return {}
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return { error: text }
  }
}

function responseTest(value: unknown) {
  if (!value || typeof value !== 'object') return null
  const test = (value as { test?: unknown }).test
  if (!test || typeof test !== 'object') return null
  const row = test as { slug?: unknown; answerKeyBound?: unknown }
  return {
    slug: typeof row.slug === 'string' ? row.slug : '',
    answerKeyBound: row.answerKeyBound === true,
  }
}

export default function TestPage() {
  const [title, setTitle] = useState('GATE-EE Practice')
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [selectedReady, setSelectedReady] = useState(true)
  const [questions, setQuestions] = useState<SampleQ[]>([])
  const [answers, setAnswers] = useState<number[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [markedForReview, setMarkedForReview] = useState<boolean[]>([])
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [savedTests, setSavedTests] = useState<SavedTest[]>([])
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadKind, setUploadKind] = useState<'question' | 'answer_key'>('question')
  const [uploadTargetSlug, setUploadTargetSlug] = useState('')
  const [createDurationMinutes, setCreateDurationMinutes] = useState(65)
  const [testDurationMinutes, setTestDurationMinutes] = useState(25)
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60)
  const [testStarted, setTestStarted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [makerContext, setMakerContext] = useState<MakerContext>({ subjects: [], topicGroups: [] })
  const [makerSubjectId, setMakerSubjectId] = useState('')
  const [makerTopicMode, setMakerTopicMode] = useState<'all_done' | 'topic'>('all_done')
  const [makerTopic, setMakerTopic] = useState('')
  const [makerSourceMode, setMakerSourceMode] = useState<'pyq' | 'ai'>('ai')
  const [makerDurationMinutes, setMakerDurationMinutes] = useState(30)
  const [makerQuestionCount, setMakerQuestionCount] = useState(10)
  const [makerLoading, setMakerLoading] = useState(false)
  const [makerStatus, setMakerStatus] = useState<string | null>(null)

  const loadSavedTests = async () => {
    const res = await fetch('/api/test', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    const rows = Array.isArray(data.tests) ? data.tests : []
    setSavedTests(rows)
    const firstPending = rows.find((row: SavedTest) => !row.answerKeyBound)
    if (firstPending && !uploadTargetSlug) setUploadTargetSlug(firstPending.slug)
  }

  const loadMakerContext = async () => {
    const res = await fetch('/api/test/maker/context', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    const subjects = Array.isArray(data.subjects) ? data.subjects : []
    const topicGroups = Array.isArray(data.topicGroups) ? data.topicGroups : []
    setMakerContext({ subjects, topicGroups })
    setMakerSubjectId((current) => current || topicGroups[0]?.subjectId || subjects[0]?.id || '')
  }

  const loadTest = async (packSlug?: string) => {
    const url = packSlug
      ? `/api/test/sample?packSlug=${encodeURIComponent(packSlug)}`
      : '/api/test/sample'
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    if (!res.ok) {
      setUploadStatus(typeof data.error === 'string' ? data.error : 'Could not load test.')
      return
    }
    const rows = Array.isArray(data.questions) ? data.questions : []
    setTitle(typeof data.title === 'string' ? data.title : 'GATE-EE Practice')
    const duration = Math.max(1, Number(data.durationMinutes ?? 25))
    setTestDurationMinutes(duration)
    setRemainingSeconds(duration * 60)
    setTestStarted(false)
    setSelectedSlug(typeof data.slug === 'string' ? data.slug : '')
    setSelectedReady(data.ready !== false)
    setQuestions(rows)
    setAnswers(Array.from({ length: rows.length }, () => -1))
    setMarkedForReview(Array.from({ length: rows.length }, () => false))
    setCurrentQuestionIndex(0)
    setResult(null)
  }

  useEffect(() => {
    void loadTest()
    void loadSavedTests()
    void loadMakerContext()
  }, [])

  const answered = useMemo(() => answers.filter((a) => a >= 0).length, [answers])
  const markedCount = useMemo(() => markedForReview.filter(Boolean).length, [markedForReview])
  const unanswered = Math.max(0, questions.length - answered)
  const currentQuestion = questions[currentQuestionIndex]
  const readySavedTests = savedTests.filter((test) => test.answerKeyBound)
  const pendingSavedTests = savedTests.filter((test) => !test.answerKeyBound)
  const makerSubjectTopics = useMemo(
    () => makerContext.topicGroups.filter((group) => group.subjectId === makerSubjectId),
    [makerContext.topicGroups, makerSubjectId],
  )
  const makerSubject = makerContext.subjects.find((subject) => subject.id === makerSubjectId)
  const makerSelectedTopic =
    makerTopic && makerSubjectTopics.some((group) => group.topic === makerTopic)
      ? makerTopic
      : makerSubjectTopics[0]?.topic ?? ''
  const makerHasCompletedLectures = makerSubjectTopics.length > 0
  const timerLabel = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`

  const comparisonById = useMemo(() => {
    const map = new Map<string, SubmitResult['comparisons'][number]>()
    result?.comparisons.forEach((row) => map.set(row.questionId, row))
    return map
  }, [result])

  const setAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[questionIndex] = optionIndex
      return next
    })
  }

  const clearAnswer = (questionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[questionIndex] = -1
      return next
    })
  }

  const toggleMarked = (questionIndex: number) => {
    setMarkedForReview((prev) => {
      const next = [...prev]
      next[questionIndex] = !next[questionIndex]
      return next
    })
  }

  const paletteClass = (index: number) => {
    const isCurrent = index === currentQuestionIndex
    const answeredState = answers[index] >= 0
    const marked = markedForReview[index]
    if (isCurrent) return 'border-primary bg-primary text-primary-foreground'
    if (marked && answeredState) return 'border-violet-500 bg-violet-500/20 text-violet-200'
    if (marked) return 'border-amber-500 bg-amber-500/20 text-amber-200'
    if (answeredState) return 'border-green-500 bg-green-500/15 text-green-300'
    return 'border-border bg-secondary/40 text-muted-foreground'
  }

  const submit = async () => {
    if (submitting) return
    setSubmitting(true)
    const res = await fetch('/api/test/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packSlug: selectedSlug,
        title,
        answers,
        timeTakenSeconds: Math.max(0, testDurationMinutes * 60 - remainingSeconds),
      }),
    })
    const data = await readJsonResponse(res)
    if (!res.ok) {
      setUploadStatus(typeof data.error === 'string' ? data.error : 'Submit failed.')
      setSubmitting(false)
      return
    }
    setResult({
      score: Number(data.score ?? 0),
      totalQuestions: Number(data.totalQuestions ?? questions.length),
      accuracy: Number(data.accuracy ?? 0),
      weakTopics: Array.isArray(data.weakTopics) ? data.weakTopics : [],
      comparisons: Array.isArray(data.comparisons) ? data.comparisons : [],
    })
    setCurrentQuestionIndex(0)
    setTestStarted(false)
    setSubmitting(false)
    void loadSavedTests()
  }

  useEffect(() => {
    if (!testStarted || result || questions.length === 0) return
    const id = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(id)
          void submit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [testStarted, result, questions.length])

  const startTest = async () => {
    if (!questions.length || !selectedReady) return
    setAnswers(Array.from({ length: questions.length }, () => -1))
    setMarkedForReview(Array.from({ length: questions.length }, () => false))
    setCurrentQuestionIndex(0)
    setResult(null)
    setRemainingSeconds(testDurationMinutes * 60)
    setTestStarted(true)
    try {
      await document.documentElement.requestFullscreen?.()
    } catch {}
  }

  const uploadPdf = async () => {
    if (!uploadFile || uploading) return
    if (uploadKind === 'answer_key' && !uploadTargetSlug) {
      setUploadStatus('Choose the matching question paper test first.')
      return
    }
    setUploading(true)
    setUploadStatus(null)
    const fd = new FormData()
    fd.append('file', uploadFile)
    fd.append('title', uploadFile.name)
    fd.append('kind', uploadKind)
    if (uploadKind === 'answer_key') fd.append('testPackSlug', uploadTargetSlug)
    if (uploadKind === 'question') fd.append('durationMinutes', String(createDurationMinutes))

    try {
      const res = await fetch('/api/test/upload-pdf', { method: 'POST', body: fd })
      const data = await readJsonResponse(res)
      if (!res.ok) {
        setUploadStatus(typeof data.error === 'string' ? data.error : 'Upload failed.')
        return
      }
      setUploadStatus(typeof data.message === 'string' ? data.message : 'Upload complete.')
      setUploadFile(null)
      const uploadedTest = responseTest(data)
      if (uploadedTest?.slug) {
        setUploadTargetSlug(uploadedTest.slug)
        if (uploadedTest.answerKeyBound) void loadTest(uploadedTest.slug)
      }
      await loadSavedTests()
    } finally {
      setUploading(false)
    }
  }

  const createMakerTest = async () => {
    if (makerLoading) return
    if (!makerSubjectId) {
      setMakerStatus('Choose a subject first.')
      return
    }
    if (!makerHasCompletedLectures) {
      setMakerStatus('No completed lectures found for this subject.')
      return
    }
    if (makerTopicMode === 'topic' && !makerSelectedTopic) {
      setMakerStatus('Choose a completed topic/chapter.')
      return
    }

    setMakerLoading(true)
    setMakerStatus(null)
    try {
      const res = await fetch('/api/test/maker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: makerSubjectId,
          durationMinutes: makerDurationMinutes,
          questionCount: makerQuestionCount,
          sourceMode: makerSourceMode,
          topicMode: makerTopicMode,
          topic: makerTopicMode === 'topic' ? makerSelectedTopic : undefined,
        }),
      })
      const data = await readJsonResponse(res)
      if (!res.ok) {
        setMakerStatus(typeof data.error === 'string' ? data.error : 'Could not create test.')
        return
      }
      setMakerStatus(typeof data.message === 'string' ? data.message : 'Test created.')
      const created = responseTest(data)
      await loadSavedTests()
      if (created?.slug) void loadTest(created.slug)
    } finally {
      setMakerLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Tests</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a question PDF to create a saved test, then bind its answer key before taking it.
        </p>
      </div>

      <section className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Test Maker</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Completed lectures only{makerSubject ? ` - ${makerSubject.title}` : ''}
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_150px_150px_180px]">
          <select
            value={makerSubjectId}
            onChange={(e) => {
              setMakerSubjectId(e.target.value)
              setMakerTopicMode('all_done')
              setMakerTopic('')
            }}
            className="rounded border border-border bg-input px-3 py-2 text-sm"
          >
            {makerContext.subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.title}
              </option>
            ))}
          </select>

          <select
            value={makerTopicMode === 'all_done' ? 'all_done' : makerSelectedTopic}
            onChange={(e) => {
              if (e.target.value === 'all_done') {
                setMakerTopicMode('all_done')
                setMakerTopic('')
                return
              }
              setMakerTopicMode('topic')
              setMakerTopic(e.target.value)
            }}
            disabled={!makerHasCompletedLectures}
            className="rounded border border-border bg-input px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="all_done">Complete till lectures done</option>
            {makerSubjectTopics.map((group) => (
              <option key={`${group.subjectId}-${group.topic}`} value={group.topic}>
                {group.topic} ({group.lectureCount})
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            max={65}
            value={makerQuestionCount}
            onChange={(e) => setMakerQuestionCount(Math.max(1, Math.min(65, Number(e.target.value) || 10)))}
            title="Number of questions"
            className="rounded border border-border bg-input px-3 py-2 text-sm"
          />

          <input
            type="number"
            min={5}
            max={360}
            value={makerDurationMinutes}
            onChange={(e) => setMakerDurationMinutes(Math.max(5, Math.min(360, Number(e.target.value) || 30)))}
            title="Duration in minutes"
            className="rounded border border-border bg-input px-3 py-2 text-sm"
          />

          <select
            value={makerSourceMode}
            onChange={(e) => setMakerSourceMode(e.target.value as 'pyq' | 'ai')}
            className="rounded border border-border bg-input px-3 py-2 text-sm"
          >
            <option value="ai">AI created</option>
            <option value="pyq">PYQ based</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {makerHasCompletedLectures
              ? `${makerSubjectTopics.reduce((sum, group) => sum + group.lectureCount, 0)} completed lectures available for this subject.`
              : 'Complete at least one lecture in this subject to unlock test creation.'}
          </p>
          <button
            type="button"
            onClick={createMakerTest}
            disabled={makerLoading || !makerHasCompletedLectures}
            className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {makerLoading ? 'Creating' : 'Create test'}
          </button>
        </div>
        {makerStatus && <p className="mt-3 text-sm text-muted-foreground">{makerStatus}</p>}
      </section>

      <section className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center gap-2">
          <UploadCloud className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Create test from PDF</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)_140px_260px_140px]">
          <select
            value={uploadKind}
            onChange={(e) => setUploadKind(e.target.value as 'question' | 'answer_key')}
            className="rounded border border-border bg-input px-3 py-2 text-sm"
          >
            <option value="question">Question paper</option>
            <option value="answer_key">Answer key</option>
          </select>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            className="rounded border border-border bg-input px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={5}
            max={360}
            value={createDurationMinutes}
            onChange={(e) => setCreateDurationMinutes(Math.max(5, Math.min(360, Number(e.target.value) || 65)))}
            disabled={uploadKind === 'answer_key'}
            title="Test duration in minutes"
            className="rounded border border-border bg-input px-3 py-2 text-sm disabled:opacity-50"
          />
          <select
            value={uploadTargetSlug}
            onChange={(e) => setUploadTargetSlug(e.target.value)}
            disabled={uploadKind === 'question'}
            className="rounded border border-border bg-input px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="">Select matching test</option>
            {savedTests.map((test) => (
              <option key={test.slug} value={test.slug}>
                {test.title} ({test.questionCount} Q)
              </option>
            ))}
          </select>
          <button
            onClick={uploadPdf}
            disabled={!uploadFile || uploading}
            className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            <FileUp className="h-4 w-4" />
            {uploading ? 'Uploading' : 'Upload'}
          </button>
        </div>
        {uploadStatus && <p className="mt-3 text-sm text-muted-foreground">{uploadStatus}</p>}
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Saved tests</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <button
            type="button"
            onClick={() => void loadTest()}
            className="rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/60"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Seeded GATE EE drill</p>
                <p className="mt-1 text-xs text-muted-foreground">Practice sample from database seed</p>
              </div>
              <Play className="h-4 w-4 text-primary" />
            </div>
          </button>

          {savedTests.map((test) => (
            <button
              key={test.slug}
              type="button"
              disabled={!test.answerKeyBound}
              onClick={() => void loadTest(test.slug)}
              className="rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{test.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {test.questionCount} questions - {test.durationMinutes} min
                  </p>
                </div>
                {test.answerKeyBound ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="rounded bg-warning/15 px-2 py-1 text-[11px] text-warning">Needs key</span>
                )}
              </div>
              {test.lastAttempt && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Last score: {test.lastAttempt.score}/{test.lastAttempt.totalQuestions}
                </p>
              )}
            </button>
          ))}
        </div>
        {savedTests.length === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">No uploaded tests yet. Upload a question paper to create one.</p>
        )}
        {(readySavedTests.length > 0 || pendingSavedTests.length > 0) && (
          <p className="mt-3 text-xs text-muted-foreground">
            Ready: {readySavedTests.length} | Waiting for answer key: {pendingSavedTests.length}
          </p>
        )}
      </section>

      <section className={`overflow-hidden rounded-xl border border-border bg-card ${testStarted ? 'fixed inset-0 z-[90] rounded-none border-0' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Question {questions.length ? currentQuestionIndex + 1 : 0} of {questions.length}
              {!selectedReady ? ' - answer key required before submission' : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`rounded border px-2 py-1 font-semibold ${remainingSeconds < 300 && testStarted ? 'border-red-500/50 bg-red-500/15 text-red-300' : 'border-primary/40 bg-primary/10 text-primary'}`}>
              Timer {timerLabel}
            </span>
            <span className="rounded border border-green-500/40 bg-green-500/10 px-2 py-1 text-green-300">
              Answered {answered}
            </span>
            <span className="rounded border border-border bg-secondary/40 px-2 py-1 text-muted-foreground">
              Unanswered {unanswered}
            </span>
            <span className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-300">
              Marked {markedCount}
            </span>
            {testStarted && (
              <button
                type="button"
                onClick={() => {
                  setTestStarted(false)
                  void document.exitFullscreen?.()
                }}
                className="rounded border border-border px-2 py-1 text-muted-foreground hover:bg-secondary"
              >
                Exit full screen
              </button>
            )}
          </div>
        </div>

        {!testStarted && !result ? (
          <div className="flex min-h-[520px] flex-col items-center justify-center px-6 text-center">
            <Play className="mb-4 h-10 w-10 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Ready to start?</h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              The test opens in a full-screen exam view with no sidebar. Timer is set to {testDurationMinutes} minutes.
            </p>
            <button
              type="button"
              onClick={startTest}
              disabled={!selectedReady || questions.length === 0}
              className="mt-5 rounded bg-primary px-5 py-2.5 text-sm text-primary-foreground disabled:opacity-50"
            >
              Start full-screen test
            </button>
          </div>
        ) : (
        <div className="grid min-h-[calc(100vh-57px)] lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-[520px] flex-col p-4">
            {currentQuestion ? (
              <>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {currentQuestion.subject} - {currentQuestion.topic}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-foreground">
                      Q{currentQuestionIndex + 1}
                    </h3>
                  </div>
                  {!result && (
                    <button
                      type="button"
                      onClick={() => toggleMarked(currentQuestionIndex)}
                      className={`inline-flex items-center gap-2 rounded border px-3 py-2 text-xs ${
                        markedForReview[currentQuestionIndex]
                          ? 'border-amber-500 bg-amber-500/15 text-amber-200'
                          : 'border-border text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      <Flag className="h-4 w-4" />
                      {markedForReview[currentQuestionIndex] ? 'Marked' : 'Mark for review'}
                    </button>
                  )}
                </div>

                <div className="rounded-lg border border-border bg-background/40 p-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {currentQuestion.text}
                  </p>
                </div>

                <div className="mt-4 grid gap-3">
                  {currentQuestion.options.map((opt, oi) => {
                    const comparison = comparisonById.get(currentQuestion.id)
                    const isSelected = answers[currentQuestionIndex] === oi
                    const isCorrect = comparison?.correctAnswerIndex === oi
                    const isWrongPick = Boolean(result && isSelected && !isCorrect)
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={Boolean(result)}
                        onClick={() => setAnswer(currentQuestionIndex, oi)}
                        className={`flex items-start gap-3 rounded-lg border px-3 py-3 text-left text-sm transition ${
                          result && isCorrect
                            ? 'border-green-500 bg-green-500/15 text-green-100'
                            : isWrongPick
                              ? 'border-red-500 bg-red-500/15 text-red-100'
                              : isSelected
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border text-foreground hover:border-primary/50'
                        }`}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {result && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />}
                        {isWrongPick && <XCircle className="h-4 w-4 shrink-0 text-red-400" />}
                      </button>
                    )
                  })}
                </div>

                {result && (
                  <div
                    className={`mt-4 rounded-lg border p-3 text-sm ${
                      comparisonById.get(currentQuestion.id)?.ok
                        ? 'border-green-500/40 bg-green-500/10 text-green-100'
                        : 'border-red-500/40 bg-red-500/10 text-red-100'
                    }`}
                  >
                    {comparisonById.get(currentQuestion.id)?.ok ? (
                      <p>Your answer is correct.</p>
                    ) : (
                      <p>
                        Your answer:{' '}
                        {answers[currentQuestionIndex] >= 0
                          ? String.fromCharCode(65 + answers[currentQuestionIndex])
                          : 'Not answered'}
                        . Correct answer:{' '}
                        {String.fromCharCode(65 + (comparisonById.get(currentQuestion.id)?.correctAnswerIndex ?? 0))}.
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((idx) => Math.max(0, idx - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex flex-wrap gap-2">
                    {!result && (
                      <button
                        type="button"
                        onClick={() => clearAnswer(currentQuestionIndex)}
                        className="rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                      >
                        Clear response
                      </button>
                    )}
                    {currentQuestionIndex < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIndex((idx) => Math.min(questions.length - 1, idx + 1))}
                        className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
                      >
                        Save & Next
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      !result && (
                        <button
                          onClick={submit}
                          disabled={!selectedReady || questions.length === 0}
                          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                        >
                          Submit test
                        </button>
                      )
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Select or create a test to begin.
              </div>
            )}
          </div>

          <aside className="border-t border-border bg-background/35 p-4 lg:border-l lg:border-t-0">
            <h3 className="text-sm font-semibold text-foreground">Question panel</h3>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {questions.map((q, index) => {
                const comparison = result ? comparisonById.get(q.id) : null
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`relative h-10 rounded border text-sm font-medium ${paletteClass(index)} ${
                      result && comparison?.ok ? 'ring-1 ring-green-400' : ''
                    } ${result && comparison && !comparison.ok ? 'ring-1 ring-red-400' : ''}`}
                  >
                    {index + 1}
                    {markedForReview[index] && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded border border-green-500 bg-green-500/30" />
                Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded border border-amber-500 bg-amber-500/30" />
                Marked for review
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded border border-border bg-secondary/40" />
                Not answered
              </div>
              {result && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    Correct in review
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3.5 w-3.5 text-red-400" />
                    Wrong in review
                  </div>
                </>
              )}
            </div>

            {!result && (
              <button
                onClick={submit}
                disabled={!selectedReady || questions.length === 0}
                className="mt-5 w-full rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
              >
                Submit test
              </button>
            )}

            {result && (
              <div className="mt-5 rounded-lg border border-border bg-card p-3">
                <p className="text-sm font-semibold text-foreground">
                  Score: {result.score}/{result.totalQuestions}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Accuracy: {result.accuracy.toFixed(1)}%
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Weak topics: {result.weakTopics.length ? result.weakTopics.join(', ') : 'None detected'}
                </p>
              </div>
            )}
          </aside>
        </div>
        )}
      </section>
    </div>
  )
}
