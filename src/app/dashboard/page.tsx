'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'

interface Stud {
  id: string
  name: string
  breed: string
  status: string
  views: number
  message_count: number
  photos: string[]
  availability: string
  stud_fee: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [studs, setStuds] = useState<Stud[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/auth/signin'); return }
      setUser(data.user)
      const { data: myStuds } = await supabase
        .from('studs')
        .select('*')
        .eq('owner_id', data.user.id)
        .order('created_at', { ascending: false })
      setStuds(myStuds || [])
      setLoading(false)
    })
  }, [router])

  const totalViews = studs.reduce((a, s) => a + (s.views || 0), 0)
  const totalMessages = studs.reduce((a, s) => a + (s.message_count || 0), 0)
  const activeListings = studs.filter(s => s.status === 'active').length

  if (!user || loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
    </>
  )

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1E2A38]">Dashboard</h1>
          <Link
            href="/list"
            className="bg-[#C6922F] hover:bg-[#A87826] text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            + Add Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active Listings', value: activeListings },
            { label: 'Total Views', value: totalViews },
            { label: 'Messages', value: totalMessages },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-[#1E2A38]">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1E2A38]">My Listings</h2>
          <Link href="/inbox" className="text-sm text-[#C6922F] font-semibold hover:underline">View Inbox →</Link>
        </div>

        {studs.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
            <p className="text-gray-400 mb-4">No listings yet</p>
            <Link href="/list" className="bg-[#C6922F] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#A87826]">
              List Your Stud
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {studs.map(stud => (
              <div key={stud.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={stud.photos?.[0] || `https://picsum.photos/seed/${stud.id}/64/64`}
                    alt={stud.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1E2A38]">{stud.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      stud.status === 'active' ? 'bg-green-50 text-green-700' :
                      stud.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>{stud.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">{stud.breed}</p>
                  <div className="flex gap-4 text-xs text-gray-400 mt-1">
                    <span>👁 {stud.views || 0} views</span>
                    <span>💬 {stud.message_count || 0} messages</span>
                    <span>${stud.stud_fee?.toLocaleString() || 'Contact'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/studs/${stud.id}`} className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
