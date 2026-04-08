import Link from 'next/link'
import { getFeaturedListings } from '@/lib/queries/listings'
import ListingGrid from '@/components/listings/ListingGrid'
import type { StudListing } from '@/lib/types'

export default async function HomePage() {
  let featuredListings: StudListing[] = []
  try {
    featuredListings = await getFeaturedListings(6)
  } catch {
    // Database may not be seeded yet
  }

  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Find Proven Stud Dogs Near You
          </h1>
          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with verified breeders and book your next breeding faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/studs"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              Browse Stud Dogs
            </Link>
            <Link
              href="/signup"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold transition-colors"
              style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
            >
              List Your Stud
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 text-center">
        <p className="text-sm text-gray-500 font-medium tracking-wide">
          ✔ Verified Breeders  ✔ Real Listings  ✔ Direct Messaging  ✔ Nationwide Coverage
        </p>
      </div>

      {/* FEATURED LISTINGS */}
      {featuredListings.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Available Stud Dogs</h2>
              <Link href="/studs" className="text-sm font-medium text-gray-600 hover:text-gray-900 underline">
                View All
              </Link>
            </div>
            <p className="text-sm text-gray-500 mb-4">🔥 New studs added this week</p>
            <ListingGrid listings={featuredListings} />
            <p className="mt-8 text-center text-xs text-gray-400">
              Built for breeders who want real connections — not just listings.
            </p>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: '1',
                title: 'Create Your Profile',
                description:
                  'Sign up and build your breeder profile. Showcase your kennel, location, and experience.',
              },
              {
                step: '2',
                title: 'List Your Stud',
                description:
                  'Upload photos, set your stud fee, and describe your dog\'s pedigree and health testing.',
              },
              {
                step: '3',
                title: 'Connect With Breeders',
                description:
                  'Receive inquiries directly from interested breeders and manage them from your dashboard.',
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
                  style={{ backgroundColor: '#2F7D5C' }}
                >
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Built for Serious Breeders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Structured Profiles',
                description:
                  'Every listing includes breed, health testing, pedigree, and location. No guessing.',
              },
              {
                title: 'Direct Contact',
                description:
                  'Inquiries go straight to the breeder. No middleman, no brokerage fees.',
              },
              {
                title: 'Organized Listings',
                description:
                  'Manage all your stud listings, inquiries, and profile from one clean dashboard.',
              },
            ].map(({ title, description }) => (
              <div
                key={title}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div
                  className="w-8 h-8 rounded mb-4"
                  style={{ backgroundColor: '#1F4D3A' }}
                />
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to list your stud?</h2>
          <p className="text-white/60 mb-8">
            Join breeders already using DOGSTUD to connect and grow their programs.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 rounded-md text-base font-semibold transition-colors"
            style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
