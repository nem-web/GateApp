'use client'

import { motion } from 'framer-motion'
import GameCard from '@/components/GameCard'

const games = [] as {
  featured?: boolean
  name: string
  description: string
  icon: string
  color: string
}[]

export default function GamesPage() {
  const featuredGame = games.find((g) => g.featured)
  const regularGames = games.filter((g) => !g.featured)

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold text-foreground">Games</h1>
            <p className="text-muted-foreground mt-1">Learn while having fun</p>
          </motion.div>

          {games.length === 0 ? (
            <p className="text-sm text-muted-foreground">More interactive drills ship later — nothing to show yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredGame && (
                <GameCard
                  name={featuredGame.name}
                  description={featuredGame.description}
                  icon={featuredGame.icon}
                  color={featuredGame.color}
                  featured={true}
                  delay={0}
                />
              )}
              {regularGames.map((g, i) => (
                <GameCard
                  key={g.name}
                  name={g.name}
                  description={g.description}
                  icon={g.icon}
                  color={g.color}
                  delay={(i + 1) * 0.03}
                />
              ))}
            </div>
          )}
    </div>
  )
}
