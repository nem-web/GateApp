'use client'

import { memo, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Zap,
  Target,
  Layers,
  BookMarked,
  Activity,
  AlertTriangle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import StatCard from '@/components/StatCard'
import SubjectProgressBar from '@/components/SubjectProgressBar'
import AIInsightCard from '@/components/AIInsightCard'
import { GATE_EXAM_DATE_ISO } from '@/lib/gate-ee'

type WeakTopicInsight = {
  subject: string
  score: number
  reasons: ('test' | 'task' | 'flashcard' | 'accuracy')[]
}

type DashboardPayload = {
  stats: {
    studyStreak: number
    hoursToday: number
    hoursThisWeek: number
    hoursLast30Days: number
    topicsDone: number
    gateCountdown: number
    gateExamDate?: string
    tasksOpen?: number
    notesCount?: number
    lecturesCount?: number
    flashcardsDue?: number
    flashcardsMastered?: number
    studyConsistencyPct?: number
    mockTestsTaken?: number
  }
  subjectProgress: { subject: string; subjectId?: string; progress: number; color: string }[]
  recentScores: { date: string; score: number }[]
  weakSubjects: string[]
  weakTopicAnalysis?: WeakTopicInsight[]
  todaysTodos: {
    id: string | number
    task: string
    priority: 'high' | 'medium' | 'low'
    completed: boolean
  }[]
  meta?: { displayName?: string; streamLabel?: string }
}

const EMPTY: DashboardPayload = {
  stats: {
    studyStreak: 0,
    hoursToday: 0,
    hoursThisWeek: 0,
    hoursLast30Days: 0,
    topicsDone: 0,
    gateCountdown: 0,
  },
  subjectProgress: [],
  recentScores: [],
  weakSubjects: [],
  weakTopicAnalysis: [],
  todaysTodos: [],
}

const ChartMemo = memo(function RecentScoresChart({ data }: { data: DashboardPayload['recentScores'] }) {
  if (!data.length) {
    return (
      <div className="flex h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 text-center">
        <Layers className="mb-3 h-9 w-9 text-muted-foreground/70" aria-hidden />
        <p className="text-sm font-medium text-foreground">No mock tests yet</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Complete a practice drill &mdash; scores will populate this trend from real attempts.
        </p>
      </div>
    )
  }
  return (
    <div className="h-[220px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" className="stroke-border/50" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={36} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(15,17,23,0.96)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            }}
            labelStyle={{ color: '#e5e7eb', fontSize: 12 }}
            itemStyle={{ color: '#a5b4fc', fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#scoreGrad)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#818cf8', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})

function reasonLabel(r: WeakTopicInsight['reasons'][number]): string {
  switch (r) {
    case 'test':
      return 'Tests'
    case 'task':
      return 'Tasks'
    case 'flashcard':
      return 'Cards'
    case 'accuracy':
      return 'Accuracy'
    default:
      return r
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<'auth' | 'other' | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    let cancelled = false
    ;(async () => {
      setError(null)
      setLoading(true)
      try {
        const res = await fetch('/api/dashboard', { signal: ac.signal, cache: 'no-store' })
        if (!res.ok) {
          if (!cancelled) {
            setError(res.status === 401 ? 'auth' : 'other')
            setData(null)
          }
          return
        }
        const json = (await res.json()) as DashboardPayload
        if (!cancelled) setData(json)
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
        if (!cancelled) {
          setError('other')
          setData(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
      ac.abort()
    }
  }, [])

  const stats = data?.stats ?? EMPTY.stats
  const subjectProgress = data?.subjectProgress ?? EMPTY.subjectProgress
  const recentScores = useMemo(() => data?.recentScores ?? [], [data?.recentScores])
  const todaysTodos = data?.todaysTodos ?? EMPTY.todaysTodos
  const weakTopicAnalysis = data?.weakTopicAnalysis ?? []
  const weakSubjects = data?.weakSubjects ?? []

  const examLabel = stats.gateExamDate
    ? new Date(stats.gateExamDate + 'T12:00:00').toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(GATE_EXAM_DATE_ISO).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              GATE Electrical Engineering &mdash; live stats from your study log
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/40 px-4 py-2 text-right backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Exam</p>
            <p className="text-sm font-medium text-foreground">{examLabel}</p>
            <p className="text-xs text-muted-foreground">{stats.gateCountdown} days to go</p>
          </div>
        </div>
        {error === 'auth' && (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Sign in to load streaks, hours, weak-topic signals, and subject progress tied to your account.
          </p>
        )}
        {error === 'other' && !loading && (
          <p className="mt-4 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Unable to refresh the dashboard. Check <code className="text-xs">DATABASE_URL</code> and retry.
          </p>
        )}
      </motion.header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {loading ? (
          <>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[112px] animate-pulse rounded-2xl border border-border/50 bg-muted/30"
              />
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="Study streak"
              value={stats.studyStreak}
              suffix="d"
              icon={Flame}
              iconColor="#f59e0b"
              delay={0}
              subLabel={`${stats.studyConsistencyPct ?? 0}% consistency (30d)`}
            />
            <StatCard
              label="Hours today"
              value={stats.hoursToday}
              suffix="h"
              icon={Clock}
              iconColor="#818cf8"
              decimals={1}
              delay={0.04}
              subLabel={`${stats.hoursThisWeek ?? 0}h this week`}
            />
            <StatCard
              label="Rolling 30d"
              value={stats.hoursLast30Days ?? 0}
              suffix="h"
              icon={Activity}
              iconColor="#34d399"
              decimals={1}
              delay={0.08}
              subLabel="Study session minutes summed"
            />
            <StatCard
              label="Countdown"
              value={stats.gateCountdown}
              suffix="d"
              icon={Calendar}
              iconColor="#f472b6"
              delay={0.12}
              subLabel={`Target ${examLabel}`}
            />
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:mt-6 lg:grid-cols-4 lg:gap-4">
        {loading ? (
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[88px] animate-pulse rounded-2xl border border-border/50 bg-muted/20" />
          ))
        ) : (
          <>
            <StatCard label="Planner slots done" value={stats.topicsDone} icon={Target} iconColor="#22c55e" delay={0} />
            <StatCard label="Flashcards due" value={stats.flashcardsDue ?? 0} icon={Layers} iconColor="#fb923c" delay={0.04} />
            <StatCard label="Open tasks" value={stats.tasksOpen ?? 0} icon={Zap} iconColor="#fbbf24" delay={0.08} />
            <StatCard label="Drills logged" value={stats.mockTestsTaken ?? 0} icon={BookMarked} iconColor="#60a5fa" delay={0.12} />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Subject progress */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="rounded-2xl border border-border/80 bg-card/85 p-5 shadow-sm backdrop-blur-sm lg:col-span-2"
        >
          <div className="mb-5 flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-foreground">GATE EE subject progress</h2>
            <span className="text-xs text-muted-foreground">From tests + timetable</span>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-muted/40" />
              ))}
            </div>
          ) : subjectProgress.length ? (
            <div className="space-y-5">
              {subjectProgress.map((item, index) => (
                <SubjectProgressBar
                  key={item.subjectId ?? item.subject}
                  subject={item.subject}
                  progress={item.progress}
                  color={item.color}
                  delay={0.05 * index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-border/80 bg-muted/15 py-10 text-center">
              <Layers className="mb-3 h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm font-medium text-foreground">Subjects not seeded</p>
              <p className="mt-1 max-w-md text-xs text-muted-foreground">
                Run{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 text-[11px]">npx prisma db seed</code> to insert the
                GATE EE catalog, then revisit.
              </p>
            </div>
          )}
        </motion.section>

        <AIInsightCard recentScores={recentScores} pending={loading} />
      </div>

      {/* Weak topic analysis */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.18 }}
        className="mt-6 rounded-2xl border border-border/80 bg-card/85 p-5 shadow-sm backdrop-blur-sm"
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden />
          <h2 className="text-base font-semibold text-foreground">Weak-topic signals</h2>
          <span className="text-xs text-muted-foreground">
            Derived from drills, timetable backlog, recall difficulty, accuracy
          </span>
        </div>
        {loading ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-muted/30" />
            ))}
          </div>
        ) : weakTopicAnalysis.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {weakTopicAnalysis.map((w) => (
              <div
                key={`${w.subject}-${w.score}`}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{w.subject}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Signals: {[...new Set(w.reasons)].map(reasonLabel).join(' · ')}
                  </p>
                </div>
                <span className="tabular-nums text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {w.score}%
                </span>
              </div>
            ))}
          </div>
        ) : weakSubjects.length ? (
          <p className="text-sm text-muted-foreground">
            Profile anchors:{' '}
            <span className="font-medium text-foreground">{weakSubjects.join(', ')}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No weakness pattern yet — keep practicing; we prioritize subjects when tests, backlog, or hard reviews skew
            low.
          </p>
        )}
      </motion.section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.22 }}
          className="rounded-2xl border border-border/80 bg-card/85 p-5 shadow-sm backdrop-blur-sm lg:col-span-2"
        >
          <h2 className="mb-4 text-base font-semibold text-foreground">Recent drill scores (%)</h2>
          <ChartMemo data={recentScores} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.26 }}
          className="rounded-2xl border border-border/80 bg-card/85 p-5 shadow-sm backdrop-blur-sm"
        >
          <h2 className="mb-4 text-base font-semibold text-foreground">Today&apos;s focus</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/30" />
              ))}
            </div>
          ) : todaysTodos.length ? (
            <div className="space-y-3">
              {todaysTodos.map((todo) => (
                <div key={String(todo.id)} className="flex items-start gap-3 rounded-lg px-2 py-1 hover:bg-muted/30">
                  {todo.completed ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle size={18} className="mt-0.5 shrink-0 text-muted-foreground" />
                  )}
                  <span
                    className={`flex-1 text-sm leading-snug ${
                      todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                  >
                    {todo.task}
                  </span>
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      todo.priority === 'high'
                        ? 'bg-red-500'
                        : todo.priority === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-muted-foreground/50'
                    }`}
                    title={`Priority ${todo.priority}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col rounded-xl border border-dashed border-border/80 bg-muted/15 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No queued tasks.</p>
              <p className="mt-1 text-xs text-muted-foreground">Add items from your to-do lane.</p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}
