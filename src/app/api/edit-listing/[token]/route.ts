import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('pending_stud_submissions')
    .select('id, dog_name, breed, color_traits, city, state, stud_fee, owner_name, phone_number, email, description, akc_status, health_testing, chilled_semen_available, photos, age, dob, status')
    .eq('edit_token', token)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const body = await req.json()
  const admin = createAdminClient()

  const allowed = ['dog_name','breed','color_traits','city','state','stud_fee','owner_name','phone_number','email','description','akc_status','health_testing','chilled_semen_available','photos','age','dob']
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (key in body) update[key] = body[key]
  }

  const { error } = await admin
    .from('pending_stud_submissions')
    .update(update)
    .eq('edit_token', token)

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ success: true })
}
