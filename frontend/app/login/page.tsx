'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProviders, signIn, useSession } from 'next-auth/react'
import { BookOpen, Loader2, Lock, UserPlus } from 'lucide-react'

type AuthMode = 'sign-in' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasGoogle, setHasGoogle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callbackUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/'
    return new URLSearchParams(window.location.search).get('callbackUrl') || '/'
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl)
    }
  }, [callbackUrl, router, status])

  useEffect(() => {
    getProviders()
      .then((providers) => setHasGoogle(Boolean(providers?.google)))
      .catch(() => setHasGoogle(false))
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(typeof data.error === 'string' ? data.error : 'Could not create account.')
        }
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        throw new Error('Invalid email or password.')
      }

      router.replace(result?.url || callbackUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-border bg-card shadow-2xl lg:grid-cols-[1fr_420px]">
          <section className="hidden bg-secondary/40 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">GATEPrep Pro</h1>
                  <p className="text-sm text-muted-foreground">Your GATE exam companion</p>
                </div>
              </div>
              <p className="max-w-md text-3xl font-semibold leading-tight">
                Sign in to edit your notes, plans, uploads, tests, and progress.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Visitors can browse in view-only mode. Your session stays active until you manually
              sign out.
            </p>
          </section>

          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary lg:hidden">
                <Lock size={20} />
              </div>
              <h2 className="text-2xl font-semibold">
                {mode === 'sign-in' ? 'Sign in' : 'Create account'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === 'sign-in'
                  ? 'Use your account to unlock editing.'
                  : 'Create an account, then keep working without surprise logouts.'}
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Name</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
                  />
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-sm font-medium">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">Password</span>
                <input
                  type="password"
                  autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
                />
              </label>

              {error && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
                {mode === 'sign-in' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            {hasGoogle && (
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl })}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition hover:bg-secondary"
              >
                Continue with Google
              </button>
            )}

            <div className="mt-6 flex flex-col gap-3 text-center text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => {
                  setMode((current) => (current === 'sign-in' ? 'register' : 'sign-in'))
                  setError(null)
                }}
                className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
              >
                <UserPlus size={15} />
                {mode === 'sign-in'
                  ? 'Need an account? Create one'
                  : 'Already have an account? Sign in'}
              </button>
              <Link href="/" className="hover:text-foreground">
                Continue in view-only mode
              </Link>
              <Link href="/gate-ee" className="hover:text-foreground">
                Read the GATE EE preparation guide
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
