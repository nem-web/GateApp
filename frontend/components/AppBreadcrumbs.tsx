'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LABELS: Record<string, string> = {
  'study-plan': 'Study Plan',
  todos: 'To-Do List',
  notes: 'Notes',
  flashcards: 'Flashcards',
  lectures: 'Lectures',
  pyq: 'PYQ Papers',
  cutoffs: 'Cutoffs',
  games: 'Games',
  test: 'Tests',
  other: 'Other',
  admin: 'Admin',
}

export default function AppBreadcrumbs() {
  const pathname = usePathname()
  if (pathname === '/' || pathname.startsWith('/admin')) return null

  const segments = pathname.split('/').filter(Boolean)
  if (!segments.length) return null

  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-4 pt-4 text-xs text-muted-foreground lg:px-8">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-foreground">
            Dashboard
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          return (
            <li key={href} className="flex items-center gap-2">
              <span aria-hidden>/</span>
              {isLast ? (
                <span aria-current="page" className="text-foreground">
                  {LABELS[segment] ?? segment}
                </span>
              ) : (
                <Link href={href} className="hover:text-foreground">
                  {LABELS[segment] ?? segment}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

