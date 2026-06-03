'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface SubjectProgressBarProps {
  subject: string
  progress: number
  color: string
  lectureDone?: number
  lectureTotal?: number
  averageWatchPercent?: number
  testAccuracy?: number | null
  weightageAverage?: number | null
  weightageLatest?: number | null
  delay?: number
}

function SubjectProgressBar({
  subject,
  progress,
  color,
  lectureDone,
  lectureTotal,
  averageWatchPercent,
  testAccuracy,
  weightageAverage,
  weightageLatest,
  delay = 0,
}: SubjectProgressBarProps) {
  const safe = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0
  const hasLectureStats = typeof lectureDone === 'number' && typeof lectureTotal === 'number'
  const meta = [
    hasLectureStats ? `${lectureDone}/${lectureTotal} lectures` : null,
    typeof averageWatchPercent === 'number' ? `${averageWatchPercent}% watched avg` : null,
    typeof testAccuracy === 'number' ? `${testAccuracy}% test accuracy` : 'No tests yet',
    typeof weightageAverage === 'number' ? `avg ${weightageAverage}% weight` : null,
    typeof weightageLatest === 'number' ? `2025 ${weightageLatest}%` : null,
  ].filter(Boolean)

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="w-[7.5rem] shrink-0 truncate text-xs font-medium text-foreground sm:w-44 sm:text-sm">
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
      {meta.length > 0 && (
        <p className="ml-[8.25rem] line-clamp-2 text-[11px] text-muted-foreground sm:ml-48">
          {meta.join(' · ')}
        </p>
      )}
    </div>
  )
}

export default memo(SubjectProgressBar)
