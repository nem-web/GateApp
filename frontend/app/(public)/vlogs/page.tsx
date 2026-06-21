import Link from "next/link";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = createMetadata({
  title: "GATE Preparation Vlogs",
  description: "Published GATE preparation vlogs with study strategy, subject walkthroughs, revision sessions, and community discussion.",
  path: "/vlogs",
});

export default async function VlogsPage() {
  const vlogs = await prisma.vlogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
    take: 48,
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-14">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">GATE preparation vlogs</h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">Community video posts, subject walkthroughs, and study updates from published GATEPrep creators.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vlogs.map((vlog) => (
            <Link key={vlog.id} href={`/vlogs/${vlog.slug}`} className="rounded-lg border border-border bg-card p-5 hover:bg-secondary">
              {vlog.thumbnailUrl && <img src={vlog.thumbnailUrl} alt="" className="mb-4 aspect-video w-full rounded-md object-cover" loading="lazy" />}
              <h2 className="text-lg font-semibold">{vlog.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{vlog.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">By {vlog.author.name ?? "GATEPrep Creator"}</p>
            </Link>
          ))}
        </div>
      </main>    </div>
  );
}
