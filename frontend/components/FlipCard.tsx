'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Edit2 } from 'lucide-react'

interface FlipCardProps {
  front: string
  back: string
  subject: string
  onDifficulty: (difficulty: 'hard' | 'okay' | 'easy') => void
  onSkip: () => void
}

export default function FlipCard({ front, back, subject, onDifficulty, onSkip }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const subjectColors: Record<string, string> = {
    'Computer Science': '#F472B6',
    'Mathematics': '#818CF8',
    'Engineering Maths': '#60A5FA',
    'General Aptitude': '#34D399',
  }

  const color = subjectColors[subject] || '#6C63FF'

  return (
    <div className="w-full max-w-[480px]">
      {/* Card Actions */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs px-2.5 py-1 rounded-md"
          style={{
            backgroundColor: `${color}26`,
            color: color,
          }}
        >
          {subject}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onSkip}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <RotateCcw size={16} />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Edit2 size={16} />
          </button>
        </div>
      </div>

      {/* Flip Card */}
      <div
        className="flip-card cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ height: '240px' }}
      >
        <div className={`flip-card-inner relative w-full h-full ${isFlipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flip-card-front absolute inset-0 bg-card border border-border rounded-xl p-6 flex items-center justify-center">
            <p className="text-lg text-foreground text-center leading-relaxed">{front}</p>
          </div>

          {/* Back */}
          <div className="flip-card-back absolute inset-0 bg-card border border-primary/30 rounded-xl p-6 flex items-center justify-center">
            <p className="text-base text-foreground/90 text-center leading-relaxed whitespace-pre-line">
              {back}
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-3">Click card to flip</p>

      {/* Difficulty Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isFlipped ? 1 : 0.5, y: 0 }}
        className="flex items-center justify-center gap-3 mt-6"
      >
        <button
          onClick={() => {
            onDifficulty('hard')
            setIsFlipped(false)
          }}
          disabled={!isFlipped}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-danger/15 text-danger hover:bg-danger/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>😕</span>
          <span className="text-sm font-medium">Hard</span>
        </button>
        <button
          onClick={() => {
            onDifficulty('okay')
            setIsFlipped(false)
          }}
          disabled={!isFlipped}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-warning/15 text-warning hover:bg-warning/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>😐</span>
          <span className="text-sm font-medium">Okay</span>
        </button>
        <button
          onClick={() => {
            onDifficulty('easy')
            setIsFlipped(false)
          }}
          disabled={!isFlipped}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>😊</span>
          <span className="text-sm font-medium">Easy</span>
        </button>
      </motion.div>
    </div>
  )
}

