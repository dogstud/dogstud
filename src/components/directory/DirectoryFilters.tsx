'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const BREEDS = [
  'French Bulldog', 'English Bulldog', 'American Bully', 'Cane Corso',
  'Rottweiler', 'German Shepherd', 'Doberman Pinscher', 'Belgian Malinois',
  'Labrador Retriever', 'Golden Retriever', 'Siberian Husky', 'Bullmastiff',
  'Boxer', 'Boston Terrier', 'Poodle', 'Mastiff', 'Great Dane',
]

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
]

export default function DirectoryFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset to page 1 on filter change
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const toggleBool = useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === 'true') {
      params.delete(key)
    } else {
      params.set(key, 'true')
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const clearAll = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  const hasFilters = searchParams.toString().length > 0

  const selectClass = "h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Breed */}
      <select
        value={searchParams.get('breed') || ''}
        onChange={e => updateFilter('breed', e.target.value)}
        className={selectClass}
      >
        <option value="">All Breeds</option>
        {BREEDS.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      {/* State */}
      <select
        value={searchParams.get('state') || ''}
        onChange={e => updateFilter('state', e.target.value)}
        className={selectClass}
      >
        <option value="">All States</option>
        {US_STATES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* City keyword */}
      <input
        type="text"
        placeholder="City..."
        value={searchParams.get('city') || ''}
        onChange={e => updateFilter('city', e.target.value)}
        className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 w-32"
      />

      {/* Color/traits keyword */}
      <input
        type="text"
        placeholder="Color / traits..."
        value={searchParams.get('color') || ''}
        onChange={e => updateFilter('color', e.target.value)}
        className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 w-40"
      />

      {/* Toggles */}
      <button
        onClick={() => toggleBool('chilled')}
        className={`h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${
          searchParams.get('chilled') === 'true'
            ? 'bg-gray-900 border-gray-900 text-white'
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
        }`}
      >
        Chilled Semen
      </button>

      <button
        onClick={() => toggleBool('verified')}
        className={`h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${
          searchParams.get('verified') === 'true'
            ? 'bg-emerald-600 border-emerald-600 text-white'
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
        }`}
      >
        Verified Only
      </button>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="h-9 px-3 rounded-lg text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
