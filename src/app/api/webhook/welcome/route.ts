/**
 * Supabase webhook: fires on auth.users INSERT (new confirmed signup)
 * Sends branded welcome email via Resend
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildWelcomeEmail } from '@/lib/email/welcome'

export async function POST(request: NextRequest) {
  // Verify webhook secret
  const secret = request.headers.get('x-webhook-secret')
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const record = body.record as Record<string, unknown> | undefined
  if (!record) return NextResponse.json({ ok: true })

  const email = record.email as string | undefined
  const userId = record.id as string | undefined
  if (!email || !userId) return NextResponse.json({ ok: true })

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('RESEND_API_KEY not set — skipping welcome email')
    return NextResponse.json({ ok: true })
  }

  // Get display name from profile
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('display_name')
    .eq('user_id', userId)
    .single()

  const displayName = (profile?.display_name as string) || email.split('@')[0]

  const html = buildWelcomeEmail(displayName)

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'DOGSTUD <welcome@dogstud.com>',
      to: [email],
      subject: `Welcome to DOGSTUD, ${displayName.split(' ')[0]}`,
      html,
    }),
  }).catch((err) => console.error('Welcome email failed:', err))

  return NextResponse.json({ ok: true })
}
