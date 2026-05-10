'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Sparkles } from 'lucide-react'

type ScorePoint = { date: string; score: number }

export default function AIInsightCard({
  recentScores,
  pending = false,
}: {
  recentScores: ScorePoint[]
  pending?: boolean
}) {
  const [insightText, setInsightText] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const fetchInsight = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/dashboard-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recentScores }),
      })
      const data = await res.json()
      const text = typeof data.content === 'string' ? data.content : data.error
      if (text) setInsightText(text)
    } catch {
      setInsightText('AI insight is temporarily unavailable — check keys or session.')
    } finally {
      setLoading(false)
    }
  }, [recentScores])

  useEffect(() => {
    if (pending) return
    void fetchInsight()
  }, [fetchInsight, pending])

  const busy = pending || loading

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
      className={`rounded-2xl border border-primary/25 bg-card/90 p-5 shadow-sm backdrop-blur-sm ${
        busy ? 'border-primary/50' : ''
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={18} className="text-primary" />
        <span className="text-sm font-semibold text-primary">Coach insight</span>
      </div>

      {busy ? (
        <div className="space-y-2">
          <div className="h-3 animate-pulse rounded bg-muted/50" />
          <div className="h-3 w-[92%] animate-pulse rounded bg-muted/35" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted/35" />
        </div>
      ) : insightText ? (
        <p className="text-sm leading-relaxed text-foreground/90">{insightText}</p>
      ) : (
        <p className="text-sm text-muted-foreground">No insight generated yet. Try regenerate.</p>
      )}

      <button
        type="button"
        onClick={() => void fetchInsight()}
        disabled={busy}
        className="mt-4 flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
      >
        <RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
        Regenerate
      </button>
    </motion.section>
  )
}
