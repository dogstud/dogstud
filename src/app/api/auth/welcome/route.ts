import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildWelcomeEmail } from '@/lib/email/welcome'
import { buildOnboardingEmail1 } from '@/lib/email/onboarding'

export async function POST(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only send welcome email if account was created within the last 5 minutes
  const createdAt = new Date(user.created_at).getTime()
  if (Date.now() - createdAt > 5 * 60 * 1000) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ ok: true })

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('display_name')
    .eq('user_id', user.id)
    .single()

  const displayName = (profile?.display_name as string) || user.email?.split('@')[0] || 'there'
  const firstName = displayName.split(' ')[0]
  const html = buildWelcomeEmail(displayName)

  // Send welcome email
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'DOGSTUD <welcome@dogstud.com>',
      to: [user.email!],
      subject: `Welcome to DOGSTUD, ${firstName}`,
      html,
    }),
  }).catch((err) => console.error('Welcome email error:', err))

  // Send onboarding email 1
  const onboardingHtml = buildOnboardingEmail1(firstName)
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'DogStud <hello@dogstud.com>',
      to: [user.email!],
      subject: 'List your stud dog in 60 seconds — dogstud.com',
      html: onboardingHtml,
    }),
  }).catch((err) => console.error('Onboarding email 1 error:', err))

  return NextResponse.json({ ok: true })
}
