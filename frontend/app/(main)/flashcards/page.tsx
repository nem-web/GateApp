'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import FlipCard from '@/components/FlipCard'

type ApiCard = {
  id: string
  front: string
  back: string
  subject: string
}

const GRADE: Record<'hard' | 'okay' | 'easy', number> = {
  hard: 0,
  okay: 2,
  easy: 3,
}

export default function FlashcardsPage() {
  const [cards, setCards] = useState<ApiCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const shuffle = useCallback(<T,>(arr: T[]) => {
    const next = [...arr]
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    return next
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [cardRes, dashboardRes] = await Promise.all([
          fetch('/api/flashcards?due=1'),
          fetch('/api/dashboard', { cache: 'no-store' }),
        ])
        const fallbackRes = cardRes.ok ? null : await fetch('/api/flashcards')
        const cardData = cardRes.ok ? await cardRes.json() : fallbackRes?.ok ? await fallbackRes.json() : null
        const raw = Array.isArray(cardData?.cards) ? cardData.cards : []
        const dashboard = dashboardRes.ok ? await dashboardRes.json() : null
        const weakSubjects = Array.isArray(dashboard?.weakTopicAnalysis)
          ? dashboard.weakTopicAnalysis.map((w: { subject?: string }) => w.subject).filter(Boolean)
          : Array.isArray(dashboard?.weakSubjects)
            ? dashboard.weakSubjects
            : []
        const weakSet = new Set(weakSubjects.map((s: string) => s.toLowerCase()))
        const mapped = raw.map((c: Record<string, unknown>) => ({
          id: String(c.id ?? ''),
          front: String(c.front ?? ''),
          back: String(c.back ?? ''),
          subject: typeof c.subject === 'string' ? c.subject : 'GATE EE',
        }))
        const weakCards = mapped.filter((c) => weakSet.has(c.subject.toLowerCase()))
        const otherCards = mapped.filter((c) => !weakSet.has(c.subject.toLowerCase()))
        if (cancelled) return
        setCards([...shuffle(weakCards), ...shuffle(otherCards)])
      } catch {
        if (!cancelled) setCards([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [shuffle])

  useEffect(() => {
    setCurrentIndex(0)
    setReviewedCount(0)
  }, [cards.length])

  const currentCard = cards[currentIndex]

  const handleDifficulty = useCallback(
    async (difficulty: 'hard' | 'okay' | 'easy') => {
      const card = cards[currentIndex]
      if (!card) return
      try {
        await fetch(`/api/flashcards/${encodeURIComponent(card.id)}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grade: GRADE[difficulty] }),
        })
      } catch {
        /* still advance locally even if persistence fails offline */
      }
      setReviewedCount((prev) => Math.min(prev + 1, cards.length || 1))
      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (cards.length <= 1) return 0
          return (prev + 1) % cards.length
        })
      }, 200)
    },
    [cards, currentIndex],
  )

  const handleSkip = () => {
    if (cards.length <= 1) return
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const progressPercentage = cards.length ? (reviewedCount / cards.length) * 100 : 0

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold text-foreground">Flashcards</h1>
            <p className="text-muted-foreground mt-1">Spaced repetition for better retention</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
            className="max-w-[480px] mx-auto mb-8"
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">
                {reviewedCount} of {cards.length || 0} reviewed this session
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
            className="flex justify-center"
          >
            {loading ? (
              <p className="text-sm text-muted-foreground text-center">Loading flashcards…</p>
            ) : currentCard ? (
              <FlipCard
                front={currentCard.front}
                back={currentCard.back}
                subject={currentCard.subject}
                onDifficulty={handleDifficulty}
                onSkip={handleSkip}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center max-w-md">
                No flashcards due yet. Create some from the Notes workspace or add them via the API.
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mt-8"
          >
            <div className="flex items-center gap-2">
              {cards.map((c, index) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-4' : index < reviewedCount ? 'bg-success/50' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.25 }}
            className="max-w-[480px] mx-auto mt-12 grid grid-cols-3 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-danger">—</p>
              <p className="text-xs text-muted-foreground mt-1">Needs work</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-warning">—</p>
              <p className="text-xs text-muted-foreground mt-1">Okay</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-success">—</p>
              <p className="text-xs text-muted-foreground mt-1">Easy recall</p>
            </div>
          </motion.div>
    </div>
  )
}
