import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { touchStreakDay } from "@/lib/streak-touch";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const lecture = await prisma.lecture.findFirst({ where: { id, userId } });
  if (!lecture) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const watchedPercent = Math.min(100, Math.max(0, Number(body.watchedPercent ?? 0)));
  const lastPositionSeconds = Math.max(0, Number(body.lastPositionSeconds ?? 0));
  const completed = Boolean(body.completed) || watchedPercent >= 95;
  const studiedSeconds = Math.max(0, Math.min(15 * 60, Number(body.studiedSeconds ?? 0)));

  const prev = await prisma.lectureWatch.findUnique({
    where: { lectureId_userId: { lectureId: id, userId } },
  });

  const watch = await prisma.lectureWatch.upsert({
    where: { lectureId_userId: { lectureId: id, userId } },
    update: { watchedPercent, lastPositionSeconds, completed },
    create: {
      lectureId: id,
      userId,
      watchedPercent,
      lastPositionSeconds,
      completed,
    },
  });

  if (completed && !prev?.completed) await touchStreakDay(prisma, userId);

  if (studiedSeconds >= 60) {
    await prisma.studySessionLog.create({
      data: {
        userId,
        subjectId: lecture.subjectId,
        startedAt: new Date(Date.now() - studiedSeconds * 1000),
        endedAt: new Date(),
        durationMinutes: Math.max(1, Math.round(studiedSeconds / 60)),
      },
    });
    await touchStreakDay(prisma, userId);
  }

  return NextResponse.json(watch);
}
