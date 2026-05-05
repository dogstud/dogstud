import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateProfile } from '@/lib/queries/profiles'

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { display_name, kennel_name, bio, city, state } = body

  if (!display_name || typeof display_name !== 'string') {
    return NextResponse.json({ error: 'Display name is required' }, { status: 400 })
  }

  try {
    const profile = await updateProfile(user.id, {
      display_name: display_name.slice(0, 100),
      kennel_name: kennel_name?.slice(0, 100) || null,
      bio: bio?.slice(0, 1000) || null,
      city: city?.slice(0, 100) || null,
      state: state?.slice(0, 2) || null,
    })
    return NextResponse.json(profile)
  } catch (err) {
    console.error('Update profile error:', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
