import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { writeLocalUpload, toLocalStoragePath } from "@/lib/local-upload-storage";
import { getSupabaseAdmin, uploadBuffer } from "@/lib/supabase-admin";

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
  const relativePath = `${userId}/${id}/${Date.now()}_${safeName}`;
  let storagePath = relativePath;
  let storageProvider: "supabase" | "local" = "supabase";

  if (getSupabaseAdmin()) {
    try {
      await uploadBuffer({
        bucket: "notes",
        path: relativePath,
        body: buf,
        contentType: "application/pdf",
      });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? `Supabase Storage upload failed: ${error.message}`
              : "Supabase Storage upload failed.",
        },
        { status: 503 },
      );
    }
  } else {
    await writeLocalUpload(relativePath, buf);
    storagePath = toLocalStoragePath(relativePath);
    storageProvider = "local";
  }

  const pdfRow = await prisma.notePdf.create({
    data: {
      noteId: id,
      userId,
      storagePath,
      fileName: safeName,
      pageCount: null,
    },
  });

  await prisma.note.update({
    where: { id },
    data: { pdfStoragePath: storagePath, pdfFileName: safeName, readingLastPage: 1 },
  });

  return NextResponse.json({ ok: true, storageProvider, pdf: pdfRow });
}
