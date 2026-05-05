'use client'

import { useState, useEffect, useCallback } from 'react'

interface Submission {
  id: string
  dog_name: string
  breed: string
  city: string
  state: string
  owner_name: string
  phone_number: string
  email: string
  status: string
  created_at: string
  featured: boolean
  verified: boolean
  admin_notes: string | null
  color_traits: string
  description: string
  stud_fee: number | null
  akc_status: string | null
  health_testing: string | null
  chilled_semen_available: boolean
  photos: string[]
  source: string
  edit_token: string
  slug: string | null
  published_at: string | null
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

interface AdminPanelProps {
  token: string
}

export default function AdminPanel({ token }: AdminPanelProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [noteValues, setNoteValues] = useState<Record<string, string>>({})

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const url = statusFilter === 'all'
        ? `/api/admin/submissions?token=${token}`
        : `/api/admin/submissions?token=${token}&status=${statusFilter}`
      const res = await fetch(url)
      const data = await res.json()
      if (Array.isArray(data)) setSubmissions(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [token, statusFilter])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const patch = async (id: string, update: Record<string, unknown>) => {
    setActionLoading(id)
    try {
      await fetch(`/api/admin/submissions?token=${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ id, ...update }),
      })
      await fetchSubmissions()
    } finally {
      setActionLoading(null)
    }
  }

  const copyUrl = async (slug: string, id: string) => {
    const url = `https://dogstud.com/studs/${slug}`
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const approve = (id: string) => patch(id, { status: 'approved' })
  const reject = (id: string) => patch(id, { status: 'rejected' })
  const toggleFeatured = (row: Submission) => patch(row.id, { featured: !row.featured })
  const toggleVerified = (row: Submission) => patch(row.id, { verified: !row.verified })
  const saveNotes = (row: Submission) => patch(row.id, { admin_notes: noteValues[row.id] ?? row.admin_notes ?? '' })

  const counts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  }

  const tabs: { label: string; value: StatusFilter }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'All', value: 'all' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Submissions Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage stud listing submissions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-lg p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={statusFilter === tab.value ? { backgroundColor: '#2F7D5C' } : {}}
            >
              {tab.label}
              {statusFilter !== 'all' && tab.value !== 'all' && (
                <span className={`ml-1.5 text-xs ${statusFilter === tab.value ? 'opacity-80' : 'text-gray-400'}`}>
                  ({counts[tab.value]})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#2F7D5C] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No submissions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Dog / Breed</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Location</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Owner</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Contact</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submissions.map(row => (
                    <>
                      <tr
                        key={row.id}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${expandedId === row.id ? 'bg-gray-50' : ''}`}
                        onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{row.dog_name}</p>
                          <p className="text-xs text-gray-500">{row.breed}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.city}, {row.state}</td>
                        <td className="px-4 py-3 text-gray-900">{row.owner_name}</td>
                        <td className="px-4 py-3">
                          <p className="text-gray-600">{row.phone_number}</p>
                          <p className="text-xs text-gray-400">{row.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.status === 'approved' ? 'bg-green-100 text-green-700' :
                            row.status === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            {row.status !== 'approved' && (
                              <button
                                onClick={() => approve(row.id)}
                                disabled={actionLoading === row.id}
                                className="px-3 py-1 rounded text-xs font-semibold text-white disabled:opacity-50"
                                style={{ backgroundColor: '#2F7D5C' }}
                              >
                                Approve
                              </button>
                            )}
                            {row.status !== 'rejected' && (
                              <button
                                onClick={() => reject(row.id)}
                                disabled={actionLoading === row.id}
                                className="px-3 py-1 rounded text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                              className="px-3 py-1 rounded text-xs font-medium border border-gray-300 text-gray-600 hover:border-gray-400"
                            >
                              {expandedId === row.id ? 'Close' : 'Details'}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {expandedId === row.id && (
                        <tr key={`${row.id}-expanded`}>
                          <td colSpan={7} className="px-4 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700 text-sm">Listing Details</h4>
                                <div className="text-xs space-y-1.5 text-gray-600">
                                  <p><span className="font-medium">Color/Traits:</span> {row.color_traits}</p>
                                  {row.stud_fee && <p><span className="font-medium">Stud Fee:</span> ${row.stud_fee}</p>}
                                  {row.akc_status && <p><span className="font-medium">AKC Status:</span> {row.akc_status}</p>}
                                  {row.health_testing && <p><span className="font-medium">Health Testing:</span> {row.health_testing}</p>}
                                  <p><span className="font-medium">Chilled Semen:</span> {row.chilled_semen_available ? 'Yes' : 'No'}</p>
                                  <p><span className="font-medium">Source:</span> {row.source}</p>
                                  <p><span className="font-medium">Edit Link:</span> <a href={`/edit-listing/${row.edit_token}`} target="_blank" rel="noopener noreferrer" className="text-[#2F7D5C] underline">/edit-listing/{row.edit_token.slice(0, 12)}...</a></p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-600 mb-1">Description:</p>
                                  <p className="text-xs text-gray-500 leading-relaxed bg-white border border-gray-200 rounded p-2">{row.description}</p>
                                </div>
                                {row.photos && row.photos.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-600 mb-2">Photos ({row.photos.length}):</p>
                                    <div className="flex gap-2 flex-wrap">
                                      {row.photos.map((url, i) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img key={i} src={url} alt={`Photo ${i + 1}`} className="w-16 h-16 object-cover rounded border border-gray-200" />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center gap-6">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={row.featured}
                                      onChange={() => toggleFeatured(row)}
                                      className="w-4 h-4 accent-[#2F7D5C]"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Featured</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={row.verified}
                                      onChange={() => toggleVerified(row)}
                                      className="w-4 h-4 accent-[#2F7D5C]"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Verified</span>
                                  </label>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Admin Notes</label>
                                  <textarea
                                    className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 resize-none outline-none focus:border-[#2F7D5C]"
                                    rows={4}
                                    defaultValue={row.admin_notes || ''}
                                    onChange={e => setNoteValues(prev => ({ ...prev, [row.id]: e.target.value }))}
                                    placeholder="Internal notes..."
                                  />
                                  <button
                                    onClick={() => saveNotes(row)}
                                    className="mt-1 px-3 py-1 text-xs font-medium border border-gray-300 text-gray-600 rounded hover:border-[#2F7D5C] hover:text-[#2F7D5C] transition-colors"
                                  >
                                    Save Notes
                                  </button>
                                </div>
                                {row.status === 'approved' && row.slug && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Public URL</p>
                                    <div className="flex items-center gap-2">
                                      <code className="text-xs bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 truncate flex-1">
                                        dogstud.com/studs/{row.slug}
                                      </code>
                                      <button
                                        onClick={() => copyUrl(row.slug!, row.id)}
                                        className="px-2 py-1 text-xs font-medium border border-gray-300 rounded hover:border-[#2F7D5C] transition-colors whitespace-nowrap"
                                      >
                                        {copiedId === row.id ? '✓ Copied' : 'Copy'}
                                      </button>
                                      <a
                                        href={`/studs/${row.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 py-1 text-xs font-medium border border-gray-300 rounded hover:border-[#2F7D5C] transition-colors"
                                      >
                                        View ↗
                                      </a>
                                    </div>
                                  </div>
                                )}
                                {row.status === 'pending' && (
                                  <div className="flex gap-2 pt-2">
                                    <button
                                      onClick={() => approve(row.id)}
                                      disabled={actionLoading === row.id}
                                      className="flex-1 py-2 rounded text-sm font-semibold text-white disabled:opacity-50"
                                      style={{ backgroundColor: '#2F7D5C' }}
                                    >
                                      ✓ Approve
                                    </button>
                                    <button
                                      onClick={() => reject(row.id)}
                                      disabled={actionLoading === row.id}
                                      className="flex-1 py-2 rounded text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
                                    >
                                      ✗ Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
