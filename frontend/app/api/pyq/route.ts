import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { toLocalStoragePath, writeLocalUpload } from "@/lib/local-upload-storage";
import { getSupabaseAdmin, uploadBuffer } from "@/lib/supabase-admin";
import { resolveSubject } from "@/lib/subject-resolve";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.pyqPaper.findMany({
    where: { userId },
    orderBy: [{ year: "desc" }, { subject: { title: "asc" } }],
    include: { subject: true },
  });

  const papers = rows.map((p) => ({
    id: p.id,
    userId: p.userId,
    year: p.year,
    subjectId: p.subjectId,
    subject: p.subject.title,
    topic: p.topic,
    difficulty: p.difficulty,
    questionPdfPath: p.questionPdfPath,
    solutionPdfPath: p.solutionPdfPath,
    answerKeyPdfPath: p.answerKeyPdfPath,
    createdAt: p.createdAt,
  }));

  return NextResponse.json({ papers });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();

  const kind = String(form.get("kind") ?? "question");
  const year = Number(form.get("year") ?? new Date().getFullYear());
  const subjectRow = await resolveSubject(prisma, "Engineering Mathematics");
  const difficulty = form.get("difficulty") ? String(form.get("difficulty")) : null;
  const file = form.get("file");

  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "PDF required" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const name = ((file as File).name || "paper.pdf").replace(/[^\w.\-]+/g, "_");
  const relativePath = `${userId}/pyq/${year}_${kind}_${Date.now()}_${name}`;
  let storagePath = relativePath;
  let storageProvider: "supabase" | "local" = "supabase";

  if (getSupabaseAdmin()) {
    try {
      await uploadBuffer({ bucket: "pyq", path: relativePath, body: buf, contentType: "application/pdf" });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? `Supabase Storage upload failed: ${error.message}`
              : "Supabase Storage upload failed.",
        },
        { status: 503 },
      );
    }
  } else {
    await writeLocalUpload(relativePath, buf);
    storagePath = toLocalStoragePath(relativePath);
    storageProvider = "local";
  }

  const existing = await prisma.pyqPaper.findUnique({
    where: { userId_year_subjectId: { userId, year, subjectId: subjectRow.id } },
  });

  let paper;
  if (existing) {
    paper = await prisma.pyqPaper.update({
      where: { id: existing.id },
      data: {
        ...(kind === "question" && { questionPdfPath: storagePath }),
        ...(kind === "solution" && { solutionPdfPath: storagePath }),
        ...(kind === "key" && { answerKeyPdfPath: storagePath }),
        topic: null,
        ...(difficulty !== null && { difficulty }),
      },
      include: { subject: true },
    });
  } else {
    paper = await prisma.pyqPaper.create({
      data: {
        userId,
        year,
        subjectId: subjectRow.id,
        topic: null,
        difficulty,
        questionPdfPath: kind === "question" ? storagePath : null,
        solutionPdfPath: kind === "solution" ? storagePath : null,
        answerKeyPdfPath: kind === "key" ? storagePath : null,
      },
      include: { subject: true },
    });
  }

  return NextResponse.json({
    ok: true,
    storageProvider,
    paper: {
      ...paper,
      subject: paper.subject.title,
    },
  });
}
