import { PublicNavbar } from '@/components/PublicNavbar'
import { PublicFooter } from '@/components/PublicFooter'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Added overflow-x-hidden to strictly enforce bounding box constraints
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* <PublicNavbar /> */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}