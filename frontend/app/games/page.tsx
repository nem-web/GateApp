'use client'

import { motion } from 'framer-motion'
import SidebarNav from '@/components/SidebarNav'
import GameCard from '@/components/GameCard'
import { games } from '@/lib/mockData'

export default function GamesPage() {
  const featuredGame = games.find((g) => g.featured)
  const regularGames = games.filter((g) => !g.featured)

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />

      <main className="lg:pl-[220px] pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold text-foreground">Games</h1>
            <p className="text-muted-foreground mt-1">Learn while having fun</p>
          </motion.div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Featured Game */}
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

            {/* Regular Games */}
            {regularGames.map((game, index) => (
              <GameCard
                key={game.id}
                name={game.name}
                description={game.description}
                icon={game.icon}
                color={game.color}
                delay={(index + 1) * 0.05}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
