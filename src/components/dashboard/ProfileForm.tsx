'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { Profile } from '@/lib/types'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
].map((s) => ({ value: s, label: s }))

interface ProfileFormProps {
  profile: Profile
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    display_name: profile.display_name ?? '',
    kennel_name: profile.kennel_name ?? '',
    bio: profile.bio ?? '',
    city: profile.city ?? '',
    state: profile.state ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')

      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          Profile saved successfully.
        </div>
      )}

      <Input
        label="Display Name"
        required
        value={form.display_name}
        onChange={(e) => handleChange('display_name', e.target.value)}
        placeholder="Your name"
      />
      <Input
        label="Kennel Name"
        value={form.kennel_name}
        onChange={(e) => handleChange('kennel_name', e.target.value)}
        placeholder="e.g. Kings Elite Bullies"
      />
      <Textarea
        label="Bio"
        value={form.bio}
        onChange={(e) => handleChange('bio', e.target.value)}
        placeholder="Tell breeders about yourself, your kennel, and your experience..."
        className="min-h-[120px]"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          value={form.city}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="Houston"
        />
        <Select
          label="State"
          value={form.state}
          onChange={(e) => handleChange('state', e.target.value)}
          options={US_STATES}
          placeholder="Select state"
        />
      </div>

      <div className="pt-2">
        <p className="text-xs text-gray-400 mb-4">
          Profile URL:{' '}
          <span className="font-mono">dogstud.com/breeders/{profile.slug}</span>
        </p>
        <Button type="submit" variant="primary" size="md" loading={saving}>
          Save Profile
        </Button>
      </div>
    </form>
  )
}
