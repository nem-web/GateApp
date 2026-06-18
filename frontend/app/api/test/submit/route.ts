import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { GATE_EE_SAMPLE_PACK_SLUG } from "@/lib/test-packs";
import { touchStreakDay } from "@/lib/streak-touch";
import { checkFeatureLimit, quotaResponse } from "@/lib/subscription";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const featureLimit = await checkFeatureLimit(userId, "mock_tests");
  if (!featureLimit.ok) return quotaResponse(featureLimit);

  try {
    const body = await req.json();
    const packSlug =
      typeof body.packSlug === "string" && body.packSlug.trim()
        ? String(body.packSlug)
        : GATE_EE_SAMPLE_PACK_SLUG;

    const pack = await prisma.testPack.findUnique({
      where: { slug: packSlug },
      include: {
        questions: {
          orderBy: [{ createdAt: "asc" }, { id: "asc" }],
          include: { subject: true },
        },
      },
    });

    if (!pack || pack.questions.length === 0) {
      return NextResponse.json({ error: "Test pack unavailable" }, { status: 404 });
    }

    if (pack.slug !== GATE_EE_SAMPLE_PACK_SLUG && !pack.questions.some((q) => q.userId === userId)) {
      return NextResponse.json({ error: "Test pack unavailable" }, { status: 404 });
    }

    if (pack.questions.some((q) => q.source === "pdf_upload_pending_key")) {
      return NextResponse.json(
        { error: "Upload and bind the answer key before taking this test." },
        { status: 400 },
      );
    }

    const answersRaw = Array.isArray(body.answers) ? body.answers.map(Number) : [];
    const questions = pack.questions;

    let score = 0;
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};
    const weakTopics: string[] = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]!;
      const picked = answersRaw[i];
      const ok = Number.isFinite(picked) && picked === q.correctOptionIndex;
      if (ok) score += 1;

      const key = `${q.subject.title}::${q.topic}`;
      if (!topicBreakdown[key]) topicBreakdown[key] = { correct: 0, total: 0 };
      topicBreakdown[key].total += 1;
      if (ok) topicBreakdown[key].correct += 1;

      await prisma.topicPerformance.upsert({
        where: {
          userId_subjectId: { userId, subjectId: q.subjectId },
        },
        update: {
          attempts: { increment: 1 },
          correct: { increment: ok ? 1 : 0 },
        },
        create: {
          userId,
          subjectId: q.subjectId,
          attempts: 1,
          correct: ok ? 1 : 0,
        },
      });
    }

    const totalQuestions = questions.length;
    const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    Object.entries(topicBreakdown).forEach(([k, v]) => {
      const pct = v.total ? (v.correct / v.total) * 100 : 0;
      if (pct < 50 && v.total > 0) weakTopics.push(k.replace("::", " — "));
    });

    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        testPackId: pack.id,
        title:
          typeof body.title === "string" && body.title.trim().length > 0
            ? body.title.trim()
            : pack.title,
        score,
        totalQuestions,
        timeTakenSeconds: Math.max(0, Number(body.timeTakenSeconds ?? 0)),
        correctIndices: questions.map((q) => q.correctOptionIndex),
        userAnswers: answersRaw,
        topicBreakdown,
        weakTopics,
        accuracy,
      },
    });

    await touchStreakDay(prisma, userId);

    return NextResponse.json({
      attempt,
      weakTopics,
      accuracy,
      score,
      totalQuestions,
      comparisons: questions.map((q, i) => ({
        questionId: q.id,
        subject: q.subject.title,
        topic: q.topic,
        correctAnswerIndex: q.correctOptionIndex,
        userAnswerIndex: Number.isFinite(answersRaw[i]) ? answersRaw[i] : null,
        ok: Number.isFinite(answersRaw[i]) && answersRaw[i] === q.correctOptionIndex,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Submit failed" }, { status: 500 });
  }
}
