import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/lib/session'

const LINK_TOKEN_TTL_MINUTES = 15

function tokenHash(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export async function POST() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const botUsername = process.env.TELEGRAM_BOT_USERNAME?.trim()
  if (!botUsername) {
    return NextResponse.json(
      { error: 'Telegram bot is not configured yet.' },
      { status: 503 },
    )
  }

  const token = crypto.randomBytes(24).toString('base64url')
  const expiresAt = new Date(Date.now() + LINK_TOKEN_TTL_MINUTES * 60 * 1000)

  await prisma.telegramLinkToken.create({
    data: {
      userId,
      tokenHash: tokenHash(token),
      expiresAt,
    },
  })

  return NextResponse.json({
    ok: true,
    expiresAt: expiresAt.toISOString(),
    telegramUrl: `https://t.me/${botUsername}?start=${token}`,
  })
}
