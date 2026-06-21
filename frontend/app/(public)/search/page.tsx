import Link from "next/link";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { resourceHref } from "@/lib/content-utils";

export const metadata: Metadata = createMetadata({
  title: "Search GATEPrep",
  description: "Search published GATE notes, formula sheets, PYQs, quizzes, subjects, blogs, and vlogs.",
  path: "/search",
});

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const [resources, blogs, vlogs, subjects] = query.length >= 2
    ? await Promise.all([
        prisma.seoResource.findMany({ where: { status: "PUBLISHED", title: { contains: query, mode: "insensitive" } }, take: 10 }),
        prisma.blogPost.findMany({ where: { status: "PUBLISHED", title: { contains: query, mode: "insensitive" } }, take: 10 }),
        prisma.vlogPost.findMany({ where: { status: "PUBLISHED", title: { contains: query, mode: "insensitive" } }, take: 10 }),
        prisma.subjectSeoPage.findMany({ where: { status: "PUBLISHED", title: { contains: query, mode: "insensitive" } }, take: 10 }),
      ])
    : [[], [], [], []] as const;
  const results = [
    ...subjects.map((item) => ({ title: item.title, href: `/subject/${item.slug}` })),
    ...resources.map((item) => ({ title: item.title, href: resourceHref(item.kind, item.slug) })),
    ...blogs.map((item) => ({ title: item.title, href: `/blog/${item.slug}` })),
    ...vlogs.map((item) => ({ title: item.title, href: `/vlogs/${item.slug}` })),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-14">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Search GATEPrep</h1>
        <form action="/search" className="flex gap-2">
          <input name="q" defaultValue={query} className="min-h-11 flex-1 rounded-md border border-border bg-background px-3" placeholder="Search notes, PYQs, formulas, quizzes, blogs..." />
          <button className="rounded-md bg-primary px-5 text-primary-foreground">Search</button>
        </form>
        <div className="grid gap-3">
          {results.map((item) => <Link key={item.href} href={item.href} className="rounded-lg border border-border p-4 hover:bg-secondary">{item.title}</Link>)}
        </div>
      </main>    </div>
  );
}
