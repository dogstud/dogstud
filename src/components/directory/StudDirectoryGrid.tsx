import type { PublicSubmission } from '@/lib/submissions'
import StudDirectoryCard from './StudDirectoryCard'
import Link from 'next/link'

interface Props {
  listings: PublicSubmission[]
  emptyMessage?: string
}

export default function StudDirectoryGrid({ listings, emptyMessage }: Props) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-gray-200 rounded-xl bg-gray-50">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium mb-1">
          {emptyMessage || 'No stud listings found'}
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Be the first breeder in this area to list a stud dog.
        </p>
        <Link
          href="/list-your-stud"
          className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#2F7D5C' }}
        >
          List Your Stud Free →
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map((listing) => (
        <StudDirectoryCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
