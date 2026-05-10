import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function POST(req: Request, ctx: { params: Promise<{ pdfId: string }> }) {
  const { pdfId } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pdf = await prisma.notePdf.findFirst({ where: { id: pdfId, userId } });
  if (!pdf) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const page = Math.max(1, Number(body.page ?? 1));
  const payload = body.payload ?? {};

  const row = await prisma.noteAnnotation.upsert({
    where: {
      notePdfId_page: { notePdfId: pdfId, page },
    },
    update: { payload },
    create: { notePdfId: pdfId, page, payload },
  });

  return NextResponse.json(row);
}
