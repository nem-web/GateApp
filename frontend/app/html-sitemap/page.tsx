import Link from "next/link";
import type { Metadata } from "next";
import { PublicFooter } from "@/components/PublicFooter";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { LEGAL_PAGES } from "@/lib/legal-pages";
import { resourceHref } from "@/lib/content-utils";

export const metadata: Metadata = createMetadata({
  title: "HTML Sitemap",
  description: "Browse all public, crawlable GATEPrep pages including branch hubs, subjects, notes, formula sheets, PYQs, quizzes, blogs, vlogs, and policies.",
  path: "/html-sitemap",
});

export default async function HtmlSitemapPage() {
  const [branches, subjects, resources, blogs, vlogs] = await Promise.all([
    prisma.gateBranchPage.findMany({ where: { status: "PUBLISHED" }, orderBy: { slug: "asc" } }),
    prisma.subjectSeoPage.findMany({ where: { status: "PUBLISHED" }, orderBy: { slug: "asc" } }),
    prisma.seoResource.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ kind: "asc" }, { slug: "asc" }] }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } }),
    prisma.vlogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } }),
  ]);
  const groups = [
    { title: "GATE hubs", items: branches.map((item) => ({ href: `/${item.slug}`, label: item.title })) },
    { title: "Subjects", items: subjects.map((item) => ({ href: `/subject/${item.slug}`, label: item.title })) },
    { title: "Resources", items: resources.map((item) => ({ href: resourceHref(item.kind, item.slug), label: item.title })) },
    { title: "Blogs", items: blogs.map((item) => ({ href: `/blog/${item.slug}`, label: item.title })) },
    { title: "Vlogs", items: vlogs.map((item) => ({ href: `/vlogs/${item.slug}`, label: item.title })) },
    { title: "Trust and legal", items: LEGAL_PAGES.map((item) => ({ href: `/${item.slug}`, label: item.title })) },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-14">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">HTML sitemap</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((group) => (
            <section key={group.title} className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-xl font-semibold">{group.title}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {group.items.map((item) => (
                  <li key={item.href}><Link href={item.href} className="text-primary hover:underline">{item.label}</Link></li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
