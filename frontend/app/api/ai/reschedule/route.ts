import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { getSessionUserId } from "@/lib/session";
import { canonicalGateEESubject, GATE_EE_SUBJECTS, GATE_EE_WEIGHTAGE_PROMPT } from "@/lib/gate-ee";
import { type AiSlotWithWindow, constrainAiSlotsToWindow } from "@/lib/ai-slot-window";
import { type NormalizedSlot, normalizePlanSlots, parseSlotArrayFromAi } from "@/lib/parse-ai-plan";

const DEFAULT_FOCUS = [
  "Engineering Mathematics",
  "Network Theory",
  "Power Systems",
  "Electrical Machines",
  "Control Systems",
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function timeToMinutes(value: unknown, fallback: number): number {
  if (typeof value !== "string") return fallback;
  const [hh, mm] = value.split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return fallback;
  return clamp(hh * 60 + mm, 0, 23 * 60 + 59);
}

function minutesToTime(minutes: number): string {
  const clamped = clamp(Math.round(minutes), 0, 23 * 60 + 59);
  const hh = Math.floor(clamped / 60);
  const mm = clamped % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function validSubject(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const canonical = canonicalGateEESubject(value);
  return (GATE_EE_SUBJECTS as readonly string[]).includes(canonical) ? canonical : null;
}

function selectedSubjectsFromBody(body: Record<string, unknown>): string[] {
  const raw = Array.isArray(body.selectedSubjects)
    ? body.selectedSubjects
    : Array.isArray(body.focusSubjects)
      ? body.focusSubjects
      : [];
  const seen = new Set<string>();
  for (const item of raw) {
    const subject = validSubject(item);
    if (subject) seen.add(subject);
  }
  return [...seen];
}

function subjectsFromBacklog(missed: unknown): string[] {
  if (!Array.isArray(missed)) return [];
  const found = new Set<string>();
  for (const item of missed) {
    const text = typeof item === "string" ? item : JSON.stringify(item);
    for (const subject of GATE_EE_SUBJECTS) {
      if (text.toLowerCase().includes(subject.toLowerCase())) found.add(subject);
    }
  }
  return [...found];
}

function topicQueuesFrom(slots: NormalizedSlot[], missed: unknown): Map<string, string[]> {
  const queues = new Map<string, string[]>();
  const add = (subject: string, topic: string | null | undefined) => {
    const clean = topic?.trim();
    if (!clean) return;
    const next = queues.get(subject) ?? [];
    if (!next.includes(clean)) next.push(clean);
    queues.set(subject, next);
  };

  for (const slot of slots) add(slot.subject, slot.topic);

  if (Array.isArray(missed)) {
    for (const item of missed) {
      if (typeof item !== "string") continue;
      for (const subject of GATE_EE_SUBJECTS) {
        if (!item.toLowerCase().includes(subject.toLowerCase())) continue;
        const topic = item.split(":").slice(1).join(":").trim() || "Backlog revision";
        add(subject, topic);
      }
    }
  }

  return queues;
}

function blockSizeMinutes(style: unknown, targetMinutes: number): number {
  const normalized = typeof style === "string" ? style.toLowerCase() : "";
  if (targetMinutes <= 75) return targetMinutes;
  if (normalized === "heavy") return 120;
  if (normalized === "light") return 60;
  return 90;
}

function buildDailyDurations(targetMinutes: number, style: unknown): number[] {
  const durations: number[] = [];
  let remaining = targetMinutes;
  const preferred = blockSizeMinutes(style, targetMinutes);
  while (remaining > 0) {
    if (remaining <= 45 && durations.length) {
      durations[durations.length - 1] += remaining;
      break;
    }
    const next = Math.min(preferred, remaining);
    durations.push(next);
    remaining -= next;
  }
  return durations;
}

function distributeStarts(
  start: number,
  end: number,
  durations: number[],
  fullDayFree: boolean,
): number[] {
  if (!durations.length) return [];
  const totalStudy = durations.reduce((sum, duration) => sum + duration, 0);
  const availableBreak = Math.max(0, end - start - totalStudy);
  const gapCount = Math.max(1, durations.length - 1);
  const breakMinutes = fullDayFree ? Math.floor(availableBreak / gapCount) : Math.min(15, Math.floor(availableBreak / gapCount));
  const starts: number[] = [];
  let cursor = start;
  for (const duration of durations) {
    starts.push(cursor);
    cursor += duration + breakMinutes;
  }
  return starts;
}

function enforceRescheduleParameters(
  aiSlots: NormalizedSlot[],
  body: Record<string, unknown>,
): AiSlotWithWindow[] {
  const start = timeToMinutes(body.startTime, 7 * 60);
  const end = timeToMinutes(body.endTime, 23 * 60);
  if (end <= start) return [];

  const selectedSubjects = selectedSubjectsFromBody(body);
  const backlogSubjects = subjectsFromBacklog(body.missed);
  const aiSubjects = [...new Set(aiSlots.map((slot) => slot.subject))];
  const subjectPool = selectedSubjects.length
    ? selectedSubjects
    : backlogSubjects.length
      ? backlogSubjects
      : aiSubjects.length
        ? aiSubjects
        : DEFAULT_FOCUS;

  const rawHours = Number(body.studyHoursPerDay ?? body.hoursPerDay ?? 4);
  const dailyTargetMinutes = Math.min(end - start, Math.round(clamp(Number.isFinite(rawHours) ? rawHours : 4, 1, 12) * 60));
  const fullDayFree = Boolean(body.fullDayFree ?? body.holiday);
  const durations = buildDailyDurations(dailyTargetMinutes, body.style);
  const topicQueues = topicQueuesFrom(aiSlots, body.missed);
  const output: AiSlotWithWindow[] = [];

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek += 1) {
    const starts = distributeStarts(start, end, durations, fullDayFree);
    for (let index = 0; index < durations.length; index += 1) {
      const subject = subjectPool[(dayOfWeek * durations.length + index) % subjectPool.length];
      const queue = topicQueues.get(subject) ?? [];
      const topic = queue.length ? queue[index % queue.length] : `${subject} revision`;
      output.push({
        dayOfWeek,
        startTime: minutesToTime(starts[index] ?? start),
        durationMinutes: durations[index],
        subject,
        topic,
      });
    }
  }

  return constrainAiSlotsToWindow(output, body.startTime, body.endTime);
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const selectedSubjects = selectedSubjectsFromBody(body);
  const studyHoursPerDay = body.studyHoursPerDay ?? body.hoursPerDay ?? 4;
  const fullDayFree = Boolean(body.fullDayFree ?? body.holiday);

  const prompt = `You reschedule GATE EE study slots. Return ONLY JSON array (no markdown).

Each item: { "dayOfWeek": 0-6 Mon=0, "startTime": "HH:MM", "durationMinutes": number, "subject": string, "topic": string }

Subjects only from: ${GATE_EE_SUBJECTS.join(" | ")}.
Use this GATE EE 2017-2025 weightage table to decide what gets protected, moved earlier, or expanded:
${GATE_EE_WEIGHTAGE_PROMPT}

Missed / backlog context:
${JSON.stringify(body.missed ?? [])}

Recent performance snapshot:
${JSON.stringify(body.performance ?? {})}

Student constraints:
- GATE exam date: fixed as 2027-02-05
- Study time target per day: ${studyHoursPerDay} hours
- Study style: ${body.style ?? "balanced"}
- Full day free / holiday mode: ${fullDayFree ? "yes, spread blocks across the full available day with breaks" : "no, place blocks compactly from the start time"}
- Start studying after: ${body.startTime ?? "06:00"}
- Stop studying by: ${body.endTime ?? "23:00"}
- Selected subjects that MUST drive the plan: ${JSON.stringify(selectedSubjects)}

Rebuild a realistic weekly timetable that clears backlog while balancing weak areas. Every slot must start inside the start/end window and must not end after the end time. Use only half-hour-aligned start times ending in :00 or :30, for example 06:00, 06:30, 07:00, 07:30. The total study time per day must match the study time target. If selected subjects are provided, prioritize those subjects instead of inventing unrelated ones. If full day free is true, spread the slots across the window with breaks; otherwise place them compactly from the start time.`;

  const result = await callAI(userId, "reschedule", prompt);
  if (!result.ok) {
    return NextResponse.json({ error: result.content }, { status: result.unavailable ? 503 : 500 });
  }

  const normalizedSlots = normalizePlanSlots(parseSlotArrayFromAi(result.content));
  const previewSlots = enforceRescheduleParameters(normalizedSlots, body);
  return NextResponse.json({ previewSlots, slotCount: previewSlots.length });
}
