'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'
import { aiInsights } from '@/lib/mockData'

type ScorePoint = { date: string; score: number }

export default function AIInsightCard({ recentScores }: { recentScores: ScorePoint[] }) {
  const [insightText, setInsightText] = useState<string>(aiInsights[0])
  const [isLoading, setIsLoading] = useState(false)

  const fetchInsight = useCallback(async () => {
    setIsLoading(true)
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
      setInsightText(aiInsights[Math.floor(Math.random() * aiInsights.length)])
    } finally {
      setIsLoading(false)
    }
  }, [recentScores])

  useEffect(() => {
    fetchInsight()
  }, [fetchInsight])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut', delay: 0.2 }}
      className={`relative bg-card border rounded-xl p-5 ${
        isLoading ? 'border-primary animate-pulse' : 'border-primary/30'
      }`}
      style={{
        boxShadow: isLoading ? '0 0 20px rgba(108, 99, 255, 0.2)' : 'none',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-primary" />
        <span className="text-sm font-medium text-primary">AI Insight</span>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground italic">
          Thinking
          <span className="thinking-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      ) : (
        <p className="text-sm text-foreground/90 italic leading-relaxed">{insightText}</p>
      )}

      <button
        type="button"
        onClick={fetchInsight}
        disabled={isLoading}
        className="mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        Regenerate
      </button>
    </motion.div>
  )
}
