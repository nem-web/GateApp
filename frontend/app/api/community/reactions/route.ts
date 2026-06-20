import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { rateLimitUserAction } from "@/lib/content-utils";

const targetTypes = new Set(["BLOG", "VLOG", "RESOURCE", "COMMENT"]);
const values = new Set(["LIKE", "UPVOTE", "DOWNVOTE"]);

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const targetType = String(body.targetType ?? "");
  const targetId = String(body.targetId ?? "");
  const value = String(body.value ?? "LIKE");
  if (!targetTypes.has(targetType) || !targetId || !values.has(value)) {
    return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
  }
  if (!(await rateLimitUserAction(userId, "reaction", 60))) {
    return NextResponse.json({ error: "Too many reactions. Please try again later." }, { status: 429 });
  }
  const reaction = await prisma.contentReaction.upsert({
    where: { userId_targetType_targetId: { userId, targetType: targetType as never, targetId } },
    update: { value: value as never },
    create: { userId, targetType: targetType as never, targetId, value: value as never },
  });
  return NextResponse.json({ reaction });
}
