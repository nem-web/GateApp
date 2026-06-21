import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, CalendarDays, ClipboardCheck, GraduationCap, Layers, Trophy } from 'lucide-react'
import { GATE_EE_SUBJECTS, GATE_EE_WEIGHTAGE } from '@/lib/gate-ee'
import { PUBLIC_SEO_PAGES } from '@/lib/seo-pages'
import {
  JsonLd,
  absoluteUrl,
  breadcrumbSchema,
  createMetadata,
  organizationSchema,
  websiteSchema,
} from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'GATE EE Preparation Platform | Study Plan, PYQs, Flashcards and Cutoffs',
  description:
    'Prepare for GATE Electrical Engineering with structured syllabus planning, PYQ strategy, flashcards, lectures, tests, cutoff analysis, and AI-guided study workflows.',
  path: '/gate-ee',
})

const featureLinks = [
  { href: '/gate-ee/syllabus', label: 'Syllabus and weightage', icon: BookOpen },
  { href: '/gate-ee/study-plan', label: 'Weekly study plan', icon: CalendarDays },
  { href: '/gate-ee/previous-year-papers', label: 'Previous-year papers', icon: ClipboardCheck },
  { href: '/gate-ee/cutoffs', label: 'Cutoff analysis', icon: Trophy },
  { href: '/gate-ee/flashcards', label: 'Formula flashcards', icon: Layers },
]

export default function GateEeLandingPage() {
  const schemas = [
    organizationSchema(),
    websiteSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'GATE EE', path: '/gate-ee' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'GATE Electrical Engineering Preparation',
      description:
        'Structured GATE EE preparation workspace covering syllabus planning, previous-year questions, flashcards, lectures, tests, and cutoff analysis.',
      provider: {
        '@type': 'Organization',
        name: 'GATEPrep Pro',
        sameAs: absoluteUrl('/gate-ee'),
      },
      educationalLevel: 'Graduate entrance exam preparation',
      teaches: GATE_EE_SUBJECTS,
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'Self-paced',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'GATE EE preparation guides',
      itemListElement: PUBLIC_SEO_PAGES.map((page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: page.h1,
        url: absoluteUrl(`/gate-ee/${page.slug}`),
      })),
    },
  ]

  return (
    <>
      <JsonLd data={schemas} />
      <main className="min-h-screen bg-background text-foreground">
        <section className="border-b border-border bg-card/35">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
            <div>
              <Link href="/" className="text-sm font-medium text-primary hover:underline">
                Open the study dashboard
              </Link>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                GATE EE preparation, organized around what actually compounds
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                GATEPrep Pro connects Electrical Engineering syllabus planning, lectures, PYQs,
                flashcards, tests, notes, and cutoff analysis so preparation stays measurable from
                the first topic to final revision.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Sign in to plan
                </Link>
                <Link
                  href="/gate-ee/syllabus"
                  className="inline-flex min-h-11 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-secondary"
                >
                  Explore syllabus
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <GraduationCap aria-hidden size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold">GATE Electrical Engineering</p>
                  <p className="text-xs text-muted-foreground">Syllabus, practice, revision, analytics</p>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border p-3">
                  <dt className="text-xs text-muted-foreground">Subjects tracked</dt>
                  <dd className="mt-1 text-2xl font-semibold">{GATE_EE_SUBJECTS.length}</dd>
                </div>
                <div className="rounded-md border border-border p-3">
                  <dt className="text-xs text-muted-foreground">PYQ weightage years</dt>
                  <dd className="mt-1 text-2xl font-semibold">2017-2025</dd>
                </div>
                <div className="rounded-md border border-border p-3">
                  <dt className="text-xs text-muted-foreground">Core workflows</dt>
                  <dd className="mt-1 text-2xl font-semibold">8</dd>
                </div>
                <div className="rounded-md border border-border p-3">
                  <dt className="text-xs text-muted-foreground">Mode</dt>
                  <dd className="mt-1 text-2xl font-semibold">Online</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">Preparation guides</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featureLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-border bg-card p-5 transition hover:border-primary/50 hover:bg-secondary/30"
              >
                <item.icon className="h-5 w-5 text-primary" aria-hidden />
                <p className="mt-4 font-medium group-hover:text-primary">{item.label}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">High-signal subjects</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The app keeps subjects normalized so lectures, tasks, notes, flashcards, and test
                performance can all feed the same weak-topic loop.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {GATE_EE_WEIGHTAGE.slice(0, 10).map((row) => (
                <div key={row.subject} className="rounded-md border border-border bg-card px-4 py-3">
                  <p className="text-sm font-medium">{row.subject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Avg {row.average}% · 2025 {row.latest}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

