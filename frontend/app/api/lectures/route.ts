import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lectures = await prisma.lecture.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      subject: true,
      watches: { where: { userId } },
    },
  });

  const payload = lectures.map((l) => {
    const w = l.watches[0];
    return {
      id: l.id,
      title: l.title,
      subjectId: l.subjectId,
      subject: l.subject.title,
      topic: l.topic,
      youtubeVideoId: l.youtubeVideoId,
      storagePath: l.storagePath,
      durationSeconds: l.durationSeconds,
      difficulty: l.difficulty,
      watchedPercent: w?.watchedPercent ?? 0,
      completed: w?.completed ?? false,
    };
  });

  return NextResponse.json({ lectures: payload });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const subject = await resolveSubject(prisma, typeof body.subject === "string" ? body.subject : null);

  const lecture = await prisma.lecture.create({
    data: {
      userId,
      title: String(body.title ?? "Lecture"),
      subjectId: subject.id,
      topic: body.topic ? String(body.topic) : null,
      youtubeVideoId: body.youtubeVideoId ? String(body.youtubeVideoId) : null,
      storagePath: body.storagePath ? String(body.storagePath) : null,
      durationSeconds: body.durationSeconds ? Number(body.durationSeconds) : null,
      difficulty: body.difficulty ? String(body.difficulty) : null,
    },
    include: { subject: true },
  });

  await prisma.lectureWatch.create({
    data: {
      lectureId: lecture.id,
      userId,
      watchedPercent: 0,
      lastPositionSeconds: 0,
      completed: false,
    },
  });

  return NextResponse.json({
    ...lecture,
    subject: lecture.subject.title,
  });
}
