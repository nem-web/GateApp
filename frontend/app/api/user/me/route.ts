import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserId } from "@/lib/session";

export async function GET() {
  const userId = await getEffectiveUserId();
  const session = await getServerSession(authOptions);

  if (!userId) {
    return NextResponse.json({
      id: "offline",
      name: session?.user?.name ?? "Demo Student",
      email: session?.user?.email ?? null,
      branch: "CSE",
      gateDate: new Date("2025-02-01").toISOString(),
      targetExam: "GATE — CS",
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return NextResponse.json({
    id: userId,
    name: user?.name ?? session?.user?.name ?? "Demo Student",
    email: user?.email ?? session?.user?.email ?? null,
    branch: user?.branch ?? "CSE",
    gateDate: user?.gateDate?.toISOString() ?? null,
    targetExam: user?.branch ? `GATE — ${user.branch}` : "GATE — CS",
  });
}
