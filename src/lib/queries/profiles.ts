import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getProfile(slug: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as Profile
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as Profile
}

export async function updateProfile(
  userId: string,
  input: Partial<Omit<Profile, 'id' | 'user_id' | 'slug' | 'created_at' | 'updated_at'>>
): Promise<Profile> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  revalidatePath(`/breeders/${(data as Profile).slug}`)
  return data as Profile
}
