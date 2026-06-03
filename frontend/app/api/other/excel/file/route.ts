import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";

export const runtime = "nodejs";

type ExcelMeta = {
  fileName: string;
  storagePath: string;
};

function uploadRoot() {
  return process.env.LOCAL_UPLOAD_DIR ?? path.join(process.cwd(), ".local-uploads");
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const meta = JSON.parse(
      await readFile(path.join(uploadRoot(), userId, "other", "excel-meta.json"), "utf8"),
    ) as ExcelMeta;
    const fileRelativePath = meta.storagePath.replace(/^local:\/\//, "");
    const target = path.resolve(uploadRoot(), fileRelativePath);
    const root = path.resolve(uploadRoot(), userId, "other");
    if (!target.startsWith(root + path.sep)) {
      return NextResponse.json({ error: "Invalid workbook path" }, { status: 400 });
    }

    const bytes = await readFile(target);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `inline; filename="${meta.fileName.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Workbook not found" }, { status: 404 });
  }
}
