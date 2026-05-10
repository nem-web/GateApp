'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="gateprep-theme">
        {children}
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </SessionProvider>
  )
}
