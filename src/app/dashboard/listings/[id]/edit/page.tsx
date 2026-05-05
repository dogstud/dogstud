import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserListingById } from '@/lib/queries/listings'
import ListingForm from '@/components/listings/ListingForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const listing = await getUserListingById(id, user.id)
  if (!listing) notFound()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Edit Listing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Update details for {listing.dog_name}.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ListingForm mode="edit" initialData={listing} />
      </div>
    </div>
  )
}
