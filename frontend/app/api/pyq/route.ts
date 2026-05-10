import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { uploadBuffer } from "@/lib/supabase-admin";
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
  const subjectRow = await resolveSubject(prisma, form.get("subject") ? String(form.get("subject")) : null);
  const topic = form.get("topic") ? String(form.get("topic")) : null;
  const difficulty = form.get("difficulty") ? String(form.get("difficulty")) : null;
  const file = form.get("file");

  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "PDF required" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const name = ((file as File).name || "paper.pdf").replace(/[^\w.\-]+/g, "_");
  const path = `${userId}/pyq/${year}_${kind}_${Date.now()}_${name}`;

  try {
    await uploadBuffer({ bucket: "pyq", path, body: buf, contentType: "application/pdf" });
  } catch {
    return NextResponse.json(
      {
        error: "Upload failed. Ensure Supabase bucket `pyq` exists and credentials are set.",
      },
      { status: 503 },
    );
  }

  const existing = await prisma.pyqPaper.findUnique({
    where: { userId_year_subjectId: { userId, year, subjectId: subjectRow.id } },
  });

  let paper;
  if (existing) {
    paper = await prisma.pyqPaper.update({
      where: { id: existing.id },
      data: {
        ...(kind === "question" && { questionPdfPath: path }),
        ...(kind === "solution" && { solutionPdfPath: path }),
        ...(kind === "key" && { answerKeyPdfPath: path }),
        ...(topic !== null && { topic }),
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
        topic,
        difficulty,
        questionPdfPath: kind === "question" ? path : null,
        solutionPdfPath: kind === "solution" ? path : null,
        answerKeyPdfPath: kind === "key" ? path : null,
      },
      include: { subject: true },
    });
  }

  return NextResponse.json({
    ok: true,
    paper: {
      ...paper,
      subject: paper.subject.title,
    },
  });
}
