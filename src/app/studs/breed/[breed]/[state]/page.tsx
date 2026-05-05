import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getApprovedListings } from '@/lib/submissions'
import StudDirectoryGrid from '@/components/directory/StudDirectoryGrid'

interface PageProps {
  params: Promise<{ breed: string; state: string }>
}

function formatBreed(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function formatState(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { breed, state } = await params
  const breedName = formatBreed(breed)
  const stateName = formatState(state)
  return {
    title: `${breedName} Studs in ${stateName} | DogStud`,
    description: `Browse ${breedName} stud dogs in ${stateName}. Find proven ${breedName} studs near you and contact owners directly.`,
    alternates: { canonical: `https://dogstud.com/studs/breed/${breed}/${state}` },
  }
}

export default async function BreedStateDirectoryPage({ params }: PageProps) {
  const { breed, state } = await params
  const breedName = formatBreed(breed)
  const stateName = formatState(state)

  const listings = await getApprovedListings({ breed: breedName, state: stateName, limit: 48 })

  // Return 404 for unknown combos with no listings rather than empty indexed pages
  if (listings.length === 0) {
    // Still render — useful for SEO even with empty state, with CTA to submit
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/studs" className="hover:text-gray-700 transition-colors">Browse Studs</Link>
        <span>/</span>
        <Link href={`/studs/breed/${breed}`} className="hover:text-gray-700 transition-colors">{breedName}</Link>
        <span>/</span>
        <span className="text-gray-700">{stateName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {breedName} Studs in {stateName}
        </h1>
        <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
          {listings.length > 0
            ? `${listings.length} ${breedName} stud${listings.length !== 1 ? 's' : ''} listed in ${stateName}. Contact owners directly through DogStud.`
            : `No ${breedName} studs are currently listed in ${stateName}. Be the first to list yours — it's free.`
          }
        </p>
      </div>

      {listings.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8 text-sm text-gray-600 leading-relaxed">
          <p>
            Browse {breedName} stud dogs available in {stateName}. Each listing is submitted
            directly by the stud owner and includes photos, health details, and contact information.
            Reach out by phone or text — no accounts required, no platform fees.
          </p>
        </div>
      )}

      <StudDirectoryGrid
        listings={listings}
        emptyMessage={`No ${breedName} studs listed in ${stateName} yet.`}
      />

      <div className="mt-12 text-center py-10 border-t border-gray-100">
        <p className="text-gray-500 text-sm mb-4">
          Own a {breedName} stud in {stateName}? List free and reach breeders nearby.
        </p>
        <Link
          href="/list-your-stud"
          className="inline-block px-7 py-3 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: '#1F4D3A' }}
        >
          List Your Stud — Free
        </Link>
      </div>
    </div>
  )
}
