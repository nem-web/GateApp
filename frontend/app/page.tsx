'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Clock, BookCheck, Calendar, CheckCircle2, Circle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import SidebarNav from '@/components/SidebarNav'
import StatCard from '@/components/StatCard'
import SubjectProgressBar from '@/components/SubjectProgressBar'
import AIInsightCard from '@/components/AIInsightCard'
import {
  dashboardStats,
  subjectProgress as mockSubjectProgress,
  recentScores as mockRecentScores,
  todaysTodos as mockTodaysTodos,
} from '@/lib/mockData'

type DashboardPayload = {
  stats: typeof dashboardStats
  subjectProgress: typeof mockSubjectProgress
  recentScores: { date: string; score: number }[]
  todaysTodos: {
    id: string | number
    task: string
    priority: 'high' | 'medium' | 'low'
    completed: boolean
  }[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardPayload | null>(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((json: DashboardPayload) => setData(json))
      .catch(() =>
        setData({
          stats: dashboardStats,
          subjectProgress: mockSubjectProgress,
          recentScores: mockRecentScores,
          todaysTodos: mockTodaysTodos.map((t) => ({ ...t, id: String(t.id) })),
        }),
      )
  }, [])

  const stats = data?.stats ?? dashboardStats
  const subjectProgress = data?.subjectProgress ?? mockSubjectProgress
  const recentScores = data?.recentScores ?? mockRecentScores
  const todaysTodos = data?.todaysTodos ?? mockTodaysTodos.map((t) => ({ ...t, id: String(t.id) }))

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />

      <main className="lg:pl-[220px] pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your GATE preparation progress</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Study Streak"
              value={stats.studyStreak}
              suffix="days"
              icon={Flame}
              iconColor="#F59E0B"
              delay={0}
            />
            <StatCard
              label="Hours Today"
              value={stats.hoursToday}
              suffix="h"
              icon={Clock}
              iconColor="#6C63FF"
              delay={0.05}
            />
            <StatCard
              label="Topics Done"
              value={stats.topicsDone}
              icon={BookCheck}
              iconColor="#22C55E"
              delay={0.1}
            />
            <StatCard
              label="GATE Countdown"
              value={stats.gateCountdown}
              suffix="days"
              icon={Calendar}
              iconColor="#F472B6"
              delay={0.15}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
              className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
            >
              <h2 className="text-base font-semibold text-foreground mb-5">Subject Progress</h2>
              <div className="space-y-4">
                {subjectProgress.map((item, index) => (
                  <SubjectProgressBar
                    key={item.subject}
                    subject={item.subject}
                    progress={item.progress}
                    color={item.color}
                    delay={0.15 + index * 0.05}
                  />
                ))}
              </div>
            </motion.div>

            <AIInsightCard recentScores={recentScores} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut', delay: 0.25 }}
              className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
            >
              <h2 className="text-base font-semibold text-foreground mb-4">Recent Scores</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recentScores}>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1D27',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                      labelStyle={{ color: '#E5E7EB' }}
                      itemStyle={{ color: '#6C63FF' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6C63FF"
                      strokeWidth={2}
                      dot={{ fill: '#6C63FF', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: '#6C63FF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut', delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <h2 className="text-base font-semibold text-foreground mb-4">{"Today's Tasks"}</h2>
              <div className="space-y-3">
                {todaysTodos.map((todo) => (
                  <div key={String(todo.id)} className="flex items-start gap-3">
                    {todo.completed ? (
                      <CheckCircle2 size={18} className="text-success mt-0.5 shrink-0" />
                    ) : (
                      <Circle size={18} className="text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <span
                      className={`text-sm flex-1 ${
                        todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}
                    >
                      {todo.task}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        todo.priority === 'high'
                          ? 'bg-danger'
                          : todo.priority === 'medium'
                            ? 'bg-warning'
                            : 'bg-muted-foreground'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
