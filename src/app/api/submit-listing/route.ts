import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import https from 'https'

function sendEmail(to: string, subject: string, text: string): Promise<void> {
  return new Promise((resolve) => {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) { resolve(); return }
    const fromEmail = process.env.FROM_EMAIL || 'hello@dogstud.com'
    const from = fromEmail.includes('<') ? fromEmail : `DogStud <${fromEmail}>`
    const body = JSON.stringify({ from, to, subject, text })
    const req = https.request(
      {
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      () => resolve()
    )
    req.on('error', () => resolve())
    req.write(body)
    req.end()
  })
}

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

    // Send email notifications (fire and forget)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'hello@dogstud.com'
    const fromEmail = process.env.FROM_EMAIL || 'hello@dogstud.com'
    const timestamp = new Date().toISOString()
    const editLink = `https://dogstud.com/edit-listing/${data.edit_token}`
    const adminReviewLink = `https://dogstud.com/admin?token=ds-admin-2025`

    void Promise.allSettled([
      sendEmail(
        adminEmail,
        `New DogStud submission: ${body.dog_name}`,
        `New listing submitted on DogStud.com

Dog: ${body.dog_name}
Breed: ${body.breed}
Location: ${body.city}, ${body.state}
Owner: ${body.owner_name}
Phone: ${body.phone_number}
Email: ${body.email}
Submitted: ${timestamp}

Review and approve at:
${adminReviewLink}`
      ),
      sendEmail(
        body.email.trim().toLowerCase(),
        'Your DogStud listing was received',
        `Hi ${body.owner_name},

Your listing for ${body.dog_name} has been received and is under review.

We typically approve listings within 24 hours. Once approved, your listing will be live at dogstud.com/studs.

Save this link to edit your listing at any time:
${editLink}

Questions? Email us at hello@dogstud.com

— The DogStud Team`
      ),
    ]).catch(() => null)

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
