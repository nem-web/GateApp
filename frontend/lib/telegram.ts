import crypto from 'crypto'

export function telegramTokenHash(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN missing; skipping Telegram sendMessage call')
    return
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    if (!res.ok) {
      console.error(`Telegram sendMessage failed with status ${res.status}`)
    }
  } catch (error) {
    console.error('Telegram sendMessage request failed', error)
  }
}
