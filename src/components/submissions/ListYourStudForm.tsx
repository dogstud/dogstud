'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

const BREEDS = [
  'French Bulldog', 'English Bulldog', 'American Bully', 'Cane Corso',
  'Rottweiler', 'German Shepherd', 'Doberman Pinscher', 'Belgian Malinois',
  'Labrador Retriever', 'Golden Retriever', 'Siberian Husky', 'Bullmastiff',
  'Boxer', 'Boston Terrier', 'Poodle', 'Mastiff', 'Great Dane', 'Other',
]

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

const AKC_OPTIONS = [
  'AKC Registered', 'AKC Registerable', 'Not AKC Registered', 'ABKC', 'UKC', 'Other',
]

interface FormState {
  dog_name: string
  breed: string
  age: string
  dob: string
  color_traits: string
  city: string
  state: string
  stud_fee: string
  owner_name: string
  phone_number: string
  email: string
  description: string
  akc_status: string
  health_testing: string
  chilled_semen_available: boolean
  ownership_confirmed: boolean
}

const initialForm: FormState = {
  dog_name: '',
  breed: '',
  age: '',
  dob: '',
  color_traits: '',
  city: '',
  state: '',
  stud_fee: '',
  owner_name: '',
  phone_number: '',
  email: '',
  description: '',
  akc_status: '',
  health_testing: '',
  chilled_semen_available: false,
  ownership_confirmed: false,
}

interface UploadedPhoto {
  url: string
  name: string
}

export default function ListYourStudForm() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<{ id: string; edit_token: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || photos.length >= 6) return
    const remaining = 6 - photos.length
    const toUpload = Array.from(files).slice(0, remaining)
    setUploading(true)

    for (const file of toUpload) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/upload-photo', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.url) {
          setPhotos(prev => [...prev, { url: data.url, name: file.name }])
        }
      } catch {
        // skip failed uploads
      }
    }
    setUploading(false)
  }, [photos.length])

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.dog_name.trim()) newErrors.dog_name = 'Dog name is required'
    if (!form.breed) newErrors.breed = 'Breed is required'
    if (!form.color_traits.trim()) newErrors.color_traits = 'Color / traits is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.state) newErrors.state = 'State is required'
    if (!form.owner_name.trim()) newErrors.owner_name = 'Your name is required'
    if (!form.phone_number.trim()) newErrors.phone_number = 'Phone number is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    else if (form.description.trim().length < 50) newErrors.description = 'Description must be at least 50 characters'
    if (!form.ownership_confirmed) newErrors.ownership_confirmed = 'You must confirm ownership'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/submit-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: form.age ? parseInt(form.age) : null,
          stud_fee: form.stud_fee ? parseFloat(form.stud_fee) : null,
          photos: photos.map(p => p.url),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ _form: data.error || 'Submission failed. Please try again.' })
        return
      }
      setSuccess({ id: data.id, edit_token: data.edit_token })

      // Track event
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'listing_submitted',
          submission_id: data.id,
          metadata: { breed: form.breed, state: form.state },
        }),
      }).catch(() => {})
    } catch {
      setErrors({ _form: 'Submission failed. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Listing Submitted!</h2>
        <p className="text-gray-600 text-sm mb-6">
          Your listing has been submitted and is pending review. You&apos;ll hear from us within 24 hours.
        </p>
        <div className="bg-white border border-green-200 rounded-md p-4 text-left">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Save this link to edit your listing:</p>
          <a
            href={`/edit-listing/${success.edit_token}`}
            className="text-sm font-medium break-all"
            style={{ color: '#2F7D5C' }}
          >
            {typeof window !== 'undefined' ? window.location.origin : 'https://dogstud.com'}/edit-listing/{success.edit_token}
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">Bookmark that link — it&apos;s the only way to edit your listing.</p>
      </div>
    )
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 text-sm border rounded-md outline-none transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-gray-300 focus:border-[#2F7D5C]'
    }`

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const errorClass = 'text-xs text-red-500 mt-1'

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Section: Dog Info */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Dog Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Dog Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={inputClass('dog_name')}
                value={form.dog_name}
                onChange={e => update('dog_name', e.target.value)}
                placeholder="e.g. Zeus"
              />
              {errors.dog_name && <p className={errorClass}>{errors.dog_name}</p>}
            </div>
            <div>
              <label className={labelClass}>Breed <span className="text-red-500">*</span></label>
              <select
                className={inputClass('breed')}
                value={form.breed}
                onChange={e => update('breed', e.target.value)}
              >
                <option value="">Select breed...</option>
                {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.breed && <p className={errorClass}>{errors.breed}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Color / Traits <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={inputClass('color_traits')}
              value={form.color_traits}
              onChange={e => update('color_traits', e.target.value)}
              placeholder="e.g. Blue merle, blue eyes, fluffy carrier"
            />
            {errors.color_traits && <p className={errorClass}>{errors.color_traits}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Age (years)</label>
              <input
                type="number"
                className={inputClass('age')}
                value={form.age}
                onChange={e => update('age', e.target.value)}
                placeholder="e.g. 3"
                min="0"
                max="20"
              />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input
                type="date"
                className={inputClass('dob')}
                value={form.dob}
                onChange={e => update('dob', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>AKC / Registration Status</label>
              <select
                className={inputClass('akc_status')}
                value={form.akc_status}
                onChange={e => update('akc_status', e.target.value)}
              >
                <option value="">Select...</option>
                {AKC_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Stud Fee ($)</label>
              <input
                type="number"
                className={inputClass('stud_fee')}
                value={form.stud_fee}
                onChange={e => update('stud_fee', e.target.value)}
                placeholder="e.g. 1500"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Health Testing</label>
            <input
              type="text"
              className={inputClass('health_testing')}
              value={form.health_testing}
              onChange={e => update('health_testing', e.target.value)}
              placeholder="e.g. Hips OFA Good, BAER tested, DM clear"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="chilled_semen"
              checked={form.chilled_semen_available}
              onChange={e => update('chilled_semen_available', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-[#2F7D5C]"
            />
            <label htmlFor="chilled_semen" className="text-sm text-gray-700">Chilled / Frozen Semen Available</label>
          </div>
        </div>
      </div>

      {/* Section: Location */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Location</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>City <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={inputClass('city')}
              value={form.city}
              onChange={e => update('city', e.target.value)}
              placeholder="e.g. San Diego"
            />
            {errors.city && <p className={errorClass}>{errors.city}</p>}
          </div>
          <div>
            <label className={labelClass}>State <span className="text-red-500">*</span></label>
            <select
              className={inputClass('state')}
              value={form.state}
              onChange={e => update('state', e.target.value)}
            >
              <option value="">Select state...</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className={errorClass}>{errors.state}</p>}
          </div>
        </div>
      </div>

      {/* Section: Description */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Listing Description</h2>
        <div>
          <label className={labelClass}>Description <span className="text-red-500">*</span></label>
          <textarea
            className={`${inputClass('description')} resize-none`}
            rows={5}
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Describe your dog — pedigree, temperament, achievements, breeding history, what makes him a good stud..."
          />
          <div className="flex items-center justify-between mt-1">
            {errors.description
              ? <p className={errorClass}>{errors.description}</p>
              : <span />
            }
            <span className={`text-xs ${form.description.length < 50 ? 'text-gray-400' : 'text-green-600'}`}>
              {form.description.length} / 50 min
            </span>
          </div>
        </div>
      </div>

      {/* Section: Photos */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Photos</h2>
        <p className="text-xs text-gray-500 mb-3">Up to 6 photos. JPEG, PNG, or WebP. Max 8MB each.</p>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                <Image src={photo.url} alt={photo.name} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < 6 && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-[#2F7D5C] bg-green-50' : 'border-gray-300 hover:border-[#2F7D5C]'
            }`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={e => handleFileUpload(e.target.files)}
            />
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#2F7D5C] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">Drag and drop photos here, or <span className="font-medium" style={{ color: '#2F7D5C' }}>click to browse</span></p>
                <p className="text-xs text-gray-400 mt-1">{6 - photos.length} slots remaining</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Section: Contact */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Your Contact Info</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Your Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={inputClass('owner_name')}
              value={form.owner_name}
              onChange={e => update('owner_name', e.target.value)}
              placeholder="Full name"
            />
            {errors.owner_name && <p className={errorClass}>{errors.owner_name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                className={inputClass('phone_number')}
                value={form.phone_number}
                onChange={e => update('phone_number', e.target.value)}
                placeholder="(555) 000-0000"
              />
              {errors.phone_number && <p className={errorClass}>{errors.phone_number}</p>}
            </div>
            <div>
              <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                className={inputClass('email')}
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Ownership confirmation */}
      <div className="mb-8">
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${errors.ownership_confirmed ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
          <input
            type="checkbox"
            id="ownership_confirmed"
            checked={form.ownership_confirmed}
            onChange={e => update('ownership_confirmed', e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-[#2F7D5C] shrink-0"
          />
          <label htmlFor="ownership_confirmed" className="text-sm text-gray-700 cursor-pointer">
            <span className="font-medium">I confirm I am the owner</span> of this dog and have the right to list him as a stud. All information provided is accurate. <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.ownership_confirmed && <p className={errorClass}>{errors.ownership_confirmed}</p>}
      </div>

      {/* Form error */}
      {errors._form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors._form}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full py-3.5 px-6 rounded-md text-white text-sm font-semibold transition-opacity disabled:opacity-60"
        style={{ backgroundColor: '#2F7D5C' }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          'Submit Your Listing — Free'
        )}
      </button>
      <p className="text-xs text-gray-400 text-center mt-3">Listings are reviewed within 24 hours. No account required.</p>
    </form>
  )
}
