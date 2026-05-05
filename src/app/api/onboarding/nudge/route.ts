import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildOnboardingEmail2, buildOnboardingEmail3 } from '@/lib/email/onboarding'

// Called by external cron. Sends email 2 at 24h, email 3 at 72h, skips if user has a listing.
// Secure with CRON_SECRET env var: Authorization: Bearer <CRON_SECRET>
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: 'No Resend key' }, { status: 500 })

  const admin = createAdminClient()

  // Get all users who signed up
  const { data: { users }, error: usersErr } = await admin.auth.admin.listUsers({ perPage: 1000 })
  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 500 })

  const now = Date.now()
  const results = { email2_sent: 0, email3_sent: 0, skipped: 0 }

  for (const user of users) {
    if (!user.email) continue
    const createdAt = new Date(user.created_at).getTime()
    const ageMs = now - createdAt
    const ageHours = ageMs / (1000 * 60 * 60)

    // Only process users in 24-96h window
    if (ageHours < 24 || ageHours > 96) continue

    // Check if user has a listing
    const { count } = await admin
      .from('stud_listings')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count ?? 0) > 0) {
      results.skipped++
      continue
    }

    // Get display name
    const { data: profile } = await admin
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single()

    const displayName = (profile?.display_name as string) || user.email.split('@')[0] || 'there'
    const firstName = displayName.split(' ')[0]

    if (ageHours >= 24 && ageHours < 48) {
      // Email 2
      const html = buildOnboardingEmail2(firstName)
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'DogStud <hello@dogstud.com>',
          to: [user.email],
          subject: 'Breeders are searching right now',
          html,
        }),
      }).catch((e) => console.error('nudge email2 error', e))
      results.email2_sent++
    } else if (ageHours >= 72 && ageHours < 96) {
      // Email 3
      const html = buildOnboardingEmail3(firstName)
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'DogStud <hello@dogstud.com>',
          to: [user.email],
          subject: 'Quick question about your stud',
          html,
        }),
      }).catch((e) => console.error('nudge email3 error', e))
      results.email3_sent++
    }
  }

  return NextResponse.json({ ok: true, ...results })
}

export async function GET() {
  return NextResponse.json({ info: 'POST to this endpoint with Authorization: Bearer <CRON_SECRET> to trigger nudge emails.' })
}
