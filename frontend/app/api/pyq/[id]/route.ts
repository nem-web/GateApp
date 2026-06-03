import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const paper = await prisma.pyqPaper.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!paper) {
    return NextResponse.json({ error: "PYQ not found" }, { status: 404 });
  }

  await prisma.pyqPaper.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
