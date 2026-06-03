import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";
import {
  extractPdfText,
  parseAnswerKeyFromText,
  parseQuestionsFromText,
  slugFromTitle,
} from "@/lib/test-pdf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'Missing form field "file"' }, { status: 400 });
  }

  const fileNameRaw = form.get("title");
  const fileName =
    typeof fileNameRaw === "string" && fileNameRaw.trim()
      ? fileNameRaw.trim()
      : "name" in file && typeof (file as File).name === "string"
        ? (file as File).name
        : "questions.pdf";

  const mimeType = file.type || "application/pdf";
  const sizeBytes = file.size;
  const kindRaw = form.get("kind");
  const kind = kindRaw === "answer_key" || kindRaw === "question" ? String(kindRaw) : "question";
  const requestedDuration = Math.max(5, Math.min(360, Number(form.get("durationMinutes") ?? 0) || 0));

  if (!mimeType.includes("pdf")) {
    return NextResponse.json({ error: "Only PDF uploads are supported." }, { status: 400 });
  }

  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const extractedText = await extractPdfText(bytes);
  if (!extractedText.trim()) {
    return NextResponse.json(
      { error: "Could not read text from this PDF. Scanned/image PDFs need OCR before import." },
      { status: 400 },
    );
  }

  if (kind === "question") {
    const questions = parseQuestionsFromText(extractedText);
    if (questions.length === 0) {
      return NextResponse.json(
        {
          error:
            "No MCQs were detected. Use a text-based PDF with questions like `1. ...` and options `A. ...` through `D. ...`.",
        },
        { status: 400 },
      );
    }

    const title = fileName.replace(/\.pdf$/i, "").trim() || "Uploaded test";
    const pack = await prisma.testPack.create({
      data: {
        slug: `${slugFromTitle(title)}-${Date.now().toString(36)}`,
        title,
        durationMinutes: requestedDuration || Math.max(15, Math.min(180, questions.length * 2)),
      },
    });

    for (const q of questions) {
      const subject = await resolveSubject(prisma, q.subject);
      await prisma.question.create({
        data: {
          testPackId: pack.id,
          userId,
          subjectId: subject.id,
          topic: q.topic,
          prompt: q.prompt,
          type: "mcq",
          options: q.options,
          correctOptionIndex: 0,
          difficulty: null,
          source: "pdf_upload_pending_key",
        },
      });
    }

    await prisma.testPaperUpload.create({
      data: {
        userId,
        kind,
        storagePath: "parsed-from-pdf",
        fileName: typeof fileName === "string" ? fileName : "upload.pdf",
        parsed: true,
        metadata: {
          mimeType,
          sizeBytes,
          status: "questions_imported",
          kind,
          testPackSlug: pack.slug,
          testPackId: pack.id,
          questionCount: questions.length,
        },
      },
    });

    return NextResponse.json({
      ok: true,
      status: "questions_imported",
      message: "Question PDF converted into a saved test. Upload its answer key to make it ready.",
      test: {
        slug: pack.slug,
        title: pack.title,
        durationMinutes: pack.durationMinutes,
        questionCount: questions.length,
        answerKeyBound: false,
        status: "needs_answer_key",
      },
    });
  }

  const testPackSlugRaw = form.get("testPackSlug");
  const testPackSlug = typeof testPackSlugRaw === "string" ? testPackSlugRaw.trim() : "";
  if (!testPackSlug) {
    return NextResponse.json(
      { error: "Choose a question paper test before uploading the answer key." },
      { status: 400 },
    );
  }

  const pack = await prisma.testPack.findFirst({
    where: {
      slug: testPackSlug,
      questions: { some: { userId } },
    },
    include: {
      questions: {
        where: { userId },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      },
    },
  });

  if (!pack) return NextResponse.json({ error: "Test not found for this user." }, { status: 404 });

  const answers = parseAnswerKeyFromText(extractedText);
  if (answers.size === 0) {
    return NextResponse.json(
      { error: "No answer key entries were detected. Use a key like `1 A`, `2 B`, `3 C`." },
      { status: 400 },
    );
  }

  let bound = 0;
  for (let i = 0; i < pack.questions.length; i++) {
    const question = pack.questions[i]!;
    const answer = answers.get(i + 1);
    if (answer === undefined) continue;
    await prisma.question.update({
      where: { id: question.id },
      data: {
        correctOptionIndex: answer,
        source: "pdf_upload",
      },
    });
    bound += 1;
  }

  if (bound === 0) {
    return NextResponse.json(
      { error: "The answer key did not match this test's question numbers." },
      { status: 400 },
    );
  }

  const fullyBound = pack.questions.every((_, i) => answers.has(i + 1));

  await prisma.testPaperUpload.create({
    data: {
      userId,
      kind,
      storagePath: "parsed-from-pdf",
      fileName: typeof fileName === "string" ? fileName : "upload.pdf",
      parsed: true,
      metadata: {
        mimeType,
        sizeBytes,
        status: "answer_key_bound",
        kind,
        testPackSlug: pack.slug,
        testPackId: pack.id,
        answerCount: answers.size,
        boundCount: bound,
      },
    },
  });

  return NextResponse.json({
    ok: true,
    message: `Answer key bound to ${bound} question${bound === 1 ? "" : "s"}.`,
    fileName,
    sizeBytes,
    status: "answer_key_bound",
    test: {
      slug: pack.slug,
      title: pack.title,
      durationMinutes: pack.durationMinutes,
      questionCount: pack.questions.length,
      answerKeyBound: fullyBound,
      status: fullyBound ? "ready" : "needs_answer_key",
    },
  });
  } catch (error) {
    console.error("Test PDF upload failed", error);
    const message = error instanceof Error ? error.message : "Test PDF upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
