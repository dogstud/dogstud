import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateListingSlug } from '@/lib/utils/slugify'
import type { StudListing, ListingFilters, CreateListingInput } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getListings(filters: ListingFilters = {}): Promise<StudListing[]> {
  const supabase = await createClient()
  let query = supabase
    .from('stud_listings')
    .select('*, profiles(*)')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters.breed) query = query.ilike('breed', `%${filters.breed}%`)
  if (filters.state) query = query.eq('state', filters.state)
  if (filters.availability) query = query.eq('availability_status', filters.availability)
  if (filters.keyword) {
    query = query.or(
      `dog_name.ilike.%${filters.keyword}%,breed.ilike.%${filters.keyword}%,short_summary.ilike.%${filters.keyword}%`
    )
  }

  const { data, error } = await query
  if (error) throw error
  return (data as StudListing[]) ?? []
}

export async function getFeaturedListings(limit = 6): Promise<StudListing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stud_listings')
    .select('*, profiles(*)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as StudListing[]) ?? []
}

export async function getListing(slug: string): Promise<StudListing | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stud_listings')
    .select('*, profiles(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) return null
  return data as StudListing
}

export async function getUserListings(userId: string): Promise<StudListing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stud_listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as StudListing[]) ?? []
}

export async function getUserListingById(id: string, userId: string): Promise<StudListing | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stud_listings')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as StudListing
}

export async function createListing(
  input: CreateListingInput,
  userId: string,
  profileId: string
): Promise<StudListing> {
  const supabase = await createClient()
  const admin = createAdminClient()

  const slug = await generateListingSlug(
    input.dog_name,
    input.breed,
    input.state,
    async (s) => {
      const { data } = await admin
        .from('stud_listings')
        .select('id')
        .eq('slug', s)
        .single()
      return !!data
    }
  )

  const { data, error } = await supabase
    .from('stud_listings')
    .insert({
      ...input,
      slug,
      user_id: userId,
      profile_id: profileId,
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath('/studs')
  return data as StudListing
}

export async function updateListing(
  id: string,
  userId: string,
  input: Partial<CreateListingInput>
): Promise<StudListing> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stud_listings')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/studs')
  revalidatePath(`/studs/${(data as StudListing).slug}`)
  return data as StudListing
}

export async function deleteListing(id: string, userId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('stud_listings')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
  revalidatePath('/studs')
}
