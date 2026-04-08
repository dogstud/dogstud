import Link from 'next/link'
import Image from 'next/image'
import Badge from '@/components/ui/Badge'
import { formatFee } from '@/lib/utils/formatFee'
import type { StudListing } from '@/lib/types'

interface ListingCardProps {
  listing: StudListing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const feeDisplay = formatFee(listing.stud_fee, listing.contact_for_fee)

  return (
    <Link
      href={`/studs/${listing.slug}`}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-400 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
        {listing.primary_image_url ? (
          <Image
            src={listing.primary_image_url}
            alt={listing.dog_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {listing.featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="featured" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-navy transition-colors" style={{ color: 'inherit' }}>
            {listing.dog_name}
          </h3>
          <Badge variant={listing.availability_status} />
        </div>

        <p className="text-sm text-gray-500 mb-2">{listing.breed}</p>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
          {listing.short_summary}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {listing.city}, {listing.state}
          </span>
          <span className="text-sm font-semibold" style={{ color: '#0B1F2A' }}>
            {feeDisplay}
          </span>
        </div>

        {listing.akc_registered && (
          <p className="text-xs text-blue-600 font-medium mt-2">AKC Registered</p>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
            View Listing →
          </span>
        </div>
      </div>
    </Link>
  )
}
