import { Suspense } from 'react'
import { getListings } from '@/lib/queries/listings'
import ListingGrid from '@/components/listings/ListingGrid'
import ListingFilters from '@/components/listings/ListingFilters'
import type { ListingFilters as Filters, StudListing } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function StudsResults({ filters }: { filters: Filters }) {
  let listings: StudListing[] = []
  try {
    listings = await getListings(filters)
  } catch {
    // DB not yet seeded
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
      <ListingGrid listings={listings} />
    </div>
  )
}

export default async function StudsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: Filters = {
    breed: typeof params.breed === 'string' ? params.breed : undefined,
    state: typeof params.state === 'string' ? params.state : undefined,
    availability: typeof params.availability === 'string' ? params.availability : undefined,
    keyword: typeof params.keyword === 'string' ? params.keyword : undefined,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse Studs</h1>
        <p className="text-gray-500 text-sm">
          Find the right stud for your breeding program.
        </p>
      </div>

      <div className="mb-6">
        <Suspense>
          <ListingFilters />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div>
            <div className="h-4 w-32 bg-gray-100 rounded mb-6 animate-pulse" />
            <ListingGrid listings={[]} loading />
          </div>
        }
      >
        <StudsResults filters={filters} />
      </Suspense>
    </div>
  )
}
