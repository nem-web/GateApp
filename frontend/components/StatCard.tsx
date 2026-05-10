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
  /** Fractional stats (study hours); animated toward `value`. */
  decimals?: number
  subLabel?: string
}

export default function StatCard({
  label,
  value,
  suffix = '',
  icon: Icon,
  iconColor,
  delay = 0,
  decimals = 0,
  subLabel,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = decimals > 0 ? 900 : 800
    const steps = decimals > 0 ? 36 : 30
    const stepDuration = Math.max(duration / steps, 12)
    const target = decimals > 0 ? value : Math.round(value)
    const increment = target / steps

    let step = 0
    let current = 0
    const timer = setInterval(() => {
      step += 1
      current += increment
      if (step >= steps || current >= target) {
        setDisplayValue(target)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value, decimals])

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals).replace(/\.?0+$/, '') || '0'
      : String(Math.round(displayValue))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="group relative rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-sm overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-[0.12]"
        style={{ backgroundImage: `linear-gradient(135deg, ${iconColor}, transparent)` }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1.5 flex items-baseline gap-1.5 tabular-nums">
            <span className="text-3xl font-semibold tracking-tight text-foreground">{formatted}</span>
            {suffix ? <span className="text-base font-normal text-muted-foreground">{suffix}</span> : null}
          </p>
          {subLabel ? <p className="mt-1 text-xs text-muted-foreground">{subLabel}</p> : null}
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-background/60"
          style={{ color: iconColor }}
        >
          <Icon size={22} strokeWidth={1.75} />
        </div>
      </div>
    </motion.div>
  )
}
