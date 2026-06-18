import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { subjectSlugFromTitle } from "@/lib/subject-resolve";
import { checkFeatureLimit, quotaResponse, recordUsage } from "@/lib/subscription";

type Incoming = {
  dayOfWeek: number;
  startTime: string;
  durationMinutes?: number;
  subject: string;
  topic?: string | null;
};

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const rows = body.slots as Incoming[];
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "slots[] required" }, { status: 400 });
  }
  if (String(body.planSource ?? body.slotSource ?? "").includes("ai")) {
    const featureLimit = await checkFeatureLimit(userId, "timetable_generations");
    if (!featureLimit.ok) return quotaResponse(featureLimit);
  }

  const slotsSnapshot = rows as unknown as Prisma.InputJsonValue;
  const subjects = await prisma.subject.findMany({ orderBy: { sortOrder: "asc" } });
  const fallbackSubject = subjects[0];
  if (!fallbackSubject) {
    return NextResponse.json(
      { error: "Subjects are not seeded. Run `npm run db:seed` in frontend." },
      { status: 500 },
    );
  }

  const subjectsByTitle = new Map(subjects.map((s) => [s.title.toLowerCase(), s]));
  const subjectsBySlug = new Map(subjects.map((s) => [s.slug, s]));
  const normalizedRows = rows.map((r) => {
    const rawSubject = String(r.subject ?? "").trim();
    const subject =
      subjectsByTitle.get(rawSubject.toLowerCase()) ??
      subjectsBySlug.get(subjectSlugFromTitle(rawSubject)) ??
      subjects.find((s) => s.title.toLowerCase().includes(rawSubject.toLowerCase())) ??
      fallbackSubject;

    return {
      userId,
      dayOfWeek: Math.min(6, Math.max(0, Number(r.dayOfWeek))),
      startTime: String(r.startTime ?? "09:00").slice(0, 5),
      durationMinutes: Math.min(240, Math.max(15, Number(r.durationMinutes ?? 60))),
      subjectId: subject.id,
      topic: r.topic ? String(r.topic) : null,
      completed: false,
      source: String(body.slotSource ?? "ai_applied"),
    };
  });

  await prisma.$transaction(async (tx) => {
    const plan = await tx.studyPlan.create({
      data: {
        userId,
        title: typeof body.planTitle === "string" ? body.planTitle : "Applied timetable",
        source: typeof body.planSource === "string" ? body.planSource : "ai_applied",
        status: "active",
        slots: slotsSnapshot,
      },
    });

    await tx.timetableSlot.deleteMany({ where: { userId } });
    await tx.timetableSlot.createMany({
      data: normalizedRows.map((row) => ({
        ...row,
        studyPlanId: plan.id,
      })),
    });
  });
  if (String(body.planSource ?? body.slotSource ?? "").includes("ai")) {
    await recordUsage(userId, "timetable_generations", 1, { slots: normalizedRows.length });
  }

  const slots = await prisma.timetableSlot.findMany({
    where: { userId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    include: { subject: true, studyPlan: true },
  });

  const payload = slots.map((sl) => ({
    id: sl.id,
    userId: sl.userId,
    studyPlanId: sl.studyPlanId,
    dayOfWeek: sl.dayOfWeek,
    startTime: sl.startTime,
    durationMinutes: sl.durationMinutes,
    subjectId: sl.subjectId,
    subject: sl.subject.title,
    topic: sl.topic,
    completed: sl.completed,
    source: sl.source,
  }));

  return NextResponse.json({ ok: true, slots: payload });
}
