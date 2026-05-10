'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameCard from '@/components/GameCard'
import { RefreshCw } from 'lucide-react'

type GameId = 'math' | 'formula' | 'memory'

const games = [
  {
    id: 'math' as const,
    name: 'Math Sprint',
    description: 'Race against time solving quick EE calculations.',
    icon: '⚡',
    color: '#6C63FF',
    featured: true,
  },
  {
    id: 'formula' as const,
    name: 'Formula Flash',
    description: 'Match core EE formulas with their names.',
    icon: '🎯',
    color: '#34D399',
  },
  {
    id: 'memory' as const,
    name: 'Memory Match',
    description: 'Flip and match key EE concepts and definitions.',
    icon: '🧠',
    color: '#F59E0B',
  },
]

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function MathSprint({ onClose }: { onClose: () => void }) {
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState({ a: 12, b: 8, op: '+' })
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const createQuestion = () => {
    const ops = ['+', '-', '×'] as const
    const op = ops[randomInt(0, ops.length - 1)]
    let a = randomInt(5, 40)
    let b = randomInt(3, 20)
    if (op === '-' && b > a) [a, b] = [b, a]
    setQuestion({ a, b, op })
  }

  const startGame = () => {
    setScore(0)
    setFeedback(null)
    setAnswer('')
    setRunning(true)
    createQuestion()
  }

  const submit = () => {
    if (!running) return
    const correct =
      question.op === '+'
        ? question.a + question.b
        : question.op === '-'
          ? question.a - question.b
          : question.a * question.b
    if (Number(answer) === correct) {
      setScore((prev) => prev + 1)
      setFeedback('Correct! Next one →')
    } else {
      setFeedback(`Oops. Correct answer was ${correct}.`)
    }
    setAnswer('')
    createQuestion()
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Math Sprint</h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
          Close
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Solve as many as you can. Each correct answer adds 1 point.</p>
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
        <p className="text-2xl font-bold text-foreground">{question.a} {question.op} {question.b}</p>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="mt-3 w-32 text-center px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground"
          disabled={!running}
        />
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            onClick={submit}
            disabled={!running}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50"
          >
            Submit
          </button>
          <button
            onClick={startGame}
            className="px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary"
          >
            {running ? 'Restart' : 'Start'}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Score: {score}</p>
        {feedback && <p className="mt-2 text-xs text-foreground">{feedback}</p>}
      </div>
    </div>
  )
}

const formulaCards = [
  { name: 'Ohm’s Law', formula: 'V = I R' },
  { name: 'Power (AC)', formula: 'P = V I cosφ' },
  { name: 'Inductor Voltage', formula: 'V = L di/dt' },
  { name: 'Capacitor Current', formula: 'I = C dv/dt' },
  { name: 'Impedance', formula: 'Z = R + jX' },
]

function FormulaFlash({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)

  const current = formulaCards[index]
  const options = useMemo(() => {
    const others = formulaCards.filter((c) => c.formula !== current.formula)
    const picks = [current.formula, ...others.sort(() => 0.5 - Math.random()).slice(0, 3).map((c) => c.formula)]
    return picks.sort(() => 0.5 - Math.random())
  }, [current])

  const handlePick = (choice: string) => {
    if (answered) return
    if (choice === current.formula) setScore((prev) => prev + 1)
    setAnswered(true)
  }

  const next = () => {
    setAnswered(false)
    setIndex((prev) => (prev + 1) % formulaCards.length)
  }

  const restart = () => {
    setIndex(0)
    setScore(0)
    setAnswered(false)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Formula Flash</h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
          Close
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Pick the correct formula for the concept.</p>
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <p className="text-base font-semibold text-foreground mb-3">{current.name}</p>
        <div className="grid gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border ${
                answered && opt === current.formula
                  ? 'border-success text-success'
                  : answered
                    ? 'border-border text-muted-foreground'
                    : 'border-border text-foreground hover:bg-secondary'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Score: {score}</span>
          <div className="flex items-center gap-3">
            <button onClick={restart} className="text-muted-foreground hover:text-foreground">
              Restart
            </button>
            <button onClick={next} className="text-primary hover:text-primary/80">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const memoryPairs = [
  { id: 'ohm', label: 'Ohm’s Law', match: 'V = I R' },
  { id: 'power', label: 'Power', match: 'P = V I cosφ' },
  { id: 'impedance', label: 'Impedance', match: 'Z = R + jX' },
  { id: 'inductor', label: 'Inductor', match: 'V = L di/dt' },
]

function MemoryMatch({ onClose }: { onClose: () => void }) {
  const createDeck = () =>
    memoryPairs
      .flatMap((p) => [
        { id: `${p.id}-a`, pair: p.id, text: p.label },
        { id: `${p.id}-b`, pair: p.id, text: p.match },
      ])
      .sort(() => 0.5 - Math.random())
  const [deck, setDeck] = useState(createDeck)
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)

  const handleFlip = (id: string) => {
    if (flipped.includes(id) || matched.includes(id)) return
    if (flipped.length === 2) return
    const next = [...flipped, id]
    setFlipped(next)
    if (next.length === 2) {
      setMoves((prev) => prev + 1)
      const [a, b] = next
      const cardA = deck.find((c) => c.id === a)
      const cardB = deck.find((c) => c.id === b)
      if (cardA && cardB && cardA.pair === cardB.pair) {
        setMatched((prev) => [...prev, a, b])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 900)
      }
    }
  }

  const reset = () => {
    setDeck(createDeck())
    setFlipped([])
    setMatched([])
    setMoves(0)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Memory Match</h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
          Close
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Match each concept with its formula.</p>
      <div className="grid grid-cols-2 gap-2">
        {deck.map((card) => {
          const isOpen = flipped.includes(card.id) || matched.includes(card.id)
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`h-20 rounded-lg border text-xs font-medium transition-all ${
                isOpen ? 'bg-primary/10 border-primary text-foreground' : 'bg-muted/20 border-border text-muted-foreground'
              }`}
            >
              {isOpen ? card.text : 'Tap to reveal'}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Moves: {moves}</span>
        <button onClick={reset} className="flex items-center gap-1 text-primary hover:text-primary/80">
          <RefreshCw size={12} />
          Restart
        </button>
      </div>
    </div>
  )
}

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null)
  const featuredGame = games.find((g) => g.featured)
  const regularGames = games.filter((g) => !g.featured)

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-foreground">Games</h1>
        <p className="text-muted-foreground mt-1">Quick refreshers for your GATE EE prep</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredGame && (
          <GameCard
            name={featuredGame.name}
            description={featuredGame.description}
            icon={featuredGame.icon}
            color={featuredGame.color}
            featured={true}
            delay={0}
            onPlay={() => setActiveGame(featuredGame.id)}
          />
        )}
        {regularGames.map((g, i) => (
          <GameCard
            key={g.name}
            name={g.name}
            description={g.description}
            icon={g.icon}
            color={g.color}
            delay={(i + 1) * 0.05}
            onPlay={() => setActiveGame(g.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            {activeGame === 'math' && <MathSprint onClose={() => setActiveGame(null)} />}
            {activeGame === 'formula' && <FormulaFlash onClose={() => setActiveGame(null)} />}
            {activeGame === 'memory' && <MemoryMatch onClose={() => setActiveGame(null)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
