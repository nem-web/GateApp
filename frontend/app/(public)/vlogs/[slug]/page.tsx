import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { relatedContent } from "@/lib/content-utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vlog = await prisma.vlogPost.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!vlog) return {};
  return createMetadata({
    title: vlog.seoTitle ?? vlog.title,
    description: vlog.seoDescription ?? vlog.excerpt,
    path: `/vlogs/${vlog.slug}`,
    image: vlog.thumbnailUrl ?? undefined,
  });
}

export default async function VlogPage({ params }: PageProps) {
  const { slug } = await params;
  const vlog = await prisma.vlogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { id: true, name: true } }, comments: { where: { status: "PUBLISHED", parentId: null }, include: { author: { select: { name: true } }, replies: { include: { author: { select: { name: true } } } } }, orderBy: { createdAt: "desc" } } },
  });
  if (!vlog) notFound();
  const related = await relatedContent({ tags: vlog.tags, excludeSlug: vlog.slug, take: 6 });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Vlogs", path: "/vlogs" }, { name: vlog.title, path: `/vlogs/${vlog.slug}` }]), { "@context": "https://schema.org", "@type": "VideoObject", name: vlog.title, description: vlog.excerpt, thumbnailUrl: vlog.thumbnailUrl ? [vlog.thumbnailUrl] : undefined, uploadDate: vlog.publishedAt?.toISOString(), contentUrl: vlog.videoUrl, embedUrl: vlog.videoUrl, url: absoluteUrl(`/vlogs/${vlog.slug}`) }]} />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 md:py-14">
        <header>
          <p className="text-sm font-medium text-primary">GATE vlog</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{vlog.title}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{vlog.excerpt}</p>
          <p className="mt-3 text-sm text-muted-foreground">By {vlog.author.name ?? "GATEPrep Creator"}</p>
        </header>
        <div className="aspect-video overflow-hidden rounded-lg border border-border bg-card">
          <iframe src={vlog.videoUrl} title={vlog.title} className="h-full w-full" allowFullScreen loading="lazy" />
        </div>
        <article className="prose prose-neutral max-w-none dark:prose-invert">{vlog.content.split(/\n{2,}/).map((p) => <p key={p}>{p}</p>)}</article>
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Discussion</h2>
          <div className="mt-5 space-y-4">
            {vlog.comments.map((comment) => (
              <div key={comment.id} className="rounded-md border border-border p-4">
                <p className="text-sm font-medium">{comment.author.name ?? "Reader"}</p>
                <p className="mt-2 text-sm text-muted-foreground">{comment.content}</p>
                {comment.replies.map((reply) => <p key={reply.id} className="mt-3 border-l border-border pl-3 text-sm text-muted-foreground">{reply.author.name ?? "Reader"}: {reply.content}</p>)}
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Related resources</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">{related.map((item) => <Link key={item.href} href={item.href} className="rounded-lg border border-border p-4 hover:bg-secondary">{item.title}</Link>)}</div>
        </section>
      </main>    </div>
  );
}
