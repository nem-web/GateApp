import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lecture = await prisma.lecture.findFirst({ where: { id, userId } });
  if (!lecture) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.lecture.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
