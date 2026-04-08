import Link from 'next/link'
import Image from 'next/image'
import type { Profile } from '@/lib/types'

interface BreederCardProps {
  profile: Profile
  listingCount?: number
}

export default function BreederCard({ profile, listingCount }: BreederCardProps) {
  return (
    <Link
      href={`/breeders/${profile.slug}`}
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm hover:border-gray-300 transition-all"
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.display_name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: '#0B1F2A' }}
          >
            {profile.display_name[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{profile.display_name}</p>
        {profile.kennel_name && (
          <p className="text-sm text-gray-500 truncate">{profile.kennel_name}</p>
        )}
        {(profile.city || profile.state) && (
          <p className="text-xs text-gray-400 mt-0.5">
            {[profile.city, profile.state].filter(Boolean).join(', ')}
          </p>
        )}
        {listingCount !== undefined && (
          <p className="text-xs text-gray-400">
            {listingCount} listing{listingCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Link>
  )
}
