import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

type HtmlGameRow = {
  id: string;
  title: string;
  html: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.$executeRaw`
    DELETE FROM "HtmlGame"
    WHERE id = ${id} AND "userId" = ${userId}
  `;

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title = String(body.title ?? "").trim();
  const html = String(body.html ?? "").trim();
  if (!title || !html) return NextResponse.json({ error: "Title and HTML are required" }, { status: 400 });

  const rows = await prisma.$queryRaw<HtmlGameRow[]>`
    UPDATE "HtmlGame"
    SET title = ${title}, html = ${html}, "updatedAt" = NOW()
    WHERE id = ${id} AND "userId" = ${userId}
    RETURNING id, title, html, "createdAt", "updatedAt"
  `;

  const row = rows[0];
  if (!row) return NextResponse.json({ error: "Game not found" }, { status: 404 });
  return NextResponse.json({ ok: true, game: row });
}
