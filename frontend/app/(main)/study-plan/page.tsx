'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Clock } from 'lucide-react'
import { GATE_EE_SUBJECTS, GATE_EXAM_DATE_ISO, SUBJECT_COLORS } from '@/lib/gate-ee'

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
]
const subjectColorMap: Record<string, string> = SUBJECT_COLORS
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

type PlannerSlot = {
  id?: string
  time: string
  subject: string
  topic: string
  durationMinutes?: number
}
type WeeklyRow = { day: (typeof DAY_LABELS)[number]; slots: PlannerSlot[] }
type SlotEditor =
  | {
      id?: string
      day: string
      time: string
      topic?: string
      subject?: string
      durationMinutes?: number
    }
  | null

function buildWeekly(
  rows: Array<{
    id?: string
    dayOfWeek: number
    startTime: string
    durationMinutes?: number
    subject: string
    topic?: string | null
  }>,
): WeeklyRow[] {
  return DAY_LABELS.map((label, dow) => ({
    day: label,
    slots: rows
      .filter((r) => Number(r.dayOfWeek) === dow)
      .map((r) => ({
        id: typeof r.id === 'string' ? r.id : undefined,
        time: String(r.startTime ?? '09:00').slice(0, 5),
        subject: r.subject,
        topic: typeof r.topic === 'string' ? r.topic : '',
        durationMinutes: typeof r.durationMinutes === 'number' ? r.durationMinutes : 60,
      }))
      .sort((a, b) => a.time.localeCompare(b.time)),
  }))
}

export default function StudyPlanPage() {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyRow[]>(() =>
    DAY_LABELS.map((d) => ({ day: d, slots: [] })),
  )
  const syllabusPreview = useMemo(() => [...GATE_EE_SUBJECTS].slice(0, 4), [])
  const [hoursPerDay, setHoursPerDay] = useState(6)
  const [gateExamDate, setGateExamDate] = useState(GATE_EXAM_DATE_ISO.slice(0, 10))
  const [studyStyle, setStudyStyle] = useState<'Light' | 'Balanced' | 'Heavy'>('Balanced')
  const [aiPlanText, setAiPlanText] = useState<string | null>(null)
  const [aiPreviewSlots, setAiPreviewSlots] = useState<
    Array<{
      dayOfWeek: number
      startTime: string
      durationMinutes: number
      subject: string
      topic: string | null
    }>
  >([])
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<SlotEditor>(null)
  const [slotSubject, setSlotSubject] = useState('')
  const [slotTopic, setSlotTopic] = useState('')
  const [slotDuration, setSlotDuration] = useState(60)

  const refreshTimetable = async () => {
    const res = await fetch('/api/timetable', { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to load timetable')
    const data = await res.json()
    const rows = Array.isArray(data.slots) ? data.slots : []
    setWeeklySchedule(buildWeekly(rows))
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/timetable', { cache: 'no-store' })
        if (!res.ok) throw new Error('load failed')
        const data = await res.json()
        const rows = Array.isArray(data.slots) ? data.slots : []
        if (!cancelled) setWeeklySchedule(buildWeekly(rows))
      } catch {
        if (!cancelled) setWeeklySchedule(DAY_LABELS.map((d) => ({ day: d, slots: [] })))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const generateAiPlan = async () => {
    setAiLoading(true)
    setAiPlanText(null)
    setAiPreviewSlots([])
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateDate: gateExamDate,
          hoursPerDay,
          weak: GATE_EE_SUBJECTS.slice(6, 9),
          style: studyStyle,
        }),
      })
      const data = await res.json()
      if (Array.isArray(data.previewSlots)) {
        setAiPreviewSlots(data.previewSlots)
        setAiPlanText(`Generated ${data.previewSlots.length} slots. Review and apply to timetable.`)
      } else {
        setAiPlanText(typeof data.error === 'string' ? data.error : 'Unexpected AI response.')
      }
    } catch {
      setAiPlanText('Could not generate plan. Check API key and retry.')
    } finally {
      setAiLoading(false)
    }
  }

  const rescheduleWithAi = async () => {
    setAiLoading(true)
    try {
      const missed = weeklySchedule.flatMap((d) =>
        d.slots.map((s) => `${d.day} ${s.time} - ${s.subject}: ${s.topic}`),
      )
      const res = await fetch('/api/ai/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missed }),
      })
      const data = await res.json()
      if (Array.isArray(data.previewSlots)) {
        setAiPreviewSlots(data.previewSlots)
        setAiPlanText(`Generated ${data.previewSlots.length} rescheduled slots. Review and apply.`)
      } else {
        setAiPlanText(typeof data.error === 'string' ? data.error : 'Unexpected AI response.')
      }
    } catch {
      setAiPlanText('Reschedule failed.')
    } finally {
      setAiLoading(false)
    }
  }

  const applyAiPlan = async () => {
    if (!aiPreviewSlots.length) return
    setSaving(true)
    try {
      const res = await fetch('/api/timetable/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slots: aiPreviewSlots,
          planTitle: 'AI Study Plan',
          planSource: 'ai',
          slotSource: 'ai_applied',
        }),
      })
      if (!res.ok) throw new Error('apply failed')
      await refreshTimetable()
      setAiPlanText('Plan applied and saved to database.')
    } catch {
      setAiPlanText('Failed to apply AI plan.')
    } finally {
      setSaving(false)
    }
  }

  const getSlotContent = (day: string, time: string) =>
    weeklySchedule.find((d) => d.day === day)?.slots.find((s) => s.time === time) ?? null

  const saveSlot = async () => {
    if (!selectedSlot || !slotSubject.trim()) return
    setSaving(true)
    try {
      if (selectedSlot.id) {
        const res = await fetch(`/api/timetable/slots/${selectedSlot.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: slotSubject,
            topic: slotTopic.trim() || null,
            durationMinutes: slotDuration,
          }),
        })
        if (!res.ok) throw new Error('update failed')
      } else {
        const dayIdx = DAY_LABELS.findIndex((d) => d === selectedSlot.day)
        const res = await fetch('/api/timetable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dayOfWeek: dayIdx,
            startTime: selectedSlot.time,
            subject: slotSubject,
            topic: slotTopic.trim() || null,
            durationMinutes: slotDuration,
          }),
        })
        if (!res.ok) throw new Error('create failed')
      }
      await refreshTimetable()
      setSelectedSlot(null)
    } finally {
      setSaving(false)
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
            {aiLoading ? 'Generating...' : 'Generate my plan'}
          </button>
          <button
            type="button"
            onClick={rescheduleWithAi}
            disabled={aiLoading}
            className="py-2.5 px-4 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-all disabled:opacity-50"
          >
            Reschedule with AI
          </button>
          <button
            type="button"
            onClick={applyAiPlan}
            disabled={saving || aiPreviewSlots.length === 0}
            className="py-2.5 px-4 rounded-lg border border-primary/40 text-sm font-medium hover:bg-primary/10 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Apply & save plan'}
          </button>
        </div>

        {aiPlanText && (
          <div className="mt-4 rounded-lg bg-muted/40 p-3 border border-border text-xs text-foreground/90">
            {aiPlanText}
          </div>
        )}

        {aiPreviewSlots.length > 0 && (
          <div className="mt-3 max-h-40 overflow-auto rounded-lg border border-border bg-background/50 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">AI preview slots</p>
            <ul className="space-y-1 text-xs text-foreground/90">
              {aiPreviewSlots.slice(0, 12).map((s, idx) => (
                <li key={`${s.dayOfWeek}-${s.startTime}-${idx}`}>
                  {DAY_LABELS[s.dayOfWeek]} {s.startTime} ({s.durationMinutes}m) - {s.subject}
                  {s.topic ? `: ${s.topic}` : ''}
                </li>
              ))}
              {aiPreviewSlots.length > 12 && <li className="text-muted-foreground">...and more</li>}
            </ul>
          </div>
        )}
      </motion.div>

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
                  {weeklySchedule.map((day) => {
                    const slot = getSlotContent(day.day, time)
                    return (
                      <div
                        key={`${day.day}-${time}`}
                        className="p-1 min-h-[40px] border-l border-border/50 cursor-pointer hover:bg-secondary/30 transition-colors"
                        onClick={() => {
                          setSelectedSlot({
                            id: slot?.id,
                            day: day.day,
                            time,
                            topic: slot?.topic,
                            subject: slot?.subject,
                            durationMinutes: slot?.durationMinutes,
                          })
                          setSlotSubject(slot?.subject ?? '')
                          setSlotTopic(slot?.topic ?? '')
                          setSlotDuration(slot?.durationMinutes ?? 60)
                        }}
                      >
                        {slot ? (
                          <div
                            className="px-2 py-1 rounded text-[11px] font-medium truncate"
                            style={{
                              backgroundColor: `${subjectColorMap[slot.subject]}26`,
                              color: subjectColorMap[slot.subject],
                            }}
                          >
                            {slot.topic || slot.subject}
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
                  {selectedSlot.day}, {selectedSlot.time}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Subject</label>
                  <select
                    value={slotSubject}
                    onChange={(e) => setSlotSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Select subject</option>
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
                    value={slotTopic}
                    onChange={(e) => setSlotTopic(e.target.value)}
                    placeholder="Enter topic name"
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Duration</label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="flex-1 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSlot}
                  disabled={saving || !slotSubject.trim()}
                  className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
