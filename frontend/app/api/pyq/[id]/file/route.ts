import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { isLocalStoragePath, readLocalUpload } from "@/lib/local-upload-storage";

function pathForKind(
  paper: { questionPdfPath: string | null; solutionPdfPath: string | null; answerKeyPdfPath: string | null },
  which: string,
) {
  if (which === "solution") return paper.solutionPdfPath;
  if (which === "key") return paper.answerKeyPdfPath;
  return paper.questionPdfPath;
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const which = searchParams.get("which") ?? "question";
  const paper = await prisma.pyqPaper.findFirst({ where: { id, userId } });
  if (!paper) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const storagePath = pathForKind(paper, which);
  if (!storagePath) return NextResponse.json({ error: "PDF not uploaded for this slot" }, { status: 404 });
  if (!isLocalStoragePath(storagePath)) {
    return NextResponse.json({ error: "PDF is stored externally" }, { status: 400 });
  }

  try {
    const bytes = await readLocalUpload(storagePath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${which}.pdf"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF file not found on local storage" }, { status: 404 });
  }
}
