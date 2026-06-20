import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resourceHref } from "@/lib/content-utils";

function hit(title: string, description: string, href: string, type: string) {
  return { title, description, href, type };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const take = Math.min(12, Math.max(1, Number(searchParams.get("take") ?? 8)));
  if (q.length < 2) return NextResponse.json({ query: q, results: [] });

  const [subjects, resources, blogs, vlogs, branches] = await Promise.all([
    prisma.subjectSeoPage.findMany({
      where: { status: "PUBLISHED", OR: [{ title: { contains: q, mode: "insensitive" } }, { subjectName: { contains: q, mode: "insensitive" } }, { overview: { contains: q, mode: "insensitive" } }] },
      take,
    }),
    prisma.seoResource.findMany({
      where: { status: "PUBLISHED", OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }, { tags: { has: q } }] },
      take,
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED", OR: [{ title: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }, { tags: { has: q } }] },
      take,
    }),
    prisma.vlogPost.findMany({
      where: { status: "PUBLISHED", OR: [{ title: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }, { tags: { has: q } }] },
      take,
    }),
    prisma.gateBranchPage.findMany({
      where: { status: "PUBLISHED", OR: [{ title: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }, { overview: { contains: q, mode: "insensitive" } }] },
      take,
    }),
  ]);

  const results = [
    ...branches.map((item) => hit(item.title, item.description, `/${item.slug}`, "GateBranch")),
    ...subjects.map((item) => hit(item.title, item.description, `/subject/${item.slug}`, "Subject")),
    ...resources.map((item) => hit(item.title, item.description, resourceHref(item.kind, item.slug), item.kind)),
    ...blogs.map((item) => hit(item.title, item.excerpt, `/blog/${item.slug}`, "Blog")),
    ...vlogs.map((item) => hit(item.title, item.excerpt, `/vlogs/${item.slug}`, "Vlog")),
  ].slice(0, take * 5);

  await prisma.searchQueryLog.create({ data: { query: q, resultCount: results.length } }).catch(() => null);
  return NextResponse.json({ query: q, results });
}
