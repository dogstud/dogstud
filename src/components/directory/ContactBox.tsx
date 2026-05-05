'use client'

import { useState } from 'react'

interface Props {
  phone: string
  ownerName: string
  listingId: string
  slug: string
  breed: string
  city: string
  state: string
}

async function track(event: string, listingId: string, meta: Record<string, string>) {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: event, submission_id: listingId, metadata: meta }),
    })
  } catch { /* silent */ }
}

export default function ContactBox({ phone, ownerName, listingId, slug, breed, city, state }: Props) {
  const [revealed, setRevealed] = useState(false)
  const meta = { slug, breed, city, state }

  const handleReveal = () => {
    setRevealed(true)
    track('phone_reveal_click', listingId, meta)
  }

  const handleCall = () => {
    track('call_click', listingId, meta)
  }

  const handleSms = () => {
    track('sms_click', listingId, meta)
  }

  const maskedPhone = phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Listed by</p>
        <p className="font-semibold text-gray-900">{ownerName}</p>
      </div>

      {/* Reveal phone */}
      {!revealed ? (
        <button
          onClick={handleReveal}
          className="w-full py-2.5 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-between"
        >
          <span className="text-gray-400 font-mono tracking-widest">{maskedPhone}</span>
          <span className="text-xs font-semibold text-gray-900">Reveal Number</span>
        </button>
      ) : (
        <div className="rounded-lg border border-gray-200 px-4 py-2.5 text-center">
          <p className="font-mono font-semibold text-gray-900 text-lg tracking-wide">{phone}</p>
        </div>
      )}

      {/* Call + Text */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${phone.replace(/\D/g, '')}`}
          onClick={handleCall}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#1F4D3A' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call
        </a>
        <a
          href={`sms:${phone.replace(/\D/g, '')}`}
          onClick={handleSms}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Text
        </a>
      </div>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Contact the owner directly. DogStud does not facilitate transactions.
      </p>
    </div>
  )
}
