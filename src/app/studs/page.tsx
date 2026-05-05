import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { getApprovedListings, getApprovedCount } from '@/lib/submissions'
import StudDirectoryGrid from '@/components/directory/StudDirectoryGrid'
import DirectoryFilters from '@/components/directory/DirectoryFilters'

export const metadata: Metadata = {
  title: 'Stud Dogs for Breeding | DogStud',
  description: 'Browse stud dogs by breed, location, traits, and availability. Find quality stud dog listings and contact owners directly.',
  alternates: { canonical: 'https://dogstud.com/studs' },
  openGraph: {
    title: 'Stud Dogs for Breeding | DogStud',
    description: 'Browse stud dogs by breed, location, traits, and availability. Find quality stud dog listings and contact owners directly.',
    url: 'https://dogstud.com/studs',
  },
}

const FEATURED_BREEDS = [
  'French Bulldog', 'English Bulldog', 'American Bully', 'Cane Corso',
  'Rottweiler', 'German Shepherd', 'Doberman Pinscher', 'Labrador Retriever',
  'Golden Retriever', 'Siberian Husky', 'Boxer', 'Great Dane',
]

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function DirectoryResults({
  breed, state, city, color, chilled, verified,
}: {
  breed?: string; state?: string; city?: string; color?: string; chilled?: boolean; verified?: boolean
}) {
  const listings = await getApprovedListings({ breed, state, city, color, chilled, verified })

  return (
    <>
      <p className="text-sm text-gray-500 mb-6">
        {listings.length > 0
          ? `${listings.length} stud${listings.length !== 1 ? 's' : ''} found`
          : 'No listings match your filters.'}
      </p>
      <StudDirectoryGrid listings={listings} />
    </>
  )
}

export default async function StudsDirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const str = (v: unknown) => (typeof v === 'string' ? v : undefined)
  const breed   = str(params.breed)
  const state   = str(params.state)
  const city    = str(params.city)
  const color   = str(params.color)
  const chilled = params.chilled === 'true' ? true : undefined
  const verified = params.verified === 'true' ? true : undefined

  const total = await getApprovedCount()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Stud Dogs</h1>
        <p className="text-gray-500 text-base max-w-2xl">
          {total > 0
            ? `${total} stud dog${total !== 1 ? 's' : ''} listed across the US. Contact owners directly — no middleman, no fees.`
            : 'Find proven stud dogs by breed and location. Contact owners directly — no middleman, no fees.'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Suspense>
          <DirectoryFilters />
        </Suspense>
      </div>

      {/* Results */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-[4/3] animate-pulse" />
            ))}
          </div>
        }
      >
        <DirectoryResults
          breed={breed} state={state} city={city}
          color={color} chilled={chilled} verified={verified}
        />
      </Suspense>

      {/* Browse by Breed */}
      <section className="mt-20 pt-12 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Browse by Breed</h2>
        <p className="text-sm text-gray-500 mb-5">
          Find stud services for top dog breeds across the United States.
        </p>
        <div className="flex flex-wrap gap-2">
          {FEATURED_BREEDS.map(b => (
            <Link
              key={b}
              href={`/studs?breed=${encodeURIComponent(b)}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              {b} Stud
            </Link>
          ))}
        </div>
      </section>

      {/* SEO copy */}
      <section className="mt-12 bg-gray-50 rounded-xl p-8 border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">How DogStud Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 leading-relaxed">
          <div>
            <p className="font-semibold text-gray-800 mb-1">For Breeders Seeking a Stud</p>
            <p>Browse stud dog listings by breed, location, and traits. View photos, health testing, and stud fee upfront. Contact the owner directly — no platform fees.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">For Stud Dog Owners</p>
            <p>List your stud dog free. Upload photos, set your fee, and reach breeders nationwide. Your listing goes live after a quick review.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Nationwide Coverage</p>
            <p>DogStud connects breeders across all 50 states. Search by breed and location to find exactly what you need for your breeding program.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/list-your-stud"
          className="inline-block px-8 py-3.5 rounded-lg text-base font-semibold text-white transition-colors"
          style={{ backgroundColor: '#1F4D3A' }}
        >
          List Your Stud Dog — Free
        </Link>
        <p className="text-gray-400 text-xs mt-2">No account required · Takes 60 seconds</p>
      </div>
    </div>
  )
}
