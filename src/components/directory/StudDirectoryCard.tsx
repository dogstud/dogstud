import Link from 'next/link'
import Image from 'next/image'
import type { PublicSubmission } from '@/lib/submissions'

interface Props {
  listing: PublicSubmission
}

function formatFee(fee: number | null): string {
  if (!fee) return 'Contact for fee'
  return `$${fee.toLocaleString()}`
}

export default function StudDirectoryCard({ listing }: Props) {
  const photo = listing.primary_image || listing.photos?.[0] || null
  const href = `/studs/${listing.slug}`

  return (
    <Link
      href={href}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 hover:shadow-md transition-all duration-200"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={`${listing.dog_name} — ${listing.breed} stud in ${listing.city}, ${listing.state}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {listing.featured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-amber-900">
              Featured
            </span>
          )}
          {listing.verified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-black">
            {listing.dog_name}
          </h3>
          <span className="text-sm font-semibold text-gray-900 shrink-0">
            {formatFee(listing.stud_fee)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-2">{listing.breed}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{listing.city}, {listing.state}</span>
        </div>
        {listing.color_traits && (
          <p className="text-xs text-gray-400 mt-1 truncate">{listing.color_traits}</p>
        )}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          {listing.chilled_semen_available && (
            <span className="text-xs text-blue-600 font-medium">Chilled semen available</span>
          )}
          <span className="ml-auto text-xs font-semibold text-gray-700 group-hover:text-black transition-colors">
            View Stud →
          </span>
        </div>
      </div>
    </Link>
  )
}
