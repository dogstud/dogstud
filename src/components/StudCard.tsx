'use client'

import Image from 'next/image'
import Link from 'next/link'

export interface StudCardProps {
  stud: {
    id: string
    name: string
    breed: string
    color?: string
    city?: string
    state?: string
    country?: string
    stud_fee?: number
    contact_for_price?: boolean
    is_proven?: boolean
    health_tested?: boolean
    akc_registered?: boolean
    photos?: string[]
    availability?: string
  }
  onMessageClick?: () => void
}

export default function StudCard({ stud, onMessageClick }: StudCardProps) {
  const photo = stud.photos?.[0] || null
  const location = [stud.city, stud.state].filter(Boolean).join(', ') || stud.country || 'Location TBD'
  const fee = stud.contact_for_price ? 'Contact for Price' : stud.stud_fee ? `$${stud.stud_fee.toLocaleString()}` : 'Contact for Price'

  return (
    <Link
      href={`/studs/${stud.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={stud.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
            </svg>
          </div>
        )}
        {/* Fee badge */}
        <div
          className="absolute top-3 right-3 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow"
          style={{ backgroundColor: '#1E2A38' }}
        >
          {fee}
        </div>
        {stud.availability === 'available' && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-tight">{stud.name}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          {stud.breed}{stud.color ? ` · ${stud.color}` : ''}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#EFF9F5', color: '#10B981' }}
          >
            ✓ Verified
          </span>
          {stud.is_proven && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              Proven
            </span>
          )}
          {stud.health_tested && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
              Health Tested
            </span>
          )}
          {stud.akc_registered && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
              AKC
            </span>
          )}
        </div>

        {/* Location + CTA */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.757.433l.018.008.006.003zM10 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                clipRule="evenodd"
              />
            </svg>
            {location}
          </span>
          <button
            className="text-xs font-bold text-white px-4 py-1.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C6922F' }}
            onClick={(e) => {
              e.preventDefault()
              onMessageClick?.()
            }}
          >
            Contact Stud
          </button>
        </div>
      </div>
    </Link>
  )
}
