import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { GATE_EXAM_DATE_ISO } from "@/lib/gate-ee";

export async function GET() {
  const userId = await getSessionUserId();
  const session = await getServerSession(authOptions);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      weakSubjectLinks: {
        include: { subject: true },
        orderBy: { priority: "desc" },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const gateDate = user.gateDate?.toISOString() ?? GATE_EXAM_DATE_ISO;

  return NextResponse.json({
    id: userId,
    isAuthenticated: Boolean(session?.user?.id),
    name: user.name,
    email: user.email ?? session?.user?.email ?? null,
    branch: user.branch ?? "EE",
    gateDate,
    targetExam: user.streamLabel ?? "GATE - EE",
    streamLabel: user.streamLabel ?? "GATE - EE",
    hoursPerDay: user.hoursPerDay ?? 4,
    weakSubjects: user.weakSubjectLinks.map((l) => l.subject.title),
    telegramLinked: Boolean(user.telegramChatId),
    telegramUsername: user.telegramUsername ?? null,
    telegramLinkedAt: user.telegramLinkedAt?.toISOString() ?? null,
  });
}
