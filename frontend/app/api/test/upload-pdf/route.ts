import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/session";

/**
 * Skeleton: accepts a PDF of questions. Later: OCR / LLM extraction → Question rows.
 * Vercel serverless has payload limits (~4.5MB on hobby) — large PDFs may need direct Blob upload + webhook.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing file field \"file\"" }, { status: 400 });
  }

  const fileName = (form.get("title") as string) || "questions.pdf";
  const mimeType = file.type || "application/pdf";
  const sizeBytes = file.size;

  if (!mimeType.includes("pdf")) {
    return NextResponse.json({ error: "Only PDF uploads are supported in this skeleton." }, { status: 400 });
  }

  const userId = await getEffectiveUserId();
  if (!userId) {
    return NextResponse.json({
      ok: true,
      message:
        "PDF received (demo mode — database not configured). Wire DATABASE_URL on Vercel to persist uploads.",
      fileName,
      sizeBytes,
      status: "queued_stub",
      nextSteps: [
        "Phase 2: store file in Vercel Blob / S3",
        "Phase 3: extract text (pdf-parse) or vision LLM",
        "Phase 4: insert Question rows",
      ],
    });
  }

  try {
    await prisma.testPdfUpload.create({
      data: {
        userId,
        fileName: typeof fileName === "string" ? fileName : "upload.pdf",
        mimeType,
        sizeBytes,
        status: "received",
      },
    });
    return NextResponse.json({
      ok: true,
      message: "PDF recorded. Question extraction is not implemented yet — this is a placeholder pipeline.",
      fileName,
      sizeBytes,
      status: "received",
      nextSteps: [
        "Implement Blob storage for the binary",
        "Parse PDF → text → structured MCQs",
        "Attach to a Test record for “Give test”",
      ],
    });
  } catch {
    return NextResponse.json({
      ok: true,
      message: "PDF accepted but metadata could not be saved (DB error).",
      fileName,
      sizeBytes,
      status: "accepted_no_db",
    });
  }
}
