import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { LEGAL_LAST_UPDATED, LEGAL_PAGES, getLegalPage } from "@/lib/legal-pages";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return {};
  return createMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    modifiedTime: LEGAL_LAST_UPDATED,
  });
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();
  const lastUpdated = new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(LEGAL_LAST_UPDATED));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: page.title, path: `/${page.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": page.slug === "contact-us" ? "ContactPage" : "WebPage",
            name: page.title,
            description: page.description,
            url: absoluteUrl(`/${page.slug}`),
            dateModified: LEGAL_LAST_UPDATED,
          },
        ]}
      />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 md:py-14">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">App</Link>
          <span>/</span>
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <span>/</span>
          <span>{page.title}</span>
        </nav>

        <header className="space-y-3">
          <p className="text-sm font-medium text-primary">Legal & compliance</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{page.title}</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{page.description}</p>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </header>

        <div className="space-y-8">
          {page.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Related policies</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {LEGAL_PAGES.filter((item) => item.slug !== page.slug).map((item) => (
              <Link key={item.slug} href={`/${item.slug}`} className="rounded-md border border-border px-3 py-2 hover:bg-secondary">
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
