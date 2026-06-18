import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { GATE_EE_WEIGHTAGE_PROMPT } from "@/lib/gate-ee";
import { byteLength, requireMemoryQuota } from "@/lib/memory-quota";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { checkFeatureLimit, quotaResponse } from "@/lib/subscription";
import { slugFromTitle } from "@/lib/test-pdf";

type SourceMode = "pyq" | "ai";
type TopicMode = "all_done" | "topic";

type ValidQuestion = {
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  topic: string;
  difficulty?: string | null;
  year?: number | null;
};

const MAX_QUESTION_COUNT = 65;
const MIN_QUESTION_COUNT = 1;
const MIN_DURATION = 5;
const MAX_DURATION = 360;

function clampInt(value: unknown, fallback: number, min: number, max: number) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeSourceMode(value: unknown): SourceMode {
  return value === "pyq" ? "pyq" : "ai";
}

function normalizeTopicMode(value: unknown): TopicMode {
  return value === "topic" ? "topic" : "all_done";
}

function extractJsonArray(text: string): unknown[] | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  const candidates = [fenced, trimmed, trimmed.match(/\[[\s\S]*\]/)?.[0]].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object") {
        const questions = (parsed as { questions?: unknown }).questions;
        if (Array.isArray(questions)) return questions;
      }
    } catch {
      /* try the next candidate */
    }
  }

  return null;
}

function optionIndex(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 3) return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  if (/^[A-D]$/.test(normalized)) return normalized.charCodeAt(0) - 65;
  const number = Number(normalized);
  if (Number.isInteger(number) && number >= 0 && number <= 3) return number;
  if (Number.isInteger(number) && number >= 1 && number <= 4) return number - 1;
  return null;
}

function normalizeAIQuestions(raw: unknown[], fallbackTopic: string, limit: number): ValidQuestion[] {
  const questions: ValidQuestion[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const promptRaw = row.prompt ?? row.question ?? row.text;
    const optionsRaw = row.options;
    const correctRaw = row.correctOptionIndex ?? row.correctIndex ?? row.answerIndex ?? row.correct ?? row.answer;

    if (typeof promptRaw !== "string" || !Array.isArray(optionsRaw)) continue;
    const prompt = promptRaw.trim();
    const options = optionsRaw.map((option) => String(option ?? "").trim()).slice(0, 4);
    const correctOptionIndex = optionIndex(correctRaw);

    if (prompt.length < 20) continue;
    if (options.length !== 4 || options.some((option) => option.length < 1)) continue;
    if (correctOptionIndex == null) continue;

    questions.push({
      prompt,
      options,
      correctOptionIndex,
      topic: typeof row.topic === "string" && row.topic.trim() ? row.topic.trim() : fallbackTopic,
      difficulty: typeof row.difficulty === "string" && row.difficulty.trim() ? row.difficulty.trim() : "GATE",
    });

    if (questions.length >= limit) break;
  }

  return questions;
}

async function completedLectureScope(userId: string, subjectId: string, topicMode: TopicMode, topic: string) {
  const lectures = await prisma.lecture.findMany({
    where: {
      userId,
      subjectId,
      ...(topicMode === "topic" ? { topic } : {}),
      watches: { some: { userId, completed: true } },
    },
    orderBy: { createdAt: "asc" },
    include: { subject: true },
  });

  return lectures;
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const subjectId = typeof body.subjectId === "string" ? body.subjectId.trim() : "";
    const sourceMode = normalizeSourceMode(body.sourceMode);
    const topicMode = normalizeTopicMode(body.topicMode);
    const requestedTopic = typeof body.topic === "string" ? body.topic.trim() : "";
    const questionCount = clampInt(body.questionCount, 10, MIN_QUESTION_COUNT, MAX_QUESTION_COUNT);
    const durationMinutes = clampInt(body.durationMinutes, 30, MIN_DURATION, MAX_DURATION);
    const featureLimit = await checkFeatureLimit(userId, "mock_tests");
    if (!featureLimit.ok) return quotaResponse(featureLimit);

    const subject = subjectId
      ? await prisma.subject.findUnique({ where: { id: subjectId } })
      : null;
    if (!subject) return NextResponse.json({ error: "Choose a valid subject." }, { status: 400 });

    if (topicMode === "topic" && !requestedTopic) {
      return NextResponse.json({ error: "Choose a completed topic/chapter." }, { status: 400 });
    }

    const lectures = await completedLectureScope(userId, subject.id, topicMode, requestedTopic);
    if (lectures.length === 0) {
      return NextResponse.json(
        { error: "No completed lectures found for this selection. Complete lectures first, then make a test." },
        { status: 400 },
      );
    }

    const scopeTopic = topicMode === "topic" ? requestedTopic : "Complete till lectures done";
    let questions: ValidQuestion[] = [];

    if (sourceMode === "pyq") {
      const candidateQuestions = await prisma.question.findMany({
        where: {
          userId,
          subjectId: subject.id,
          source: { in: ["pdf_upload", "test_maker_pyq"] },
          ...(topicMode === "topic" ? { topic: requestedTopic } : {}),
          options: { isEmpty: false },
        },
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        take: questionCount * 3,
      });

      questions = candidateQuestions
        .filter((question) => question.options.length === 4)
        .slice(0, questionCount)
        .map((question) => ({
          prompt: question.prompt,
          options: [...question.options],
          correctOptionIndex: question.correctOptionIndex,
          topic: question.topic,
          difficulty: question.difficulty,
          year: question.year,
        }));

      if (questions.length < questionCount) {
        return NextResponse.json(
          {
            error: `Not enough parsed PYQ questions for this selection. Found ${questions.length}, need ${questionCount}. Upload/parse more question papers or use AI created mode.`,
          },
          { status: 400 },
        );
      }
    } else {
      const lectureTitles = lectures.map((lecture) => lecture.title).slice(0, 80);
      const prompt = `Create ${questionCount} original GATE Electrical Engineering standard MCQs.
Return ONLY valid JSON as an array. No markdown. Each item must be:
{"prompt":"...","options":["A","B","C","D"],"correctOptionIndex":0,"topic":"...","difficulty":"easy|medium|hard"}

Subject: ${subject.title}
Scope: ${scopeTopic}
Completed lecture titles to stay within: ${JSON.stringify(lectureTitles)}
GATE EE weightage context: ${GATE_EE_WEIGHTAGE_PROMPT}

Rules:
- Questions must be at actual GATE exam standard for EE.
- Do not ask questions outside the completed lecture scope.
- Use numerical/conceptual questions where appropriate.
- Exactly 4 options per question.
- correctOptionIndex must be 0, 1, 2, or 3.
- Do not include explanations.`;

      const result = await callAI(userId, "test-maker-ai", prompt);
      if (!result.ok) {
        const quotaExceeded = "quotaExceeded" in result && result.quotaExceeded;
        return NextResponse.json(
          {
            error: result.content,
            ...(quotaExceeded && {
              quotaExceeded: true,
              upgradeRequired: true,
              billingUrl: "/api/billing/checkout",
            }),
          },
          { status: quotaExceeded ? 402 : result.unavailable ? 503 : 500 },
        );
      }

      const raw = extractJsonArray(result.content);
      questions = raw ? normalizeAIQuestions(raw, scopeTopic, questionCount) : [];
      if (questions.length < questionCount) {
        return NextResponse.json(
          {
            error: `AI returned ${questions.length} valid question${questions.length === 1 ? "" : "s"}; needed ${questionCount}. No test was saved.`,
          },
          { status: 502 },
        );
      }
    }

    const title = `${subject.title} - ${sourceMode === "pyq" ? "PYQ based" : "AI"} test`;
    const payloadSize = byteLength(JSON.stringify({ title, questions }));
    const quotaError = await requireMemoryQuota(userId, payloadSize);
    if (quotaError) return quotaError;

    const pack = await prisma.testPack.create({
      data: {
        slug: `${slugFromTitle(title)}-${Date.now().toString(36)}`,
        title,
        durationMinutes,
      },
    });

    await prisma.question.createMany({
      data: questions.map((question) => ({
        testPackId: pack.id,
        userId,
        subjectId: subject.id,
        topic: question.topic,
        prompt: question.prompt,
        type: "mcq",
        options: question.options,
        correctOptionIndex: question.correctOptionIndex,
        difficulty: question.difficulty ?? null,
        year: question.year ?? null,
        source: sourceMode === "pyq" ? "test_maker_pyq" : "test_maker_ai",
      })),
    });

    return NextResponse.json({
      ok: true,
      message: "Test created and loaded.",
      test: {
        slug: pack.slug,
        title: pack.title,
        durationMinutes: pack.durationMinutes,
        questionCount: questions.length,
        answerKeyBound: true,
        status: "ready",
      },
    });
  } catch (error) {
    console.error("Test maker failed", error);
    const message = error instanceof Error ? error.message : "Test maker failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
