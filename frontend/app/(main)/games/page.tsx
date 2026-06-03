'use client'

import { useEffect, useMemo, useState } from 'react'

type QuizQ = { q: string; options: string[]; ans: number }
type SavedGame = {
  id: string
  title: string
  html: string
  updatedAt?: string
}

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
  const [uploadedGameName, setUploadedGameName] = useState('')
  const [uploadedHtml, setUploadedHtml] = useState('')
  const [savedGames, setSavedGames] = useState<SavedGame[]>([])
  const [activeGame, setActiveGame] = useState<SavedGame | null>(null)
  const [playScreenGame, setPlayScreenGame] = useState<SavedGame | null>(null)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const current = formulaQuiz[quizIdx]
  const accuracy = useMemo(() => (tries ? Math.round((hits / tries) * 100) : 0), [hits, tries])
  const previewTitle = uploadedGameName.replace(/\.html?$/i, '') || 'Uploaded HTML game'

  const loadGames = async () => {
    const res = await fetch('/api/games', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    const rows = Array.isArray(data.games) ? data.games : []
    setSavedGames(
      rows.map((g: Record<string, unknown>) => ({
        id: String(g.id ?? ''),
        title: String(g.title ?? 'Untitled game'),
        html: String(g.html ?? ''),
        updatedAt: typeof g.updatedAt === 'string' ? g.updatedAt : undefined,
      })),
    )
  }

  useEffect(() => {
    void loadGames()
  }, [])

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

  const onUploadHtml = async (file: File) => {
    const text = await file.text()
    setUploadedGameName(file.name)
    setUploadedHtml(text)
    setActiveGame({ id: 'preview', title: file.name.replace(/\.html?$/i, ''), html: text })
    setSaveStatus('Preview ready. Save it to add this game to your library.')
  }

  const saveUploadedGame = async () => {
    if (!uploadedHtml.trim()) return
    setSaving(true)
    setSaveStatus('Saving game...')
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: previewTitle, html: uploadedHtml }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSaveStatus(typeof data.error === 'string' ? data.error : 'Could not save game.')
        return
      }
      const game = data.game as SavedGame
      await loadGames()
      setActiveGame(game)
      setUploadedGameName('')
      setUploadedHtml('')
      setSaveStatus('Game saved. Click Play anytime to start it again.')
    } finally {
      setSaving(false)
    }
  }

  const deleteGame = async (game: SavedGame) => {
    await fetch(`/api/games/${game.id}`, { method: 'DELETE' })
    if (activeGame?.id === game.id) setActiveGame(null)
    if (playScreenGame?.id === game.id) setPlayScreenGame(null)
    await loadGames()
  }

  return (
    <div className="w-full p-4 lg:p-6">
      <h1 className="text-2xl font-semibold text-foreground">Games</h1>
      <p className="text-muted-foreground mt-1 mb-6">EE quick-revision games, plus your saved HTML games</p>

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

      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground">Upload HTML game</h2>
            <p className="text-xs text-muted-foreground mt-1">Upload a standalone HTML file, preview it, then save it.</p>
            <div className="mt-3 space-y-3">
              <input
                type="file"
                accept=".html,text/html"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void onUploadHtml(f)
                  e.target.value = ''
                }}
                className="text-sm"
              />
              {uploadedHtml && (
                <button
                  type="button"
                  onClick={saveUploadedGame}
                  disabled={saving}
                  className="w-full rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save game'}
                </button>
              )}
              {saveStatus && <p className="text-xs text-muted-foreground">{saveStatus}</p>}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground">Saved games</h2>
            <div className="mt-3 space-y-2">
              {savedGames.map((game) => (
                <div key={game.id} className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{game.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {game.updatedAt ? new Date(game.updatedAt).toLocaleString() : 'Saved'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveGame(game)
                        setPlayScreenGame(game)
                      }}
                      className="flex-1 rounded bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                    >
                      Play
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteGame(game)}
                      className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!savedGames.length && (
                <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                  No saved HTML games yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Game screen</h2>
              <p className="text-xs text-muted-foreground">{activeGame ? activeGame.title : 'Upload or click Play to start a game'}</p>
            </div>
            {activeGame && (
              <button
                type="button"
                onClick={() => setActiveGame({ ...activeGame })}
                className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
              >
                Restart
              </button>
            )}
          </div>
          {activeGame ? (
            <iframe
              key={`${activeGame.id}-${activeGame.updatedAt ?? activeGame.title}`}
              title="html-game-player"
              sandbox="allow-scripts allow-forms allow-modals allow-pointer-lock"
              srcDoc={activeGame.html}
              className="h-[min(78vh,900px)] min-h-[620px] w-full bg-white"
            />
          ) : (
            <div className="flex h-[min(70vh,820px)] min-h-[520px] items-center justify-center text-sm text-muted-foreground">
              Saved HTML games start here.
            </div>
          )}
        </div>
      </div>

      {playScreenGame && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{playScreenGame.title}</p>
              <p className="text-xs text-muted-foreground">Game play screen</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlayScreenGame({ ...playScreenGame })}
                className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
              >
                Restart
              </button>
              <button
                type="button"
                onClick={() => setPlayScreenGame(null)}
                className="rounded bg-primary px-3 py-1.5 text-xs text-primary-foreground"
              >
                Exit
              </button>
            </div>
          </div>
          <iframe
            key={`screen-${playScreenGame.id}-${playScreenGame.updatedAt ?? playScreenGame.title}`}
            title="html-game-fullscreen-player"
            sandbox="allow-scripts allow-forms allow-modals allow-pointer-lock"
            srcDoc={playScreenGame.html}
            className="min-h-0 flex-1 bg-white"
          />
        </div>
      )}
    </div>
  )
}
