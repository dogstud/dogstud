'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface InquiryFormProps {
  listingId: string
  listingSlug: string
  breederUserId: string
}

export default function InquiryForm({ listingId, listingSlug, breederUserId }: InquiryFormProps) {
  const [form, setForm] = useState({
    sender_name: '',
    sender_email: '',
    sender_phone: '',
    message: '',
    website: '', // honeypot
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.website) return // honeypot triggered
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          listing_slug: listingSlug,
          breeder_user_id: breederUserId,
          sender_name: form.sender_name,
          sender_email: form.sender_email,
          sender_phone: form.sender_phone,
          message: form.message,
          honeypot: form.website,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to send inquiry')

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="p-5 bg-green-50 border border-green-200 rounded-lg text-center">
        <p className="font-semibold text-green-800 text-base">Inquiry Sent</p>
        <p className="text-sm text-green-700 mt-1">
          The breeder will be in touch with you shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-gray-900 text-base">Contact the Breeder</h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Honeypot — hidden from humans */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            tabIndex={-1}
            name="website"
            value={form.website}
            onChange={(e) => handleChange('website', e.target.value)}
            autoComplete="off"
          />
        </label>
      </div>

      <Input
        label="Your Name"
        required
        value={form.sender_name}
        onChange={(e) => handleChange('sender_name', e.target.value)}
        placeholder="Jane Smith"
        autoComplete="name"
      />
      <Input
        label="Email Address"
        type="email"
        required
        value={form.sender_email}
        onChange={(e) => handleChange('sender_email', e.target.value)}
        placeholder="jane@example.com"
        autoComplete="email"
      />
      <Input
        label="Phone Number (optional)"
        type="tel"
        value={form.sender_phone}
        onChange={(e) => handleChange('sender_phone', e.target.value)}
        placeholder="(555) 000-0000"
        autoComplete="tel"
      />
      <Textarea
        label="Message"
        required
        value={form.message}
        onChange={(e) => handleChange('message', e.target.value)}
        placeholder="Tell the breeder about your female, breeding goals, and any questions you have..."
        className="min-h-[120px]"
      />

      <Button type="submit" variant="primary" size="md" loading={submitting} className="w-full">
        Send Inquiry
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Your information is shared only with this breeder.
      </p>
    </form>
  )
}
