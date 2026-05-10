'use client'

import { motion } from 'framer-motion'
import { FileText, Eye, KeyRound } from 'lucide-react'
import { SUBJECT_COLORS } from '@/lib/gate-ee'

interface PYQCardProps {
  year: number
  subject: string
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[]
  onViewPDF: () => void
  onViewSolution: () => void
  onViewKey?: () => void
  hasAnswerKey?: boolean
  delay?: number
}

const difficultyColors = {
  easy: '#22C55E',
  medium: '#F59E0B',
  hard: '#EF4444',
}

export default function PYQCard({
  year,
  subject,
  difficulty,
  topics,
  onViewPDF,
  onViewSolution,
  onViewKey,
  hasAnswerKey = false,
  delay = 0,
}: PYQCardProps) {
  const color = SUBJECT_COLORS[subject] || '#6C63FF'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut', delay }}
      whileHover={{ y: -2 }}
      className="bg-card border border-border rounded-xl p-5 transition-all hover:border-border/50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">{year}</span>
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: difficultyColors[difficulty] }}
            title={`${difficulty} difficulty`}
          />
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-md font-medium"
          style={{
            backgroundColor: `${color}26`,
            color: color,
          }}
        >
          {subject}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {topics.map((topic) => (
          <span
            key={topic}
            className="text-[11px] px-2 py-0.5 rounded bg-secondary text-muted-foreground"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className={`grid gap-2 ${hasAnswerKey ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <button
          onClick={onViewPDF}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
        >
          <FileText size={14} />
          Paper
        </button>
        <button
          onClick={onViewSolution}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-all"
        >
          <Eye size={14} />
          Solution
        </button>
        {hasAnswerKey && onViewKey && (
          <button
            onClick={onViewKey}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-all"
          >
            <KeyRound size={14} />
            Key
          </button>
        )}
      </div>
    </motion.div>
  )
}
