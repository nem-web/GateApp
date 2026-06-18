import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [subjects, lectures] = await Promise.all([
    prisma.subject.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.lecture.findMany({
      where: {
        userId,
        watches: { some: { userId, completed: true } },
      },
      orderBy: { createdAt: "asc" },
      include: { subject: true },
    }),
  ]);

  const groups = new Map<
    string,
    {
      subjectId: string;
      subject: string;
      topic: string;
      lectureCount: number;
      lectureTitles: string[];
    }
  >();

  for (const lecture of lectures) {
    const topic = lecture.topic?.trim() || "Single lectures";
    const key = `${lecture.subjectId}::${topic.toLowerCase()}`;
    const group =
      groups.get(key) ??
      {
        subjectId: lecture.subjectId,
        subject: lecture.subject.title,
        topic,
        lectureCount: 0,
        lectureTitles: [],
      };
    group.lectureCount += 1;
    group.lectureTitles.push(lecture.title);
    groups.set(key, group);
  }

  return NextResponse.json({
    subjects: subjects.map((subject) => ({
      id: subject.id,
      title: subject.title,
      slug: subject.slug,
    })),
    topicGroups: [...groups.values()].sort(
      (a, b) => a.subject.localeCompare(b.subject) || a.topic.localeCompare(b.topic),
    ),
  });
}
