import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";

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

  const slotsSnapshot = rows as unknown as Prisma.InputJsonValue;

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

    await Promise.all(
      rows.map(async (r) => {
        const subject = await resolveSubject(tx, String(r.subject ?? ""));
        return tx.timetableSlot.create({
          data: {
            userId,
            studyPlanId: plan.id,
            dayOfWeek: Math.min(6, Math.max(0, Number(r.dayOfWeek))),
            startTime: String(r.startTime ?? "09:00"),
            durationMinutes: Math.min(240, Math.max(15, Number(r.durationMinutes ?? 60))),
            subjectId: subject.id,
            topic: r.topic ? String(r.topic) : null,
            completed: false,
            source: String(body.slotSource ?? "ai_applied"),
          },
        });
      }),
    );
  });

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
