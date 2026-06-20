import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const targetTypes = new Set(["BLOG", "VLOG", "RESOURCE", "COMMENT"]);

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const targetType = String(body.targetType ?? "");
  const targetId = String(body.targetId ?? "");
  if (!targetTypes.has(targetType) || !targetId) return NextResponse.json({ error: "Invalid bookmark." }, { status: 400 });
  const bookmark = await prisma.contentBookmark.upsert({
    where: { userId_targetType_targetId: { userId, targetType: targetType as never, targetId } },
    update: {},
    create: { userId, targetType: targetType as never, targetId },
  });
  return NextResponse.json({ bookmark });
}

export async function DELETE(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("targetType") ?? "";
  const targetId = searchParams.get("targetId") ?? "";
  if (!targetTypes.has(targetType) || !targetId) return NextResponse.json({ error: "Invalid bookmark." }, { status: 400 });
  await prisma.contentBookmark.deleteMany({ where: { userId, targetType: targetType as never, targetId } });
  return NextResponse.json({ ok: true });
}
