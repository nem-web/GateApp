import { PublicNavbar } from '@/components/PublicNavbar'
import { PublicFooter } from '@/components/PublicFooter'
import { SocialBar } from "@/components/ads/SocialBar";
import { PopunderController } from "@/components/ads/PopunderController";
import { AdEngagementTracker } from "@/components/ads/AdEngagementTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Added overflow-x-hidden to strictly enforce bounding box constraints
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      <PublicNavbar />
      <PopunderController />
      <AdEngagementTracker />
      <main className="flex-1 flex w-full flex-col pb-14">
        {children}
      </main>
      <SocialBar />
      <PublicFooter />
    </div>
  )
}