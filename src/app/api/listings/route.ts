import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProfileByUserId } from '@/lib/queries/profiles'
import { createListing } from '@/lib/queries/listings'
import type { CreateListingInput } from '@/lib/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await getProfileByUserId(user.id)
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 400 })
  }

  let body: Partial<CreateListingInput>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { dog_name, breed, city, state, short_summary, description } = body
  if (!dog_name || !breed || !city || !state || !short_summary || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const listing = await createListing(body as CreateListingInput, user.id, profile.id)
    return NextResponse.json(listing)
  } catch (err) {
    console.error('Create listing error:', err)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}
