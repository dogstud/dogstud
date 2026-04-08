'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import type { User } from '@supabase/supabase-js'

interface Stud {
  id: string
  name: string
  breed: string
  status: string
  city: string
  state: string
  created_at: string
  owner: { full_name: string; email: string }
}

interface Profile {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
  is_verified: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<'pending' | 'active' | 'users'>('pending')
  const [studs, setStuds] = useState<Stud[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/auth/signin'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role !== 'admin') { router.push('/'); return }
      setUser(data.user)
      loadData()
    })
  }, [router])

  async function loadData() {
    const { data: studData } = await supabase
      .from('studs')
      .select('*, owner:profiles(full_name, email)')
      .order('created_at', { ascending: false })
    setStuds(studData as Stud[] || [])

    const { data: userData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(userData || [])
    setLoading(false)
  }

  async function updateStudStatus(id: string, status: string) {
    await supabase.from('studs').update({ status }).eq('id', id)
    setStuds(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const pendingStuds = studs.filter(s => s.status === 'pending')
  const activeStuds = studs.filter(s => s.status === 'active')

  if (!user || loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
    </>
  )

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1E2A38] mb-6">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {([['pending', `Pending (${pendingStuds.length})`], ['active', `Active (${activeStuds.length})`], ['users', `Users (${users.length})`]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === key ? 'border-[#C6922F] text-[#1E2A38]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'pending' && (
          <div className="space-y-3">
            {pendingStuds.length === 0 && <p className="text-gray-400 text-center py-8">No pending listings</p>}
            {pendingStuds.map(stud => (
              <div key={stud.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1E2A38]">{stud.name}</div>
                  <div className="text-sm text-gray-500">{stud.breed} · {stud.city}, {stud.state}</div>
                  <div className="text-xs text-gray-400">Owner: {stud.owner?.full_name} ({stud.owner?.email})</div>
                  <div className="text-xs text-gray-400">{new Date(stud.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStudStatus(stud.id, 'active')}
                    className="bg-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStudStatus(stud.id, 'rejected')}
                    className="bg-red-50 text-red-600 border border-red-200 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'active' && (
          <div className="space-y-3">
            {activeStuds.map(stud => (
              <div key={stud.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1E2A38]">{stud.name}</div>
                  <div className="text-sm text-gray-500">{stud.breed} · {stud.city}, {stud.state}</div>
                </div>
                <button
                  onClick={() => updateStudStatus(stud.id, 'inactive')}
                  className="bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-200"
                >
                  Deactivate
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-medium text-[#1E2A38]">{u.full_name || '—'}</td>
                    <td className="py-2 text-gray-500">{u.email}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                        u.role === 'owner' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-50 text-gray-600'
                      }`}>{u.role}</span>
                    </td>
                    <td className="py-2 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
