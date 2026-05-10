import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";

function notePayload(note: {
  id: string;
  userId: string;
  title: string;
  content: string;
  subjectId: string;
  topic: string | null;
  tags: string[];
  pdfStoragePath: string | null;
  pdfFileName: string | null;
  readingLastPage: number;
  updatedAt: Date;
  createdAt: Date;
  subject?: { title: string };
}) {
  return {
    ...note,
    subject: note.subject?.title,
  };
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const note = await prisma.note.findFirst({
    where: { id, userId },
    include: { subject: true },
  });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(notePayload(note));
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existing = await prisma.note.findFirst({ where: { id, userId }, include: { subject: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();

  const subjectId =
    body.subject !== undefined
      ? (await resolveSubject(prisma, String(body.subject ?? ""))).id
      : undefined;

  const note = await prisma.note.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: String(body.title) }),
      ...(body.content !== undefined && { content: String(body.content) }),
      ...(subjectId !== undefined && { subjectId }),
      ...(body.topic !== undefined && { topic: body.topic ? String(body.topic) : null }),
      ...(body.tags !== undefined && { tags: Array.isArray(body.tags) ? body.tags.map(String) : [] }),
      ...(body.readingLastPage !== undefined && { readingLastPage: Number(body.readingLastPage) }),
    },
    include: { subject: true },
  });
  return NextResponse.json(notePayload(note));
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existing = await prisma.note.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
