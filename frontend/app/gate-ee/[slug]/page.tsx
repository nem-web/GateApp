import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PUBLIC_SEO_PAGES, getPublicSeoPage } from '@/lib/seo-pages'
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PUBLIC_SEO_PAGES.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getPublicSeoPage(slug)
  if (!page) return {}

  return createMetadata({
    title: page.title,
    description: page.description,
    path: `/gate-ee/${page.slug}`,
    type: 'article',
    publishedTime: '2026-06-18T00:00:00.000Z',
    modifiedTime: '2026-06-18T00:00:00.000Z',
  })
}

export default async function GateEeTopicPage({ params }: PageProps) {
  const { slug } = await params
  const page = getPublicSeoPage(slug)

  if (!page) notFound()

  const schemas = [
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'GATE EE', path: '/gate-ee' },
      { name: page.h1, path: `/gate-ee/${page.slug}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.h1,
      description: page.description,
      keywords: page.keywords.join(', '),
      datePublished: '2026-06-18T00:00:00.000Z',
      dateModified: '2026-06-18T00:00:00.000Z',
      author: {
        '@type': 'Organization',
        name: 'GATEPrep Pro',
        url: absoluteUrl('/gate-ee'),
      },
      publisher: {
        '@type': 'Organization',
        name: 'GATEPrep Pro',
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/pwa-icon-512.png'),
        },
      },
      mainEntityOfPage: absoluteUrl(`/gate-ee/${page.slug}`),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ]

  return (
    <>
      <JsonLd data={schemas} />
      <main className="min-h-screen bg-background text-foreground">
        <article className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/gate-ee" className="hover:text-foreground">
                  GATE EE
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">
                {page.h1}
              </li>
            </ol>
          </nav>

          <header>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{page.h1}</h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground">{page.intro}</p>
          </header>

          <div className="mt-10 space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
                {section.bullets && (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="rounded-md border border-border bg-card px-4 py-3 text-sm">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="mt-12 border-t border-border pt-10">
            <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
            <div className="mt-5 space-y-4">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-base font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Build your study workspace
            </Link>
            <Link
              href="/gate-ee"
              className="inline-flex min-h-11 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-secondary"
            >
              Back to GATE EE guides
            </Link>
          </footer>
        </article>
      </main>
    </>
  )
}

