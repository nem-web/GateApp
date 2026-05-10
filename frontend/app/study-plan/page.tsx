'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Clock } from 'lucide-react'
import SidebarNav from '@/components/SidebarNav'
import { weeklySchedule, subjects } from '@/lib/mockData'

const timeSlots = [
  '6:00', '7:00', '8:00', '9:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
]

const subjectColorMap: Record<string, string> = {
  'Mathematics': '#818CF8',
  'General Aptitude': '#34D399',
  'Engineering Maths': '#60A5FA',
  'Computer Science': '#F472B6',
  'Verbal Ability': '#FBBF24',
}

export default function StudyPlanPage() {
  const [hoursPerDay, setHoursPerDay] = useState(6)
  const [gateExamDate, setGateExamDate] = useState('2025-02-01')
  const [studyStyle, setStudyStyle] = useState<'Light' | 'Balanced' | 'Heavy'>('Balanced')
  const [aiPlanText, setAiPlanText] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string; topic?: string; subject?: string } | null>(null)

  const generateAiPlan = async () => {
    setAiLoading(true)
    setAiPlanText(null)
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateDate: gateExamDate,
          hoursPerDay,
          weak: ['Discrete Mathematics', 'Graph Theory', 'Operating Systems'],
          style: studyStyle,
        }),
      })
      const data = await res.json()
      setAiPlanText(typeof data.content === 'string' ? data.content : data.error ?? null)
    } catch {
      setAiPlanText('Could not generate plan. Check API key and try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const rescheduleWithAi = async () => {
    setAiLoading(true)
    try {
      const missed = weeklySchedule.flatMap((d) =>
        d.slots.map((s) => `${d.day} ${s.time} — ${s.subject}: ${s.topic}`),
      )
      const res = await fetch('/api/ai/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missed }),
      })
      const data = await res.json()
      setAiPlanText(typeof data.content === 'string' ? data.content : data.error ?? null)
    } catch {
      setAiPlanText('Reschedule failed.')
    } finally {
      setAiLoading(false)
    }
  }

  const getSlotContent = (day: string, time: string) => {
    const daySchedule = weeklySchedule.find((d) => d.day === day)
    if (!daySchedule) return null
    return daySchedule.slots.find((s) => s.time === time)
  }

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
            <h1 className="text-2xl font-semibold text-foreground">Study Plan</h1>
            <p className="text-muted-foreground mt-1">AI-powered personalized timetable</p>
          </motion.div>

          {/* AI Generator Form */}
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
              {/* GATE Date */}
              <div>
                <label className="block text-xs text-muted-foreground mb-2">GATE Exam Date</label>
                <input
                  type="date"
                  value={gateExamDate}
                  onChange={(e) => setGateExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Hours Per Day */}
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

              {/* Subjects */}
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Subjects</label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.values(subjects).slice(0, 3).map((subject) => (
                    <span
                      key={subject.name}
                      className="text-[11px] px-2 py-1 rounded cursor-pointer transition-all"
                      style={{
                        backgroundColor: subject.bgColor,
                        color: subject.color,
                      }}
                    >
                      {subject.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Style */}
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
            {aiPlanText && (
              <pre className="mt-4 max-h-48 overflow-auto text-xs text-foreground/90 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 border border-border">
                {aiPlanText}
              </pre>
            )}
          </motion.div>

          {/* Weekly Grid */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.1 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-8 border-b border-border">
                  <div className="p-3 text-xs text-muted-foreground" />
                  {weeklySchedule.map((day) => (
                    <div key={day.day} className="p-3 text-center">
                      <span className="text-sm font-medium text-foreground">{day.day}</span>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="max-h-[500px] overflow-y-auto">
                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-8 border-b border-border/50">
                      <div className="p-2 text-xs text-muted-foreground text-right pr-3">
                        {time}
                      </div>
                      {weeklySchedule.map((day) => {
                        const slot = getSlotContent(day.day, time)
                        return (
                          <div
                            key={`${day.day}-${time}`}
                            className="p-1 min-h-[40px] border-l border-border/50 cursor-pointer hover:bg-secondary/30 transition-colors"
                            onClick={() =>
                              setSelectedSlot({
                                day: day.day,
                                time,
                                topic: slot?.topic,
                                subject: slot?.subject,
                              })
                            }
                          >
                            {slot ? (
                              <div
                                className="px-2 py-1 rounded text-[11px] font-medium truncate"
                                style={{
                                  backgroundColor: `${subjectColorMap[slot.subject]}26`,
                                  color: subjectColorMap[slot.subject],
                                }}
                              >
                                {slot.topic}
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

          {/* Side Panel */}
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
                        defaultValue={selectedSlot.subject || ''}
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="">Select subject</option>
                        {Object.values(subjects).map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Topic</label>
                      <input
                        type="text"
                        defaultValue={selectedSlot.topic || ''}
                        placeholder="Enter topic name"
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Duration</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                        <option>1 hour</option>
                        <option>1.5 hours</option>
                        <option>2 hours</option>
                        <option>3 hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Add notes for this session..."
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
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
                      onClick={() => setSelectedSlot(null)}
                      className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
