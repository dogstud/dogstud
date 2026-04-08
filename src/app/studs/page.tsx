'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { trackSearch } from '@/lib/track'
import Navbar from '@/components/Navbar'
import StudCard from '@/components/StudCard'
import MessageModal from '@/components/MessageModal'
import { DEMO_STUDS } from '@/lib/demoData'
import { ALL_BREEDS } from '@/components/BreedSelect'

interface Stud {
  id: string
  name: string
  breed: string
  color: string
  city: string
  state: string
  stud_fee: number
  contact_for_price: boolean
  is_proven: boolean
  health_tested: boolean
  akc_registered: boolean
  photos: string[]
  owner_id: string
}

function StudsContent() {
  const searchParams = useSearchParams()
  const [studs, setStuds] = useState<Stud[]>([])
  const [loading, setLoading] = useState(true)
  const [breedFilter, setBreedFilter] = useState(searchParams.get('breed') || '')
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '')
  const [maxFee, setMaxFee] = useState(10000)
  const [provenOnly, setProvenOnly] = useState(false)
  const [healthOnly, setHealthOnly] = useState(false)
  const [modal, setModal] = useState<{ studId: string; studName: string; ownerId: string; breed: string } | null>(null)

  useEffect(() => {
    loadStuds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breedFilter, locationFilter, provenOnly, healthOnly, maxFee])

  async function loadStuds() {
    setLoading(true)
    let query = supabase.from('studs').select('*').eq('status', 'active')
    if (breedFilter && breedFilter !== 'All Breeds') query = query.ilike('breed', `%${breedFilter}%`)
    if (locationFilter) query = query.or(`city.ilike.%${locationFilter}%,state.ilike.%${locationFilter}%`)
    if (provenOnly) query = query.eq('is_proven', true)
    if (healthOnly) query = query.eq('health_tested', true)

    const { data } = await query.order('is_featured', { ascending: false }).limit(50)

    if (data && data.length > 0) {
      setStuds(data)
    } else {
      // Use demo data, apply filters client-side
      let filtered = DEMO_STUDS.filter(s => s.status === 'active')
      if (breedFilter && breedFilter !== 'All Breeds') filtered = filtered.filter(s => s.breed.toLowerCase().includes(breedFilter.toLowerCase()))
      if (locationFilter) filtered = filtered.filter(s => s.city.toLowerCase().includes(locationFilter.toLowerCase()) || s.state.toLowerCase().includes(locationFilter.toLowerCase()))
      if (provenOnly) filtered = filtered.filter(s => s.is_proven)
      if (healthOnly) filtered = filtered.filter(s => s.health_tested)
      filtered = filtered.filter(s => !s.stud_fee || s.stud_fee <= maxFee)
      setStuds(filtered as unknown as Stud[])
    }

    if (breedFilter || locationFilter) {
      trackSearch(breedFilter, locationFilter)
    }
    setLoading(false)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadStuds()
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            value={breedFilter}
            onChange={e => setBreedFilter(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]"
          >
            <option value="">All Breeds</option>
            {ALL_BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <input
            type="text"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            placeholder="City or State"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]"
          />
          <button type="submit" className="bg-[#C6922F] hover:bg-[#A87826] text-white font-semibold px-6 py-2 rounded-lg text-sm whitespace-nowrap">
            Search
          </button>
        </form>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
              <h3 className="font-bold text-[#1E2A38] text-sm">Filters</h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Max Stud Fee: ${maxFee.toLocaleString()}</label>
                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={250}
                  value={maxFee}
                  onChange={e => setMaxFee(Number(e.target.value))}
                  className="w-full accent-[#C6922F]"
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={provenOnly} onChange={e => setProvenOnly(e.target.checked)} className="accent-[#C6922F]" />
                <span className="text-gray-700">Proven only</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={healthOnly} onChange={e => setHealthOnly(e.target.checked)} className="accent-[#C6922F]" />
                <span className="text-gray-700">Health tested</span>
              </label>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{studs.length} studs found</p>
            </div>
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
                ))}
              </div>
            ) : studs.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg mb-2">No studs found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {studs.map(stud => (
                  <StudCard
                    key={stud.id}
                    stud={stud}
                    onMessageClick={() => setModal({ studId: stud.id, studName: stud.name, ownerId: stud.owner_id || '', breed: stud.breed })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <MessageModal
          studId={modal.studId}
          studName={modal.studName}
          ownerId={modal.ownerId}
          breed={modal.breed}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}

export default function StudsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>}>
      <StudsContent />
    </Suspense>
  )
}
