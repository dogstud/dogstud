'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BreedSelect from '@/components/BreedSelect'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'

export default function ListPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Form state
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [color, setColor] = useState('')
  const [genetics, setGenetics] = useState('')
  const [age, setAge] = useState('')
  const [ageUnit, setAgeUnit] = useState<'years' | 'months'>('years')
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs')
  const [fee, setFee] = useState('')
  const [contactForPrice, setContactForPrice] = useState(false)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('US')
  const [healthTested, setHealthTested] = useState(false)
  const [healthNotes, setHealthNotes] = useState('')
  const [akcRegistered, setAkcRegistered] = useState(false)
  const [registrationType, setRegistrationType] = useState('')
  const [proven, setProven] = useState(false)
  const [availability, setAvailability] = useState('available')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/signin'); return }
      setUser(data.user)
    })
  }, [router])

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length || !user) return
    setUploading(true)
    const uploaded: string[] = []
    for (const file of files.slice(0, 10 - photos.length)) {
      const ext = file.name.split('.').pop()
      const path = `studs/${user.id}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('stud-photos').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('stud-photos').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }
    setPhotos(prev => [...prev, ...uploaded])
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!breed) { setError('Please select a breed.'); return }
    if (description.length < 100) { setError('Description must be at least 100 characters.'); return }

    setLoading(true)
    setError('')

    const ageYears = age ? (ageUnit === 'months' ? parseFloat(age) / 12 : parseFloat(age)) : null
    const weightLbs = weight ? (weightUnit === 'kg' ? parseFloat(weight) * 2.205 : parseFloat(weight)) : null

    // Ensure user has a profile
    await supabase.from('profiles').upsert({ id: user.id, email: user.email!, role: 'owner' })

    const { error: insertError } = await supabase.from('studs').insert({
      owner_id: user.id,
      name,
      breed,
      color,
      genetics,
      age_years: ageYears,
      weight_lbs: weightLbs,
      stud_fee: contactForPrice ? null : fee ? parseFloat(fee) : null,
      contact_for_price: contactForPrice,
      city,
      state,
      country,
      is_proven: proven,
      health_tested: healthTested,
      health_notes: healthNotes,
      akc_registered: akcRegistered,
      registration_type: registrationType,
      description,
      photos,
      availability,
      status: 'pending',
    })

    setLoading(false)
    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-black text-[#1E2A38] mb-3">Listing Submitted!</h1>
          <p className="text-gray-500 mb-6">Your listing is under review. We&apos;ll notify you when it&apos;s live (usually within 24 hours).</p>
          <a href="/dashboard" className="bg-[#C6922F] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#A87826] inline-block">
            Go to Dashboard
          </a>
        </div>
      </>
    )
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#1E2A38] mb-1">List Your Stud</h1>
        <p className="text-sm text-gray-500 mb-8">Free listing. Approved within 24 hours.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <section>
            <h2 className="font-bold text-[#1E2A38] mb-4 text-sm uppercase tracking-wide">Basic Info</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dog Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
                <BreedSelect value={breed} onChange={setBreed} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color / Coat</label>
                <input type="text" value={color} onChange={e => setColor(e.target.value)} placeholder="e.g. Blue Merle" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genetics</label>
                <input type="text" value={genetics} onChange={e => setGenetics(e.target.value)} placeholder="e.g. Carries chocolate, tan" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <div className="flex gap-2">
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} min={0} step={0.5} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
                  <select value={ageUnit} onChange={e => setAgeUnit(e.target.value as 'years' | 'months')} className="border border-gray-300 rounded-lg px-2 py-2 text-sm">
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <div className="flex gap-2">
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} min={0} step={0.5} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
                  <select value={weightUnit} onChange={e => setWeightUnit(e.target.value as 'lbs' | 'kg')} className="border border-gray-300 rounded-lg px-2 py-2 text-sm">
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="font-bold text-[#1E2A38] mb-4 text-sm uppercase tracking-wide">Stud Fee</h2>
            <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer">
              <input type="checkbox" checked={contactForPrice} onChange={e => setContactForPrice(e.target.checked)} className="accent-[#C6922F]" />
              <span>Contact for price</span>
            </label>
            {!contactForPrice && (
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={fee} onChange={e => setFee(e.target.value)} min={0} placeholder="0" className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
              </div>
            )}
          </section>

          {/* Location */}
          <section>
            <h2 className="font-bold text-[#1E2A38] mb-4 text-sm uppercase tracking-wide">Location</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="e.g. CA" maxLength={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* Health & Registration */}
          <section>
            <h2 className="font-bold text-[#1E2A38] mb-4 text-sm uppercase tracking-wide">Health & Registration</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={healthTested} onChange={e => setHealthTested(e.target.checked)} className="accent-[#C6922F]" />
                <span>Health tested</span>
              </label>
              {healthTested && (
                <textarea value={healthNotes} onChange={e => setHealthNotes(e.target.value)} placeholder="Describe health tests completed (e.g. OFA hips Good, cardiac clear)" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
              )}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={akcRegistered} onChange={e => setAkcRegistered(e.target.checked)} className="accent-[#C6922F]" />
                <span>AKC Registered</span>
              </label>
              {akcRegistered && (
                <input type="text" value={registrationType} onChange={e => setRegistrationType(e.target.value)} placeholder="Registration type (e.g. Full AKC, Limited AKC)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]" />
              )}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={proven} onChange={e => setProven(e.target.checked)} className="accent-[#C6922F]" />
                <span>Proven (has produced litters)</span>
              </label>
            </div>
          </section>

          {/* Availability */}
          <section>
            <h2 className="font-bold text-[#1E2A38] mb-4 text-sm uppercase tracking-wide">Availability</h2>
            <div className="flex gap-2">
              {['available', 'limited', 'unavailable'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAvailability(opt)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${availability === opt ? 'border-[#C6922F] bg-[#FBF4E9] text-[#1E2A38]' : 'border-gray-200 text-gray-600'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          {/* Description */}
          <section>
            <h2 className="font-bold text-[#1E2A38] mb-4 text-sm uppercase tracking-wide">Description</h2>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe your stud — structure, temperament, litter history, what makes him stand out. Be specific."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]"
            />
            <p className={`text-xs mt-1 ${description.length < 100 ? 'text-red-400' : 'text-green-600'}`}>
              {description.length}/500 characters {description.length < 100 && `(minimum 100)`}
            </p>
          </section>

          {/* Photos */}
          <section>
            <h2 className="font-bold text-[#1E2A38] mb-4 text-sm uppercase tracking-wide">Photos (up to 10)</h2>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#C6922F] transition-colors"
            >
              <div className="text-3xl mb-2">📷</div>
              <p className="text-sm text-gray-500">Click to upload photos</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG — up to 10 photos</p>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            {uploading && <p className="text-xs text-gray-400 mt-2">Uploading...</p>}
            {photos.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {photos.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={url} alt="" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C6922F] hover:bg-[#A87826] disabled:opacity-50 text-white font-bold py-4 rounded-xl text-base"
          >
            {loading ? 'Submitting...' : 'Submit Listing'}
          </button>
          <p className="text-xs text-gray-400 text-center">Listings are reviewed within 24 hours before going live.</p>
        </form>
      </div>
    </>
  )
}
