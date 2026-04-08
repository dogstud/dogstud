import { createClient } from '@/lib/supabase/server'
import type { Inquiry } from '@/lib/types'

export async function getUserInquiries(userId: string): Promise<Inquiry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, stud_listings(id, slug, dog_name, breed)')
    .eq('breeder_user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Inquiry[]) ?? []
}

export async function markInquiryRead(id: string, userId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('inquiries')
    .update({ status: 'read' })
    .eq('id', id)
    .eq('breeder_user_id', userId)

  if (error) throw error
}
