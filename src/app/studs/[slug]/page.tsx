import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getListing } from '@/lib/queries/listings'
import { formatFee } from '@/lib/utils/formatFee'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import InquiryForm from '@/components/inquiries/InquiryForm'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const listing = await getListing(slug)
  if (!listing) return { title: 'Listing Not Found' }
  return {
    title: `${listing.dog_name} — ${listing.breed} Stud | DOGSTUD`,
    description: listing.short_summary,
  }
}

export default async function StudDetailPage({ params }: PageProps) {
  const { slug } = await params
  const listing = await getListing(slug)
  if (!listing) notFound()

  const profile = listing.profiles
  const feeDisplay = formatFee(listing.stud_fee, listing.contact_for_fee)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/studs" className="hover:text-gray-800">Browse Studs</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{listing.dog_name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary image */}
          <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
            {listing.primary_image_url ? (
              <Image
                src={listing.primary_image_url}
                alt={listing.dog_name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {listing.featured && (
              <div className="absolute top-3 left-3">
                <Badge variant="featured" />
              </div>
            )}
          </div>

          {/* Dog info */}
          <Card>
            <div className="flex flex-wrap items-start gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900">{listing.dog_name}</h1>
                <p className="text-gray-500 mt-0.5">{listing.breed}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant={listing.availability_status} />
                {listing.akc_registered && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    AKC Registered
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">{listing.short_summary}</p>

            {/* Key details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-sm text-gray-900">{listing.city}, {listing.state}</p>
              </div>
              {listing.age && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Age</p>
                  <p className="text-sm text-gray-900">{listing.age} yr{listing.age !== 1 ? 's' : ''}</p>
                </div>
              )}
              {listing.color && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Color</p>
                  <p className="text-sm text-gray-900">{listing.color}</p>
                </div>
              )}
              {listing.weight && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Weight</p>
                  <p className="text-sm text-gray-900">{listing.weight} lbs</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Stud Fee</p>
                <p className="text-sm font-semibold text-gray-900">{feeDisplay}</p>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-3">About {listing.dog_name}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </Card>

          {/* Health & Pedigree */}
          {(listing.health_testing || listing.pedigree_text) && (
            <Card>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Health &amp; Pedigree</h2>
              {listing.health_testing && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Health Testing</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{listing.health_testing}</p>
                </div>
              )}
              {listing.pedigree_text && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Pedigree</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{listing.pedigree_text}</p>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Breeder info */}
          {profile && (
            <Card>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Listed By</h2>
              <Link
                href={`/breeders/${profile.slug}`}
                className="flex items-center gap-3 group"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: '#0B1F2A' }}
                >
                  {profile.display_name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:underline truncate">
                    {profile.display_name}
                  </p>
                  {profile.kennel_name && (
                    <p className="text-sm text-gray-500 truncate">{profile.kennel_name}</p>
                  )}
                  {(profile.city || profile.state) && (
                    <p className="text-xs text-gray-400">
                      {[profile.city, profile.state].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </Link>
            </Card>
          )}

          {/* Inquiry form */}
          <div id="inquiry-form">
          <Card>
            {listing.profiles?.user_id ? (
              <InquiryForm
                listingId={listing.id}
                listingSlug={listing.slug}
                breederUserId={listing.profiles.user_id}
              />
            ) : (
              <p className="text-sm text-gray-500">Contact information unavailable.</p>
            )}
          </Card>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-4 z-40">
        <a
          href="#inquiry-form"
          className="block w-full text-center py-3 rounded-md text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#0B1F2A" }}
        >
          Send Message
        </a>
      </div>
    </div>
  )
}
