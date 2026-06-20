import Link from "next/link";
import type { Metadata } from "next";
import { PublicFooter } from "@/components/PublicFooter";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { readingTimeMinutes, plainTextFromMarkdown } from "@/lib/content-utils";

export const metadata: Metadata = createMetadata({
  title: "GATE Preparation Blog",
  description:
    "Published GATE preparation articles, strategies, subject guides, PYQ analysis, and revision resources from GATEPrep.",
  path: "/blog",
});

// Helper to format dates cleanly
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
    take: 48,
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 md:py-14">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            GATE Preparation Blog
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Strategies, subject guides, PYQ analysis, formula revision, and exam planning content published by GATEPrep authors.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-secondary/50 hover:shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span className="uppercase tracking-wider text-primary">
                  {post.category ?? "GATE"}
                </span>
                <span>
                  {readingTimeMinutes(plainTextFromMarkdown(post.content))} min read
                </span>
              </div>
              
              <h2 className="mt-4 text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground flex-1">
                {post.excerpt}
              </p>
              
              <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {post.author.name ?? "GATEPrep Author"}
                </span>
                {post.publishedAt && (
                  <time dateTime={post.publishedAt.toISOString()}>
                    {formatDate(post.publishedAt)}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}