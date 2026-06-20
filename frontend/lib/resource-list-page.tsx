import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter } from "@/components/PublicFooter";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { resourceHref } from "@/lib/content-utils";

type Kind = "NOTE" | "FORMULA" | "PYQ" | "QUIZ";

export function resourceListMetadata(title: string, description: string, path: string): Metadata {
  return createMetadata({ title, description, path });
}

export async function ResourceListPage({ kind, title, description }: { kind: Kind; title: string; description: string }) {
  const items = await prisma.seoResource.findMany({
    where: { kind, status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 100,
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-14">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">{description}</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={resourceHref(item.kind, item.slug)} className="rounded-lg border border-border bg-card p-5 hover:bg-secondary">
              <p className="text-xs text-muted-foreground">{item.topic ?? item.branchCode.toUpperCase()}</p>
              <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
