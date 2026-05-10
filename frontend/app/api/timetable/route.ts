import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const slots = await prisma.timetableSlot.findMany({
    where: { userId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    include: { subject: true },
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
  return NextResponse.json({ slots: payload });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const subject = await resolveSubject(prisma, String(body.subject ?? ""));
  const slot = await prisma.timetableSlot.create({
    data: {
      userId,
      dayOfWeek: Number(body.dayOfWeek),
      startTime: String(body.startTime),
      durationMinutes: Number(body.durationMinutes ?? 60),
      subjectId: subject.id,
      topic: body.topic ? String(body.topic) : null,
      completed: Boolean(body.completed),
      source: String(body.source ?? "manual"),
      ...(typeof body.studyPlanId === "string" &&
        body.studyPlanId.trim() && { studyPlanId: body.studyPlanId.trim() }),
    },
    include: { subject: true },
  });
  return NextResponse.json({
    ...slot,
    subject: slot.subject.title,
  });
}
