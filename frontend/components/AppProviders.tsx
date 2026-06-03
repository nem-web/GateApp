'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { ReadOnlyMode } from '@/components/ReadOnlyMode'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import { StudyPlanNotifications } from '@/components/StudyPlanNotifications'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="gateprep-theme">
        <ServiceWorkerRegistration />
        <ReadOnlyMode />
        <StudyPlanNotifications />
        {children}
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </SessionProvider>
  )
}

