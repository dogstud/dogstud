import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateListing, deleteListing } from '@/lib/queries/listings'
import type { CreateListingInput } from '@/lib/types'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Partial<CreateListingInput>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const listing = await updateListing(id, user.id, body)
    return NextResponse.json(listing)
  } catch (err) {
    console.error('Update listing error:', err)
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await deleteListing(id, user.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete listing error:', err)
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }
}
