import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

async function checkRateLimit(ip: string): Promise<boolean> {
  // Persistent rate limiting via DB — survives serverless cold starts
  const admin = createAdminClient()
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString()
  const { count, error } = await admin
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', since)

  if (error) return true // fail open — don't block on DB error
  return (count ?? 0) < RATE_LIMIT
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!(await checkRateLimit(ip))) {
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

  // Email notification to breeder via Resend (non-blocking)
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    // Look up breeder email
    const { data: breederData } = await admin.auth.admin.getUserById(String(breeder_user_id))
    const breederEmail = breederData?.user?.email
    if (breederEmail) {
      const listingSlug = await admin
        .from('stud_listings')
        .select('dog_name, slug')
        .eq('id', String(listing_id))
        .single()
      const dogName = listingSlug.data?.dog_name ?? 'your stud'
      const listingUrl = `https://dogstud.com/studs/${listingSlug.data?.slug ?? ''}`

      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'DOGSTUD <noreply@dogstud.com>',
          to: [breederEmail],
          subject: `New inquiry for ${dogName}`,
          html: `
            <p>You have a new inquiry for <strong>${dogName}</strong>.</p>
            <p><strong>From:</strong> ${String(sender_name)} (${String(sender_email)})</p>
            ${sender_phone ? `<p><strong>Phone:</strong> ${String(sender_phone)}</p>` : ''}
            <p><strong>Message:</strong></p>
            <blockquote style="border-left:3px solid #2F7D5C;padding-left:12px;color:#444;">
              ${String(message).replace(/\n/g, '<br/>')}
            </blockquote>
            <p><a href="${listingUrl}" style="color:#2F7D5C;">View listing on DOGSTUD</a></p>
          `,
        }),
      }).catch((err) => console.error('Email notification failed:', err))
    }
  }

  return NextResponse.json({ ok: true })
}
