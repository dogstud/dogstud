import ListingForm from '@/components/listings/ListingForm'

export const metadata = {
  title: 'New Listing — DOGSTUD Dashboard',
}

export default function NewListingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Create New Listing</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Fill in the details below to list your stud on DOGSTUD.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ListingForm mode="create" />
      </div>
    </div>
  )
}
