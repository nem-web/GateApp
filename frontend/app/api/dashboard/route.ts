import { NextResponse } from "next/server";
import {
  differenceInCalendarDays,
  endOfDay,
  formatISO,
  startOfDay,
  subDays,
} from "date-fns";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import {
  canonicalGateEESubject,
  GATE_EE_SUBJECTS,
  GATE_EE_WEIGHTAGE_BY_SUBJECT,
  GATE_EXAM_DATE_ISO,
  SUBJECT_COLORS,
} from "@/lib/gate-ee";
import {
  collectActiveDates,
  consecutiveStreakFromToday,
  consistencyLastNDays,
} from "@/lib/streak";

function coerceTaskPriority(value: string): "high" | "medium" | "low" {
  return value === "high" || value === "medium" || value === "low" ? value : "medium";
}

type TopicBreakdown = Record<string, { correct: number; total: number }>;

function scoreBreakdownEntry(v: { correct: number; total: number }): number {
  return v.total > 0 ? (100 * v.correct) / v.total : 100;
}

function inferLectureFolderSubject(folder: string | null | undefined, fallbackSubject: string): string | null {
  const raw = folder?.trim() ?? "";
  const normalized = raw.toLowerCase();
  if (!raw) {
    return canonicalGateEESubject(fallbackSubject);
  }

  if (
    ["overall", "all lectures", "complete course", "full course", "gate ee"].includes(normalized) ||
    ["overall", "combined", "mixed", "complete playlist", "complete gate ee"].some((word) =>
      normalized.includes(word),
    )
  ) {
    return null;
  }

  const exact = canonicalGateEESubject(raw);
  if ((GATE_EE_SUBJECTS as readonly string[]).includes(exact)) return exact;

  for (const subject of GATE_EE_SUBJECTS) {
    if (normalized.includes(subject.toLowerCase())) return subject;
  }

  const aliasPairs: Array<[string, string]> = [
    ["math", "Engineering Mathematics"],
    ["network", "Network Theory"],
    ["signal", "Signals and Systems"],
    ["control", "Control Systems"],
    ["machine", "Electrical Machines"],
    ["power system", "Power Systems"],
    ["power electronic", "Power Electronics"],
    ["analog", "Analog Electronics"],
    ["digital", "Digital Electronics"],
    ["measurement", "Measurements"],
    ["emft", "Electromagnetic Fields"],
    ["electromagnetic", "Electromagnetic Fields"],
    ["aptitude", "Aptitude"],
  ];
  for (const [needle, subject] of aliasPairs) {
    if (normalized.includes(needle)) return subject;
  }

  return canonicalGateEESubject(fallbackSubject);
}

async function readDashboardValue<T>(label: string, promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error(`Dashboard query failed: ${label}`, error);
    return fallback;
  }
}

/** Merge weak signals from tests, open tasks, and difficult flashcard reviews (GATE EE subjects only). */
function buildWeakTopicAnalysis(input: {
  syllabusTitles: Set<string>;
  testRows: { topicBreakdown: unknown; weakTopics: string[] }[];
  openTaskCounts: Map<string, number>;
  flashcardStruggle: Map<string, number>;
  topicPerf: { subjectTitle: string; attempts: number; correct: number }[];
}): {
  label: string;
  subject: string;
  score: number;
  reasons: ("test" | "task" | "flashcard" | "accuracy")[];
}[] {
  const agg = new Map<
    string,
    { subject: string; score: number; reasons: Set<"test" | "task" | "flashcard" | "accuracy"> }
  >();

  const bump = (
    key: string,
    subject: string,
    score: number,
    r: "test" | "task" | "flashcard" | "accuracy",
  ) => {
    if (!input.syllabusTitles.has(subject)) return;
    const cur = agg.get(key) ?? { subject, score: 100, reasons: new Set() };
    cur.score = Math.min(cur.score, score);
    cur.reasons.add(r);
    agg.set(key, cur);
  };

  for (const t of input.topicPerf) {
    if (t.attempts < 2) continue;
    const acc = t.attempts ? (100 * t.correct) / t.attempts : 100;
    if (acc < 70) {
      bump(`acc:${t.subjectTitle}`, t.subjectTitle, acc, "accuracy");
    }
  }

  for (const att of input.testRows) {
    const tb = att.topicBreakdown as TopicBreakdown | null;
    if (tb && typeof tb === "object") {
      for (const [key, val] of Object.entries(tb)) {
        if (!val || typeof val.total !== "number" || val.total < 1) continue;
        const sc = scoreBreakdownEntry(val);
        if (sc >= 55) continue;
        const subject = key.split("::")[0] ?? key;
        if (!input.syllabusTitles.has(subject)) continue;
        bump(`tb:${key}`, subject, sc, "test");
      }
    }
    for (const w of att.weakTopics) {
      const subject = w.split(" — ")[0]?.trim() ?? w;
      if (!input.syllabusTitles.has(subject)) continue;
      bump(`wt:${w}`, subject, 40, "test");
    }
  }

  for (const [subject, n] of input.openTaskCounts) {
    if (n <= 0 || !input.syllabusTitles.has(subject)) continue;
    const score = Math.max(15, 80 - Math.min(60, n * 6));
    bump(`tasks:${subject}`, subject, score, "task");
  }

  for (const [subject, n] of input.flashcardStruggle) {
    if (n <= 0 || !input.syllabusTitles.has(subject)) continue;
    const score = Math.max(20, 75 - Math.min(50, n * 5));
    bump(`fc:${subject}`, subject, score, "flashcard");
  }

  return [...agg.entries()]
    .map(([label, v]) => ({
      label,
      subject: v.subject,
      score: Math.round(v.score),
      reasons: [...v.reasons],
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 8);
}

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const weekStart = startOfDay(subDays(new Date(), 6));
    const monthStart = startOfDay(subDays(new Date(), 29));

    const gateExam = new Date(GATE_EXAM_DATE_ISO);

    const userPromise = prisma.user.findUnique({
      where: { id: userId },
      include: {
        weakSubjectLinks: {
          include: { subject: true },
          orderBy: { priority: "desc" },
        },
      },
    });

    const syllabusPromise = prisma.subject.findMany({
      where: { branch: "EE" },
      orderBy: { sortOrder: "asc" },
    });

    const [user, syllabus] = await Promise.all([
      readDashboardValue("user", userPromise, null),
      readDashboardValue("syllabus", syllabusPromise, []),
    ]);
    const syllabusTitles = new Set(syllabus.map((s) => s.title));

    const gateDate = gateExam;
    const gateCountdown = Math.max(0, differenceInCalendarDays(startOfDay(gateDate), todayStart));

    const [
      studyTodayAgg,
      studyWeekAgg,
      studyMonthAgg,
      tasksCompletedAll,
      tasksCompletedToday,
      tasksOpen,
      notesCount,
      lecturesCount,
      flashcardsDue,
      flashcardsMastered,
      attempts,
      topicPerf,
      slots,
      lectures,
      recentAttempts,
      badReviews,
      openTasksBySubject,
    ] = await Promise.all([
      readDashboardValue("studyTodayAgg", prisma.studySessionLog.aggregate({
        where: { userId, startedAt: { gte: todayStart, lte: todayEnd } },
        _sum: { durationMinutes: true },
      }), { _sum: { durationMinutes: null } }),
      readDashboardValue("studyWeekAgg", prisma.studySessionLog.aggregate({
        where: { userId, startedAt: { gte: weekStart } },
        _sum: { durationMinutes: true },
      }), { _sum: { durationMinutes: null } }),
      readDashboardValue("studyMonthAgg", prisma.studySessionLog.aggregate({
        where: { userId, startedAt: { gte: monthStart } },
        _sum: { durationMinutes: true },
      }), { _sum: { durationMinutes: null } }),
      readDashboardValue("tasksCompletedAll", prisma.task.count({ where: { userId, completed: true } }), 0),
      readDashboardValue("tasksCompletedToday", prisma.task.count({
        where: { userId, completed: true, updatedAt: { gte: todayStart, lte: todayEnd } },
      }), 0),
      readDashboardValue("tasksOpen", prisma.task.count({ where: { userId, completed: false } }), 0),
      readDashboardValue("notesCount", prisma.note.count({ where: { userId } }), 0),
      readDashboardValue("lecturesCount", prisma.lecture.count({ where: { userId } }), 0),
      readDashboardValue("flashcardsDue", prisma.flashcard.count({
        where: {
          userId,
          mastered: false,
          nextReview: { lte: new Date() },
        },
      }), 0),
      readDashboardValue("flashcardsMastered", prisma.flashcard.count({ where: { userId, mastered: true } }), 0),
      readDashboardValue("attempts", prisma.testAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
        take: 24,
      }), []),
      readDashboardValue("topicPerf", prisma.topicPerformance.findMany({
        where: { userId },
        include: { subject: true },
      }), []),
      readDashboardValue("slots", prisma.timetableSlot.findMany({
        where: { userId },
        include: { subject: true },
      }), []),
      readDashboardValue("lectures", prisma.lecture.findMany({
        where: { userId },
        include: {
          subject: true,
          watches: { where: { userId } },
        },
      }), []),
      readDashboardValue("recentAttempts", prisma.testAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { topicBreakdown: true, weakTopics: true },
      }), []),
      readDashboardValue("badReviews", prisma.flashcardReview.findMany({
        where: {
          userId,
          grade: { lte: 1 },
          reviewedAt: { gte: subDays(new Date(), 14) },
        },
        take: 400,
        include: { flashcard: { include: { subject: true } } },
      }), []),
      readDashboardValue("openTasksBySubject", prisma.task.groupBy({
        by: ["subjectId"],
        where: { userId, completed: false, subjectId: { not: null } },
        _count: { _all: true },
      }), []),
    ]);

    const hoursToday = Math.round(((studyTodayAgg._sum.durationMinutes ?? 0) / 60) * 10) / 10;
    const hoursThisWeek = Math.round(((studyWeekAgg._sum.durationMinutes ?? 0) / 60) * 10) / 10;
    const hoursLast30Days = Math.round(((studyMonthAgg._sum.durationMinutes ?? 0) / 60) * 10) / 10;

    const recentScores = attempts.map((a) => ({
      date: formatISO(startOfDay(a.createdAt), { representation: "date" }),
      score: a.totalQuestions > 0 ? Math.round((a.score / a.totalQuestions) * 100) : 0,
    }));

    const perfMap = Object.fromEntries(
      topicPerf.map((t) => [
        t.subject.title,
        t.attempts > 0 ? Math.round((100 * t.correct) / t.attempts) : null,
      ]),
    );

    const lectureSubjectTotals = new Map<string, { done: number; all: number; watchedPctSum: number }>();
    for (const lecture of lectures) {
      const title = inferLectureFolderSubject(lecture.topic, lecture.subject.title);
      if (!title) continue;
      if (!syllabusTitles.has(title)) continue;
      const watch = lecture.watches[0];
      const cur = lectureSubjectTotals.get(title) ?? { done: 0, all: 0, watchedPctSum: 0 };
      cur.all += 1;
      cur.done += watch?.completed ? 1 : 0;
      cur.watchedPctSum += Math.min(100, Math.max(0, watch?.watchedPercent ?? 0));
      lectureSubjectTotals.set(title, cur);
    }

    const subjectsWithLectures = new Set(lectureSubjectTotals.keys());
    const subjectProgress = syllabus
      .filter((row) => subjectsWithLectures.has(row.title))
      .map((row) => {
        const lectureStats = lectureSubjectTotals.get(row.title) ?? { done: 0, all: 0, watchedPctSum: 0 };
        const lectureProgress =
          lectureStats.all > 0 ? Math.round((100 * lectureStats.done) / lectureStats.all) : 0;
        const testAccuracy = perfMap[row.title];
        const weightage = GATE_EE_WEIGHTAGE_BY_SUBJECT[row.title];
        return {
          subjectId: row.id,
          subject: row.title,
          progress: Math.min(100, lectureProgress),
          lectureDone: lectureStats.done,
          lectureTotal: lectureStats.all,
          averageWatchPercent:
            lectureStats.all > 0 ? Math.round(lectureStats.watchedPctSum / lectureStats.all) : 0,
          testAccuracy,
          weightageAverage: weightage?.average ?? null,
          weightageLatest: weightage?.latest ?? null,
          color: SUBJECT_COLORS[row.title] ?? "#6C63FF",
        };
      })
      .sort((a, b) => (b.weightageAverage ?? 0) - (a.weightageAverage ?? 0));

    const weakFromPerf = [...topicPerf]
      .filter((t) => t.attempts >= 2)
      .map((t) => ({
        subject: t.subject.title,
        pct: t.attempts ? (100 * t.correct) / t.attempts : 0,
      }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 5)
      .map((w) => w.subject);

    const weakFromProfile = user?.weakSubjectLinks?.map((l) => l.subject.title) ?? [];

    let weakSubjects: string[];
    if (weakFromPerf.length > 0) weakSubjects = weakFromPerf;
    else if (weakFromProfile.length > 0) weakSubjects = weakFromProfile.slice(0, 5);
    else weakSubjects = [];

    const tasksPreview = await readDashboardValue("tasksPreview", prisma.task.findMany({
      where: { userId },
      orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      take: 5,
    }), []);

    const activeDates = await readDashboardValue("activeDates", collectActiveDates(prisma, userId), new Set<string>());
    const streak = consecutiveStreakFromToday(activeDates);
    const consistency = consistencyLastNDays(activeDates, 30);

    await readDashboardValue(
      "userStreakUpdate",
      prisma.user.update({
        where: { id: userId },
        data: { studyStreakDays: streak, lastStreakDate: startOfDay(new Date()) },
      }),
      null,
    );

    const topicsDoneSlots = slots.filter((s) => s.completed).length;

    const displayName = user?.name ?? "Nem";

    const subjectIdToTitle = Object.fromEntries(syllabus.map((s) => [s.id, s.title]));

    const openTaskCounts = new Map<string, number>();
    for (const row of openTasksBySubject) {
      const sid = row.subjectId;
      if (!sid) continue;
      const title = subjectIdToTitle[sid];
      if (!title) continue;
      openTaskCounts.set(title, row._count._all);
    }

    const flashcardStruggle = new Map<string, number>();
    for (const r of badReviews) {
      const title = r.flashcard.subject.title;
      if (!syllabusTitles.has(title)) continue;
      flashcardStruggle.set(title, (flashcardStruggle.get(title) ?? 0) + 1);
    }

    const rawWeak = buildWeakTopicAnalysis({
      syllabusTitles,
      testRows: recentAttempts.map((a) => ({
        topicBreakdown: a.topicBreakdown,
        weakTopics: a.weakTopics,
      })),
      openTaskCounts,
      flashcardStruggle,
      topicPerf: topicPerf.map((t) => ({
        subjectTitle: t.subject.title,
        attempts: t.attempts,
        correct: t.correct,
      })),
    });

    const weakMerged = new Map<
      string,
      { score: number; reasons: Set<"test" | "task" | "flashcard" | "accuracy"> }
    >();
    for (const row of rawWeak) {
      const prev = weakMerged.get(row.subject);
      if (!prev) {
        weakMerged.set(row.subject, { score: row.score, reasons: new Set(row.reasons) });
      } else {
        prev.score = Math.min(prev.score, row.score);
        row.reasons.forEach((r) => prev.reasons.add(r));
      }
    }

    const weakTopicAnalysis = [...weakMerged.entries()]
      .map(([subject, v]) => ({
        label: subject,
        subject,
        score: v.score,
        reasons: [...v.reasons],
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 8);

    const payload = {
      stats: {
        studyStreak: streak,
        hoursToday,
        hoursThisWeek,
        hoursLast30Days,
        tasksCompletedToday,
        tasksCompletedAll,
        tasksOpen,
        topicsDone: topicsDoneSlots,
        gateCountdown,
        gateExamDate: formatISO(startOfDay(gateDate), { representation: "date" }),
        notesCount,
        lecturesCount,
        flashcardsDue,
        flashcardsMastered,
        studyConsistencyPct: consistency,
        mockTestsTaken: attempts.length,
      },
      subjectProgress,
      recentScores,
      weakSubjects,
      weakTopicAnalysis,
      todaysTodos: tasksPreview.map((t) => ({
        id: t.id,
        task: t.title,
        priority: coerceTaskPriority(t.priority),
        completed: t.completed,
      })),
      meta: {
        streamLabel: "GATE-EE",
        displayName,
      },
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
