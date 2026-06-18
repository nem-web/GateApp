import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { byteLength, requireMemoryQuota } from "@/lib/memory-quota";
import { getSessionUserId } from "@/lib/session";

export const runtime = "nodejs";

type ResourceLink = {
  id: string;
  title: string;
  url: string;
  category: string;
  notes: string | null;
  createdAt: string;
};

const VALID_CATEGORIES = new Set(["notes", "practice", "pyq", "lectures", "tools", "other"]);

function uploadRoot() {
  return process.env.LOCAL_UPLOAD_DIR ?? path.join(process.cwd(), ".local-uploads");
}

function linksPath(userId: string) {
  return path.join(uploadRoot(), userId, "other-links.json");
}

async function readLinks(userId: string): Promise<ResourceLink[]> {
  try {
    const parsed = JSON.parse(await readFile(linksPath(userId), "utf8")) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isResourceLink) : [];
  } catch {
    return [];
  }
}

async function writeLinks(userId: string, links: ResourceLink[]) {
  const target = linksPath(userId);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(links, null, 2), "utf8");
}

function isResourceLink(value: unknown): value is ResourceLink {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.url === "string" &&
    typeof row.category === "string" &&
    typeof row.createdAt === "string"
  );
}

function normalizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(withProtocol);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function cleanCategory(value: unknown) {
  const category = typeof value === "string" ? value.trim().toLowerCase() : "other";
  return VALID_CATEGORIES.has(category) ? category : "other";
}

function cleanTitle(value: unknown, url: string) {
  const title = typeof value === "string" ? value.trim() : "";
  if (title) return title.slice(0, 120);
  return new URL(url).hostname.replace(/^www\./, "");
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ links: await readLinks(userId) });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Record<string, unknown>;
  const url = normalizeUrl(body.url);
  if (!url) return NextResponse.json({ error: "Valid http(s) link required." }, { status: 400 });

  const link: ResourceLink = {
    id: crypto.randomUUID(),
    title: cleanTitle(body.title, url),
    url,
    category: cleanCategory(body.category),
    notes: typeof body.notes === "string" && body.notes.trim() ? body.notes.trim().slice(0, 280) : null,
    createdAt: new Date().toISOString(),
  };

  const links = await readLinks(userId);
  const next = [link, ...links].slice(0, 200);
  const quotaError = await requireMemoryQuota(userId, byteLength(JSON.stringify(next)));
  if (quotaError) return quotaError;

  await writeLinks(userId, next);
  return NextResponse.json({ ok: true, link, links: next });
}

export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id : "";
  const url = normalizeUrl(body.url);
  if (!id || !url) return NextResponse.json({ error: "Link id and valid URL required." }, { status: 400 });

  const links = await readLinks(userId);
  const next = links.map((link) =>
    link.id === id
      ? {
          ...link,
          title: cleanTitle(body.title, url),
          url,
          category: cleanCategory(body.category),
          notes: typeof body.notes === "string" && body.notes.trim() ? body.notes.trim().slice(0, 280) : null,
        }
      : link,
  );

  await writeLinks(userId, next);
  return NextResponse.json({ ok: true, links: next });
}

export async function DELETE(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Link id required." }, { status: 400 });

  const links = await readLinks(userId);
  const next = links.filter((link) => link.id !== id);
  await writeLinks(userId, next);
  return NextResponse.json({ ok: true, links: next });
}
