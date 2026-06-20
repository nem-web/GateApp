import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFooter } from "@/components/PublicFooter";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { plainTextFromMarkdown, readingTimeMinutes, relatedContent, resourceHref } from "@/lib/content-utils";

type ResourceKind = "NOTE" | "FORMULA" | "PYQ" | "QUIZ";
type PageProps = { params: Promise<{ slug: string }> };

const labels: Record<ResourceKind, string> = {
  NOTE: "Note",
  FORMULA: "Formula Sheet",
  PYQ: "PYQ Explanation",
  QUIZ: "Quiz",
};

export async function resourceMetadata({ params }: PageProps, kind: ResourceKind): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.seoResource.findFirst({ where: { slug, kind, status: "PUBLISHED" } });
  if (!item) return {};
  return createMetadata({
    title: item.seoTitle ?? item.title,
    description: item.seoDescription ?? item.description,
    path: resourceHref(kind, item.slug),
    type: "article",
    publishedTime: item.publishedAt?.toISOString(),
    modifiedTime: item.updatedAt.toISOString(),
  });
}

export async function ResourceSeoPage({ params, kind }: PageProps & { kind: ResourceKind }) {
  const { slug } = await params;
  const item = await prisma.seoResource.findFirst({ where: { slug, kind, status: "PUBLISHED" } });
  if (!item) notFound();
  const related = await relatedContent({ tags: item.tags, subjectSlug: item.subjectSlug, excludeSlug: item.slug, take: 8 });
  const text = plainTextFromMarkdown(item.content);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: labels[kind], path: resourceHref(kind, item.slug) }]),
          {
            "@context": "https://schema.org",
            "@type": kind === "QUIZ" ? "Quiz" : "Article",
            headline: item.title,
            description: item.description,
            datePublished: item.publishedAt?.toISOString(),
            dateModified: item.updatedAt.toISOString(),
            mainEntityOfPage: absoluteUrl(resourceHref(kind, item.slug)),
          },
        ]}
      />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 md:py-14">
        <header>
          <p className="text-sm font-medium text-primary">{labels[kind]}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{item.title}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{item.description}</p>
          <p className="mt-3 text-sm text-muted-foreground">{readingTimeMinutes(text)} min read</p>
        </header>
        <article className="prose prose-neutral max-w-none dark:prose-invert">
          {item.content.split(/\n{2,}/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
        <section className="border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">Related resources</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {related.map((link) => <Link key={link.href} href={link.href} className="rounded-lg border border-border p-4 hover:bg-secondary">{link.title}</Link>)}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
