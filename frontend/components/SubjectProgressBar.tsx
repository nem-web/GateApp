'use client'

import { motion } from 'framer-motion'

interface SubjectProgressBarProps {
  subject: string
  progress: number
  color: string
  delay?: number
}

export default function SubjectProgressBar({ subject, progress, color, delay = 0 }: SubjectProgressBarProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-foreground w-36 truncate">{subject}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-10 text-right">{progress}%</span>
    </div>
  )
}
