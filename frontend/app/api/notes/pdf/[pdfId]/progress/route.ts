import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function PATCH(req: Request, ctx: { params: Promise<{ pdfId: string }> }) {
  const { pdfId } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const lastPage = Math.max(1, Number(body.lastPage ?? 1));

  const pdf = await prisma.notePdf.findFirst({ where: { id: pdfId, userId } });
  if (!pdf) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.pdfReadingProgress.upsert({
    where: { userId_notePdfId: { userId, notePdfId: pdfId } },
    update: { lastPage },
    create: { userId, notePdfId: pdfId, lastPage },
  });

  if (pdf.noteId) {
    await prisma.note.update({
      where: { id: pdf.noteId },
      data: { readingLastPage: lastPage },
    });
  }

  return NextResponse.json({ ok: true, lastPage });
}
