'use client'

import { useState, useEffect } from 'react'

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

interface ListingData {
  id: string
  dog_name: string
  breed: string
  color_traits: string
  city: string
  state: string
  stud_fee: number | null
  owner_name: string
  phone_number: string
  email: string
  description: string
  akc_status: string | null
  health_testing: string | null
  chilled_semen_available: boolean
  photos: string[]
  age: number | null
  dob: string | null
  status: string
}

interface EditListingFormProps {
  token: string
}

export default function EditListingForm({ token }: EditListingFormProps) {
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<Partial<ListingData>>({})
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch(`/api/edit-listing/${token}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null }
        return res.json()
      })
      .then(data => {
        if (data) {
          setForm(data)
          setStatus(data.status)
        }
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [token])

  const update = (field: string, value: string | boolean | number | null) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    setSaved(false)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.dog_name?.trim()) newErrors.dog_name = 'Dog name is required'
    if (!form.breed) newErrors.breed = 'Breed is required'
    if (!form.color_traits?.trim()) newErrors.color_traits = 'Color / traits is required'
    if (!form.city?.trim()) newErrors.city = 'City is required'
    if (!form.state) newErrors.state = 'State is required'
    if (!form.owner_name?.trim()) newErrors.owner_name = 'Your name is required'
    if (!form.phone_number?.trim()) newErrors.phone_number = 'Phone number is required'
    if (!form.email?.trim()) newErrors.email = 'Email is required'
    if (!form.description?.trim()) newErrors.description = 'Description is required'
    else if (form.description.trim().length < 50) newErrors.description = 'Description must be at least 50 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/edit-listing/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrors({ _form: data.error || 'Save failed. Please try again.' })
        return
      }
      setSaved(true)
    } catch {
      setErrors({ _form: 'Save failed. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#2F7D5C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Invalid or Expired Link</h2>
        <p className="text-sm text-gray-500">This edit link doesn&apos;t match any listing. Check your link and try again.</p>
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
    <div>
      {status === 'approved' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">✓ Your listing is live and approved.</p>
          <p className="text-xs text-green-600 mt-0.5">Updates will be reviewed before going live.</p>
        </div>
      )}
      {status === 'pending' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">⏳ Your listing is pending review.</p>
          <p className="text-xs text-yellow-600 mt-0.5">You can update your details below while it&apos;s being reviewed.</p>
        </div>
      )}
      {status === 'rejected' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800">Your listing was not approved.</p>
          <p className="text-xs text-red-600 mt-0.5">Update the details below and save to resubmit for review.</p>
        </div>
      )}

      <form onSubmit={handleSave} noValidate>
        {/* Dog Info */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Dog Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Dog Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={inputClass('dog_name')}
                  value={form.dog_name || ''}
                  onChange={e => update('dog_name', e.target.value)}
                />
                {errors.dog_name && <p className={errorClass}>{errors.dog_name}</p>}
              </div>
              <div>
                <label className={labelClass}>Breed <span className="text-red-500">*</span></label>
                <select
                  className={inputClass('breed')}
                  value={form.breed || ''}
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
                value={form.color_traits || ''}
                onChange={e => update('color_traits', e.target.value)}
              />
              {errors.color_traits && <p className={errorClass}>{errors.color_traits}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Age (years)</label>
                <input
                  type="number"
                  className={inputClass('age')}
                  value={form.age ?? ''}
                  onChange={e => update('age', e.target.value ? parseInt(e.target.value) : null)}
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  className={inputClass('dob')}
                  value={form.dob || ''}
                  onChange={e => update('dob', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>AKC / Registration Status</label>
                <select
                  className={inputClass('akc_status')}
                  value={form.akc_status || ''}
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
                  value={form.stud_fee ?? ''}
                  onChange={e => update('stud_fee', e.target.value ? parseFloat(e.target.value) : null)}
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Health Testing</label>
              <input
                type="text"
                className={inputClass('health_testing')}
                value={form.health_testing || ''}
                onChange={e => update('health_testing', e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="chilled_semen_edit"
                checked={form.chilled_semen_available || false}
                onChange={e => update('chilled_semen_available', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#2F7D5C]"
              />
              <label htmlFor="chilled_semen_edit" className="text-sm text-gray-700">Chilled / Frozen Semen Available</label>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={inputClass('city')}
                value={form.city || ''}
                onChange={e => update('city', e.target.value)}
              />
              {errors.city && <p className={errorClass}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelClass}>State <span className="text-red-500">*</span></label>
              <select
                className={inputClass('state')}
                value={form.state || ''}
                onChange={e => update('state', e.target.value)}
              >
                <option value="">Select state...</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className={errorClass}>{errors.state}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Description</h2>
          <div>
            <label className={labelClass}>Description <span className="text-red-500">*</span></label>
            <textarea
              className={`${inputClass('description')} resize-none`}
              rows={5}
              value={form.description || ''}
              onChange={e => update('description', e.target.value)}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description
                ? <p className={errorClass}>{errors.description}</p>
                : <span />
              }
              <span className={`text-xs ${(form.description?.length || 0) < 50 ? 'text-gray-400' : 'text-green-600'}`}>
                {form.description?.length || 0} / 50 min
              </span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Info</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Your Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={inputClass('owner_name')}
                value={form.owner_name || ''}
                onChange={e => update('owner_name', e.target.value)}
              />
              {errors.owner_name && <p className={errorClass}>{errors.owner_name}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  className={inputClass('phone_number')}
                  value={form.phone_number || ''}
                  onChange={e => update('phone_number', e.target.value)}
                />
                {errors.phone_number && <p className={errorClass}>{errors.phone_number}</p>}
              </div>
              <div>
                <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  className={inputClass('email')}
                  value={form.email || ''}
                  onChange={e => update('email', e.target.value)}
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>
            </div>
          </div>
        </div>

        {errors._form && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors._form}</p>
          </div>
        )}

        {saved && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700 font-medium">✓ Changes saved successfully.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-6 rounded-md text-white text-sm font-semibold transition-opacity disabled:opacity-60"
          style={{ backgroundColor: '#2F7D5C' }}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          Photos can be updated by contacting us or re-submitting your listing.
        </p>
      </form>
    </div>
  )
}
