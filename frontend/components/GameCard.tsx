'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

interface GameCardProps {
  name: string
  description: string
  icon: string
  color: string
  featured?: boolean
  delay?: number
}

export default function GameCard({ name, description, icon, color, featured = false, delay = 0 }: GameCardProps) {
  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut', delay }}
        className="col-span-full bg-card border border-border rounded-xl p-6 relative overflow-hidden"
        style={{
          boxShadow: `0 0 40px ${color}15`,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{icon}</span>
              <div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                  Featured
                </span>
                <h3 className="text-xl font-semibold text-foreground mt-1">{name}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">{description}</p>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: color,
                color: '#FFFFFF',
              }}
            >
              <Play size={16} fill="currentColor" />
              Play Now
            </button>
          </div>

          {/* Mini Game Preview */}
          <div className="hidden md:block w-64 h-32 rounded-lg bg-muted/50 border border-border overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">42 + 58</p>
                <p className="text-sm text-muted-foreground mt-2">Solve to start!</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut', delay }}
      whileHover={{ y: -2 }}
      className="bg-card border border-border rounded-xl p-5 transition-all group hover:border-transparent"
      style={{
        ['--card-glow' as string]: `0 0 20px ${color}30`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${color}30`
        e.currentTarget.style.borderColor = `${color}50`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = ''
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
      <button
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-all"
      >
        <Play size={14} />
        Play
      </button>
    </motion.div>
  )
}

