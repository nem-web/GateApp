import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";
import { touchStreakDay } from "@/lib/streak-touch";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const existing = await prisma.task.findFirst({ where: { id, userId }, include: { subject: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

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

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(body.title != null && { title: body.title }),
      ...(body.priority != null && { priority: body.priority }),
      ...(body.completed != null && { completed: Boolean(body.completed) }),
      ...(body.dueDate !== undefined && {
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      }),
      ...(subjectId !== undefined && { subjectId }),
      ...(body.topicTag !== undefined && {
        topicTag: body.topicTag ? String(body.topicTag) : null,
      }),
    },
    include: { subject: true },
  });

  if (body.completed === true && !existing.completed) {
    await touchStreakDay(prisma, userId);
  }

  return NextResponse.json({
    ...task,
    subjectTag: task.subject?.title ?? task.topicTag,
    subjectTitle: task.subject?.title ?? null,
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
