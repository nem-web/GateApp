import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { GATE_EE_SAMPLE_PACK_SLUG } from "@/lib/test-packs";

export async function GET(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const requestedSlug = url.searchParams.get("packSlug")?.trim();
    const packSlug = requestedSlug || GATE_EE_SAMPLE_PACK_SLUG;

    const pack = await prisma.testPack.findUnique({
      where: { slug: packSlug },
      include: {
        questions: {
          where: requestedSlug ? { userId } : undefined,
          orderBy: requestedSlug ? [{ createdAt: "asc" }, { id: "asc" }] : { id: "asc" },
          include: { subject: true },
        },
      },
    });

    if (!pack || pack.questions.length === 0) {
      return NextResponse.json(
        {
          error: requestedSlug
            ? "Saved test is unavailable or has no questions."
            : "Sample GATE EE drill is unavailable. Seed the catalog with `npx prisma db seed`.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      slug: pack.slug,
      title: pack.title,
      durationMinutes: pack.durationMinutes,
      ready: pack.questions.every((q) => q.source !== "pdf_upload_pending_key"),
      questions: pack.questions.map((q) => ({
        id: q.id,
        subject: q.subject.title,
        topic: q.topic,
        text: q.prompt,
        options: [...q.options],
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
