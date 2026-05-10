'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SidebarNav from '@/components/SidebarNav'
import FlipCard from '@/components/FlipCard'
import { flashcards } from '@/lib/mockData'

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewedCount, setReviewedCount] = useState(0)
  const totalCards = flashcards.length

  const currentCard = flashcards[currentIndex]

  const handleDifficulty = (difficulty: 'hard' | 'okay' | 'easy') => {
    setReviewedCount((prev) => Math.min(prev + 1, totalCards))
    // In a real app, this would update spaced repetition algorithm
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards)
    }, 300)
  }

  const handleSkip = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards)
  }

  const progressPercentage = (reviewedCount / totalCards) * 100

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
            <h1 className="text-2xl font-semibold text-foreground">Flashcards</h1>
            <p className="text-muted-foreground mt-1">Spaced repetition for better retention</p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
            className="max-w-[480px] mx-auto mb-8"
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">
                {reviewedCount} of {totalCards} reviewed today
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </motion.div>

          {/* Flashcard */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
            className="flex justify-center"
          >
            <FlipCard
              front={currentCard.front}
              back={currentCard.back}
              subject={currentCard.subject}
              onDifficulty={handleDifficulty}
              onSkip={handleSkip}
            />
          </motion.div>

          {/* Card Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mt-8"
          >
            <div className="flex items-center gap-2">
              {flashcards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary w-4'
                      : index < reviewedCount
                      ? 'bg-success/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.25 }}
            className="max-w-[480px] mx-auto mt-12 grid grid-cols-3 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-danger">12</p>
              <p className="text-xs text-muted-foreground mt-1">Hard</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-warning">28</p>
              <p className="text-xs text-muted-foreground mt-1">Okay</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-success">45</p>
              <p className="text-xs text-muted-foreground mt-1">Easy</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
