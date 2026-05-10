'use client'

import { useEffect, useMemo, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type CutoffRow = { year: number; category: string; marks: number | null }

export default function CutoffsPage() {
  const [rows, setRows] = useState<CutoffRow[]>([])
  const [predicted, setPredicted] = useState<number>(0)
  const [psuBand, setPsuBand] = useState<string>('')
  const [scoreInput, setScoreInput] = useState(50)
  const [advice, setAdvice] = useState<string | null>(null)
  const [loadingAdvice, setLoadingAdvice] = useState(false)

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/cutoffs', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setRows(Array.isArray(data.historical) ? data.historical : [])
      setPredicted(Number(data.predictedGENQualifying2027 ?? 0))
      setPsuBand(String(data.safeScores?.PSUCandidateBand ?? ''))
    })()
  }, [])

  const byYear = useMemo(() => {
    const map = new Map<number, Record<string, number>>()
    for (const r of rows) {
      if (r.marks == null) continue
      if (!map.has(r.year)) map.set(r.year, {})
      map.get(r.year)![r.category.toUpperCase()] = r.marks
    }
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([year, v]) => ({
        year: String(year),
        GEN: v.GEN ?? null,
        OBC: v.OBC ?? null,
        SC: v.SC ?? null,
        ST: v.ST ?? null,
      }))
  }, [rows])

  const latest = byYear[byYear.length - 1]

  const analyzePsuSafeScore = async () => {
    setLoadingAdvice(true)
    setAdvice(null)
    try {
      const res = await fetch('/api/ai/college-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rank: `not fixed; score=${scoreInput}`,
          branch: 'GATE-EE',
          category: 'General',
        }),
      })
      const data = await res.json()
      setAdvice(typeof data.content === 'string' ? data.content : data.error ?? null)
    } catch {
      setAdvice('Unable to generate PSU safe score analysis.')
    } finally {
      setLoadingAdvice(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Cutoffs</h1>
      <p className="text-muted-foreground mt-1 mb-6">Historical GATE-EE cutoffs, prediction, and PSU-safe analysis</p>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="text-base font-semibold text-foreground mb-3">Previous year EE cutoffs</h2>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byYear}>
              <XAxis dataKey="year" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line dataKey="GEN" stroke="#6366f1" strokeWidth={2} />
              <Line dataKey="OBC" stroke="#3b82f6" strokeWidth={2} />
              <Line dataKey="SC" stroke="#10b981" strokeWidth={2} />
              <Line dataKey="ST" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Latest GEN cutoff</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{latest?.GEN ?? '-'} </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Predicted GEN cutoff (2027)</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{predicted || '-'}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">PSU safe score band</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{psuBand || '-'}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-3">PSU safe score analysis (AI)</h2>
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Your expected marks/score</label>
            <input
              type="number"
              value={scoreInput}
              onChange={(e) => setScoreInput(Number(e.target.value))}
              className="px-3 py-2 rounded border border-border bg-input text-sm"
            />
          </div>
          <button
            onClick={analyzePsuSafeScore}
            disabled={loadingAdvice}
            className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm"
          >
            {loadingAdvice ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {advice && (
          <pre className="mt-4 text-xs whitespace-pre-wrap rounded-lg bg-muted/30 border border-border p-4 text-foreground/90">
            {advice}
          </pre>
        )}
      </div>
    </div>
  )
}
