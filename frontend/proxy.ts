import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
const PUBLIC_MUTATION_PATHS = new Set(['/api/auth/register'])

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/api/auth/') ||
    !MUTATING_METHODS.has(req.method) ||
    PUBLIC_MUTATION_PATHS.has(pathname)
  ) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token?.sub) {
    return NextResponse.json(
      { error: 'Sign in to edit or save changes.' },
      { status: 401 },
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
