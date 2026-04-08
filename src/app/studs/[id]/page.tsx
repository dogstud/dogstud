'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { trackListingView } from '@/lib/track'
import Navbar from '@/components/Navbar'
import MessageModal from '@/components/MessageModal'
import { DEMO_STUDS } from '@/lib/demoData'

interface Stud {
  id: string
  name: string
  breed: string
  color: string
  weight_lbs: number
  age_years: number
  stud_fee: number
  contact_for_price: boolean
  city: string
  state: string
  country: string
  is_proven: boolean
  health_tested: boolean
  health_notes: string
  akc_registered: boolean
  registration_type: string
  description: string
  photos: string[]
  owner_id: string
  availability: string
  genetics: string
}

interface Profile {
  id: string
  full_name: string
  avatar_url: string
  city: string
  state: string
  created_at: string
  is_verified: boolean
}

export default function StudDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [stud, setStud] = useState<Stud | null>(null)
  const [owner, setOwner] = useState<Profile | null>(null)
  const [activePhoto, setActivePhoto] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (id.startsWith('demo-')) {
        const demo = DEMO_STUDS.find(s => s.id === id)
        if (demo) {
          setStud(demo as unknown as Stud)
          setOwner({ id: '', full_name: demo.owner_name, avatar_url: '', city: demo.city, state: demo.state, created_at: `${demo.owner_since}-01-01`, is_verified: true })
        }
        setLoading(false)
        return
      }

      const { data: studData } = await supabase.from('studs').select('*').eq('id', id).single()
      if (studData) {
        setStud(studData)
        const { data: ownerData } = await supabase.from('profiles').select('*').eq('id', studData.owner_id).single()
        if (ownerData) setOwner(ownerData)
        trackListingView(id, studData.breed, `${studData.city}, ${studData.state}`)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="bg-gray-200 rounded-2xl h-96 mb-6" />
      </div>
    </>
  )

  if (!stud) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-64 text-gray-400">Listing not found</div>
    </>
  )

  const photos = stud.photos?.length > 0 ? stud.photos : [`https://picsum.photos/seed/${stud.id}/800/600`]
  const location = [stud.city, stud.state].filter(Boolean).join(', ')

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 pb-24 lg:pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Photos + Details */}
          <div className="lg:col-span-2">
            {/* Photo gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] mb-3">
              <Image
                src={photos[activePhoto]}
                alt={`${stud.name} - ${stud.breed}`}
                fill
                className="object-cover"
                unoptimized
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setActivePhoto(p => Math.max(0, p - 1))}
                    disabled={activePhoto === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-30"
                  >←</button>
                  <button
                    onClick={() => setActivePhoto(p => Math.min(photos.length - 1, p + 1))}
                    disabled={activePhoto === photos.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-30"
                  >→</button>
                </>
              )}
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {photos.map((p, i) => (
                  <button key={i} onClick={() => setActivePhoto(i)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activePhoto === i ? 'border-[#C6922F]' : 'border-gray-200'}`}>
                    <Image src={p} alt="" width={64} height={64} className="object-cover w-full h-full" unoptimized />
                  </button>
                ))}
              </div>
            )}

            {/* Name + breed */}
            <div className="mt-6">
              <h1 className="text-3xl font-black text-[#1E2A38]">{stud.name}</h1>
              <p className="text-lg text-gray-500 mt-1">{stud.breed}{stud.color ? ` · ${stud.color}` : ''}</p>
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap mt-3">
              {stud.is_proven && <span className="bg-green-50 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">✓ Proven</span>}
              {stud.health_tested && <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">✓ Health Tested</span>}
              {stud.akc_registered && <span className="bg-purple-50 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">✓ AKC</span>}
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${stud.availability === 'available' ? 'bg-green-100 text-green-800' : stud.availability === 'limited' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-600'}`}>
                {stud.availability === 'available' ? '● Available' : stud.availability === 'limited' ? '◐ Limited' : '○ Unavailable'}
              </span>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Age', value: stud.age_years ? `${stud.age_years} yrs` : '—' },
                { label: 'Weight', value: stud.weight_lbs ? `${stud.weight_lbs} lbs` : '—' },
                { label: 'Location', value: location || '—' },
                { label: 'Color', value: stud.color || '—' },
                { label: 'Registration', value: stud.registration_type || (stud.akc_registered ? 'AKC' : '—') },
                { label: 'Genetics', value: stud.genetics || '—' },
              ].map(d => (
                <div key={d.label} className="bg-[#F8F9FB] rounded-xl p-3">
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{d.label}</div>
                  <div className="text-sm font-semibold text-[#1E2A38] mt-0.5">{d.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {stud.description && (
              <div className="mt-6">
                <h2 className="font-bold text-[#1E2A38] mb-2">About {stud.name}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{stud.description}</p>
              </div>
            )}

            {stud.health_notes && (
              <div className="mt-4 bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 text-sm mb-1">Health Notes</h3>
                <p className="text-sm text-blue-700">{stud.health_notes}</p>
              </div>
            )}
          </div>

          {/* Right sidebar — desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              {/* Price */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
                <div className="text-3xl font-black text-[#1E2A38] mb-1">
                  {stud.contact_for_price ? 'Contact for Price' : stud.stud_fee ? `$${stud.stud_fee.toLocaleString()}` : 'Contact for Price'}
                </div>
                {!stud.contact_for_price && stud.stud_fee && (
                  <p className="text-xs text-gray-400 mb-4">Stud fee</p>
                )}
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full bg-[#C6922F] hover:bg-[#A87826] text-white font-bold py-3 rounded-xl text-base transition-colors"
                >
                  Contact Stud Owner
                </button>
              </div>

              {/* Owner card */}
              {owner && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <h3 className="font-bold text-[#1E2A38] text-sm mb-3">Owner</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E2A38] text-white flex items-center justify-center font-bold">
                      {owner.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1E2A38] text-sm flex items-center gap-1">
                        {owner.full_name}
                        {owner.is_verified && <span className="text-[#C6922F]">✓</span>}
                      </div>
                      <div className="text-xs text-gray-400">
                        {[owner.city, owner.state].filter(Boolean).join(', ')} · Member since {new Date(owner.created_at).getFullYear()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center gap-3">
        <div>
          <div className="font-black text-[#1E2A38]">
            {stud.contact_for_price ? 'Contact for Price' : stud.stud_fee ? `$${stud.stud_fee.toLocaleString()}` : 'Contact'}
          </div>
          <div className="text-xs text-gray-400">Stud fee</div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex-1 bg-[#C6922F] hover:bg-[#A87826] text-white font-bold py-3 rounded-xl transition-colors"
        >
          Message {stud.name}
        </button>
      </div>

      {showModal && (
        <MessageModal
          studId={stud.id}
          studName={stud.name}
          ownerId={stud.owner_id || ''}
          breed={stud.breed}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
