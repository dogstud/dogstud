'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { trackMessage } from '@/lib/track'
import type { User } from '@supabase/supabase-js'

interface MessageModalProps {
  studId: string
  studName: string
  ownerId: string
  breed?: string
  onClose: () => void
}

export default function MessageModal({ studId, studName, ownerId, breed, onClose }: MessageModalProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  async function handleSend() {
    if (!message.trim() || !user) return
    setSending(true)
    setError('')
    try {
      // Upsert conversation
      const { data: conv, error: convErr } = await supabase
        .from('conversations')
        .upsert(
          { stud_id: studId, buyer_id: user.id, owner_id: ownerId, last_message_preview: message.slice(0, 100), last_message_at: new Date().toISOString() },
          { onConflict: 'stud_id,buyer_id' }
        )
        .select()
        .single()

      if (convErr) throw convErr

      const { error: msgErr } = await supabase
        .from('messages')
        .insert({ conversation_id: conv.id, sender_id: user.id, message_text: message })

      if (msgErr) throw msgErr

      await trackMessage(conv.id, studId, breed || '', '')
      setSent(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send. Try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-bold text-[#1E2A38]">Message Sent!</h3>
              <p className="text-sm text-gray-500 mt-2">The owner of {studName} will be in touch. Check your inbox for replies.</p>
              <button
                onClick={onClose}
                className="mt-4 bg-[#C6922F] hover:bg-[#A87826] text-white font-semibold px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          ) : !user ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-3">👋</div>
              <h3 className="text-lg font-bold text-[#1E2A38]">Contact this stud owner</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">View the listing to call or text the owner directly — no account needed.</p>
              <a
                href="/studs"
                className="block bg-[#1F4D3A] text-white text-center font-semibold py-2.5 rounded-lg"
              >
                Browse Listings
              </a>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-[#1E2A38] mb-1">Contact {studName}&apos;s Owner</h3>
              <p className="text-sm text-gray-500 mb-4">Introduce yourself and ask about availability.</p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                placeholder={`Hi, I'm interested in ${studName} for my female. Can you tell me about availability and requirements?`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F] resize-none"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              <button
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="mt-3 w-full bg-[#C6922F] hover:bg-[#A87826] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
