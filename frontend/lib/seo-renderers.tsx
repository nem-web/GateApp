import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFooter } from "@/components/PublicFooter";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { resourceHref } from "@/lib/content-utils";

export async function branchMetadata(slug: string): Promise<Metadata> {
  const page = await prisma.gateBranchPage.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!page) return {};
  return createMetadata({ title: page.title, description: page.description, path: `/${page.slug}` });
}

export async function GateBranchSeoPage({ slug }: { slug: string }) {
  const page = await prisma.gateBranchPage.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!page) notFound();
  const [subjects, resources, blogs] = await Promise.all([
    prisma.subjectSeoPage.findMany({ where: { branchCode: page.code, status: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, take: 12 }),
    prisma.seoResource.findMany({ where: { branchCode: page.code, status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 12 }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED", tags: { hasSome: [page.code, page.name] } }, orderBy: { publishedAt: "desc" }, take: 6 }),
  ]);
  const syllabus = Array.isArray(page.syllabus) ? page.syllabus.map(String) : [];
  const faqs = Array.isArray(page.faqs) ? (page.faqs as Array<{ question: string; answer: string }>) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: page.name, path: `/${page.slug}` }]),
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: page.name,
            description: page.description,
            provider: { "@type": "Organization", name: "GATEPrep", url: absoluteUrl("/") },
            teaches: syllabus,
          },
          ...(faqs.length
            ? [{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
              }]
            : []),
        ]}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:py-14">
        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE preparation hub</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{page.title}</h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">{page.overview}</p>
        </header>
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-xl font-semibold">Syllabus</h2>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {syllabus.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-xl font-semibold">Important topics</h2>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {page.importantTopics.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Preparation strategy</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{page.preparation}</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Related resources</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ...subjects.map((item) => ({ title: item.title, href: `/subject/${item.slug}` })),
              ...resources.map((item) => ({ title: item.title, href: resourceHref(item.kind, item.slug) })),
              ...blogs.map((item) => ({ title: item.title, href: `/blog/${item.slug}` })),
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-border bg-card p-4 hover:bg-secondary">
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
