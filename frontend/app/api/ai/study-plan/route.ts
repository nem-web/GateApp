import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
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

type LectureContext = {
  title: string;
  subject: string;
  lectureNumber: number | null;
};

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
  const clamped = clamp(Math.round(minutes / 30) * 30, 0, 23 * 60 + 30);
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
  const raw = Array.isArray(body.focusSubjects) ? body.focusSubjects : Array.isArray(body.weak) ? body.weak : [];
  const seen = new Set<string>();
  for (const item of raw) {
    const subject = validSubject(item);
    if (subject) seen.add(subject);
  }
  return [...seen];
}

function extractLectureNumber(title: string): number | null {
  const match =
    title.match(/\b(?:lecture|lec|class|video|part)\s*[-#: ]*\s*(\d{1,3})\b/i) ??
    title.match(/\b(\d{1,3})\b/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

async function getUnfinishedLectureContext(userId: string): Promise<LectureContext[]> {
  const lectures = await prisma.lecture.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      subject: true,
      watches: { where: { userId } },
    },
  });

  return lectures
    .map((lecture) => ({
      title: lecture.title,
      subject: lecture.subject.title,
      lectureNumber: extractLectureNumber(lecture.title),
      completed: lecture.watches[0]?.completed ?? false,
    }))
    .filter((lecture) => !lecture.completed)
    .sort((a, b) => {
      const subjectOrder = a.subject.localeCompare(b.subject);
      if (subjectOrder) return subjectOrder;
      if (a.lectureNumber != null && b.lectureNumber != null) return a.lectureNumber - b.lectureNumber;
      if (a.lectureNumber != null) return -1;
      if (b.lectureNumber != null) return 1;
      return a.title.localeCompare(b.title);
    })
    .map(({ completed: _completed, ...lecture }) => lecture);
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

function distributeStarts(start: number, end: number, durations: number[], fullDayFree: boolean): number[] {
  if (!durations.length) return [];
  const totalStudy = durations.reduce((sum, duration) => sum + duration, 0);
  const availableBreak = Math.max(0, end - start - totalStudy);
  const gapCount = Math.max(1, durations.length - 1);
  const rawBreak = fullDayFree ? Math.floor(availableBreak / gapCount) : Math.min(30, Math.floor(availableBreak / gapCount));
  const breakMinutes = Math.floor(rawBreak / 30) * 30;
  const starts: number[] = [];
  let cursor = Math.ceil(start / 30) * 30;

  for (const duration of durations) {
    starts.push(cursor);
    cursor += duration + breakMinutes;
  }

  return starts.map((slotStart, index) => {
    const maxStart = Math.max(start, end - durations[index]);
    return Math.min(slotStart, Math.floor(maxStart / 30) * 30);
  });
}

function topicQueuesFrom(aiSlots: NormalizedSlot[], lectures: LectureContext[]): Map<string, string[]> {
  const queues = new Map<string, string[]>();
  const add = (subject: string, topic: string | null | undefined) => {
    const clean = topic?.trim();
    if (!clean) return;
    const next = queues.get(subject) ?? [];
    if (!next.includes(clean)) next.push(clean);
    queues.set(subject, next);
  };

  for (const lecture of lectures) add(lecture.subject, lecture.title);
  for (const slot of aiSlots) add(slot.subject, slot.topic);
  return queues;
}

function enforceBalancedWeeklyPlan(
  aiSlots: NormalizedSlot[],
  body: Record<string, unknown>,
  lectures: LectureContext[],
): AiSlotWithWindow[] {
  const start = timeToMinutes(body.startTime, 7 * 60);
  const end = timeToMinutes(body.endTime, 23 * 60);
  if (end <= start) return [];

  const selectedSubjects = selectedSubjectsFromBody(body);
  const lectureSubjects = [...new Set(lectures.map((lecture) => lecture.subject))];
  const aiSubjects = [...new Set(aiSlots.map((slot) => slot.subject))];
  const subjectPool = selectedSubjects.length
    ? selectedSubjects
    : lectureSubjects.length
      ? lectureSubjects
      : aiSubjects.length
        ? aiSubjects
        : DEFAULT_FOCUS;

  const rawHours = Number(body.hoursPerDay ?? 4);
  const dailyTargetMinutes = Math.min(end - start, Math.round(clamp(Number.isFinite(rawHours) ? rawHours : 4, 1, 12) * 60));
  const durations = buildDailyDurations(dailyTargetMinutes, body.style);
  const starts = distributeStarts(start, end, durations, Boolean(body.holiday));
  const topicQueues = topicQueuesFrom(aiSlots, lectures);
  const topicCursor = new Map<string, number>();
  const output: AiSlotWithWindow[] = [];

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek += 1) {
    for (let index = 0; index < durations.length; index += 1) {
      const subject = subjectPool[(dayOfWeek * durations.length + index) % subjectPool.length];
      const queue = topicQueues.get(subject) ?? [];
      const cursor = topicCursor.get(subject) ?? 0;
      const topic = queue.length ? queue[cursor % queue.length] : `${subject} revision`;
      topicCursor.set(subject, cursor + 1);
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
  const unfinishedLectures = await getUnfinishedLectureContext(userId);
  const lecturePromptContext = unfinishedLectures.slice(0, 80).map((lecture) => ({
    subject: lecture.subject,
    lectureNumber: lecture.lectureNumber,
    title: lecture.title,
  }));

  const prompt = `You are an expert coach for GATE Electrical Engineering (EE).

Return ONLY valid JSON: an array of timetable objects (no markdown, no commentary).
Each object: { "dayOfWeek": 0-6 (Monday=0 .. Sunday=6), "startTime": "HH:MM", "durationMinutes": number, "subject": string, "topic": string }

Subjects MUST be exactly one of: ${GATE_EE_SUBJECTS.join(" | ")}.
Use this GATE EE 2017-2025 weightage table as the priority signal, while still respecting weak areas and available time:
${GATE_EE_WEIGHTAGE_PROMPT}

Context:
- GATE exam date: fixed as 2027-02-05
- Typical daily study hours: ${body.hoursPerDay ?? 4}
- Study intensity: ${body.style ?? "balanced"}
- Holiday mode: ${body.holiday ? "yes, the whole available day can be used with breaks" : "no, keep the plan inside the normal study target"}
- Available study window: ${body.startTime ?? "06:00"} to ${body.endTime ?? "23:00"}
- Selected syllabus focus from lecture folders: ${JSON.stringify(body.focusSubjects ?? [])}
- Weak / priority areas: ${JSON.stringify(body.weak ?? [])}
- Available unfinished lectures, sorted by detected lecture number where possible. Prefer these as topics and do not suggest already completed lectures: ${JSON.stringify(lecturePromptContext)}
- Remaining days roughly: ${body.remainingDays ?? "unknown"}

Plan rule: every day from Monday through Sunday must receive the same study-hour target and a similar number of study blocks. Do not reduce the number of slots later in the week. Every slot must start within the available study window and must not end after it. Use only half-hour-aligned start times ending in :00 or :30, for example 06:00, 06:30, 07:00, 07:30. If holiday mode is true, use more of the free day with breaks. High-weight selected/weak subjects get more and earlier slots; low-weight subjects stay present but lighter.
Produce 18-32 varied slots across the week covering syllabus gaps and weak areas.`;

  const result = await callAI(userId, "study-plan", prompt);
  if (!result.ok) {
    return NextResponse.json({ error: result.content }, { status: result.unavailable ? 503 : 500 });
  }

  const parsed = parseSlotArrayFromAi(result.content);
  const previewSlots = enforceBalancedWeeklyPlan(normalizePlanSlots(parsed), body, unfinishedLectures);
  return NextResponse.json({
    previewSlots,
    slotCount: previewSlots.length,
  });
}
