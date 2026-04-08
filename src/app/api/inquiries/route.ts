import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// In-memory rate limit: max 3 per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3_600_000 })
    return true
  }

  if (entry.count >= 3) return false
  entry.count++
  return true
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before sending another inquiry.' },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Honeypot check
  if (body.honeypot) {
    return NextResponse.json({ ok: true }) // Silent success for bots
  }

  const { listing_id, breeder_user_id, sender_name, sender_email, message, sender_phone } = body

  // Validate required fields
  if (!listing_id || !breeder_user_id || !sender_name || !sender_email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (typeof sender_email !== 'string' || !sender_email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  if (typeof message !== 'string' || message.length < 10) {
    return NextResponse.json({ error: 'Message too short' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('inquiries').insert({
    listing_id,
    breeder_user_id,
    sender_name: String(sender_name).slice(0, 100),
    sender_email: String(sender_email).slice(0, 200),
    sender_phone: sender_phone ? String(sender_phone).slice(0, 30) : null,
    message: String(message).slice(0, 2000),
    ip_address: ip,
    user_agent: request.headers.get('user-agent') ?? null,
    honeypot: null,
  })

  if (error) {
    console.error('Inquiry insert error:', error)
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
