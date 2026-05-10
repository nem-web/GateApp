'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface SubjectProgressBarProps {
  subject: string
  progress: number
  color: string
  delay?: number
}

function SubjectProgressBar({ subject, progress, color, delay = 0 }: SubjectProgressBarProps) {
  const safe = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="w-[7.5rem] sm:w-44 shrink-0 truncate text-xs sm:text-sm font-medium text-foreground">
        {subject}
      </span>
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-full bg-muted/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safe}%` }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
          className="relative h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="w-11 shrink-0 text-right tabular-nums text-xs text-muted-foreground sm:text-sm">
        {safe}%
      </span>
    </div>
  )
}

export default memo(SubjectProgressBar)
