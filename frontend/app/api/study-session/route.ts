import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";
import { touchStreakDay } from "@/lib/streak-touch";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const durationMinutes = Math.min(600, Math.max(1, Number(body.durationMinutes ?? 25)));

  const subjectTitle =
    typeof body.subject === "string"
      ? body.subject
      : typeof body.subjectTitle === "string"
        ? body.subjectTitle
        : null;

  let resolvedSubjectId: string | undefined;
  if (typeof body.subjectId === "string" && body.subjectId.trim()) {
    const row = await prisma.subject.findUnique({ where: { id: body.subjectId.trim() } });
    if (row) resolvedSubjectId = row.id;
  }
  if (!resolvedSubjectId && subjectTitle) {
    resolvedSubjectId = (await resolveSubject(prisma, subjectTitle)).id;
  }

  const log = await prisma.studySessionLog.create({
    data: {
      userId,
      durationMinutes,
      subjectId: resolvedSubjectId ?? null,
      endedAt: new Date(),
    },
    include: { subject: true },
  });

  if (durationMinutes > 0) await touchStreakDay(prisma, userId);

  return NextResponse.json({
    ...log,
    subject: log.subject?.title ?? null,
  });
}
