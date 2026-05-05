import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProfile } from '@/lib/queries/profiles'
import { getListings } from '@/lib/queries/listings'
import ListingGrid from '@/components/listings/ListingGrid'
import Card from '@/components/ui/Card'
import type { StudListing } from '@/lib/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const profile = await getProfile(slug)
  if (!profile) return { title: 'Breeder Not Found' }
  return {
    title: `${profile.display_name} — Breeder Profile | DOGSTUD`,
    description: profile.bio ?? `Browse stud listings from ${profile.display_name}`,
  }
}

export default async function BreederProfilePage({ params }: PageProps) {
  const { slug } = await params
  const profile = await getProfile(slug)
  if (!profile) notFound()

  let listings: StudListing[] = []
  try {
    const all = await getListings()
    listings = all.filter((l) => l.profile_id === profile.id)
  } catch {
    // DB not seeded
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/studs" className="hover:text-gray-800">Browse Studs</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{profile.display_name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3"
                style={{ backgroundColor: '#0B1F2A' }}
              >
                {profile.display_name[0]?.toUpperCase()}
              </div>
              <h1 className="font-bold text-gray-900 text-lg">{profile.display_name}</h1>
              {profile.kennel_name && (
                <p className="text-sm text-gray-500 mt-0.5">{profile.kennel_name}</p>
              )}
              {(profile.city || profile.state) && (
                <p className="text-xs text-gray-400 mt-1">
                  {[profile.city, profile.state].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            {profile.bio && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 mt-4">
              <p className="text-xs text-gray-400">
                {listings.length} active listing{listings.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        </div>

        {/* Listings */}
        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Stud Listings by {profile.display_name}
          </h2>
          <ListingGrid listings={listings} />
        </div>
      </div>
    </div>
  )
}
