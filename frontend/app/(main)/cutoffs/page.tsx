'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react'
const cutoffData = [
  { year: '2019', general: 29.5, obc: 26.6, sc: 19.6, st: 19.6 },
  { year: '2020', general: 28.7, obc: 25.9, sc: 19.1, st: 19.1 },
  { year: '2021', general: 25.0, obc: 22.5, sc: 16.7, st: 16.7 },
  { year: '2022', general: 30.0, obc: 27.0, sc: 20.0, st: 20.0 },
  { year: '2023', general: 32.5, obc: 29.2, sc: 21.7, st: 21.7 },
  { year: '2024', general: 31.2, obc: 28.1, sc: 20.8, st: 20.8 },
]

const iitCutoffs = [
  { name: 'IIT Bombay', score2024: 850, score2023: 820, change: 'up' },
  { name: 'IIT Delhi', score2024: 780, score2023: 790, change: 'down' },
  { name: 'IIT Madras', score2024: 720, score2023: 700, change: 'up' },
  { name: 'IIT Kanpur', score2024: 680, score2023: 680, change: 'same' },
  { name: 'IIT Kharagpur', score2024: 650, score2023: 640, change: 'up' },
  { name: 'IIT Roorkee', score2024: 620, score2023: 630, change: 'down' },
  { name: 'IIT Guwahati', score2024: 580, score2023: 570, change: 'up' },
  { name: 'IIT Hyderabad', score2024: 550, score2023: 540, change: 'up' },
]

const categoryColors = {
  general: '#6C63FF',
  obc: '#60A5FA',
  sc: '#34D399',
  st: '#FBBF24',
}

export default function CutoffsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'obc' | 'sc' | 'st'>('all')
  const [aiRank, setAiRank] = useState(420)
  const [aiBranch, setAiBranch] = useState('CSE')
  const [aiCategory, setAiCategory] = useState('General')
  const [advisorText, setAdvisorText] = useState<string | null>(null)
  const [advisorLoading, setAdvisorLoading] = useState(false)

  const askAdvisor = async () => {
    setAdvisorLoading(true)
    setAdvisorText(null)
    try {
      const res = await fetch('/api/ai/college-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rank: aiRank, branch: aiBranch, category: aiCategory }),
      })
      const data = await res.json()
      setAdvisorText(typeof data.content === 'string' ? data.content : data.error ?? null)
    } catch {
      setAdvisorText('Could not reach AI advisor.')
    } finally {
      setAdvisorLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold text-foreground">Cutoffs</h1>
            <p className="text-muted-foreground mt-1">Historical GATE cutoffs and IIT admissions</p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {(['all', 'general', 'obc', 'sc', 'st'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat.toUpperCase()}
              </button>
            ))}
          </motion.div>

          {/* Cutoff Chart */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-5 mb-6"
          >
            <h2 className="text-base font-semibold text-foreground mb-4">
              GATE CS Qualifying Cutoff Trends
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cutoffData}>
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis
                    domain={[15, 35]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1D27',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#E5E7EB' }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 20 }}
                    formatter={(value) => (
                      <span className="text-sm text-muted-foreground capitalize">{value}</span>
                    )}
                  />
                  {(selectedCategory === 'all' || selectedCategory === 'general') && (
                    <Line
                      type="monotone"
                      dataKey="general"
                      stroke={categoryColors.general}
                      strokeWidth={2}
                      dot={{ fill: categoryColors.general, strokeWidth: 0, r: 4 }}
                    />
                  )}
                  {(selectedCategory === 'all' || selectedCategory === 'obc') && (
                    <Line
                      type="monotone"
                      dataKey="obc"
                      stroke={categoryColors.obc}
                      strokeWidth={2}
                      dot={{ fill: categoryColors.obc, strokeWidth: 0, r: 4 }}
                    />
                  )}
                  {(selectedCategory === 'all' || selectedCategory === 'sc') && (
                    <Line
                      type="monotone"
                      dataKey="sc"
                      stroke={categoryColors.sc}
                      strokeWidth={2}
                      dot={{ fill: categoryColors.sc, strokeWidth: 0, r: 4 }}
                    />
                  )}
                  {(selectedCategory === 'all' || selectedCategory === 'st') && (
                    <Line
                      type="monotone"
                      dataKey="st"
                      stroke={categoryColors.st}
                      strokeWidth={2}
                      dot={{ fill: categoryColors.st, strokeWidth: 0, r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Latest Cutoffs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {(['general', 'obc', 'sc', 'st'] as const).map((cat) => {
              const latest = cutoffData[cutoffData.length - 1]
              const prev = cutoffData[cutoffData.length - 2]
              const change = latest[cat] - prev[cat]
              return (
                <div
                  key={cat}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <p className="text-xs text-muted-foreground uppercase mb-1">{cat}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-semibold text-foreground">
                      {latest[cat]}%
                    </span>
                    <span
                      className={`text-xs pb-1 ${
                        change > 0 ? 'text-danger' : change < 0 ? 'text-success' : 'text-muted-foreground'
                      }`}
                    >
                      {change > 0 ? '+' : ''}{change.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">GATE 2024</p>
                </div>
              )
            })}
          </motion.div>

          {/* IIT Cutoffs Table */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-5 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">
                IIT M.Tech Admission Cutoffs (General)
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Based on GATE score (out of 1000)
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">
                      Institute
                    </th>
                    <th className="text-right px-5 py-3 text-xs text-muted-foreground font-medium">
                      2024 Cutoff
                    </th>
                    <th className="text-right px-5 py-3 text-xs text-muted-foreground font-medium">
                      2023 Cutoff
                    </th>
                    <th className="text-center px-5 py-3 text-xs text-muted-foreground font-medium">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {iitCutoffs.map((iit, index) => (
                    <tr
                      key={iit.name}
                      className={`border-b border-border/50 ${
                        index % 2 === 0 ? 'bg-background/30' : ''
                      }`}
                    >
                      <td className="px-5 py-3 text-sm text-foreground font-medium">
                        {iit.name}
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground text-right">
                        {iit.score2024}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground text-right">
                        {iit.score2023}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {iit.change === 'up' && (
                          <span className="inline-flex items-center gap-1 text-xs text-danger">
                            <TrendingUp size={14} />
                            Higher
                          </span>
                        )}
                        {iit.change === 'down' && (
                          <span className="inline-flex items-center gap-1 text-xs text-success">
                            <TrendingDown size={14} />
                            Lower
                          </span>
                        )}
                        {iit.change === 'same' && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Minus size={14} />
                            Same
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.25 }}
            className="bg-card border border-border rounded-xl p-5 mt-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-base font-semibold text-foreground">AI college advisor</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Approx. rank</label>
                <input
                  type="number"
                  value={aiRank}
                  onChange={(e) => setAiRank(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Branch</label>
                <input
                  value={aiBranch}
                  onChange={(e) => setAiBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Category</label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm"
                >
                  {['General', 'OBC', 'SC', 'ST'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={askAdvisor}
                  disabled={advisorLoading}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 disabled:opacity-50"
                >
                  {advisorLoading ? 'Thinking…' : 'Get advice'}
                </button>
              </div>
            </div>
            {advisorText && (
              <pre className="text-xs text-foreground/90 whitespace-pre-wrap rounded-lg bg-muted/30 border border-border p-4">
                {advisorText}
              </pre>
            )}
          </motion.div>
    </div>
  )
}

