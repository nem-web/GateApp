import { PrismaClient } from "@prisma/client";
import { canonicalGateEESubject, GATE_EE_SUBJECTS } from "@/lib/gate-ee";
import { type AiSlotWithWindow, constrainAiSlotsToWindow } from "@/lib/ai-slot-window";
import { type NormalizedSlot } from "@/lib/parse-ai-plan";

const DEFAULT_FOCUS = [
  "Engineering Mathematics",
  "Network Theory",
  "Power Systems",
  "Electrical Machines",
  "Control Systems",
];

type PrismaLike = PrismaClient;

export type SelectedLectureFolder = {
  subject: string;
  folder: string;
};

type LectureForPlan = {
  title: string;
  subject: string;
  folder: string;
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

export function selectedSubjectsFromBody(body: Record<string, unknown>): string[] {
  const raw = Array.isArray(body.selectedSubjects)
    ? body.selectedSubjects
    : Array.isArray(body.focusSubjects)
      ? body.focusSubjects
      : Array.isArray(body.weak)
        ? body.weak
        : [];
  const seen = new Set<string>();
  for (const item of raw) {
    const subject = validSubject(item);
    if (subject) seen.add(subject);
  }
  return [...seen];
}

export function selectedLectureFoldersFromBody(body: Record<string, unknown>): SelectedLectureFolder[] {
  const raw = Array.isArray(body.selectedLectureFolders) ? body.selectedLectureFolders : [];
  const seen = new Set<string>();
  const folders: SelectedLectureFolder[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const subject = validSubject(row.subject);
    const folder = typeof row.folder === "string" ? row.folder.trim() : "";
    if (!subject || !folder) continue;

    const key = `${subject}\u0000${folder.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    folders.push({ subject, folder });
  }

  return folders;
}

function extractLectureNumber(title: string): number | null {
  const match =
    title.match(/\b(?:l|lecture|lec|class|video|part)\s*[-#: ]*\s*(\d{1,4})\b/i) ??
    title.match(/\b(\d{1,4})\b/);
  if (!match?.[1]) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

function folderKey(folder: SelectedLectureFolder) {
  return `${folder.subject}\u0000${folder.folder.toLowerCase()}`;
}

export async function getUnfinishedPlaylistLectures(
  prisma: PrismaLike,
  userId: string,
  selectedFolders: SelectedLectureFolder[],
): Promise<LectureForPlan[]> {
  if (!selectedFolders.length) return [];

  const folderOrder = new Map(selectedFolders.map((folder, index) => [folderKey(folder), index]));
  const lectures = await prisma.lecture.findMany({
    where: {
      userId,
      OR: selectedFolders.map((folder) => ({
        topic: folder.folder,
        subject: { title: folder.subject },
      })),
      NOT: {
        watches: { some: { userId, completed: true } },
      },
    },
    include: {
      subject: true,
      watches: { where: { userId } },
    },
  });

  return lectures
    .filter((lecture) => !(lecture.watches[0]?.completed ?? false))
    .map((lecture) => ({
      title: lecture.title,
      subject: lecture.subject.title,
      folder: lecture.topic ?? "Single lectures",
      lectureNumber: extractLectureNumber(lecture.title),
    }))
    .sort((a, b) => {
      const folderA = folderOrder.get(folderKey({ subject: a.subject, folder: a.folder })) ?? Number.MAX_SAFE_INTEGER;
      const folderB = folderOrder.get(folderKey({ subject: b.subject, folder: b.folder })) ?? Number.MAX_SAFE_INTEGER;
      if (folderA !== folderB) return folderA - folderB;
      if (a.lectureNumber != null && b.lectureNumber != null && a.lectureNumber !== b.lectureNumber) {
        return a.lectureNumber - b.lectureNumber;
      }
      if (a.lectureNumber != null) return -1;
      if (b.lectureNumber != null) return 1;
      return a.title.localeCompare(b.title);
    });
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

function orderedSubjectsFrom(
  body: Record<string, unknown>,
  selectedFolders: SelectedLectureFolder[],
  aiSlots: NormalizedSlot[],
) {
  const selectedSubjects = selectedSubjectsFromBody(body);
  const folderSubjects = [...new Set(selectedFolders.map((folder) => folder.subject))];
  const aiSubjects = [...new Set(aiSlots.map((slot) => slot.subject))];
  const subjects = [...selectedSubjects, ...folderSubjects];
  if (subjects.length) return subjects.filter((subject, index) => subjects.indexOf(subject) === index);
  return (aiSubjects.length ? aiSubjects : DEFAULT_FOCUS).filter((subject, index, arr) => arr.indexOf(subject) === index);
}

function queueBySubject(lectures: LectureForPlan[]) {
  const queues = new Map<string, LectureForPlan[]>();
  for (const lecture of lectures) {
    const next = queues.get(lecture.subject) ?? [];
    next.push(lecture);
    queues.set(lecture.subject, next);
  }
  return queues;
}

export function buildDeterministicTimetableSlots(
  aiSlots: NormalizedSlot[],
  body: Record<string, unknown>,
  selectedFolders: SelectedLectureFolder[],
  lectures: LectureForPlan[],
): AiSlotWithWindow[] {
  const start = timeToMinutes(body.startTime, 7 * 60);
  const end = timeToMinutes(body.endTime, 23 * 60);
  if (end <= start) return [];

  const rawHours = Number(body.studyHoursPerDay ?? body.hoursPerDay ?? 4);
  const dailyTargetMinutes = Math.min(end - start, Math.round(clamp(Number.isFinite(rawHours) ? rawHours : 4, 1, 12) * 60));
  const durations = buildDailyDurations(dailyTargetMinutes, body.style);
  const starts = distributeStarts(start, end, durations, Boolean(body.fullDayFree ?? body.holiday));
  const subjects = orderedSubjectsFrom(body, selectedFolders, aiSlots);
  const lectureQueues = queueBySubject(lectures);
  const practiceCursor = new Map<string, number>();
  const output: AiSlotWithWindow[] = [];

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek += 1) {
    for (let index = 0; index < durations.length; index += 1) {
      const subject = subjects[(dayOfWeek * durations.length + index) % subjects.length] ?? DEFAULT_FOCUS[0];
      const lecture = lectureQueues.get(subject)?.shift();
      const practiceIndex = practiceCursor.get(subject) ?? 0;
      const topic = lecture?.title ?? (practiceIndex % 2 === 0 ? "Revision" : "Question Practice");
      if (!lecture) practiceCursor.set(subject, practiceIndex + 1);

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
