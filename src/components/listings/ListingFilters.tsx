'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const BREEDS = [
  'American Bully',
  'American Pit Bull Terrier',
  'Bulldog',
  'French Bulldog',
  'English Bulldog',
  'Rottweiler',
  'German Shepherd',
  'Doberman Pinscher',
  'Belgian Malinois',
  'Cane Corso',
  'Great Dane',
  'Labrador Retriever',
  'Golden Retriever',
  'Poodle',
  'Dachshund',
  'Chihuahua',
  'Shih Tzu',
  'Yorkshire Terrier',
  'Boxer',
  'Siberian Husky',
  'Alaskan Malamute',
  'Mastiff',
  'Bullmastiff',
  'Staffordshire Bull Terrier',
  'Boston Terrier',
  'Other',
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

export default function ListingFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const hasFilters = !!(searchParams.get('keyword') || searchParams.get('breed') || searchParams.get('state') || searchParams.get('availability'))
  const clearFilters = () => router.push(pathname)

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Keyword */}
        <input
          type="text"
          placeholder="Find a stud..."
          defaultValue={searchParams.get('keyword') ?? ''}
          onChange={(e) => updateParam('keyword', e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7D5C]/20 focus:border-[#2F7D5C]"
        />

        {/* Breed */}
        <select
          defaultValue={searchParams.get('breed') ?? ''}
          onChange={(e) => updateParam('breed', e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7D5C]/20 focus:border-[#2F7D5C] bg-white appearance-none"
        >
          <option value="">All Breeds</option>
          {BREEDS.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>

        {/* State */}
        <select
          defaultValue={searchParams.get('state') ?? ''}
          onChange={(e) => updateParam('state', e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7D5C]/20 focus:border-[#2F7D5C] bg-white appearance-none"
        >
          <option value="">All States</option>
          {US_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* Availability */}
        <select
          defaultValue={searchParams.get('availability') ?? ''}
          onChange={(e) => updateParam('availability', e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7D5C]/20 focus:border-[#2F7D5C] bg-white appearance-none"
        >
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-[#1F4D3A] hover:text-[#2F7D5C] underline transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
