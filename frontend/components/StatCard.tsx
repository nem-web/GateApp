'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  icon: LucideIcon
  iconColor: string
  delay?: number
}

export default function StatCard({ label, value, suffix = '', icon: Icon, iconColor, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 30
    const stepDuration = duration / steps
    const increment = value / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut', delay }}
      whileHover={{ y: -2 }}
      className="relative bg-card border border-border rounded-xl p-5 overflow-hidden"
    >
      <div className="absolute top-4 right-4">
        <Icon size={24} style={{ color: iconColor }} />
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-medium text-foreground mt-1">
        {displayValue}
        {suffix && <span className="text-xl text-muted-foreground ml-1">{suffix}</span>}
      </p>
    </motion.div>
  )
}
