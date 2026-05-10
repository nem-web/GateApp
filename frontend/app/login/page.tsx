'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">GATEPrep Pro</p>
        </div>
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
        />
        <button
          type="button"
          className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:brightness-110"
          onClick={() => signIn('credentials', { email, password, callbackUrl: '/' })}
        >
          Continue with email
        </button>
        <p className="text-xs text-muted-foreground text-center">
          APIs work without login using a local demo profile once the database is migrated.{' '}
          <Link href="/" className="text-primary hover:underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
