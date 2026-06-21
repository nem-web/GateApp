import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { relatedContent } from "@/lib/content-utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.subjectSeoPage.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!page) return {};
  return createMetadata({ title: page.title, description: page.description, path: `/subject/${page.slug}` });
}

export default async function SubjectPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await prisma.subjectSeoPage.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!page) notFound();
  const related = await relatedContent({ subjectSlug: page.slug, tags: [page.subjectName, page.branchCode], take: 9 });
  const syllabus = Array.isArray(page.syllabus) ? page.syllabus.map(String) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Subjects", path: "/html-sitemap" }, { name: page.subjectName, path: `/subject/${page.slug}` }]),
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: page.subjectName,
            description: page.description,
            url: absoluteUrl(`/subject/${page.slug}`),
            provider: { "@type": "Organization", name: "GATEPrep" },
          },
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:py-14">
        <header>
          <p className="text-sm font-medium text-primary">GATE subject guide</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{page.title}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{page.overview}</p>
        </header>
        {syllabus.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold">Syllabus</h2>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">{syllabus.map((item) => <li key={item} className="rounded-md border border-border p-3">{item}</li>)}</ul>
          </section>
        )}
        <section>
          <h2 className="text-2xl font-semibold">Important topics</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">{page.importantTopics.map((item) => <li key={item} className="rounded-md border border-border p-3">{item}</li>)}</ul>
        </section>
        {page.strategy && (
          <section>
            <h2 className="text-2xl font-semibold">Preparation strategy</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{page.strategy}</p>
          </section>
        )}
        <section>
          <h2 className="text-2xl font-semibold">Related notes, PYQs, quizzes, formulas and blogs</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {related.map((item) => <Link key={item.href} href={item.href} className="rounded-lg border border-border p-4 hover:bg-secondary">{item.title}</Link>)}
          </div>
        </section>
      </main>    </div>
  );
}
