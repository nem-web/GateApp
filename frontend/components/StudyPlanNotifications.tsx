'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

type TimetableSlot = {
  id: string
  dayOfWeek: number
  startTime: string
  durationMinutes: number
  subject: string
  topic: string | null
  completed: boolean
}

const CHECK_INTERVAL_MS = 30 * 1000
const REFRESH_INTERVAL_MS = 5 * 60 * 1000
const NOTIFICATION_GRACE_MINUTES = 2
const PERMISSION_PROMPT_KEY = 'gateprep-notification-permission-prompted'
const NOTIFIED_KEY_PREFIX = 'gateprep-study-slot-notified'

function appDayOfWeek(date: Date) {
  return (date.getDay() + 6) % 7
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function timeToMinutes(value: string) {
  const [hh, mm] = value.split(':').map(Number)
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
  return hh * 60 + mm
}

function minutesNow(date: Date) {
  return date.getHours() * 60 + date.getMinutes()
}

function notificationKey(slot: TimetableSlot, now: Date) {
  return `${NOTIFIED_KEY_PREFIX}:${dateKey(now)}:${slot.id}:${slot.startTime}`
}

function slotLabel(slot: TimetableSlot) {
  return slot.topic?.trim() ? `${slot.subject}: ${slot.topic}` : slot.subject
}

function canUseNotifications() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function StudyPlanNotifications() {
  const { status } = useSession()
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const slotsRef = useRef<TimetableSlot[]>([])

  const loadSlots = useCallback(async () => {
    if (status !== 'authenticated') return
    try {
      const res = await fetch('/api/timetable', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      const next = Array.isArray(data.slots) ? data.slots : []
      setSlots(next)
      slotsRef.current = next
    } catch {
      // Reminder failures should never interrupt the app.
    }
  }, [status])

  useEffect(() => {
    slotsRef.current = slots
  }, [slots])

  useEffect(() => {
    if (status !== 'authenticated') return
    void loadSlots()
    const refresh = window.setInterval(() => void loadSlots(), REFRESH_INTERVAL_MS)
    const onFocus = () => void loadSlots()
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(refresh)
      window.removeEventListener('focus', onFocus)
    }
  }, [loadSlots, status])

  useEffect(() => {
    if (status !== 'authenticated' || !canUseNotifications()) return
    if (Notification.permission !== 'default') return
    if (window.localStorage.getItem(PERMISSION_PROMPT_KEY)) return

    const timer = window.setTimeout(() => {
      toast('Enable study reminders?', {
        description: 'Browser notifications can remind you when a study-plan lecture starts.',
        action: {
          label: 'Enable',
          onClick: () => {
            window.localStorage.setItem(PERMISSION_PROMPT_KEY, '1')
            void Notification.requestPermission()
          },
        },
        cancel: {
          label: 'Later',
          onClick: () => window.localStorage.setItem(PERMISSION_PROMPT_KEY, '1'),
        },
        duration: 12000,
      })
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [status])

  useEffect(() => {
    if (status !== 'authenticated') return

    const checkDueSlots = () => {
      const now = new Date()
      const today = appDayOfWeek(now)
      const currentMinutes = minutesNow(now)

      for (const slot of slotsRef.current) {
        if (slot.completed || Number(slot.dayOfWeek) !== today) continue
        const slotMinutes = timeToMinutes(String(slot.startTime).slice(0, 5))
        if (slotMinutes == null) continue
        const delta = currentMinutes - slotMinutes
        if (delta < 0 || delta > NOTIFICATION_GRACE_MINUTES) continue

        const key = notificationKey(slot, now)
        if (window.localStorage.getItem(key)) continue
        window.localStorage.setItem(key, '1')

        const title = 'Lecture time'
        const description = `${slot.startTime} · ${slotLabel(slot)}`
        toast(title, {
          description,
          action: {
            label: 'Open plan',
            onClick: () => {
              window.location.href = '/study-plan'
            },
          },
          duration: 15000,
        })

        if (canUseNotifications() && Notification.permission === 'granted') {
          new Notification(title, {
            body: description,
            tag: key,
          })
        }
      }
    }

    checkDueSlots()
    const interval = window.setInterval(checkDueSlots, CHECK_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [status])

  return null
}
