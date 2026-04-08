import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUserListings } from '@/lib/queries/listings'
import ListingsTable from '@/components/dashboard/ListingsTable'

export default async function DashboardListingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const listings = await getUserListings(user.id).catch(() => [])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-md"
          style={{ backgroundColor: '#0B1F2A' }}
        >
          + New Listing
        </Link>
      </div>
      <ListingsTable listings={listings} />
    </div>
  )
}
