import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { rateLimitUserAction, validateCommunityText } from "@/lib/content-utils";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const targetType = String(body.targetType ?? "");
  const targetId = String(body.targetId ?? "");
  const content = String(body.content ?? "").trim();
  const parentId = body.parentId ? String(body.parentId) : null;

  const qualityError = validateCommunityText(content);
  if (qualityError) return NextResponse.json({ error: qualityError }, { status: 400 });
  if (!(await rateLimitUserAction(userId, "comment", 12))) {
    return NextResponse.json({ error: "Too many comments. Please try again later." }, { status: 429 });
  }

  const duplicateSince = new Date(Date.now() - 10 * 60 * 1000);
  const duplicate = await prisma.communityComment.findFirst({
    where: { authorId: userId, content, createdAt: { gte: duplicateSince } },
  });
  if (duplicate) return NextResponse.json({ error: "Duplicate comment detected." }, { status: 409 });

  const data =
    targetType === "BLOG"
      ? { blogId: targetId }
      : targetType === "VLOG"
        ? { vlogId: targetId }
        : null;
  if (!data) return NextResponse.json({ error: "Invalid comment target." }, { status: 400 });

  const comment = await prisma.communityComment.create({
    data: { authorId: userId, content, parentId, ...data },
    include: { author: { select: { name: true } } },
  });
  return NextResponse.json({ comment });
}
