import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { byteLength, requireMemoryQuota } from "@/lib/memory-quota";
import { resolveSubject } from "@/lib/subject-resolve";
import { checkFeatureLimit, quotaResponse } from "@/lib/subscription";

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
    id: note.id,
    userId: note.userId,
    title: note.title,
    content: note.content,
    subjectId: note.subjectId,
    subject: note.subject?.title,
    topic: note.topic,
    tags: note.tags,
    pdfStoragePath: note.pdfStoragePath,
    pdfFileName: note.pdfFileName,
    readingLastPage: note.readingLastPage,
    updatedAt: note.updatedAt,
    createdAt: note.createdAt,
  };
}

export async function GET(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const subjectTitle = searchParams.get("subject")?.trim();

  let subjectFilter: { subjectId?: string } = {};
  if (subjectTitle) {
    try {
      const subj = await resolveSubject(prisma, subjectTitle);
      subjectFilter = { subjectId: subj.id };
    } catch {
      subjectFilter = {};
    }
  }

  const notes = await prisma.note.findMany({
    where: {
      userId,
      ...subjectFilter,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
              { topic: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { subject: true },
  });

  const subjectRows = await prisma.subject.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, slug: true },
  });

  return NextResponse.json({
    notes: notes.map(notePayload),
    subjects: subjectRows.map((s) => s.title),
    subjectCatalog: subjectRows,
  });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const featureLimit = await checkFeatureLimit(userId, "notes");
  if (!featureLimit.ok) return quotaResponse(featureLimit);
  const incomingBytes = byteLength(
    [
      body.title ?? "Untitled",
      body.content ?? "",
      body.topic ?? "",
      Array.isArray(body.tags) ? body.tags.join(",") : "",
    ].map(String).join(""),
  );
  const quotaError = await requireMemoryQuota(userId, incomingBytes);
  if (quotaError) return quotaError;

  const subject = await resolveSubject(prisma, typeof body.subject === "string" ? body.subject : null);
  const note = await prisma.note.create({
    data: {
      userId,
      title: String(body.title ?? "Untitled"),
      content: String(body.content ?? ""),
      subjectId: subject.id,
      topic: body.topic ? String(body.topic) : null,
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    },
    include: { subject: true },
  });
  return NextResponse.json(notePayload(note));
}
