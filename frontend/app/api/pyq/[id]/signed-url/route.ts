import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { getSignedUrl } from "@/lib/supabase-admin";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const which = searchParams.get("which") ?? "question";

  const paper = await prisma.pyqPaper.findFirst({ where: { id, userId } });
  if (!paper) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const path =
    which === "solution"
      ? paper.solutionPdfPath
      : which === "key"
        ? paper.answerKeyPdfPath
        : paper.questionPdfPath;

  if (!path) return NextResponse.json({ error: "PDF not uploaded for this slot" }, { status: 404 });

  try {
    const url = await getSignedUrl("pyq", path, 3600);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Could not sign URL" }, { status: 503 });
  }
}
