import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type TelegramUpdate = {
  message?: {
    text?: string
    chat?: {
      id?: number
      type?: string
      username?: string
    }
    from?: {
      username?: string
    }
  }
}

function tokenHash(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
  if (!botToken) return

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

export async function POST(req: Request) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim()
  if (expectedSecret) {
    const receivedSecret = req.headers.get('x-telegram-bot-api-secret-token')
    if (receivedSecret !== expectedSecret) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }
  }

  const update = (await req.json().catch(() => null)) as TelegramUpdate | null
  const message = update?.message
  const chatId = message?.chat?.id
  const text = message?.text?.trim()

  if (!chatId || !text?.startsWith('/start')) {
    return NextResponse.json({ ok: true })
  }

  if (message?.chat?.type !== 'private') {
    await sendTelegramMessage(chatId, 'Please message me directly to link your account.')
    return NextResponse.json({ ok: true })
  }

  const [, rawToken = ''] = text.split(/\s+/, 2)
  const token = rawToken.trim()
  if (!token) {
    await sendTelegramMessage(chatId, 'Open the connect link from GatePrep settings to link your account.')
    return NextResponse.json({ ok: true })
  }

  const now = new Date()
  const linkToken = await prisma.telegramLinkToken.findUnique({
    where: { tokenHash: tokenHash(token) },
    select: { id: true, userId: true, expiresAt: true, consumedAt: true },
  })

  if (!linkToken || linkToken.consumedAt || linkToken.expiresAt <= now) {
    await sendTelegramMessage(chatId, 'This link is invalid or expired. Generate a new one from GatePrep settings.')
    return NextResponse.json({ ok: true })
  }

  const username = message?.from?.username ?? message?.chat?.username ?? null

  await prisma.$transaction([
    prisma.user.update({
      where: { id: linkToken.userId },
      data: {
        telegramChatId: String(chatId),
        telegramUsername: username,
        telegramLinkedAt: now,
      },
    }),
    prisma.telegramLinkToken.update({
      where: { id: linkToken.id },
      data: { consumedAt: now },
    }),
  ])

  await sendTelegramMessage(chatId, '✅ Telegram linked to your GatePrep account. You will now receive reminders and productivity updates here.')

  return NextResponse.json({ ok: true })
}
