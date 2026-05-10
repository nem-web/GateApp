'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Clock, CheckCircle2, Trash2 } from 'lucide-react'
import { GATE_EE_SUBJECTS, GATE_EXAM_DATE_ISO, SUBJECT_COLORS } from '@/lib/gate-ee'

const baseTimeSlots = [
  '6:00', '7:00', '8:00', '9:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
]

const subjectColorMap: Record<string, string> = SUBJECT_COLORS

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

type PlannerSlot = {
  id?: string
  dayOfWeek: number
  startTime: string
  durationMinutes: number
  subject: string
  topic: string
  completed?: boolean
}

type WeeklyRow = {
  day: (typeof DAY_LABELS)[number]
  slots: PlannerSlot[]
}

type SlotEditor = {
  id?: string
  dayOfWeek: number
  dayLabel: string
  startTime: string
  durationMinutes: number
  subject: string
  topic: string
  completed: boolean
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map((v) => Number(v))
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0)
}

function buildWeekly(rows: PlannerSlot[]): WeeklyRow[] {
  const schedule: WeeklyRow[] = DAY_LABELS.map((label) => ({ day: label, slots: [] }))
  for (const row of rows) {
    const dayIndex = Math.min(6, Math.max(0, Number(row.dayOfWeek)))
    const slot: PlannerSlot = {
      ...row,
      dayOfWeek: dayIndex,
      startTime: String(row.startTime ?? '09:00').slice(0, 5),
      durationMinutes: Number(row.durationMinutes ?? 60),
      subject: row.subject ?? GATE_EE_SUBJECTS[0],
      topic: row.topic ?? '',
      completed: Boolean(row.completed),
    }
    schedule[dayIndex].slots.push(slot)
  }
  for (const row of schedule) {
    row.slots.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
  }
  return schedule
}

function upsertWeekly(rows: WeeklyRow[], slot: PlannerSlot): WeeklyRow[] {
  const updated = rows.map((row) => ({ ...row, slots: row.slots.filter((s) => s.id !== slot.id) }))
  const idx = Math.min(6, Math.max(0, slot.dayOfWeek))
  const target = updated[idx]
  if (target) {
    target.slots = [...target.slots, slot].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
  }
  return updated
}

function removeSlot(rows: WeeklyRow[], slotId: string): WeeklyRow[] {
  return rows.map((row) => ({ ...row, slots: row.slots.filter((s) => s.id !== slotId) }))
}

export default function StudyPlanPage() {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyRow[]>(() =>
    DAY_LABELS.map((d) => ({ day: d, slots: [] })),
  )
  const [aiPreview, setAiPreview] = useState<PlannerSlot[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [applyLoading, setApplyLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<SlotEditor | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saveTimer = useRef<NodeJS.Timeout | null>(null)

  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [gateExamDate, setGateExamDate] = useState(GATE_EXAM_DATE_ISO.slice(0, 10))
  const [studyStyle, setStudyStyle] = useState<'Light' | 'Balanced' | 'Heavy'>('Balanced')
  const [weakSubjects, setWeakSubjects] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [timetableRes, profileRes] = await Promise.all([
          fetch('/api/timetable'),
          fetch('/api/user/me'),
        ])
        if (timetableRes.ok) {
          const data = await timetableRes.json()
          const rows = Array.isArray(data.slots) ? data.slots : []
          if (!cancelled) setWeeklySchedule(buildWeekly(rows))
        }
        if (profileRes.ok) {
          const data = await profileRes.json()
          if (!cancelled) {
            if (data?.gateDate) setGateExamDate(String(data.gateDate).slice(0, 10))
            if (typeof data?.hoursPerDay === 'number') setHoursPerDay(data.hoursPerDay)
            if (Array.isArray(data?.weakSubjects)) setWeakSubjects(data.weakSubjects)
          }
        }
      } catch {
        if (!cancelled) setWeeklySchedule(DAY_LABELS.map((d) => ({ day: d, slots: [] })))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const previewSchedule = useMemo(() => buildWeekly(aiPreview), [aiPreview])

  const timeSlots = useMemo(() => {
    const times = new Set(baseTimeSlots)
    for (const row of weeklySchedule) {
      row.slots.forEach((s) => times.add(s.startTime))
    }
    for (const row of previewSchedule) {
      row.slots.forEach((s) => times.add(s.startTime))
    }
    return [...times].sort((a, b) => toMinutes(a) - toMinutes(b))
  }, [weeklySchedule, previewSchedule])

  const syllabusPreview = useMemo(() => [...GATE_EE_SUBJECTS].slice(0, 4), [])

  const getSlotContent = (day: string, time: string, from: WeeklyRow[]) => {
    const daySchedule = from.find((d) => d.day === day)
    if (!daySchedule) return null
    return daySchedule.slots.find((s) => s.startTime === time)
  }

  const handleOpenSlot = (dayLabel: string, dayOfWeek: number, time: string) => {
    const existing = getSlotContent(dayLabel, time, weeklySchedule)
    setSelectedSlot({
      id: existing?.id,
      dayLabel,
      dayOfWeek,
      startTime: time,
      durationMinutes: existing?.durationMinutes ?? 60,
      subject: existing?.subject ?? GATE_EE_SUBJECTS[0],
      topic: existing?.topic ?? '',
      completed: Boolean(existing?.completed),
    })
    setDirty(false)
    setSaveState('idle')
  }

  const saveSlot = async (slot: SlotEditor) => {
    setSaveState('saving')
    try {
      const body = {
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        durationMinutes: slot.durationMinutes,
        subject: slot.subject,
        topic: slot.topic,
        completed: slot.completed,
      }
      const res = await fetch(slot.id ? `/api/timetable/slots/${slot.id}` : '/api/timetable', {
        method: slot.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('save failed')
      const data = await res.json()
      const saved: PlannerSlot = {
        id: data.id,
        dayOfWeek: Number(data.dayOfWeek ?? slot.dayOfWeek),
        startTime: String(data.startTime ?? slot.startTime).slice(0, 5),
        durationMinutes: Number(data.durationMinutes ?? slot.durationMinutes),
        subject: data.subject ?? slot.subject,
        topic: data.topic ?? slot.topic,
        completed: Boolean(data.completed ?? slot.completed),
      }
      setWeeklySchedule((prev) => upsertWeekly(prev, saved))
      setSelectedSlot((prev) => (prev ? { ...prev, id: saved.id } : prev))
      setDirty(false)
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  useEffect(() => {
    if (!selectedSlot || !dirty) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      void saveSlot(selectedSlot)
    }, 700)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [selectedSlot, dirty])

  const handleDeleteSlot = async () => {
    if (!selectedSlot?.id) return
    const slotId = selectedSlot.id
    setSelectedSlot(null)
    try {
      await fetch(`/api/timetable/slots/${slotId}`, { method: 'DELETE' })
    } catch {
      /* ignore delete errors */
    }
    setWeeklySchedule((prev) => removeSlot(prev, slotId))
  }

  const generateAiPlan = async () => {
    setAiLoading(true)
    setAiError(null)
    setAiPreview([])
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateDate: gateExamDate,
          hoursPerDay,
          weak: weakSubjects.length ? weakSubjects : GATE_EE_SUBJECTS.slice(0, 4),
          style: studyStyle,
        }),
      })
      const data = await res.json()
      if (Array.isArray(data.previewSlots)) {
        const slots = data.previewSlots.map((s: Record<string, unknown>) => ({
          dayOfWeek: Number(s.dayOfWeek ?? s.day ?? 0),
          startTime: String(s.startTime ?? s.time ?? '09:00').slice(0, 5),
          durationMinutes: Number(s.durationMinutes ?? s.duration ?? 60),
          subject: String(s.subject ?? GATE_EE_SUBJECTS[0]),
          topic: s.topic ? String(s.topic) : '',
        })) as PlannerSlot[]
        setAiPreview(slots)
      } else if (typeof data.error === 'string') {
        setAiError(data.error)
      } else {
        setAiError('Unexpected AI response.')
      }
    } catch {
      setAiError('Could not generate plan. Check API key and sign-in status.')
    } finally {
      setAiLoading(false)
    }
  }

  const rescheduleWithAi = async () => {
    setAiLoading(true)
    setAiError(null)
    try {
      const missed = weeklySchedule.flatMap((d) =>
        d.slots.map((s) => `${d.day} ${s.startTime} — ${s.subject}: ${s.topic}`),
      )
      const res = await fetch('/api/ai/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missed }),
      })
      const data = await res.json()
      if (Array.isArray(data.previewSlots)) {
        const slots = data.previewSlots.map((s: Record<string, unknown>) => ({
          dayOfWeek: Number(s.dayOfWeek ?? s.day ?? 0),
          startTime: String(s.startTime ?? s.time ?? '09:00').slice(0, 5),
          durationMinutes: Number(s.durationMinutes ?? s.duration ?? 60),
          subject: String(s.subject ?? GATE_EE_SUBJECTS[0]),
          topic: s.topic ? String(s.topic) : '',
        })) as PlannerSlot[]
        setAiPreview(slots)
      } else if (typeof data.error === 'string') {
        setAiError(data.error)
      } else {
        setAiError('Unexpected AI response.')
      }
    } catch {
      setAiError('Reschedule failed.')
    } finally {
      setAiLoading(false)
    }
  }

  const applyAiPlan = async () => {
    if (!aiPreview.length) return
    setApplyLoading(true)
    try {
      const res = await fetch('/api/timetable/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slots: aiPreview,
          planTitle: 'AI weekly plan',
          planSource: 'ai',
          slotSource: 'ai',
        }),
      })
      const data = await res.json()
      if (res.ok && Array.isArray(data.slots)) {
        setWeeklySchedule(buildWeekly(data.slots))
        setAiPreview([])
      } else {
        setAiError(data.error ?? 'Could not apply plan.')
      }
    } catch {
      setAiError('Could not apply plan.')
    } finally {
      setApplyLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-foreground">Study Plan</h1>
        <p className="text-muted-foreground mt-1">AI-powered personalized timetable</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
        className="bg-card border border-border rounded-xl p-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-primary" />
          <span className="text-sm font-medium text-primary">AI Plan Generator</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs text-muted-foreground mb-2">GATE Exam Date</label>
            <input
              type="date"
              value={gateExamDate}
              onChange={(e) => setGateExamDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-2">
              Hours per day: <span className="text-foreground font-medium">{hoursPerDay}h</span>
            </label>
            <input
              type="range"
              min={1}
              max={12}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-2">Syllabus focus</label>
            <div className="flex flex-wrap gap-1.5">
              {syllabusPreview.map((subjectName) => {
                const fg = SUBJECT_COLORS[subjectName] ?? '#CBD5F5'
                return (
                  <span
                    key={subjectName}
                    className="text-[11px] px-2 py-1 rounded cursor-default transition-all border border-border"
                    style={{ color: fg, backgroundColor: `${fg}1A` }}
                  >
                    {subjectName.split(' ')[0]}
                  </span>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-2">Study Style</label>
            <div className="flex gap-2">
              {(['Light', 'Balanced', 'Heavy'] as const).map((style) => (
                <label key={style} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    checked={studyStyle === style}
                    onChange={() => setStudyStyle(style)}
                    className="accent-primary"
                  />
                  <span className="text-xs text-foreground">{style}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={generateAiPlan}
            disabled={aiLoading}
            className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50"
          >
            {aiLoading ? 'Generating…' : 'Generate my plan →'}
          </button>
          <button
            type="button"
            onClick={rescheduleWithAi}
            disabled={aiLoading}
            className="py-2.5 px-4 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-all disabled:opacity-50"
          >
            Reschedule with AI
          </button>
        </div>
        {aiError && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {aiError}
          </div>
        )}
      </motion.div>

      {aiPreview.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="bg-card border border-primary/40 rounded-xl p-4 mb-6"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">AI preview ready</p>
              <p className="text-xs text-muted-foreground">{aiPreview.length} slots generated — review before applying.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyAiPlan}
                disabled={applyLoading}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 disabled:opacity-50"
              >
                {applyLoading ? 'Applying…' : 'Apply timetable'}
              </button>
              <button
                type="button"
                onClick={() => setAiPreview([])}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-secondary"
              >
                Dismiss
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 border-b border-border/40">
                <div className="p-2 text-xs text-muted-foreground" />
                {previewSchedule.map((day) => (
                  <div key={day.day} className="p-2 text-center">
                    <span className="text-xs font-medium text-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="max-h-[240px] overflow-y-auto">
                {timeSlots.map((time) => (
                  <div key={`preview-${time}`} className="grid grid-cols-8 border-b border-border/20">
                    <div className="p-2 text-[11px] text-muted-foreground text-right pr-3">{time}</div>
                    {previewSchedule.map((day) => {
                      const slot = getSlotContent(day.day, time, previewSchedule)
                      return (
                        <div key={`${day.day}-${time}-preview`} className="p-1 min-h-[34px] border-l border-border/30">
                          {slot ? (
                            <div
                              className="px-2 py-1 rounded text-[10px] font-medium truncate"
                              style={{
                                backgroundColor: `${subjectColorMap[slot.subject] ?? '#6C63FF'}26`,
                                color: subjectColorMap[slot.subject] ?? '#6C63FF',
                              }}
                            >
                              {slot.topic || slot.subject}
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-3 text-xs text-muted-foreground" />
              {weeklySchedule.map((day) => (
                <div key={day.day} className="p-3 text-center">
                  <span className="text-sm font-medium text-foreground">{day.day}</span>
                </div>
              ))}
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b border-border/50">
                  <div className="p-2 text-xs text-muted-foreground text-right pr-3">{time}</div>
                  {weeklySchedule.map((day, idx) => {
                    const slot = getSlotContent(day.day, time, weeklySchedule)
                    return (
                      <div
                        key={`${day.day}-${time}`}
                        className="p-1 min-h-[40px] border-l border-border/50 cursor-pointer hover:bg-secondary/30 transition-colors"
                        onClick={() => handleOpenSlot(day.day, idx, time)}
                      >
                        {slot ? (
                          <div
                            className="px-2 py-1 rounded text-[11px] font-medium truncate flex items-center gap-1"
                            style={{
                              backgroundColor: `${subjectColorMap[slot.subject] ?? '#6C63FF'}26`,
                              color: subjectColorMap[slot.subject] ?? '#6C63FF',
                            }}
                          >
                            {slot.completed && <CheckCircle2 size={12} className="text-success" />}
                            <span className="truncate">{slot.topic || slot.subject}</span>
                          </div>
                        ) : (
                          <div className="w-full h-full border border-dashed border-border/30 rounded opacity-0 hover:opacity-100 flex items-center justify-center">
                            <span className="text-[10px] text-muted-foreground">+</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border z-50 shadow-2xl"
          >
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Edit Slot</h3>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 text-sm text-muted-foreground">
                <Clock size={16} />
                <span>
                  {selectedSlot.dayLabel}, {selectedSlot.startTime}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Subject</label>
                  <select
                    value={selectedSlot.subject}
                    onChange={(e) => {
                      setSelectedSlot((prev) => (prev ? { ...prev, subject: e.target.value } : prev))
                      setDirty(true)
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {GATE_EE_SUBJECTS.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Topic</label>
                  <input
                    type="text"
                    value={selectedSlot.topic}
                    onChange={(e) => {
                      setSelectedSlot((prev) => (prev ? { ...prev, topic: e.target.value } : prev))
                      setDirty(true)
                    }}
                    placeholder="Enter topic name"
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Duration</label>
                  <select
                    value={selectedSlot.durationMinutes}
                    onChange={(e) => {
                      setSelectedSlot((prev) =>
                        prev ? { ...prev, durationMinutes: Number(e.target.value) } : prev,
                      )
                      setDirty(true)
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {[60, 90, 120, 180].map((v) => (
                      <option key={v} value={v}>
                        {v === 60 ? '1 hour' : v === 90 ? '1.5 hours' : `${v / 60} hours`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSlot.completed}
                    onChange={(e) => {
                      setSelectedSlot((prev) => (prev ? { ...prev, completed: e.target.checked } : prev))
                      setDirty(true)
                    }}
                    className="accent-primary"
                  />
                  <span className="text-sm text-muted-foreground">Mark completed</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  {saveState === 'saving'
                    ? 'Saving…'
                    : saveState === 'saved'
                      ? 'Saved'
                      : saveState === 'error'
                        ? 'Save failed'
                        : 'Auto-save enabled'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="flex-1 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-all"
                  >
                    Close
                  </button>
                  {selectedSlot.id && (
                    <button
                      onClick={handleDeleteSlot}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
