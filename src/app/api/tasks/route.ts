import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const userId = "demo-user";

export async function GET() {
  const tasks = await prisma.task.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const task = await prisma.task.create({
    data: {
      userId,
      title: body.title,
      priority: body.priority ?? "medium",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      subjectTag: body.subjectTag ?? null,
      repeat: body.repeat ?? null
    }
  });
  return NextResponse.json(task);
}
