import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireApprovedForStorage } from "@/lib/admin-access";
import { getSessionUserId } from "@/lib/session";
import { toLocalStoragePath, writeLocalUpload } from "@/lib/local-upload-storage";
import { requireMemoryQuota } from "@/lib/memory-quota";

export const runtime = "nodejs";

type ExcelMeta = {
  fileName: string;
  storagePath: string;
  uploadedAt: string;
  sizeBytes: number;
};

function uploadRoot() {
  return process.env.LOCAL_UPLOAD_DIR ?? path.join(process.cwd(), ".local-uploads");
}

function metaPath(userId: string) {
  return path.join(uploadRoot(), userId, "other", "excel-meta.json");
}

async function readMeta(userId: string): Promise<ExcelMeta | null> {
  try {
    return JSON.parse(await readFile(metaPath(userId), "utf8")) as ExcelMeta;
  } catch {
    return null;
  }
}

async function writeMeta(userId: string, meta: ExcelMeta) {
  const target = metaPath(userId);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(meta, null, 2), "utf8");
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^\w.\- ]+/g, "_").trim() || "workbook.xlsx";
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const meta = await readMeta(userId);
  return NextResponse.json({
    workbook: meta
      ? {
          ...meta,
          fileUrl: "/api/other/excel/file",
        }
      : null,
  });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const approvalError = await requireApprovedForStorage(userId);
  if (approvalError) return approvalError;

  const form = await req.formData();
  const replace = String(form.get("replace") ?? "false") === "true";
  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Excel file required" }, { status: 400 });
  }
  const quotaError = await requireMemoryQuota(userId, file.size);
  if (quotaError) return quotaError;

  const existing = await readMeta(userId);
  if (existing && !replace) {
    return NextResponse.json(
      {
        error: "Workbook already exists. Confirm replacement to upload a new one.",
        replaceRequired: true,
        workbook: existing,
      },
      { status: 409 },
    );
  }

  const originalName =
    "name" in file && typeof (file as File).name === "string" ? (file as File).name : "workbook.xlsx";
  const fileName = safeFileName(originalName);
  const relativePath = `${userId}/other/${Date.now()}_${fileName}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeLocalUpload(relativePath, bytes);
  const meta: ExcelMeta = {
    fileName,
    storagePath: toLocalStoragePath(relativePath),
    uploadedAt: new Date().toISOString(),
    sizeBytes: file.size,
  };
  await writeMeta(userId, meta);

  return NextResponse.json({
    ok: true,
    workbook: {
      ...meta,
      fileUrl: "/api/other/excel/file",
    },
  });
}

export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const approvalError = await requireApprovedForStorage(userId);
  if (approvalError) return approvalError;

  const meta = await readMeta(userId);
  if (!meta) return NextResponse.json({ error: "Workbook not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Workbook file required" }, { status: 400 });
  }
  const quotaError = await requireMemoryQuota(userId, file.size);
  if (quotaError) return quotaError;

  const relativePath = meta.storagePath.replace(/^local:\/\//, "");
  await writeLocalUpload(relativePath, Buffer.from(await file.arrayBuffer()));
  const next = {
    ...meta,
    uploadedAt: new Date().toISOString(),
    sizeBytes: file.size,
  };
  await writeMeta(userId, next);

  return NextResponse.json({ ok: true, workbook: next });
}

export async function DELETE() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await rm(path.join(uploadRoot(), userId, "other"), { recursive: true, force: true });
  return NextResponse.json({ ok: true });
}
