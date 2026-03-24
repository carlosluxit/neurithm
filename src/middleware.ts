import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimits: Record<string, { max: number; windowMs: number }> = {
  '/api/leads': { max: 5, windowMs: 60_000 },
  '/api/subscribe': { max: 3, windowMs: 60_000 },
  '/api/whitepaper': { max: 5, windowMs: 60_000 },
  '/api/email': { max: 10, windowMs: 60_000 },
  '/api/generate-image': { max: 2, windowMs: 60_000 },
}

const requests = new Map<string, { count: number; resetAt: number }>()

// Cleanup stale entries every 5 minutes
let lastCleanup = Date.now()
function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < 300_000) return
  lastCleanup = now
  for (const [key, val] of requests) {
    if (val.resetAt < now) requests.delete(key)
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const limit = rateLimits[pathname]
  if (!limit) return NextResponse.next()

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const key = `${ip}:${pathname}`
  const now = Date.now()

  cleanup()

  const entry = requests.get(key)

  if (!entry || entry.resetAt < now) {
    requests.set(key, { count: 1, resetAt: now + limit.windowMs })
    return NextResponse.next()
  }

  if (entry.count >= limit.max) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) } }
    )
  }

  entry.count++
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
