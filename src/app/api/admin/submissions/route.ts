import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateSubmissionSlug } from '@/lib/submissions'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'ds-admin-2025'

function isAuthorized(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || req.nextUrl.searchParams.get('token')
  return token === ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const status = req.nextUrl.searchParams.get('status') || undefined

  let query = admin
    .from('pending_stud_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...update } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const admin = createAdminClient()

  // When approving: auto-generate slug, set published_at, set primary_image
  if (update.status === 'approved') {
    // Fetch current row to get name/breed/city/state/photos/slug
    const { data: row, error: fetchErr } = await admin
      .from('pending_stud_submissions')
      .select('id, dog_name, breed, city, state, photos, slug, primary_image, published_at')
      .eq('id', id)
      .single()

    if (fetchErr || !row) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Generate slug if missing (or if admin explicitly set one via update.slug)
    if (!update.slug && !row.slug) {
      update.slug = await generateSubmissionSlug(
        row.dog_name, row.breed, row.city, row.state, row.id
      )
    }

    // Set published_at if not already set
    if (!row.published_at && !update.published_at) {
      update.published_at = new Date().toISOString()
    }

    // Set primary_image from first photo if not already set
    if (!row.primary_image && !update.primary_image) {
      const photos: string[] = row.photos || []
      if (photos.length > 0) {
        update.primary_image = photos[0]
      }
    }
  }

  const { error } = await admin
    .from('pending_stud_submissions')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return updated slug so admin panel can build the public URL
  const { data: updated } = await admin
    .from('pending_stud_submissions')
    .select('id, slug, status, published_at')
    .eq('id', id)
    .single()

  return NextResponse.json({ success: true, listing: updated })
}
