'use client'

import { useEffect, useMemo, useState } from 'react'

type SampleQ = {
  id: string
  subject: string
  topic: string
  text: string
  options: string[]
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

export default function TestPage() {
  const [title, setTitle] = useState('GATE-EE Practice')
  const [questions, setQuestions] = useState<SampleQ[]>([])
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadKind, setUploadKind] = useState<'question' | 'answer_key'>('question')

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/test/sample', { cache: 'no-store' })
      const data = await res.json()
      const rows = Array.isArray(data.questions) ? data.questions : []
      setTitle(typeof data.title === 'string' ? data.title : 'GATE-EE Practice')
      setQuestions(rows)
      setAnswers(Array.from({ length: rows.length }, () => -1))
    })()
  }, [])

  const answered = useMemo(() => answers.filter((a) => a >= 0).length, [answers])

  const submit = async () => {
    const res = await fetch('/api/test/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        answers,
        timeTakenSeconds: 900,
      }),
    })
    if (!res.ok) return
    const data = await res.json()
    setResult({
      score: Number(data.score ?? 0),
      totalQuestions: Number(data.totalQuestions ?? questions.length),
      accuracy: Number(data.accuracy ?? 0),
      weakTopics: Array.isArray(data.weakTopics) ? data.weakTopics : [],
      comparisons: Array.isArray(data.comparisons) ? data.comparisons : [],
    })
  }

  const uploadPdf = async () => {
    if (!uploadFile) return
    const fd = new FormData()
    fd.append('file', uploadFile)
    fd.append('title', uploadFile.name)
    fd.append('kind', uploadKind)
    await fetch('/api/test/upload-pdf', { method: 'POST', body: fd })
    setUploadFile(null)
  }

  return (
    <div className="mx-auto max-w-5xl p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Tests</h1>
      <p className="text-muted-foreground mt-1 mb-6">Create/upload test files and get analytics after submission</p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6">
        <h2 className="text-sm font-semibold mb-3">Upload test PDFs</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <select value={uploadKind} onChange={(e) => setUploadKind(e.target.value as 'question' | 'answer_key')} className="px-3 py-2 rounded border border-border bg-input text-sm">
            <option value="question">Question paper</option>
            <option value="answer_key">Answer key</option>
          </select>
          <input type="file" accept="application/pdf" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
          <button onClick={uploadPdf} className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Upload</button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-1">{answered} / {questions.length} answered</p>
        <div className="mt-4 space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{q.subject} - {q.topic}</p>
              <p className="text-sm mt-1 text-foreground">{q.text}</p>
              <div className="mt-2 grid gap-2">
                {q.options.map((opt, oi) => (
                  <button key={oi} onClick={() => setAnswers((prev) => { const next = [...prev]; next[i] = oi; return next })} className={`text-left px-3 py-2 rounded border text-sm ${answers[i] === oi ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    {String.fromCharCode(65 + oi)}. {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={submit} className="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Submit test</button>
      </div>

      {result && (
        <div className="mt-6 bg-card border border-border rounded-xl p-4">
          <h3 className="text-base font-semibold text-foreground">Result</h3>
          <p className="text-sm text-foreground mt-2">Score: {result.score}/{result.totalQuestions}</p>
          <p className="text-sm text-foreground">Accuracy: {result.accuracy.toFixed(1)}%</p>
          <p className="text-sm text-foreground mt-2">Weak topics: {result.weakTopics.length ? result.weakTopics.join(', ') : 'None detected'}</p>
        </div>
      )}
    </div>
  )
}
