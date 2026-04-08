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

export default function ListingForm({ initialData, mode }: ListingFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<Partial<CreateListingInput>>({
    dog_name: initialData?.dog_name ?? '',
    breed: initialData?.breed ?? '',
    age: initialData?.age ?? undefined,
    city: initialData?.city ?? '',
    state: initialData?.state ?? '',
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
    if (!validation.valid) {
      setUploadError(validation.error!)
      return
    }

    setUploadError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (initialData?.id) formData.append('listingId', initialData.id)

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

  async function handleSubmit(e: React.FormEvent, submitStatus: 'draft' | 'published') {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = { ...form, status: submitStatus }

    try {
      let res: Response
      if (mode === 'create') {
        res = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/api/listings/${initialData!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

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

  return (
    <form className="space-y-8" onSubmit={(e) => handleSubmit(e, form.status as 'draft' | 'published')}>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <Input
            label="Age (years)"
            type="number"
            min={0}
            max={20}
            value={form.age ?? ''}
            onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="e.g. 3"
          />
          <Input
            label="Color"
            value={form.color ?? ''}
            onChange={(e) => handleChange('color', e.target.value)}
            placeholder="e.g. Tri Color"
          />
          <Input
            label="Weight (lbs)"
            type="number"
            min={0}
            value={form.weight ?? ''}
            onChange={(e) => handleChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="e.g. 85"
          />
        </div>
      </section>

      {/* Location */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Location
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            placeholder="Select state"
          />
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Stud Fee
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.contact_for_fee ?? false}
              onChange={(e) => handleChange('contact_for_fee', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Contact for fee (don&apos;t show price publicly)</span>
          </label>
          {!form.contact_for_fee && (
            <div className="max-w-xs">
              <Input
                label="Stud Fee (USD)"
                type="number"
                min={0}
                value={form.stud_fee ?? ''}
                onChange={(e) => handleChange('stud_fee', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="e.g. 1500"
              />
            </div>
          )}
        </div>
      </section>

      {/* Description */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Description
        </h2>
        <div className="space-y-4">
          <Input
            label="Short Summary"
            required
            value={form.short_summary ?? ''}
            onChange={(e) => handleChange('short_summary', e.target.value)}
            placeholder="One sentence about your stud (shown on browse cards)"
            maxLength={160}
          />
          <Textarea
            label="Full Description"
            required
            value={form.description ?? ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detailed description of temperament, pedigree, accomplishments..."
            className="min-h-[160px]"
          />
        </div>
      </section>

      {/* Health & Registration */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Health &amp; Registration
        </h2>
        <div className="space-y-4">
          <Textarea
            label="Health Testing"
            value={form.health_testing ?? ''}
            onChange={(e) => handleChange('health_testing', e.target.value)}
            placeholder="e.g. OFA Hip Certified, DNA tested, BAER tested..."
          />
          <Textarea
            label="Pedigree"
            value={form.pedigree_text ?? ''}
            onChange={(e) => handleChange('pedigree_text', e.target.value)}
            placeholder="Pedigree lineage, notable ancestors..."
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.akc_registered ?? false}
              onChange={(e) => handleChange('akc_registered', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">AKC Registered</span>
          </label>
        </div>
      </section>

      {/* Photo */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Primary Photo
        </h2>
        <div className="space-y-3">
          {form.primary_image_url && (
            <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={form.primary_image_url}
                alt="Primary photo"
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {form.primary_image_url ? 'Change Photo' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP · Max 5MB</p>
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
          </div>
        </div>
      </section>

      {/* Availability */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Availability
        </h2>
        <Select
          label="Availability Status"
          value={form.availability_status ?? 'available'}
          onChange={(e) => handleChange('availability_status', e.target.value as 'available' | 'unavailable' | 'limited')}
          options={[
            { value: 'available', label: 'Available' },
            { value: 'limited', label: 'Limited' },
            { value: 'unavailable', label: 'Unavailable' },
          ]}
        />
      </section>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={saving}
          onClick={(e) => handleSubmit(e, 'published')}
        >
          {mode === 'create' ? 'Publish Listing' : 'Save & Publish'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          loading={saving}
          onClick={(e) => handleSubmit(e, 'draft')}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push('/dashboard/listings')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
