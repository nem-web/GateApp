'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function isSameOriginApi(input: RequestInfo | URL) {
  if (typeof window === 'undefined') return false

  const url =
    typeof input === 'string'
      ? new URL(input, window.location.origin)
      : input instanceof URL
      ? input
      : new URL(input.url)

  return url.origin === window.location.origin && url.pathname.startsWith('/api/')
}

function requestMethod(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method) return init.method.toUpperCase()
  if (typeof Request !== 'undefined' && input instanceof Request) return input.method.toUpperCase()
  return 'GET'
}

export function ReadOnlyMode() {
  const pathname = usePathname()
  const { status } = useSession()
  const isLoginPage = pathname.startsWith('/login')
  const isReadOnly = status === 'unauthenticated' && !isLoginPage

  useEffect(() => {
    if (!isReadOnly) return

    const originalFetch = window.fetch.bind(window)

    window.fetch = async (input, init) => {
      const method = requestMethod(input, init)

      if (MUTATING_METHODS.has(method) && isSameOriginApi(input)) {
        toast.info('Sign in to edit or save changes.')
        return new Response(JSON.stringify({ error: 'Sign in to edit or save changes.' }), {
          status: 401,
          headers: { 'content-type': 'application/json' },
        })
      }

      return originalFetch(input, init)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [isReadOnly])

  if (!isReadOnly) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-warning/30 bg-warning/15 px-4 py-2 text-center text-xs font-medium text-warning backdrop-blur">
      View-only mode.{' '}
      <a href="/login" className="underline underline-offset-4">
        Sign in
      </a>{' '}
      to edit, upload, save, or delete.
    </div>
  )
}
