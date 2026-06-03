'use client'

import { useEffect, useMemo, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CATEGORIES = ['GEN', 'OBC', 'EWS', 'SC', 'ST', 'PWD'] as const
type Category = (typeof CATEGORIES)[number]

type CutoffRow = {
  id?: string
  year: number
  category: string
  marks: number | null
  airApprox?: number | null
  remarks?: string | null
}

type CategoryPoint = {
  year: string
  GEN: number | null
  OBC: number | null
  EWS: number | null
  SC: number | null
  ST: number | null
  PWD: number | null
}

export default function CutoffsPage() {
  const [rows, setRows] = useState<CutoffRow[]>([])
  const [predictions, setPredictions] = useState<Record<string, number>>({})
  const [selectedCategory, setSelectedCategory] = useState<Category>('GEN')
  const [psuBand, setPsuBand] = useState<string>('')
  const [scoreInput, setScoreInput] = useState(50)
  const [advice, setAdvice] = useState<string | null>(null)
  const [loadingAdvice, setLoadingAdvice] = useState(false)
  const [manualYear, setManualYear] = useState(new Date().getFullYear())
  const [manualCategory, setManualCategory] = useState<Category>('GEN')
  const [manualMarks, setManualMarks] = useState<number>(30)
  const [manualAir, setManualAir] = useState<number | ''>('')
  const [manualRemarks, setManualRemarks] = useState('')
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  const loadCutoffs = async (category = selectedCategory) => {
    const res = await fetch(`/api/cutoffs?category=${category}`, { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    setRows(Array.isArray(data.historical) ? data.historical : [])
    setPredictions(data.predictionsByCategory ?? {})
    setPsuBand(String(data.safeScores?.PSUCandidateBand ?? ''))
  }

  useEffect(() => {
    void loadCutoffs()
  }, [])

  const byYear = useMemo<CategoryPoint[]>(() => {
    const map = new Map<number, Record<string, number | null>>()
    for (const r of rows) {
      if (!map.has(r.year)) map.set(r.year, {})
      map.get(r.year)![r.category.toUpperCase()] = r.marks
    }
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([year, v]) => ({
        year: String(year),
        GEN: v.GEN ?? null,
        OBC: v.OBC ?? null,
        EWS: v.EWS ?? null,
        SC: v.SC ?? null,
        ST: v.ST ?? null,
        PWD: v.PWD ?? null,
      }))
  }, [rows])

  const selectedRows = useMemo(
    () =>
      rows
        .filter((row) => row.category === selectedCategory)
        .sort((a, b) => b.year - a.year),
    [rows, selectedCategory],
  )
  const latestSelected = selectedRows[0]
  const predictedSelected = predictions[selectedCategory] ?? 0

  const chooseCategory = (category: Category) => {
    setSelectedCategory(category)
    setManualCategory(category)
    setAdvice(null)
    void loadCutoffs(category)
  }

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
          category: selectedCategory,
          cutoffContext: {
            latestQualifyingMarks: latestSelected?.marks ?? null,
            predictedQualifying2027: predictedSelected || null,
            psuBand,
          },
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

  const editRow = (row: CutoffRow) => {
    setManualYear(row.year)
    setManualCategory(row.category as Category)
    setManualMarks(row.marks ?? 0)
    setManualAir(row.airApprox ?? '')
    setManualRemarks(row.remarks ?? '')
    setSaveStatus(`Editing ${row.year} ${row.category}`)
  }

  const saveCutoff = async () => {
    setSaveStatus('Saving cutoff...')
    const res = await fetch('/api/cutoffs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year: manualYear,
        category: manualCategory,
        marks: manualMarks,
        airApprox: manualAir === '' ? null : manualAir,
        remarks: manualRemarks.trim() || null,
      }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setSaveStatus(typeof data.error === 'string' ? data.error : 'Could not save cutoff.')
      return
    }
    setSaveStatus('Cutoff saved.')
    await loadCutoffs(selectedCategory)
  }

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Cutoffs</h1>
      <p className="text-muted-foreground mt-1 mb-6">Historical GATE-EE cutoffs, prediction, and PSU-safe analysis</p>

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4">
        <span className="mr-2 text-sm font-medium text-foreground">Category</span>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => chooseCategory(category)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              selectedCategory === category
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:bg-secondary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-foreground">Previous year EE cutoffs</h2>
          <span className="text-xs text-muted-foreground">Selected: {selectedCategory}</span>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byYear}>
              <XAxis dataKey="year" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line dataKey="GEN" stroke="#6366f1" strokeWidth={2} />
              <Line dataKey="OBC" stroke="#3b82f6" strokeWidth={2} />
              <Line dataKey="EWS" stroke="#8b5cf6" strokeWidth={2} />
              <Line dataKey="SC" stroke="#10b981" strokeWidth={2} />
              <Line dataKey="ST" stroke="#f59e0b" strokeWidth={2} />
              <Line dataKey="PWD" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Latest {selectedCategory} cutoff</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{latestSelected?.marks ?? '-'}</p>
          <p className="mt-1 text-xs text-muted-foreground">{latestSelected ? `Year ${latestSelected.year}` : 'No data yet'}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Predicted {selectedCategory} cutoff (2027)</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{predictedSelected || '-'}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">PSU safe score band ({selectedCategory})</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{psuBand || '-'}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-3">College / PSU analysis</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => chooseCategory(e.target.value as Category)}
              className="px-3 py-2 rounded border border-border bg-input text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
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
            type="button"
            onClick={analyzePsuSafeScore}
            disabled={loadingAdvice}
            className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm disabled:opacity-60"
          >
            {loadingAdvice ? 'Analyzing...' : 'Analyze for category'}
          </button>
        </div>
        {advice && (
          <pre className="mt-4 text-xs whitespace-pre-wrap rounded-lg bg-muted/30 border border-border p-4 text-foreground/90">
            {advice}
          </pre>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mt-6">
        <h2 className="text-base font-semibold text-foreground mb-3">Add or edit cutoff</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            type="number"
            value={manualYear}
            onChange={(e) => setManualYear(Number(e.target.value))}
            className="px-3 py-2 rounded border border-border bg-input text-sm"
          />
          <select
            value={manualCategory}
            onChange={(e) => setManualCategory(e.target.value as Category)}
            className="px-3 py-2 rounded border border-border bg-input text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            value={manualMarks}
            onChange={(e) => setManualMarks(Number(e.target.value))}
            className="px-3 py-2 rounded border border-border bg-input text-sm"
          />
          <input
            type="number"
            value={manualAir}
            onChange={(e) => setManualAir(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="AIR approx"
            className="px-3 py-2 rounded border border-border bg-input text-sm"
          />
          <input
            value={manualRemarks}
            onChange={(e) => setManualRemarks(e.target.value)}
            placeholder="Remarks"
            className="px-3 py-2 rounded border border-border bg-input text-sm"
          />
          <button type="button" onClick={saveCutoff} className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">
            Save cutoff
          </button>
        </div>
        {saveStatus && <p className="mt-3 text-xs text-muted-foreground">{saveStatus}</p>}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold text-foreground">Editable cutoff rows</h2>
          <p className="text-xs text-muted-foreground">Click edit to load a row into the form above.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Marks</th>
                <th className="px-4 py-3 text-left">AIR approx</th>
                <th className="px-4 py-3 text-left">Remarks</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.year}-${row.category}`} className="border-t border-border/60">
                  <td className="px-4 py-3">{row.year}</td>
                  <td className="px-4 py-3">{row.category}</td>
                  <td className="px-4 py-3">{row.marks ?? '-'}</td>
                  <td className="px-4 py-3">{row.airApprox ?? '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.remarks ?? '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => editRow(row)}
                      className="rounded border border-border px-3 py-1 text-xs hover:bg-secondary"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={6}>
                    No cutoff data found. Run the seed script to insert previous year data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
