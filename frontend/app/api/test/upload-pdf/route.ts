import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'Missing form field \"file\"' }, { status: 400 });
  }

  const fileNameRaw = form.get("title");
  const fileName =
    typeof fileNameRaw === "string" && fileNameRaw.trim()
      ? fileNameRaw.trim()
      : ("name" in file && typeof (file as File).name === "string"
        ? (file as File).name
        : "questions.pdf");

  const mimeType = file.type || "application/pdf";
  const sizeBytes = file.size;
  const kindRaw = form.get("kind");
  const kind =
    kindRaw === "answer_key" || kindRaw === "question"
      ? String(kindRaw)
      : "question";

  if (!mimeType.includes("pdf")) {
    return NextResponse.json({ error: "Only PDF uploads are supported in this skeleton." }, { status: 400 });
  }

  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.testPaperUpload.create({
    data: {
      userId,
      kind,
      storagePath: "unstored",
      fileName: typeof fileName === "string" ? fileName : "upload.pdf",
      parsed: false,
      metadata: { mimeType, sizeBytes, status: "received", kind },
    },
  });

  return NextResponse.json({
    ok: true,
    message: "PDF metadata recorded; binary storage & parsing are still TODO.",
    fileName,
    sizeBytes,
    status: "received",
    nextSteps: [
      "Persist bytes to Supabase Storage / Blob",
      "Extract MCQs → `Question` + `TestPack` rows",
    ],
  });
}
