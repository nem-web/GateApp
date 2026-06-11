'use client'

import { useEffect, useState } from 'react'

type Profile = {
  telegramLinked: boolean
  telegramUsername: string | null
  telegramLinkedAt: string | null
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>({
    telegramLinked: false,
    telegramUsername: null,
    telegramLinkedAt: null,
  })
  const [status, setStatus] = useState<string | null>(null)
  const [connectUrl, setConnectUrl] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  const loadProfile = async () => {
    const res = await fetch('/api/user/me', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    setProfile({
      telegramLinked: Boolean(data.telegramLinked),
      telegramUsername:
        typeof data.telegramUsername === 'string' && data.telegramUsername.trim()
          ? data.telegramUsername
          : null,
      telegramLinkedAt:
        typeof data.telegramLinkedAt === 'string' ? data.telegramLinkedAt : null,
    })
  }

  useEffect(() => {
    void loadProfile()
  }, [])

  const connectTelegram = async () => {
    setConnecting(true)
    setStatus('Generating secure Telegram link...')
    setConnectUrl(null)

    try {
      const res = await fetch('/api/telegram/link-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus(typeof data.error === 'string' ? data.error : 'Could not generate Telegram link.')
        return
      }

      const url = typeof data.telegramUrl === 'string' ? data.telegramUrl : null
      setConnectUrl(url)
      setStatus(
        url
          ? 'Link ready. Open Telegram to finish linking your account.'
          : 'Link generated.',
      )
      await loadProfile()
    } catch {
      setStatus('Could not generate Telegram link.')
    } finally {
      setConnecting(false)
    }
  }

  const linkedLabel = profile.telegramUsername ? `@${profile.telegramUsername}` : 'Linked'

  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      <p className="text-muted-foreground mt-1 mb-6">Manage your integrations and account preferences</p>

      <section className="bg-card border border-border rounded-xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Telegram Integration</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect Telegram to receive reminders, revisions, quizzes, and productivity coaching.
            </p>
            {profile.telegramLinked ? (
              <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
                Connected as {linkedLabel}
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Not connected</p>
            )}
          </div>

          <button
            type="button"
            onClick={connectTelegram}
            disabled={connecting}
            className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {connecting ? 'Generating...' : 'Connect Telegram'}
          </button>
        </div>

        {connectUrl ? (
          <a
            href={connectUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary hover:bg-secondary"
          >
            Open Telegram to connect
          </a>
        ) : null}

        {status ? <p className="mt-4 text-sm text-muted-foreground">{status}</p> : null}
      </section>
    </div>
  )
}
