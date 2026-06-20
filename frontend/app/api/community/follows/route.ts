import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as { followingId?: string };
  const followingId = body.followingId?.trim();
  if (!followingId || followingId === userId) return NextResponse.json({ error: "Invalid follow target." }, { status: 400 });
  const follow = await prisma.userFollow.upsert({
    where: { followerId_followingId: { followerId: userId, followingId } },
    update: {},
    create: { followerId: userId, followingId },
  });
  return NextResponse.json({ follow });
}

export async function DELETE(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const followingId = new URL(req.url).searchParams.get("followingId");
  if (!followingId) return NextResponse.json({ error: "followingId required." }, { status: 400 });
  await prisma.userFollow.deleteMany({ where: { followerId: userId, followingId } });
  return NextResponse.json({ ok: true });
}
