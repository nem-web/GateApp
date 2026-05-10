import { NextResponse } from "next/server";
import { differenceInCalendarDays } from "date-fns";
import {
  dashboardStats,
  subjectProgress,
  recentScores as mockScores,
  todaysTodos as mockTodos,
} from "@/lib/mockData";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/session";

export async function GET() {
  try {
    const userId = await getEffectiveUserId();
    if (!userId) {
      throw new Error("no-db");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const gateDate = user?.gateDate ?? new Date("2025-02-01");
    const gateCountdown = Math.max(0, differenceInCalendarDays(gateDate, new Date()));

    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      take: 12,
    });

    const recentScores =
      results.length > 0
        ? results.map((r, i) => ({
            date: `W${i + 1}`,
            score: r.totalQ > 0 ? Math.round((r.score / r.totalQ) * 100) : r.score,
          }))
        : mockScores;

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
      take: 10,
    });

    const todaysTodos =
      tasks.length > 0
        ? tasks.slice(0, 3).map((t) => ({
            id: t.id,
            task: t.title,
            priority: t.priority as "high" | "medium" | "low",
            completed: t.completed,
          }))
        : mockTodos.map((t) => ({
            id: String(t.id),
            task: t.task,
            priority: t.priority,
            completed: t.completed,
          }));

    return NextResponse.json({
      stats: {
        studyStreak: dashboardStats.studyStreak,
        hoursToday: dashboardStats.hoursToday,
        topicsDone: dashboardStats.topicsDone,
        gateCountdown,
      },
      subjectProgress,
      recentScores,
      todaysTodos,
    });
  } catch {
    return NextResponse.json({
      stats: dashboardStats,
      subjectProgress,
      recentScores: mockScores,
      todaysTodos: mockTodos.map((t) => ({
        id: String(t.id),
        task: t.task,
        priority: t.priority,
        completed: t.completed,
      })),
    });
  }
}
