'use client'
// app/(public)/free-gate-notes/FreeNotesClient.tsx
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  LayoutGrid,
  Clock,
  ChevronRight,
  Code,
  Calculator,
  Cpu,
  Zap,
  Settings,
  Flame,
  CheckCircle2,
  AlertCircle,
  Star,
} from 'lucide-react'

// --- Mock Data Structure (Replace with your actual API/Database data) ---
const subjects = [
  { id: 'all', name: 'All Subjects', short: 'All', icon: LayoutGrid, color: 'var(--primary)' },
  { id: 'cs', name: 'Computer Science', short: 'CS', icon: Code, color: 'var(--general-aptitude)' },
  { id: 'math', name: 'Engineering Math', short: 'Math', icon: Calculator, color: 'var(--mathematics)' },
  { id: 'ec', name: 'Electronics', short: 'EC', icon: Cpu, color: 'var(--engineering-maths)' },
  { id: 'ee', name: 'Electrical', short: 'EE', icon: Zap, color: 'var(--core-subject)' },
  { id: 'me', name: 'Mechanical', short: 'ME', icon: Settings, color: 'var(--aptitude-verbal)' },
]

const notesData = [
  {
    id: 1,
    subjectId: 'cs',
    topic: 'Theory of Computation',
    description: 'Complete notes on Automata, Regular Expressions, Context Free Grammars, and Turing Machines with PYQ examples.',
    difficulty: 'Hard',
    time: '4 Hours',
    priority: 'High',
    isCompleted: false,
    slug: 'theory-of-computation',
  },
  {
    id: 2,
    subjectId: 'cs',
    topic: 'Data Structures',
    description: 'Arrays, Stacks, Queues, Trees, Graphs, and Hashing. Includes time complexity analysis and optimal approaches.',
    difficulty: 'Medium',
    time: '3.5 Hours',
    priority: 'High',
    isCompleted: true,
    slug: 'data-structures',
  },
  {
    id: 3,
    subjectId: 'math',
    topic: 'Linear Algebra',
    description: 'Matrices, Determinants, Systems of Linear Equations, Eigenvalues, and Eigenvectors.',
    difficulty: 'Medium',
    time: '2.5 Hours',
    priority: 'Medium',
    isCompleted: false,
    slug: 'linear-algebra',
  },
  {
    id: 4,
    subjectId: 'ee',
    topic: 'Power Systems',
    description: 'Generation, Transmission, Distribution, Fault Analysis, and Load Flow studies.',
    difficulty: 'Hard',
    time: '5 Hours',
    priority: 'High',
    isCompleted: false,
    slug: 'power-systems',
  },
  {
    id: 5,
    subjectId: 'ec',
    topic: 'Digital Circuits',
    description: 'Combinational and Sequential circuits, Boolean algebra, Logic gates, and Microprocessors.',
    difficulty: 'Easy',
    time: '2 Hours',
    priority: 'Medium',
    isCompleted: false,
    slug: 'digital-circuits',
  },
]

// --- Helper Functions for Styling ---
const getDifficultyColor = (diff: string) => {
  switch (diff.toLowerCase()) {
    case 'easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    case 'hard': return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    default: return 'text-muted-foreground bg-secondary border-border'
  }
}

export function FreeNotesClient() {
  const [activeSubject, setActiveSubject] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = useMemo(() => {
    return notesData.filter((note) => {
      const matchesSubject = activeSubject === 'all' || note.subjectId === activeSubject
      const matchesSearch =
        note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSubject && matchesSearch
    })
  }, [activeSubject, searchQuery])

  // Scorecard stats — framed like an exam result strip, not a generic dashboard
  const stats = useMemo(() => {
    const totalTopics = notesData.length
    const highYield = notesData.filter((n) => n.priority === 'High').length
    const totalHours = notesData.reduce((sum, n) => sum + parseFloat(n.time), 0)
    const subjectsCovered = new Set(notesData.map((n) => n.subjectId)).size
    return [
      { label: 'Topics', value: totalTopics },
      { label: 'High Yield', value: highYield },
      { label: 'Study Hours', value: `${totalHours}+` },
      { label: 'Subjects', value: subjectsCovered },
    ]
  }, [])

  const activeSubjectMeta = subjects.find((s) => s.id === activeSubject)

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center pb-20 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
        {/* --- Hero --- */}
        <header className="mb-12 flex flex-col items-center text-center max-w-2xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
          >
            <Star className="h-4 w-4" />
            100% Free Resources
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            GATE Exam Notes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Premium, high-yield study material organized by top educators. Search by subject, track your preparation, and revise faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xl relative mt-2"
          >
            <Search className="pointer-events-none absolute left-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics, keywords, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '3.25rem' }}
              className="w-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md pr-4 py-4 text-base shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </motion.div>
        </header>

        {/* --- Scorecard strip (signature element) --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-14 grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md px-4 py-6 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-0 sm:px-2"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center justify-center">
              <div className="px-4 text-center sm:px-8">
                <div className="font-mono text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:text-[11px]">
                  {s.label}
                </div>
              </div>
              {i < stats.length - 1 && <div className="hidden h-10 w-px bg-border sm:block" />}
            </div>
          ))}
        </motion.div>

        {/* --- Horizontal Subject Filter --- */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {subjects.map((subject) => {
            const isActive = activeSubject === subject.id
            return (
              <button
                key={subject.id}
                onClick={() => setActiveSubject(subject.id)}
                aria-pressed={isActive}
                aria-label={subject.name}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'border-border/70 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                <subject.icon
                  className="h-4 w-4"
                  style={!isActive ? { color: subject.color } : undefined}
                />
                {subject.short}
              </button>
            )
          })}
        </div>

        {/* --- Results header --- */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            {searchQuery ? 'Search Results' : activeSubjectMeta?.name}
          </h2>
          <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {filteredNotes.length} topics
          </span>
        </div>

        {/* --- Notes Grid --- */}
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card/30 rounded-2xl border border-dashed border-border">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No notes found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or selecting a different subject.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => {
                const subjectMeta = subjects.find((s) => s.id === note.subjectId)
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={note.id}
                  >
                    <Link
                      href={`/free-gate-notes/${note.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                    >
                      {/* Subject accent rail */}
                      <span
                        className="absolute inset-y-0 left-0 w-1"
                        style={{ backgroundColor: subjectMeta?.color }}
                      />

                      <div className="flex h-full flex-col p-6 pl-7">
                        {/* Subject tag */}
                        {subjectMeta && (
                          <div
                            className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: subjectMeta.color }}
                          >
                            <subjectMeta.icon className="h-3.5 w-3.5" />
                            {subjectMeta.short}
                          </div>
                        )}

                        {/* Top Indicators */}
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(note.difficulty)}`}>
                              {note.difficulty}
                            </span>
                            {note.priority === 'High' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 border border-orange-500/20">
                                <Flame className="h-3 w-3" /> High Yield
                              </span>
                            )}
                          </div>

                          {note.isCompleted && (
                            <div className="text-primary" title="Completed">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                          )}
                        </div>

                        {/* Text Content */}
                        <h3 className="text-lg font-bold leading-tight transition-colors duration-200 group-hover:text-primary">
                          {note.topic}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {note.description}
                        </p>

                        {/* Bottom Row */}
                        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 opacity-70" />
                            {note.time}
                          </span>
                          <span className="flex items-center gap-1 text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                            Read Notes <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}