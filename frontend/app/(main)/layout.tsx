import SidebarNav from '@/components/SidebarNav'
import AppBreadcrumbs from '@/components/AppBreadcrumbs'
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Study Dashboard',
  description:
    'Private GATE EE study dashboard for tracking subjects, streaks, tests, weak areas, tasks, notes, lectures, and flashcards.',
  path: '/',
  // noIndex: true,
  verification: {
    google: 'U-oJ-qB-eYH3oMEy6D4dTQXDvokCVxM7ACfsGKiYnHY',
  },
})

export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-100 dark:opacity-90"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-15%,rgba(108,99,255,0.14),transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      </div>
      <SidebarNav />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden lg:pl-[220px] lg:pt-4">
        {/* Mobile top spacer for fixed header */}
        <div className="h-14 shrink-0 lg:hidden" aria-hidden />
        <div className="flex min-h-[calc(100dvh-3.6rem)] min-w-0 flex-1 flex-col pb-24 lg:min-h-[calc(100vh-5rem)] lg:pb-12">
          <AppBreadcrumbs />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
