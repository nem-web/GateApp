import { NextResponse } from "next/server";
import { byteLength, requireMemoryQuota } from "@/lib/memory-quota";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";
import { checkFeatureLimit, quotaResponse } from "@/lib/subscription";

function cardPayload(c: {
  id: string;
  userId: string;
  noteId: string | null;
  subjectId: string;
  topic: string | null;
  front: string;
  back: string;
  nextReview: Date;
  easeFactor: number;
  interval: number;
  repetitions: number;
  mastered: boolean;
  source: string;
  subject?: { title: string };
}) {
  return {
    ...c,
    subject: c.subject?.title,
  };
}

export async function GET(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const dueOnly = searchParams.get("due") === "1";
  const now = new Date();

  const cards = await prisma.flashcard.findMany({
    where: {
      userId,
      ...(dueOnly ? { mastered: false, nextReview: { lte: now } } : {}),
    },
    orderBy: dueOnly ? { nextReview: "asc" } : { updatedAt: "desc" },
    take: dueOnly ? 50 : 100,
    include: { subject: true },
  });

  return NextResponse.json({ cards: cards.map(cardPayload) });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const featureLimit = await checkFeatureLimit(userId, "flashcards");
  if (!featureLimit.ok) return quotaResponse(featureLimit);
  const incomingBytes = byteLength(
    [
      body.front ?? "",
      body.back ?? "",
      body.topic ?? "",
      body.source ?? "manual",
    ].map(String).join(""),
  );
  const quotaError = await requireMemoryQuota(userId, incomingBytes);
  if (quotaError) return quotaError;

  const subject = await resolveSubject(prisma, typeof body.subject === "string" ? body.subject : null);
  const card = await prisma.flashcard.create({
    data: {
      userId,
      noteId: body.noteId ?? null,
      subjectId: subject.id,
      topic: body.topic ? String(body.topic) : null,
      front: String(body.front ?? ""),
      back: String(body.back ?? ""),
      source: String(body.source ?? "manual"),
      nextReview: new Date(),
    },
    include: { subject: true },
  });
  return NextResponse.json(cardPayload(card));
}
