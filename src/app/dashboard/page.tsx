import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUserListings } from '@/lib/queries/listings'
import { getUserInquiries } from '@/lib/queries/inquiries'
import { getProfileByUserId } from '@/lib/queries/profiles'
import Card from '@/components/ui/Card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [listings, inquiries, profile] = await Promise.all([
    getUserListings(user.id).catch(() => []),
    getUserInquiries(user.id).catch(() => []),
    getProfileByUserId(user.id).catch(() => null),
  ])

  const publishedCount = listings.filter((l) => l.status === 'published').length
  const draftCount = listings.filter((l) => l.status === 'draft').length
  const newInquiries = inquiries.filter((i) => i.status === 'new').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-md"
          style={{ backgroundColor: '#0B1F2A' }}
        >
          + New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Published', value: publishedCount },
          { label: 'Drafts', value: draftCount },
          { label: 'Total Inquiries', value: inquiries.length },
          { label: 'New Inquiries', value: newInquiries },
        ].map(({ label, value }) => (
          <Card key={label} padding="md">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Recent Inquiries */}
      {inquiries.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
            <Link
              href="/dashboard/listings"
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              View Listings
            </Link>
          </div>
          <div className="space-y-3">
            {inquiries.slice(0, 5).map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: '#0B1F2A' }}
                >
                  {inquiry.sender_name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{inquiry.sender_name}</p>
                    {inquiry.status === 'new' && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        New
                      </span>
                    )}
                    <p className="text-xs text-gray-400 ml-auto">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {inquiry.stud_listings && (
                    <p className="text-xs text-gray-500">
                      Re: {inquiry.stud_listings.dog_name}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{inquiry.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick links */}
      {listings.length === 0 && (
        <Card>
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">You haven&apos;t created any listings yet.</p>
            <Link
              href="/dashboard/listings/new"
              className="inline-block px-6 py-2.5 text-sm font-semibold text-white rounded-md"
              style={{ backgroundColor: '#0B1F2A' }}
            >
              Create Your First Listing
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
