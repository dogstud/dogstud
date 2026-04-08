import { supabase } from './supabase'

export async function trackSearch(breed: string, location: string, userId?: string) {
  await supabase.from('search_events').insert({ breed, location, user_id: userId })
}

export async function trackListingView(studId: string, breed: string, location: string, viewerId?: string) {
  await supabase.from('listing_views').insert({ stud_id: studId, breed, location, viewer_id: viewerId })
  await supabase.rpc('increment_views', { stud_id: studId })
}

export async function trackMessage(conversationId: string, studId: string, breed: string, buyerLocation?: string) {
  await supabase.from('message_events').insert({ conversation_id: conversationId, stud_id: studId, breed, buyer_location: buyerLocation })
}
