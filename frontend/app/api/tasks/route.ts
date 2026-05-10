import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/session";

export async function GET() {
  try {
    const userId = await getEffectiveUserId();
    if (!userId) return NextResponse.json([]);
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const userId = await getEffectiveUserId();
  if (!userId) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
  const body = await req.json();
  const task = await prisma.task.create({
    data: {
      userId,
      title: body.title,
      priority: body.priority ?? "medium",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      subjectTag: body.subjectTag ?? null,
      repeat: body.repeat ?? null,
    },
  });
  return NextResponse.json(task);
}
