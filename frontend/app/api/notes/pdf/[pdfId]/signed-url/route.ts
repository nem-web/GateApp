import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { getSignedUrl } from "@/lib/supabase-admin";

export async function GET(_req: Request, ctx: { params: Promise<{ pdfId: string }> }) {
  const { pdfId } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pdf = await prisma.notePdf.findFirst({ where: { id: pdfId, userId } });
  if (!pdf) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const url = await getSignedUrl("notes", pdf.storagePath, 3600);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Could not sign URL" }, { status: 503 });
  }
}
