import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { isLocalStoragePath, readLocalUpload } from "@/lib/local-upload-storage";

export async function GET(_req: Request, ctx: { params: Promise<{ pdfId: string }> }) {
  const { pdfId } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pdf = await prisma.notePdf.findFirst({ where: { id: pdfId, userId } });
  if (!pdf) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!isLocalStoragePath(pdf.storagePath)) {
    return NextResponse.json({ error: "PDF is stored externally" }, { status: 400 });
  }

  try {
    const bytes = await readLocalUpload(pdf.storagePath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${pdf.fileName.replace(/"/g, "")}"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF file not found on local storage" }, { status: 404 });
  }
}
