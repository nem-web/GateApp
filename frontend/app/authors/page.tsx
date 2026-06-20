import type { Metadata } from "next";
import { PublicFooter } from "@/components/PublicFooter";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = createMetadata({
  title: "GATEPrep Authors",
  description: "Authors and creators publishing GATE preparation articles, notes, resources, and vlogs on GATEPrep.",
  path: "/authors",
});

export default async function AuthorsPage() {
  const authors = await prisma.user.findMany({
    where: { OR: [{ authoredBlogPosts: { some: { status: "PUBLISHED" } } }, { authoredVlogs: { some: { status: "PUBLISHED" } } }] },
    select: { id: true, name: true, email: true, _count: { select: { authoredBlogPosts: true, authoredVlogs: true, followers: true } } },
    orderBy: { name: "asc" },
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 md:py-14">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Authors</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {authors.map((author) => (
            <div key={author.id} className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">{author.name ?? author.email}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{author._count.authoredBlogPosts} posts · {author._count.authoredVlogs} vlogs · {author._count.followers} followers</p>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
