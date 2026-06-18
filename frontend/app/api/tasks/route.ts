import { NextResponse } from "next/server";
import { byteLength, requireMemoryQuota } from "@/lib/memory-quota";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { subject: true },
    });
    const payload = tasks.map(({ subject: subj, ...t }) => ({
      ...t,
      subjectTag: subj?.title ?? t.topicTag ?? null,
      subjectTitle: subj?.title ?? null,
    }));
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const quotaError = await requireMemoryQuota(
    userId,
    byteLength(
      [
        body.title ?? "Task",
        body.priority ?? "medium",
        body.topicTag ?? "",
        body.repeat ?? "",
      ].map(String).join(""),
    ),
  );
  if (quotaError) return quotaError;

  let subjectId: string | undefined;
  if (typeof body.subjectId === "string") {
    subjectId = body.subjectId;
  } else if (typeof body.subjectTag === "string" || typeof body.subject === "string") {
    const resolved = await resolveSubject(
      prisma,
      typeof body.subject === "string" ? body.subject : body.subjectTag,
    );
    subjectId = resolved.id;
  }

  const task = await prisma.task.create({
    data: {
      userId,
      title: String(body.title ?? "Task"),
      priority: body.priority ?? "medium",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      subjectId,
      topicTag: body.topicTag ?? null,
      repeat: body.repeat ?? null,
    },
    include: { subject: true },
  });

  return NextResponse.json({
    ...task,
    subjectTag: task.subject?.title ?? task.topicTag,
    subjectTitle: task.subject?.title ?? null,
  });
}
