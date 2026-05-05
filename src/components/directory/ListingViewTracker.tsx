'use client'

import { useEffect } from 'react'

interface Props {
  listingId: string
  slug: string
  breed: string
  city: string
  state: string
}

export default function ListingViewTracker({ listingId, slug, breed, city, state }: Props) {
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'listing_view',
        submission_id: listingId,
        metadata: { slug, breed, city, state },
      }),
    }).catch(() => {/* silent */})
  }, [listingId, slug, breed, city, state])

  return null
}
