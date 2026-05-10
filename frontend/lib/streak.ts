import { formatISO, startOfDay } from "date-fns";
import type { PrismaClient } from "@prisma/client";

/** Dates (yyyy-MM-dd) where user had meaningful activity (ledger + legacy sources). */
export async function collectActiveDates(prisma: PrismaClient, userId: string): Promise<Set<string>> {
  const dates = new Set<string>();

  const streakLedger = await prisma.streakDay.findMany({
    where: { userId },
    select: { day: true },
    orderBy: { day: "desc" },
    take: 366,
  });
  streakLedger.forEach((r) => dates.add(formatISO(startOfDay(r.day), { representation: "date" })));

  const sessions = await prisma.studySessionLog.findMany({
    where: { userId, durationMinutes: { gt: 0 } },
    select: { startedAt: true },
    take: 500,
  });
  sessions.forEach((s) => dates.add(formatISO(startOfDay(s.startedAt), { representation: "date" })));

  const tasks = await prisma.task.findMany({
    where: { userId, completed: true },
    select: { updatedAt: true },
    take: 500,
  });
  tasks.forEach((t) => dates.add(formatISO(startOfDay(t.updatedAt), { representation: "date" })));

  const reviews = await prisma.flashcardReview.findMany({
    where: { userId },
    select: { reviewedAt: true },
    take: 500,
  });
  reviews.forEach((r) => dates.add(formatISO(startOfDay(r.reviewedAt), { representation: "date" })));

  const attempts = await prisma.testAttempt.findMany({
    where: { userId },
    select: { createdAt: true },
    take: 100,
  });
  attempts.forEach((a) => dates.add(formatISO(startOfDay(a.createdAt), { representation: "date" })));

  return dates;
}

export function consecutiveStreakFromToday(activeDates: Set<string>): number {
  const today = startOfDay(new Date());
  let streak = 0;
  for (let i = 0; i < 366; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = formatISO(d, { representation: "date" });
    if (activeDates.has(key)) streak += 1;
    else break;
  }
  return streak;
}

export function consistencyLastNDays(activeDates: Set<string>, n: number): number {
  const today = startOfDay(new Date());
  let hit = 0;
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = formatISO(d, { representation: "date" });
    if (activeDates.has(key)) hit += 1;
  }
  return Math.round((hit / n) * 100);
}
