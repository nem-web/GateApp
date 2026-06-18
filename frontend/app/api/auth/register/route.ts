import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 },
    )
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  await prisma.user.create({
    data: {
      email,
      name: name || email.split('@')[0],
      password: await hash(password, 12),
      approved: false,
      approvedAt: null,
      branch: 'EE',
      streamLabel: 'GATE-EE',
      gateDate: new Date('2027-02-05T00:00:00.000Z'),
    },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
