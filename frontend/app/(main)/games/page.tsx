'use client'

import { useMemo, useState } from 'react'

type QuizQ = { q: string; options: string[]; ans: number }

const formulaQuiz: QuizQ[] = [
  { q: 'Power in AC circuit equals?', options: ['VI', 'VIcos(phi)', 'I^2R only'], ans: 1 },
  { q: 'Laplace of unit step u(t)?', options: ['1/s', 's', '1/(s+1)'], ans: 0 },
  { q: 'Synchronous speed formula?', options: ['120f/P', '60f/P', 'P/120f'], ans: 0 },
]

const memoryItems = ['RLC', 'KCL', 'KVL', 'Thevenin', 'Norton', 'Bode']

export default function GamesPage() {
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  const [target, setTarget] = useState(memoryItems[0])
  const [hits, setHits] = useState(0)
  const [tries, setTries] = useState(0)

  const current = formulaQuiz[quizIdx]
  const accuracy = useMemo(() => (tries ? Math.round((hits / tries) * 100) : 0), [hits, tries])

  const answerQuiz = (i: number) => {
    if (quizDone) return
    if (i === current.ans) setQuizScore((s) => s + 1)
    if (quizIdx >= formulaQuiz.length - 1) setQuizDone(true)
    else setQuizIdx((v) => v + 1)
  }

  const restartQuiz = () => {
    setQuizIdx(0)
    setQuizScore(0)
    setQuizDone(false)
  }

  const tryMemory = (item: string) => {
    setTries((t) => t + 1)
    if (item === target) {
      setHits((h) => h + 1)
      const next = memoryItems[Math.floor(Math.random() * memoryItems.length)]
      setTarget(next)
    }
  }

  const restartMemory = () => {
    setHits(0)
    setTries(0)
    setTarget(memoryItems[0])
  }

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Games</h1>
      <p className="text-muted-foreground mt-1 mb-6">EE quick-revision games with score and restart</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground">Formula MCQ Sprint</h2>
          {!quizDone ? (
            <>
              <p className="text-sm text-foreground mt-3">{current.q}</p>
              <div className="mt-3 space-y-2">
                {current.options.map((o, i) => (
                  <button key={i} onClick={() => answerQuiz(i)} className="w-full text-left px-3 py-2 rounded border border-border bg-secondary/50 text-sm">{o}</button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Question {quizIdx + 1}/{formulaQuiz.length}</p>
            </>
          ) : (
            <>
              <p className="mt-4 text-2xl font-semibold text-foreground">{quizScore}/{formulaQuiz.length}</p>
              <button onClick={restartQuiz} className="mt-3 px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Restart quiz</button>
            </>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground">Memory Tap</h2>
          <p className="text-sm text-muted-foreground mt-2">Tap: <span className="text-foreground font-medium">{target}</span></p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {memoryItems.map((it) => (
              <button key={it} onClick={() => tryMemory(it)} className="px-3 py-2 rounded border border-border text-sm hover:bg-secondary">
                {it}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-foreground">Score: {hits}/{tries} ({accuracy}%)</p>
          <button onClick={restartMemory} className="mt-3 px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Restart memory game</button>
        </div>
      </div>
    </div>
  )
}
