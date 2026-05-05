import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Basic validation
    const required = ['dog_name','breed','color_traits','city','state','owner_name','phone_number','email','description']
    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    if (!body.ownership_confirmed) {
      return NextResponse.json({ error: 'You must confirm ownership' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data, error } = await admin
      .from('pending_stud_submissions')
      .insert({
        dog_name: body.dog_name.trim(),
        breed: body.breed.trim(),
        sex: 'male',
        age: body.age ? parseInt(body.age) : null,
        dob: body.dob || null,
        color_traits: body.color_traits.trim(),
        city: body.city.trim(),
        state: body.state.trim(),
        stud_fee: body.stud_fee ? parseFloat(body.stud_fee) : null,
        owner_name: body.owner_name.trim(),
        phone_number: body.phone_number.trim(),
        email: body.email.trim().toLowerCase(),
        description: body.description.trim(),
        akc_status: body.akc_status || null,
        health_testing: body.health_testing || null,
        chilled_semen_available: body.chilled_semen_available === true,
        photos: body.photos || [],
        ownership_confirmed: true,
        source: 'organic',
      })
      .select('id, edit_token')
      .single()

    if (error) throw error

    // Track event (fire and forget)
    admin.from('listing_events').insert({
      event_type: 'listing_submitted',
      submission_id: data.id,
      metadata: { breed: body.breed, state: body.state },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    }).then(() => null, () => null)

    return NextResponse.json({ success: true, id: data.id, edit_token: data.edit_token })
  } catch (err) {
    console.error('submit-listing error:', err)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
