import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/session";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getEffectiveUserId();
  if (!userId) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const body = await req.json();
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(body.title != null && { title: body.title }),
      ...(body.priority != null && { priority: body.priority }),
      ...(body.completed != null && { completed: Boolean(body.completed) }),
      ...(body.dueDate !== undefined && {
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      }),
    },
  });
  return NextResponse.json(task);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getEffectiveUserId();
  if (!userId) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
