/**
 * Phase 2 — public queries against pending_stud_submissions (approved only)
 * All reads use service-role admin client so RLS doesn't block public pages.
 * NEVER expose edit_token, email, phone in public queries.
 */

import { createAdminClient } from '@/lib/supabase/admin'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PublicSubmission {
  id: string
  slug: string
  dog_name: string
  breed: string
  age: number | null
  dob: string | null
  color_traits: string
  city: string
  state: string
  stud_fee: number | null
  description: string
  akc_status: string | null
  health_testing: string | null
  chilled_semen_available: boolean
  photos: string[]
  primary_image: string | null
  featured: boolean
  verified: boolean
  published_at: string | null
  created_at: string
}

export interface PublicSubmissionWithContact extends PublicSubmission {
  owner_name: string
  phone_number: string
}

export interface DirectoryFilters {
  breed?: string
  state?: string
  city?: string
  color?: string
  chilled?: boolean
  verified?: boolean
  featured?: boolean
  limit?: number
  offset?: number
}

// ── Slug generation ───────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function generateSubmissionSlug(
  dogName: string,
  breed: string,
  city: string,
  state: string,
  id: string
): Promise<string> {
  const base = slugify(`${dogName} ${breed} ${city} ${state}`)
  const admin = createAdminClient()

  // Check if base slug is taken
  const { data } = await admin
    .from('pending_stud_submissions')
    .select('id')
    .eq('slug', base)
    .maybeSingle()

  if (!data) return base

  // Append short ID suffix
  const suffix = id.replace(/-/g, '').slice(0, 6)
  return `${base}-${suffix}`
}

// ── Public SELECT fields (never expose edit_token / email / raw phone) ─────────

const PUBLIC_FIELDS = [
  'id', 'slug', 'dog_name', 'breed', 'age', 'dob',
  'color_traits', 'city', 'state', 'stud_fee', 'description',
  'akc_status', 'health_testing', 'chilled_semen_available',
  'photos', 'primary_image', 'featured', 'verified',
  'published_at', 'created_at',
].join(', ')

const PUBLIC_CONTACT_FIELDS = PUBLIC_FIELDS + ', owner_name, phone_number'

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getApprovedListings(
  filters: DirectoryFilters = {}
): Promise<PublicSubmission[]> {
  const admin = createAdminClient()
  let query = admin
    .from('pending_stud_submissions')
    .select(PUBLIC_FIELDS)
    .eq('status', 'approved')
    .not('slug', 'is', null)
    .order('featured', { ascending: false })
    .order('verified', { ascending: false })
    .order('published_at', { ascending: false, nullsFirst: false })

  if (filters.breed) {
    query = query.ilike('breed', `%${filters.breed}%`)
  }
  if (filters.state) {
    query = query.ilike('state', `%${filters.state}%`)
  }
  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`)
  }
  if (filters.color) {
    query = query.ilike('color_traits', `%${filters.color}%`)
  }
  if (filters.chilled === true) {
    query = query.eq('chilled_semen_available', true)
  }
  if (filters.verified === true) {
    query = query.eq('verified', true)
  }
  if (filters.featured === true) {
    query = query.eq('featured', true)
  }

  const limit = filters.limit ?? 48
  const offset = filters.offset ?? 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query
  if (error) {
    console.error('getApprovedListings error:', error.message)
    return []
  }
  return (data ?? []) as unknown as PublicSubmission[]
}

export async function getApprovedListingBySlug(
  slug: string
): Promise<PublicSubmissionWithContact | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('pending_stud_submissions')
    .select(PUBLIC_CONTACT_FIELDS)
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle()

  if (error || !data) return null
  return data as unknown as PublicSubmissionWithContact
}

export async function getApprovedCount(): Promise<number> {
  const admin = createAdminClient()
  const { count } = await admin
    .from('pending_stud_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'approved')
  return count ?? 0
}

export async function getApprovedBreeds(): Promise<string[]> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('pending_stud_submissions')
    .select('breed')
    .eq('status', 'approved')
  const breeds = [...new Set((data ?? []).map((r: { breed: string }) => r.breed).filter(Boolean))]
  return breeds.sort()
}

export async function getApprovedStates(): Promise<string[]> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('pending_stud_submissions')
    .select('state')
    .eq('status', 'approved')
  const states = [...new Set((data ?? []).map((r: { state: string }) => r.state).filter(Boolean))]
  return states.sort()
}
