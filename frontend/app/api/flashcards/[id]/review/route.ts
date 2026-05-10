import { NextResponse } from "next/server";
import { addDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { scheduleFlashcard } from "@/lib/sm2";
import { touchStreakDay } from "@/lib/streak-touch";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const grade = Math.min(3, Math.max(0, Number(body.grade ?? 2)));

  const card = await prisma.flashcard.findFirst({
    where: { id, userId },
    include: { subject: true },
  });
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const next = scheduleFlashcard({
    grade,
    repetitions: card.repetitions,
    easeFactor: card.easeFactor,
    interval: card.interval,
  });

  const nextReview = addDays(new Date(), Math.max(1, next.interval));

  await prisma.flashcardReview.create({
    data: {
      flashcardId: id,
      userId,
      grade,
      intervalDays: next.interval,
      easeAfter: next.easeFactor,
    },
  });

  const updated = await prisma.flashcard.update({
    where: { id },
    data: {
      repetitions: next.repetitions,
      easeFactor: next.easeFactor,
      interval: next.interval,
      mastered: next.mastered,
      nextReview,
    },
    include: { subject: true },
  });

  await touchStreakDay(prisma, userId);

  return NextResponse.json({
    ...updated,
    subject: updated.subject.title,
  });
}
