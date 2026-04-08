export interface Profile {
  id: string
  user_id: string
  display_name: string
  slug: string
  kennel_name?: string | null
  bio?: string | null
  city?: string | null
  state?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface StudListing {
  id: string
  user_id: string
  profile_id: string
  slug: string
  dog_name: string
  breed: string
  age?: number | null
  city: string
  state: string
  stud_fee?: number | null
  contact_for_fee: boolean
  short_summary: string
  description: string
  primary_image_url?: string | null
  color?: string | null
  weight?: number | null
  pedigree_text?: string | null
  health_testing?: string | null
  akc_registered: boolean
  availability_status: 'available' | 'unavailable' | 'limited'
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface StudImage {
  id: string
  listing_id: string
  image_url: string
  sort_order: number
  created_at: string
}

export interface Inquiry {
  id: string
  listing_id: string
  breeder_user_id: string
  sender_name: string
  sender_email: string
  sender_phone?: string | null
  message: string
  status: 'new' | 'read' | 'replied'
  ip_address?: string | null
  user_agent?: string | null
  created_at: string
  stud_listings?: StudListing
}

export interface ListingFilters {
  breed?: string
  state?: string
  availability?: string
  keyword?: string
}

export interface CreateListingInput {
  dog_name: string
  breed: string
  age?: number
  city: string
  state: string
  stud_fee?: number
  contact_for_fee: boolean
  short_summary: string
  description: string
  primary_image_url?: string
  color?: string
  weight?: number
  pedigree_text?: string
  health_testing?: string
  akc_registered: boolean
  availability_status: 'available' | 'unavailable' | 'limited'
  status: 'draft' | 'published'
}

export interface UpdateListingInput extends Partial<CreateListingInput> {
  id: string
}
