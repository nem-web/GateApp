import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

type HtmlGameRow = {
  id: string;
  title: string;
  html: string;
  createdAt: Date;
  updatedAt: Date;
};

function gamePayload(row: HtmlGameRow) {
  return {
    id: row.id,
    title: row.title,
    html: row.html,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const games = await prisma.$queryRaw<HtmlGameRow[]>`
    SELECT id, title, html, "createdAt", "updatedAt"
    FROM "HtmlGame"
    WHERE "userId" = ${userId}
    ORDER BY "updatedAt" DESC
  `;

  return NextResponse.json({ games: games.map(gamePayload) });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title = String(body.title ?? "").trim();
  const html = String(body.html ?? "").trim();

  if (!title) return NextResponse.json({ error: "Game title is required" }, { status: 400 });
  if (!html) return NextResponse.json({ error: "HTML code is required" }, { status: 400 });
  if (html.length > 1_000_000) {
    return NextResponse.json({ error: "HTML game is too large. Keep it under 1 MB." }, { status: 400 });
  }

  const id = `game_${randomUUID().replace(/-/g, "")}`;
  const rows = await prisma.$queryRaw<HtmlGameRow[]>`
    INSERT INTO "HtmlGame" (id, "userId", title, html, "createdAt", "updatedAt")
    VALUES (${id}, ${userId}, ${title}, ${html}, NOW(), NOW())
    RETURNING id, title, html, "createdAt", "updatedAt"
  `;

  return NextResponse.json({ ok: true, game: gamePayload(rows[0]!) });
}
