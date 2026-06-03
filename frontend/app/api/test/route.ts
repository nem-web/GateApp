import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const packs = await prisma.testPack.findMany({
    where: {
      questions: {
        some: { userId },
      },
    },
    include: {
      questions: {
        where: { userId },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        include: { subject: true },
      },
      attempts: {
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const uploads = await prisma.testPaperUpload.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const uploadBySlug = new Map<string, (typeof uploads)[number]>();
  for (const upload of uploads) {
    const meta = upload.metadata;
    if (!meta || typeof meta !== "object" || Array.isArray(meta)) continue;
    const slug = (meta as Record<string, unknown>).testPackSlug;
    if (typeof slug === "string" && !uploadBySlug.has(slug)) uploadBySlug.set(slug, upload);
  }

  const tests = packs
    .map((pack) => {
      const pending = pack.questions.some((q) => q.source === "pdf_upload_pending_key");
      const latestUpload = uploadBySlug.get(pack.slug);
      return {
        slug: pack.slug,
        title: pack.title,
        durationMinutes: pack.durationMinutes,
        questionCount: pack.questions.length,
        answerKeyBound: pack.questions.length > 0 && !pending,
        status: pending ? "needs_answer_key" : "ready",
        subjects: [...new Set(pack.questions.map((q) => q.subject.title))].slice(0, 4),
        lastAttempt: pack.attempts[0]
          ? {
              score: pack.attempts[0].score,
              totalQuestions: pack.attempts[0].totalQuestions,
              accuracy: pack.attempts[0].accuracy,
              createdAt: pack.attempts[0].createdAt,
            }
          : null,
        createdAt: latestUpload?.createdAt ?? null,
      };
    })
    .sort((a, b) => {
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bt - at || a.title.localeCompare(b.title);
    });

  return NextResponse.json({ tests });
}

