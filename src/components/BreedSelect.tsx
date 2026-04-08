'use client'

import { useState, useRef, useEffect } from 'react'

export const ALL_BREEDS = [
  'Affenpinscher', 'Afghan Hound', 'Airedale Terrier', 'Akita', 'Alaskan Malamute',
  'American Bulldog', 'American Pit Bull Terrier', 'Australian Cattle Dog', 'Australian Shepherd',
  'Basenji', 'Basset Hound', 'Beagle', 'Belgian Malinois', 'Bernese Mountain Dog',
  'Bichon Frise', 'Bloodhound', 'Border Collie', 'Border Terrier', 'Boston Terrier',
  'Boxer', 'Boykin Spaniel', 'Bulldog', 'Bullmastiff', 'Cane Corso',
  'Cavalier King Charles Spaniel', 'Chesapeake Bay Retriever', 'Chihuahua', 'Chinese Shar-Pei',
  'Chow Chow', 'Cocker Spaniel', 'Dachshund', 'Dalmatian', 'Doberman',
  'Dogue de Bordeaux', 'English Bulldog', 'English Springer Spaniel', 'French Bulldog',
  'German Shepherd', 'Giant Schnauzer', 'Golden Retriever', 'Great Dane', 'Great Pyrenees',
  'Greyhound', 'Havanese', 'Irish Setter', 'Irish Wolfhound', 'Italian Greyhound',
  'Jack Russell Terrier', 'Labrador Retriever', 'Lhasa Apso', 'Maltese',
  'Mastiff', 'Miniature Pinscher', 'Miniature Schnauzer', 'Newfoundland', 'Papillon',
  'Pekingese', 'Pembroke Welsh Corgi', 'Pointer', 'Pomeranian', 'Poodle',
  'Pug', 'Rhodesian Ridgeback', 'Rottweiler', 'Saint Bernard', 'Samoyed',
  'Scottish Terrier', 'Shetland Sheepdog', 'Shiba Inu', 'Shih Tzu',
  'Siberian Husky', 'Standard Poodle', 'Vizsla', 'Weimaraner',
  'West Highland White Terrier', 'Whippet', 'Yorkshire Terrier',
]

interface BreedSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export default function BreedSelect({ value, onChange, placeholder = 'Select breed...', required }: BreedSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = ALL_BREEDS.filter(b => b.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]"
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
        <span className="float-right text-gray-400">▼</span>
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search breeds..."
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#C6922F]"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">No breeds found</div>
            ) : (
              filtered.map(breed => (
                <button
                  key={breed}
                  type="button"
                  onClick={() => { onChange(breed); setOpen(false); setSearch('') }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${value === breed ? 'bg-[#FBF4E9] text-[#C6922F] font-medium' : ''}`}
                >
                  {breed}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      {required && <input type="hidden" value={value} required />}
    </div>
  )
}
