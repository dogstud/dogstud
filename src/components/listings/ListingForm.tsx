'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { validateImage } from '@/lib/utils/validateImage'
import type { StudListing, CreateListingInput } from '@/lib/types'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
].map((s) => ({ value: s, label: s }))

const MX_STATES = [
  'Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas',
  'Chihuahua','Ciudad de México','Coahuila','Colima','Durango',
  'Estado de México','Guanajuato','Guerrero','Hidalgo','Jalisco',
  'Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca',
  'Puebla','Querétaro','Quintana Roo','San Luis Potosí','Sinaloa',
  'Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas',
].map((s) => ({ value: s, label: s }))

const BREEDS = [
  'American Bully','American Pit Bull Terrier','Bulldog','French Bulldog','English Bulldog',
  'Rottweiler','German Shepherd','Doberman Pinscher','Belgian Malinois','Cane Corso',
  'Great Dane','Labrador Retriever','Golden Retriever','Poodle','Dachshund',
  'Chihuahua','Shih Tzu','Yorkshire Terrier','Boxer','Siberian Husky',
  'Alaskan Malamute','Mastiff','Bullmastiff','Staffordshire Bull Terrier','Boston Terrier','Other',
].map((b) => ({ value: b, label: b }))

interface ListingFormProps {
  initialData?: StudListing
  mode: 'create' | 'edit'
}

type FormData = Partial<CreateListingInput>

function computeProgress(form: FormData): number {
  const fields: (keyof FormData)[] = [
    'dog_name', 'breed', 'city', 'state', 'short_summary',
    'primary_image_url', 'description', 'age', 'color', 'weight',
    'stud_fee', 'health_testing',
  ]
  const filled = fields.filter((f) => {
    const v = form[f]
    return v !== undefined && v !== null && v !== ''
  }).length
  return Math.round((filled / fields.length) * 100)
}

export default function ListingForm({ initialData, mode }: ListingFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormData>({
    dog_name: initialData?.dog_name ?? '',
    breed: initialData?.breed ?? '',
    age: initialData?.age ?? undefined,
    city: initialData?.city ?? '',
    state: initialData?.state ?? '',
    country_code: initialData?.country_code ?? 'US',
    currency: initialData?.currency ?? 'USD',
    stud_fee: initialData?.stud_fee ?? undefined,
    contact_for_fee: initialData?.contact_for_fee ?? false,
    short_summary: initialData?.short_summary ?? '',
    description: initialData?.description ?? '',
    primary_image_url: initialData?.primary_image_url ?? '',
    color: initialData?.color ?? '',
    weight: initialData?.weight ?? undefined,
    pedigree_text: initialData?.pedigree_text ?? '',
    health_testing: initialData?.health_testing ?? '',
    akc_registered: initialData?.akc_registered ?? false,
    availability_status: initialData?.availability_status ?? 'available',
    status: (initialData?.status as 'draft' | 'published') ?? 'draft',
  })

  // For create mode: 'step1' | 'step2' | 'success'
  const [uiStep, setUiStep] = useState<'step1' | 'step2' | 'success'>('step1')
  const [publishedId, setPublishedId] = useState<string | null>(null)

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  function handleChange(field: keyof CreateListingInput, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const validation = validateImage(file)
    if (!validation.valid) { setUploadError(validation.error!); return }
    setUploadError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (initialData?.id) formData.append('listingId', initialData.id)
      if (publishedId) formData.append('listingId', publishedId)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      handleChange('primary_image_url', data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // ── Edit mode: full form (unchanged behavior) ──────────────────────────
  async function handleEditSubmit(e: React.FormEvent, submitStatus: 'draft' | 'published') {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { ...form, status: submitStatus }
    try {
      const res = await fetch(`/api/listings/${initialData!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      router.push('/dashboard/listings')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  // ── Create step 1: quick publish ───────────────────────────────────────
  async function handleQuickPublish(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { ...form, status: 'published' as const }
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setPublishedId(data.id ?? data.listing?.id ?? null)
      setUiStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  // ── Create step 2: enhance (PATCH) ────────────────────────────────────
  async function handleEnhanceSave(e: React.FormEvent) {
    e.preventDefault()
    if (!publishedId) return
    setSaving(true)
    setError(null)
    const payload = { ...form, status: 'published' as const }
    try {
      const res = await fetch(`/api/listings/${publishedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      router.push('/dashboard/listings')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  // EDIT MODE: full original form
  // ────────────────────────────────────────────────────────────────────────
  if (mode === 'edit') {
    return (
      <form className="space-y-8" onSubmit={(e) => handleEditSubmit(e, 'published')}>
        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>}

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Dog Name" required value={form.dog_name ?? ''} onChange={(e) => handleChange('dog_name', e.target.value)} placeholder="e.g. King Zeus" />
            <Select label="Breed" required value={form.breed ?? ''} onChange={(e) => handleChange('breed', e.target.value)} options={BREEDS} placeholder="Select breed" />
            <Input label="Age (years)" type="number" min={0} max={20} value={form.age ?? ''} onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : undefined)} placeholder="e.g. 3" />
            <Input label="Color" value={form.color ?? ''} onChange={(e) => handleChange('color', e.target.value)} placeholder="e.g. Tri Color" />
            <Input label="Weight (lbs)" type="number" min={0} value={form.weight ?? ''} onChange={(e) => handleChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 85" />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Country" required value={form.country_code ?? 'US'} onChange={(e) => { const c = e.target.value; handleChange('country_code', c); handleChange('state', ''); handleChange('currency', c === 'MX' ? 'MXN' : 'USD') }} options={[{ value: 'US', label: 'USA' }, { value: 'MX', label: 'México' }]} placeholder="Select country" />
            <Input label="City" required value={form.city ?? ''} onChange={(e) => handleChange('city', e.target.value)} placeholder="e.g. Houston" />
            <Select label={form.country_code === 'MX' ? 'Estado' : 'State'} required value={form.state ?? ''} onChange={(e) => handleChange('state', e.target.value)} options={form.country_code === 'MX' ? MX_STATES : US_STATES} placeholder={form.country_code === 'MX' ? 'Selecciona estado' : 'Select state'} />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Stud Fee</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.contact_for_fee ?? false} onChange={(e) => handleChange('contact_for_fee', e.target.checked)} className="w-4 h-4" />
              <span className="text-sm text-gray-700">Contact for fee</span>
            </label>
            {!form.contact_for_fee && (
              <div className="flex items-end gap-3 max-w-sm">
                <div className="w-28 shrink-0">
                  <Select label="Currency" value={form.currency ?? 'USD'} onChange={(e) => handleChange('currency', e.target.value as 'USD' | 'MXN')} options={[{ value: 'USD', label: 'USD ($)' }, { value: 'MXN', label: 'MXN ($)' }]} />
                </div>
                <div className="flex-1">
                  <Input label={`Stud Fee (${form.currency ?? 'USD'})`} type="number" min={0} value={form.stud_fee ?? ''} onChange={(e) => handleChange('stud_fee', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 1500" />
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Description</h2>
          <div className="space-y-4">
            <Input label="Short Summary" required value={form.short_summary ?? ''} onChange={(e) => handleChange('short_summary', e.target.value)} placeholder="One sentence about your stud" maxLength={160} />
            <Textarea label="Full Description" required value={form.description ?? ''} onChange={(e) => handleChange('description', e.target.value)} placeholder="Detailed description..." className="min-h-[160px]" />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Health &amp; Registration</h2>
          <div className="space-y-4">
            <Textarea label="Health Testing" value={form.health_testing ?? ''} onChange={(e) => handleChange('health_testing', e.target.value)} placeholder="e.g. OFA Hip Certified, DNA tested..." />
            <Textarea label="Pedigree" value={form.pedigree_text ?? ''} onChange={(e) => handleChange('pedigree_text', e.target.value)} placeholder="Pedigree lineage..." />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.akc_registered ?? false} onChange={(e) => handleChange('akc_registered', e.target.checked)} className="w-4 h-4" />
              <span className="text-sm text-gray-700">AKC Registered</span>
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Primary Photo</h2>
          <div className="space-y-3">
            {form.primary_image_url && (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
                <Image src={form.primary_image_url} alt="Primary photo" fill className="object-cover" />
              </div>
            )}
            <div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
              <Button type="button" variant="secondary" size="sm" loading={uploading} onClick={() => fileInputRef.current?.click()}>
                {form.primary_image_url ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP · Max 5MB</p>
              {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Availability</h2>
          <Select label="Availability Status" value={form.availability_status ?? 'available'} onChange={(e) => handleChange('availability_status', e.target.value as 'available' | 'unavailable' | 'limited')} options={[{ value: 'available', label: 'Available' }, { value: 'limited', label: 'Limited' }, { value: 'unavailable', label: 'Unavailable' }]} />
        </section>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
          <Button type="submit" variant="primary" size="md" loading={saving} onClick={(e) => handleEditSubmit(e, 'published')}>Save &amp; Publish</Button>
          <Button type="button" variant="secondary" size="md" loading={saving} onClick={(e) => handleEditSubmit(e, 'draft')}>Save as Draft</Button>
          <Button type="button" variant="ghost" size="md" onClick={() => router.push('/dashboard/listings')}>Cancel</Button>
        </div>
      </form>
    )
  }

  // ────────────────────────────────────────────────────────────────────────
  // CREATE MODE
  // ────────────────────────────────────────────────────────────────────────

  const progress = computeProgress(form)

  // ── Success screen ──────────────────────────────────────────────────────
  if (uiStep === 'success') {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-6">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">Your listing is live!</h2>
        <p className="text-gray-500">Add more details to get more inquiries.</p>

        {/* Progress bar */}
        <div className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
            <span>Profile {progress}% complete</span>
            <span>Complete your listing to get more inquiries</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="md" onClick={() => setUiStep('step2')}>
            Enhance My Listing
          </Button>
          <Button variant="secondary" size="md" onClick={() => router.push('/dashboard/listings')}>
            View My Listings
          </Button>
        </div>
      </div>
    )
  }

  // ── Step 2: Enhance ─────────────────────────────────────────────────────
  if (uiStep === 'step2') {
    return (
      <div className="max-w-2xl">
        {/* Progress bar */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex justify-between text-xs font-medium text-amber-800 mb-2">
            <span>Profile {progress}% complete</span>
            <span>Complete your listing to get more inquiries</span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2">
            <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Enhance Your Listing</h2>
        <p className="text-sm text-gray-500 mb-6">Optional — but listings with more detail get significantly more inquiries.</p>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 mb-4">{error}</div>}

        <form className="space-y-6" onSubmit={handleEnhanceSave}>
          <Textarea
            label="Full Description"
            value={form.description ?? ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Temperament, pedigree, accomplishments, what makes him stand out..."
            className="min-h-[140px]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Age (years)" type="number" min={0} max={20} value={form.age ?? ''} onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : undefined)} placeholder="e.g. 3" />
            <Input label="Color" value={form.color ?? ''} onChange={(e) => handleChange('color', e.target.value)} placeholder="e.g. Tri Color" />
            <Input label="Weight (lbs)" type="number" min={0} value={form.weight ?? ''} onChange={(e) => handleChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 85" />
          </div>

          {/* Stud fee */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Stud Fee</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.contact_for_fee ?? false} onChange={(e) => handleChange('contact_for_fee', e.target.checked)} className="w-4 h-4" />
              <span className="text-sm text-gray-700">Contact for fee</span>
            </label>
            {!form.contact_for_fee && (
              <div className="flex items-end gap-3 max-w-sm">
                <div className="w-28 shrink-0">
                  <Select label="Currency" value={form.currency ?? 'USD'} onChange={(e) => handleChange('currency', e.target.value as 'USD' | 'MXN')} options={[{ value: 'USD', label: 'USD ($)' }, { value: 'MXN', label: 'MXN ($)' }]} />
                </div>
                <div className="flex-1">
                  <Input label="Amount" type="number" min={0} value={form.stud_fee ?? ''} onChange={(e) => handleChange('stud_fee', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 1500" />
                </div>
              </div>
            )}
          </div>

          <Textarea label="Health Clearances" value={form.health_testing ?? ''} onChange={(e) => handleChange('health_testing', e.target.value)} placeholder="e.g. OFA Hip Certified, DNA tested, BAER tested..." />

          {/* Additional photo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Photo</label>
            {form.primary_image_url && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 mb-2">
                <Image src={form.primary_image_url} alt="Primary photo" fill className="object-cover" />
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
            <Button type="button" variant="secondary" size="sm" loading={uploading} onClick={() => fileInputRef.current?.click()}>
              {form.primary_image_url ? 'Change Photo' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP · Max 5MB</p>
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" variant="primary" size="md" loading={saving}>Save Updates</Button>
            <Button type="button" variant="ghost" size="md" onClick={() => router.push('/dashboard/listings')}>Skip for now</Button>
          </div>
        </form>
      </div>
    )
  }

  // ── Step 1: Quick List ──────────────────────────────────────────────────
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Quick List</h2>
        <p className="text-sm text-gray-500">Get your stud live in under 60 seconds. Only 5 fields required.</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 mb-4">{error}</div>}

      <form className="space-y-5" onSubmit={handleQuickPublish}>
        <Input
          label="Dog Name"
          required
          value={form.dog_name ?? ''}
          onChange={(e) => handleChange('dog_name', e.target.value)}
          placeholder="e.g. King Zeus"
        />

        <Select
          label="Breed"
          required
          value={form.breed ?? ''}
          onChange={(e) => handleChange('breed', e.target.value)}
          options={BREEDS}
          placeholder="Select breed"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            required
            value={form.city ?? ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g. Houston"
          />
          <Select
            label="State"
            required
            value={form.state ?? ''}
            onChange={(e) => handleChange('state', e.target.value)}
            options={US_STATES}
            placeholder="State"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo <span className="text-gray-400 font-normal">(optional — but gets more clicks)</span>
          </label>
          {form.primary_image_url && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 mb-2">
              <Image src={form.primary_image_url} alt="Primary photo" fill className="object-cover" />
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
          <Button type="button" variant="secondary" size="sm" loading={uploading} onClick={() => fileInputRef.current?.click()}>
            {form.primary_image_url ? 'Change Photo' : 'Upload Photo'}
          </Button>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP · Max 5MB</p>
          {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
        </div>

        <div>
          <Input
            label="Short Summary"
            required
            value={form.short_summary ?? ''}
            onChange={(e) => handleChange('short_summary', e.target.value.slice(0, 150))}
            placeholder="One sentence — e.g. Proven French Bulldog stud, triple carrier, located in Houston TX"
            maxLength={150}
          />
          <p className="text-xs text-gray-400 mt-1">{(form.short_summary ?? '').length}/150 characters</p>
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" size="md" loading={saving} className="w-full">
            Publish Listing →
          </Button>
          <p className="text-xs text-center text-gray-400 mt-2">Goes live immediately. You can add more details after.</p>
        </div>
      </form>
    </div>
  )
}
