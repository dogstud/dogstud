import type { Metadata } from 'next'
import EditListingForm from '@/components/submissions/EditListingForm'

export const metadata: Metadata = {
  title: 'Edit Your Listing | DOGSTUD',
  robots: { index: false, follow: false },
}

export default async function EditListingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Your Listing</h1>
      <EditListingForm token={token} />
    </div>
  )
}
