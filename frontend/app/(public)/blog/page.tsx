import Link from "next/link";
import type { Metadata } from "next";
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
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Aligned with standard max-w-7xl constraint to match Navbar/Footer */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 md:py-16">
        <header className="space-y-5 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            GATE Preparation Blog
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Strategies, subject guides, PYQ analysis, formula revision, and exam planning content published by GATEPrep authors.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-4">
                <span className="uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                  {post.category ?? "GATE"}
                </span>
                <span className="flex items-center gap-1.5 opacity-80">
                  {readingTimeMinutes(plainTextFromMarkdown(post.content))} min read
                </span>
              </div>
              
              <h2 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-200">
                {post.title}
              </h2>
              
              <p className="mt-3 mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground flex-1">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between border-t border-border/50 pt-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                    {(post.author.name?.[0] ?? "G").toUpperCase()}
                  </div>
                  {post.author.name ?? "GATEPrep Author"}
                </div>
                {post.publishedAt && (
                  <time dateTime={post.publishedAt.toISOString()} className="opacity-80">
                    {formatDate(post.publishedAt)}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}