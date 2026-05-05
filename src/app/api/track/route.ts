import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const admin = createAdminClient()
    await admin.from('listing_events').insert({
      event_type: body.event_type,
      listing_id: body.listing_id || null,
      submission_id: body.submission_id || null,
      metadata: body.metadata || {},
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // fail silently
  }
}
