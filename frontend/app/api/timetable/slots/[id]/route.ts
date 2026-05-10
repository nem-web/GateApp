import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";
import { touchStreakDay } from "@/lib/streak-touch";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existing = await prisma.timetableSlot.findFirst({
    where: { id, userId },
    include: { subject: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();

  const subject =
    body.subject !== undefined ? await resolveSubject(prisma, String(body.subject ?? "")) : undefined;

  const slot = await prisma.timetableSlot.update({
    where: { id },
    data: {
      ...(body.dayOfWeek !== undefined && { dayOfWeek: Number(body.dayOfWeek) }),
      ...(body.startTime !== undefined && { startTime: String(body.startTime) }),
      ...(body.durationMinutes !== undefined && { durationMinutes: Number(body.durationMinutes) }),
      ...(subject && { subjectId: subject.id }),
      ...(body.topic !== undefined && { topic: body.topic ? String(body.topic) : null }),
      ...(body.completed !== undefined && { completed: Boolean(body.completed) }),
      source: "manual",
    },
    include: { subject: true },
  });

  if (body.completed === true) await touchStreakDay(prisma, userId);

  return NextResponse.json({
    ...slot,
    subject: slot.subject.title,
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existing = await prisma.timetableSlot.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.timetableSlot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
