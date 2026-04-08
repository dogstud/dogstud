'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'

interface Conversation {
  id: string
  stud_id: string
  buyer_id: string
  owner_id: string
  last_message_at: string
  last_message_preview: string
  buyer_unread: number
  owner_unread: number
  stud: { name: string; breed: string; photos: string[] }
  other_user: { full_name: string; avatar_url: string }
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  message_text: string
  is_read: boolean
  created_at: string
}

export default function InboxPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [active, setActive] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [showThread, setShowThread] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/signin'); return }
      setUser(data.user)
      loadConversations(data.user.id)
    })
  }, [router])

  async function loadConversations(userId: string) {
    const { data } = await supabase
      .from('conversations')
      .select('*, stud:studs(name, breed, photos)')
      .or(`buyer_id.eq.${userId},owner_id.eq.${userId}`)
      .order('last_message_at', { ascending: false })

    if (data) {
      const enriched = await Promise.all(data.map(async (conv) => {
        const otherId = conv.buyer_id === userId ? conv.owner_id : conv.buyer_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', otherId)
          .single()
        return { ...conv, other_user: profile || { full_name: 'User', avatar_url: '' } }
      }))
      setConversations(enriched as Conversation[])
    }
  }

  async function openConversation(conv: Conversation) {
    setActive(conv)
    setShowThread(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)

    // Real-time subscription
    const channel = supabase
      .channel(`conv:${conv.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conv.id}` }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendReply() {
    if (!reply.trim() || !active || !user) return
    setSending(true)
    await supabase.from('messages').insert({
      conversation_id: active.id,
      sender_id: user.id,
      message_text: reply,
    })
    await supabase.from('conversations').update({
      last_message_preview: reply.slice(0, 100),
      last_message_at: new Date().toISOString(),
    }).eq('id', active.id)
    setReply('')
    setSending(false)
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto h-[calc(100vh-56px)] flex overflow-hidden">
        {/* Conversation list */}
        <div className={`w-full sm:w-80 border-r border-gray-200 flex flex-col ${showThread ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <h1 className="font-bold text-[#1E2A38] text-lg">Inbox</h1>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No conversations yet</div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${active?.id === conv.id ? 'bg-[#FBF4E9]' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={conv.stud?.photos?.[0] || `https://picsum.photos/seed/${conv.stud_id}/80/80`}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-sm text-[#1E2A38] truncate">{conv.stud?.name || 'Stud'}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                          {new Date(conv.last_message_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.other_user?.full_name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{conv.last_message_preview}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Thread */}
        <div className={`flex-1 flex flex-col ${!showThread ? 'hidden sm:flex' : 'flex'}`}>
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-gray-200 flex items-center gap-3">
                <button className="sm:hidden text-gray-500 mr-1" onClick={() => setShowThread(false)}>← Back</button>
                <div className="font-semibold text-[#1E2A38]">{active.stud?.name}</div>
                <div className="text-sm text-gray-500">{active.stud?.breed}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${msg.sender_id === user.id ? 'bg-[#1E2A38] text-white' : 'bg-gray-100 text-gray-800'}`}>
                      {msg.message_text}
                      <div className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-blue-200' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-3 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendReply()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922F]"
                />
                <button
                  onClick={sendReply}
                  disabled={sending || !reply.trim()}
                  className="bg-[#C6922F] hover:bg-[#A87826] disabled:opacity-50 text-white font-semibold px-4 rounded-lg text-sm"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
