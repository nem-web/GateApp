import SidebarNav from '@/components/SidebarNav'

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
      <div className="flex min-h-0 flex-1 flex-col lg:pl-[220px] lg:pt-4">
        {/* Mobile top spacer for fixed header */}
        <div className="h-14 shrink-0 lg:hidden" aria-hidden />
        <div className="flex min-h-[calc(100dvh-3.6rem)] flex-1 flex-col pb-24 lg:pb-12 lg:min-h-[calc(100vh-5rem)]">
          {children}
        </div>
      </div>
    </div>
  )
}
