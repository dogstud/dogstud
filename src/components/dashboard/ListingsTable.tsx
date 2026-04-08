'use client'

import Link from 'next/link'
import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatFee } from '@/lib/utils/formatFee'
import type { StudListing } from '@/lib/types'

interface ListingsTableProps {
  listings: StudListing[]
}

export default function ListingsTable({ listings }: ListingsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      window.location.reload()
    } catch {
      alert('Failed to delete listing')
    } finally {
      setDeleting(null)
    }
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-500">No listings yet.</p>
        <Link
          href="/dashboard/listings/new"
          className="inline-block mt-4 text-sm font-medium px-4 py-2 rounded text-white"
          style={{ backgroundColor: '#0B1F2A' }}
        >
          Create Your First Listing
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Dog</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Breed</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Fee</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Availability</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{listing.dog_name}</p>
                    <p className="text-xs text-gray-400">
                      {listing.city}, {listing.state}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{listing.breed}</td>
                <td className="px-4 py-3 text-gray-600">
                  {formatFee(listing.stud_fee, listing.contact_for_fee)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={listing.status} />
                </td>
                <td className="px-4 py-3">
                  <Badge variant={listing.availability_status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {listing.status === 'published' && (
                      <Link
                        href={`/studs/${listing.slug}`}
                        target="_blank"
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        View
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/listings/${listing.id}/edit`}
                      className="text-xs font-medium px-2.5 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      loading={deleting === listing.id}
                      onClick={() => handleDelete(listing.id)}
                      className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 px-2.5 py-1"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
