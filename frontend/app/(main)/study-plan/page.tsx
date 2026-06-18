'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Clock, Plus } from 'lucide-react'
import { canonicalGateEESubject, GATE_EE_SUBJECTS, SUBJECT_COLORS } from '@/lib/gate-ee'

const DEFAULT_GRID_START_MINUTES = 6 * 60
const DEFAULT_GRID_END_MINUTES = 23 * 60
const GRID_STEP_MINUTES = 30
const subjectColorMap: Record<string, string> = SUBJECT_COLORS
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const COMBINED_FOLDERS = ['overall', 'all lectures', 'combined', 'complete course', 'full course', 'gate ee']

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

type LectureFolderOption = {
  label: string
  subject: string
  folder: string
  value: string
}

type SelectedLectureFolder = {
  subject: string
  folder: string
}

function timeToMinutes(value: string | null | undefined, fallback: number): number {
  if (!value) return fallback
  const [hh, mm] = value.split(':').map(Number)
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return fallback
  return Math.min(23 * 60 + 59, Math.max(0, hh * 60 + mm))
}

function minutesToTime(minutes: number): string {
  const clamped = Math.min(23 * 60 + 59, Math.max(0, Math.round(minutes)))
  const hh = Math.floor(clamped / 60)
  const mm = clamped % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function buildDisplayTimeSlots(startTime: string, endTime: string, weeklySchedule: WeeklyRow[]): string[] {
  const start = timeToMinutes(startTime, DEFAULT_GRID_START_MINUTES)
  const end = timeToMinutes(endTime, DEFAULT_GRID_END_MINUTES)
  const rangeStart = end > start ? Math.min(start, DEFAULT_GRID_START_MINUTES) : DEFAULT_GRID_START_MINUTES
  const rangeEnd = end > start ? Math.max(end, DEFAULT_GRID_END_MINUTES) : DEFAULT_GRID_END_MINUTES
  const first = Math.floor(rangeStart / GRID_STEP_MINUTES) * GRID_STEP_MINUTES
  const last = Math.ceil(rangeEnd / GRID_STEP_MINUTES) * GRID_STEP_MINUTES
  const times = new Set<string>()

  for (let minutes = first; minutes <= last; minutes += GRID_STEP_MINUTES) {
    times.add(minutesToTime(minutes))
  }

  for (const day of weeklySchedule) {
    for (const slot of day.slots) {
      times.add(slot.time)
    }
  }

  return [...times].sort((a, b) => timeToMinutes(a, 0) - timeToMinutes(b, 0))
}

function inferSubjectFromLectureFolder(folder: string | null | undefined, fallbackSubject: string): string | null {
  const raw = folder?.trim() ?? ''
  const normalized = raw.toLowerCase()
  if (!raw) return canonicalGateEESubject(fallbackSubject)
  if (COMBINED_FOLDERS.some((word) => normalized === word || normalized.includes(word))) return null

  const exact = canonicalGateEESubject(raw)
  if ((GATE_EE_SUBJECTS as readonly string[]).includes(exact)) return exact

  for (const subject of GATE_EE_SUBJECTS) {
    if (normalized.includes(subject.toLowerCase())) return subject
  }

  const aliasPairs: Array<[string, string]> = [
    ['math', 'Engineering Mathematics'],
    ['network', 'Network Theory'],
    ['signal', 'Signals and Systems'],
    ['control', 'Control Systems'],
    ['machine', 'Electrical Machines'],
    ['power system', 'Power Systems'],
    ['power electronic', 'Power Electronics'],
    ['analog', 'Analog Electronics'],
    ['digital', 'Digital Electronics'],
    ['measurement', 'Measurements'],
    ['emft', 'Electromagnetic Fields'],
    ['electromagnetic', 'Electromagnetic Fields'],
    ['aptitude', 'Aptitude'],
  ]
  return aliasPairs.find(([needle]) => normalized.includes(needle))?.[1] ?? canonicalGateEESubject(fallbackSubject)
}

function lectureFolderValue(subject: string, folder: string) {
  return `${encodeURIComponent(subject)}::${encodeURIComponent(folder)}`
}

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
  const [hoursPerDay, setHoursPerDay] = useState(6)
  const [startTime, setStartTime] = useState('07:00')
  const [endTime, setEndTime] = useState('23:00')
  const [holiday, setHoliday] = useState(false)
  const [studyStyle, setStudyStyle] = useState<'Light' | 'Balanced' | 'Heavy'>('Balanced')
  const [folderFocusOptions, setFolderFocusOptions] = useState<LectureFolderOption[]>([])
  const [focusSelect, setFocusSelect] = useState('')
  const [selectedFocus, setSelectedFocus] = useState<string[]>([])
  const [lectureFolderSelect, setLectureFolderSelect] = useState('')
  const [selectedLectureFolders, setSelectedLectureFolders] = useState<SelectedLectureFolder[]>([])
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
  const displayTimeSlots = useMemo(
    () => buildDisplayTimeSlots(startTime, endTime, weeklySchedule),
    [endTime, startTime, weeklySchedule],
  )

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

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/lectures', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const rows = Array.isArray(data.lectures) ? data.lectures : []
        const options = new Map<string, LectureFolderOption>()
        for (const row of rows) {
          if (Boolean(row.completed)) continue
          const topic = typeof row.topic === 'string' ? row.topic : ''
          const fallback = typeof row.subject === 'string' ? row.subject : 'Engineering Mathematics'
          const subject = inferSubjectFromLectureFolder(topic, fallback)
          if (!subject) continue
          const folder = topic.trim() || 'Single lectures'
          const value = lectureFolderValue(subject, folder)
          const label = `${folder} (${subject})`
          options.set(value, { label, subject, folder, value })
        }
        const next = [...options.values()].sort((a, b) => a.subject.localeCompare(b.subject) || a.folder.localeCompare(b.folder))
        if (!cancelled) {
          setFolderFocusOptions(next)
          setLectureFolderSelect(next[0]?.value ?? '')
        }
      } catch {
        if (!cancelled) setFolderFocusOptions([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const addFocusSubject = () => {
    if (!focusSelect) return
    setSelectedFocus((current) => (current.includes(focusSelect) ? current : [...current, focusSelect]))
  }

  const addLectureFolder = () => {
    const option = folderFocusOptions.find((folder) => folder.value === lectureFolderSelect)
    if (!option) return
    setSelectedLectureFolders((current) =>
      current.some((folder) => folder.subject === option.subject && folder.folder === option.folder)
        ? current
        : [...current, { subject: option.subject, folder: option.folder }],
    )
    setSelectedFocus((current) => (current.includes(option.subject) ? current : [...current, option.subject]))
  }

  const focusOptions = useMemo(() => {
    return GATE_EE_SUBJECTS.map((subjectName) => ({ subject: subjectName, label: subjectName }))
  }, [])

  const generateAiPlan = async () => {
    if (endTime <= startTime) {
      setAiPlanText('End time must be later than start time.')
      return
    }
    setAiLoading(true)
    setAiPlanText(null)
    setAiPreviewSlots([])
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hoursPerDay,
          startTime,
          endTime,
          holiday,
          focusSubjects: selectedFocus,
          selectedLectureFolders,
          weak: selectedFocus.length ? selectedFocus : GATE_EE_SUBJECTS.slice(6, 9),
          style: studyStyle,
        }),
      })
      const data = await res.json()
      if (Array.isArray(data.previewSlots)) {
        setAiPreviewSlots(data.previewSlots)
        setAiPlanText(typeof data.message === 'string' ? data.message : `Generated ${data.previewSlots.length} slots. Review and apply to timetable.`)
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
    if (endTime <= startTime) {
      setAiPlanText('End time must be later than start time.')
      return
    }
    setAiLoading(true)
    try {
      const missed = weeklySchedule.flatMap((d) =>
        d.slots.map((s) => `${d.day} ${s.time} - ${s.subject}: ${s.topic}`),
      )
      const res = await fetch('/api/ai/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missed,
          hoursPerDay,
          startTime,
          endTime,
          holiday,
          focusSubjects: selectedFocus,
          selectedSubjects: selectedFocus,
          selectedLectureFolders,
          fullDayFree: holiday,
          studyHoursPerDay: hoursPerDay,
          style: studyStyle,
        }),
      })
      const data = await res.json()
      if (Array.isArray(data.previewSlots)) {
        setAiPreviewSlots(data.previewSlots)
        const focusLabel = selectedFocus.length ? selectedFocus.join(', ') : 'balanced GATE EE subjects'
        setAiPlanText(
          typeof data.message === 'string'
            ? `${data.message} Focus: ${focusLabel}.`
            : `Generated ${data.previewSlots.length} rescheduled slots using ${hoursPerDay}h/day, ${startTime}-${endTime}, ${holiday ? 'full-day-free spacing' : 'normal spacing'}, and focus: ${focusLabel}. Review and apply.`,
        )
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
    <div className="mx-auto w-full min-w-0 max-w-7xl overflow-x-hidden p-4 lg:p-8">
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
        className="mb-6 rounded-xl border border-border bg-card p-4 sm:p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-primary" />
          <span className="text-sm font-medium text-primary">AI Plan Generator</span>
        </div>

        <p className="mb-4 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          GATE exam date is fixed: <span className="font-medium text-foreground">5 February 2027</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
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
            <label className="block text-xs text-muted-foreground mb-2">Study window</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={holiday}
              onChange={(e) => setHoliday(e.target.checked)}
              className="accent-primary"
            />
            Holiday / full day free
          </label>
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Selected subjects</label>
            <div className="flex gap-2">
              <select
                value={focusSelect}
                onChange={(e) => setFocusSelect(e.target.value)}
                className="min-w-0 flex-1 px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Select subject</option>
                {focusOptions.map((option) => (
                  <option key={option.subject} value={option.subject}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addFocusSubject}
                disabled={!focusSelect}
                className="inline-flex items-center justify-center rounded-lg border border-border px-3 text-sm text-foreground hover:bg-secondary disabled:opacity-50"
                title="Add focus subject"
              >
                <Plus size={16} />
              </button>
            </div>
            {selectedFocus.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedFocus.map((subjectName) => {
                  const fg = SUBJECT_COLORS[subjectName] ?? '#CBD5F5'
                  return (
                    <button
                      type="button"
                      key={subjectName}
                      onClick={() => setSelectedFocus((current) => current.filter((name) => name !== subjectName))}
                      className="rounded border border-border px-2 py-1 text-[11px]"
                      style={{ color: fg, backgroundColor: `${fg}1A` }}
                    >
                      {subjectName} x
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Lecture playlist folders</label>
            <div className="flex gap-2">
              <select
                value={lectureFolderSelect}
                onChange={(e) => setLectureFolderSelect(e.target.value)}
                className="min-w-0 flex-1 px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Select playlist folder</option>
                {folderFocusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addLectureFolder}
                disabled={!lectureFolderSelect}
                className="inline-flex items-center justify-center rounded-lg border border-border px-3 text-sm text-foreground hover:bg-secondary disabled:opacity-50"
                title="Add playlist folder"
              >
                <Plus size={16} />
              </button>
            </div>
            {selectedLectureFolders.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedLectureFolders.map((folder) => {
                  const fg = SUBJECT_COLORS[folder.subject] ?? '#CBD5F5'
                  return (
                    <button
                      type="button"
                      key={`${folder.subject}-${folder.folder}`}
                      onClick={() =>
                        setSelectedLectureFolders((current) =>
                          current.filter((item) => item.subject !== folder.subject || item.folder !== folder.folder),
                        )
                      }
                      className="rounded border border-border px-2 py-1 text-[11px]"
                      style={{ color: fg, backgroundColor: `${fg}1A` }}
                    >
                      {folder.folder} x
                    </button>
                  )
                })}
              </div>
            )}
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
        className="min-w-0 overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[640px] sm:min-w-[800px]">
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-3 text-xs text-muted-foreground" />
              {weeklySchedule.map((day) => (
                <div key={day.day} className="p-3 text-center">
                  <span className="text-sm font-medium text-foreground">{day.day}</span>
                </div>
              ))}
            </div>

            <div className="max-h-[500px] overflow-y-auto overscroll-contain">
              {displayTimeSlots.map((time) => (
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
