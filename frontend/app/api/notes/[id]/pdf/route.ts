import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { uploadBuffer } from "@/lib/supabase-admin";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const note = await prisma.note.findFirst({ where: { id, userId } });
  if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Missing PDF file" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const safeName = (file as File).name.replace(/[^\w.\-]+/g, "_");
  const path = `${userId}/${id}/${Date.now()}_${safeName}`;

  try {
    await uploadBuffer({
      bucket: "notes",
      path,
      body: buf,
      contentType: "application/pdf",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Supabase Storage upload failed. Create bucket `notes` and set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  const pdfRow = await prisma.notePdf.create({
    data: {
      noteId: id,
      userId,
      storagePath: path,
      fileName: safeName,
      pageCount: null,
    },
  });

  await prisma.note.update({
    where: { id },
    data: { pdfStoragePath: path, pdfFileName: safeName, readingLastPage: 1 },
  });

  return NextResponse.json({ ok: true, pdf: pdfRow });
}
