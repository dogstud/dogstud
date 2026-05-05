import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getApprovedListingBySlug } from '@/lib/submissions'
import ContactBox from '@/components/directory/ContactBox'
import ListingViewTracker from '@/components/directory/ListingViewTracker'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const listing = await getApprovedListingBySlug(slug)
  if (!listing) return { title: 'Not Found' }

  const title = `${listing.dog_name} - ${listing.breed} Stud in ${listing.city}, ${listing.state}`
  const description = `View ${listing.dog_name}, a ${listing.color_traits} ${listing.breed} stud in ${listing.city}, ${listing.state}. Contact the owner directly through DogStud.`
  const image = listing.primary_image || listing.photos?.[0]

  return {
    title: title.length > 60 ? title.slice(0, 57) + '...' : title,
    description: description.length > 150 ? description.slice(0, 147) + '...' : description,
    alternates: { canonical: `https://dogstud.com/studs/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://dogstud.com/studs/${slug}`,
      type: 'website',
      ...(image ? { images: [{ url: image, width: 1200, height: 900, alt: listing.dog_name }] } : {}),
    },
    robots: { index: true, follow: true },
  }
}

function formatFee(fee: number | null): string {
  if (!fee) return 'Contact owner for fee'
  return `$${fee.toLocaleString()}`
}

function formatAge(age: number | null, dob: string | null): string | null {
  if (age) return `${age} year${age !== 1 ? 's' : ''}`
  if (dob) {
    const years = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000))
    return `${years} year${years !== 1 ? 's' : ''} (approx.)`
  }
  return null
}

export default async function StudDetailPage({ params }: PageProps) {
  const { slug } = await params
  const listing = await getApprovedListingBySlug(slug)
  if (!listing) notFound()

  const ageDisplay = formatAge(listing.age, listing.dob)
  const allPhotos = [
    ...(listing.primary_image ? [listing.primary_image] : []),
    ...(listing.photos || []).filter(p => p !== listing.primary_image),
  ]
  const primaryPhoto = allPhotos[0] || null
  const galleryPhotos = allPhotos.slice(1)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${listing.dog_name} — ${listing.breed} Stud Service`,
    description: listing.description,
    areaServed: {
      '@type': 'Place',
      name: `${listing.city}, ${listing.state}`,
    },
    url: `https://dogstud.com/studs/${slug}`,
    ...(primaryPhoto ? { image: primaryPhoto } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingViewTracker
        listingId={listing.id}
        slug={slug}
        breed={listing.breed}
        city={listing.city}
        state={listing.state}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 lg:pb-10">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
          <Link href="/studs" className="hover:text-gray-700 transition-colors">Browse Studs</Link>
          <span>/</span>
          <Link href={`/studs?breed=${encodeURIComponent(listing.breed)}`} className="hover:text-gray-700 transition-colors">
            {listing.breed}
          </Link>
          <span>/</span>
          <span className="text-gray-700">{listing.dog_name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: photos + details */}
          <div className="lg:col-span-2 space-y-6">

            {/* H1 */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {listing.dog_name}
                </h1>
                {listing.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    Featured
                  </span>
                )}
                {listing.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-base">
                {listing.color_traits} {listing.breed} · {listing.city}, {listing.state}
              </p>
            </div>

            {/* Primary photo */}
            <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
              {primaryPhoto ? (
                <Image
                  src={primaryPhoto}
                  alt={`${listing.dog_name} — ${listing.breed} stud in ${listing.city}, ${listing.state}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Gallery */}
            {galleryPhotos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {galleryPhotos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={photo}
                      alt={`${listing.dog_name} photo ${i + 2}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Details card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Stud Details</h2>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Breed</dt>
                  <dd className="text-gray-900">{listing.breed}</dd>
                </div>
                {ageDisplay && (
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Age</dt>
                    <dd className="text-gray-900">{ageDisplay}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Color / Traits</dt>
                  <dd className="text-gray-900">{listing.color_traits}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Stud Fee</dt>
                  <dd className="font-semibold text-gray-900">{formatFee(listing.stud_fee)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Location</dt>
                  <dd className="text-gray-900">{listing.city}, {listing.state}</dd>
                </div>
                {listing.akc_status && (
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Registration</dt>
                    <dd className="text-gray-900">{listing.akc_status}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Chilled Semen</dt>
                  <dd className="text-gray-900">{listing.chilled_semen_available ? 'Available' : 'Not available'}</dd>
                </div>
              </dl>
            </div>

            {/* Health testing */}
            {listing.health_testing && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Health Testing</h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {listing.health_testing}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">About {listing.dog_name}</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
              DogStud is a listing directory. Buyers and breeders are responsible for verifying details,
              health records, agreements, and breeding terms directly with the stud owner.
            </div>
          </div>

          {/* Right: sticky contact sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <ContactBox
              phone={listing.phone_number}
              ownerName={listing.owner_name}
              listingId={listing.id}
              slug={slug}
              breed={listing.breed}
              city={listing.city}
              state={listing.state}
            />

            {/* Quick facts */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{listing.city}, {listing.state}</span>
              </div>
              {listing.stud_fee && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Stud fee: {formatFee(listing.stud_fee)}</span>
                </div>
              )}
              {listing.chilled_semen_available && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-600">Chilled semen available</span>
                </div>
              )}
            </div>

            <Link
              href="/list-your-stud"
              className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
            >
              Own a stud? List free →
            </Link>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-4 z-40 flex gap-2">
          <a
            href={`tel:${listing.phone_number.replace(/\D/g, '')}`}
            className="flex-1 text-center py-3 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#1F4D3A' }}
          >
            Call Owner
          </a>
          <a
            href={`sms:${listing.phone_number.replace(/\D/g, '')}`}
            className="flex-1 text-center py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700"
          >
            Text Owner
          </a>
        </div>
      </div>
    </>
  )
}
