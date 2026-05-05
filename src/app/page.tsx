import Link from 'next/link'
import Image from 'next/image'
import { getApprovedListings, getApprovedCount, getApprovedBreeds, getApprovedStates } from '@/lib/submissions'
import StudDirectoryCard from '@/components/directory/StudDirectoryCard'

async function getSocialProof() {
  try {
    const [total, breeds, states] = await Promise.all([
      getApprovedCount(),
      getApprovedBreeds(),
      getApprovedStates(),
    ])
    return { listings: total, breeds: breeds.length, states: states.length }
  } catch {
    return { listings: 0, breeds: 0, states: 0 }
  }
}

export default async function HomePage() {
  const proof = await getSocialProof()
  let recentListings = await getApprovedListings({ limit: 6 }).catch(() => [])

  const FEATURED_BREEDS = [
    'French Bulldog', 'English Bulldog', 'American Bully',
    'Cane Corso', 'Rottweiler', 'German Shepherd',
    'Doberman Pinscher', 'Belgian Malinois', 'Labrador Retriever',
    'Golden Retriever', 'Siberian Husky', 'Bullmastiff',
    'Boxer', 'Boston Terrier', 'Poodle', 'Mastiff', 'Great Dane',
  ]

  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Find Stud Dogs by Breed and Location
          </h1>
          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Free listings. No commissions. Direct contact with stud owners.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/list-your-stud"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold transition-colors"
              style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
            >
              List Your Stud Free
            </Link>
            <Link
              href="/studs"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              Browse Stud Dogs
            </Link>
          </div>
          <p className="text-white/50 text-sm mt-4">Takes 60 seconds · No account required</p>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      {(proof.listings > 0 || proof.breeds > 0 || proof.states > 0) && (
        <div className="bg-white border-b border-gray-100 py-5 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 divide-x divide-gray-200 text-center">
              <div className="px-4">
                <p className="text-2xl font-bold text-gray-900">{proof.listings > 0 ? proof.listings : '—'}</p>
                <p className="text-xs text-gray-500 mt-0.5">stud dogs listed</p>
              </div>
              <div className="px-4">
                <p className="text-2xl font-bold text-gray-900">{proof.breeds > 0 ? proof.breeds : '—'}</p>
                <p className="text-xs text-gray-500 mt-0.5">breeds represented</p>
              </div>
              <div className="px-4">
                <p className="text-2xl font-bold text-gray-900">{proof.states > 0 ? proof.states : '—'}</p>
                <p className="text-xs text-gray-500 mt-0.5">states covered</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: '1', title: 'Submit your listing', description: 'Fill out a quick form with your dog\'s details and photos. No account needed. Takes 60 seconds.' },
              { step: '2', title: 'Get listed after review', description: 'Your listing goes live after a quick approval. Breeders find you by breed, location, and color.' },
              { step: '3', title: 'Get contacted directly', description: 'Breeders reach you by phone or text straight from your listing. No middleman, no platform fees.' },
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
          <div className="text-center mt-10">
            <Link
              href="/list-your-stud"
              className="inline-block px-7 py-3 rounded-md text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#2F7D5C' }}
            >
              List Your Stud Dog — Free
            </Link>
          </div>
        </div>
      </section>

      {/* RECENTLY LISTED */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recently Listed Studs</h2>
              <p className="text-sm text-gray-500 mt-1">Browse stud dogs listed by breeders across the US.</p>
            </div>
            {recentListings.length > 0 && (
              <Link href="/studs" className="text-sm font-medium text-gray-600 hover:text-gray-900 underline">
                View all →
              </Link>
            )}
          </div>

          {recentListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentListings.map(listing => (
                <StudDirectoryCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-400 text-sm mb-4">Listings will appear here once breeders submit.</p>
              <Link
                href="/list-your-stud"
                className="inline-block px-6 py-2.5 rounded-md text-sm font-semibold text-white"
                style={{ backgroundColor: '#2F7D5C' }}
              >
                Be the first to list →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* BROWSE BY BREED */}
      <section className="py-12 px-4 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Breed</h2>
          <div className="flex flex-wrap gap-2">
            {FEATURED_BREEDS.map(breed => (
              <Link
                key={breed}
                href={`/studs?breed=${encodeURIComponent(breed)}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                {breed}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Built for Serious Breeders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Structured Profiles', description: 'Every listing includes breed, health testing, registration, and location — so you know exactly what you\'re looking at before reaching out.' },
              { title: 'Direct Contact', description: 'Contact stud owners directly by phone or text. No middleman. No brokerage fees.' },
              { title: 'Free to List', description: 'List your stud dog free. No subscription, no per-inquiry fees. Just a clean public listing that breeders can find.' },
            ].map(({ title, description }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-8 h-8 rounded mb-4" style={{ backgroundColor: '#1F4D3A' }} />
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEXICO */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2F7D5C] mb-3">Now Available in México 🇲🇽</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Stud Services in Mexico</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                DOGSTUD is the first dedicated stud dog marketplace serving Mexico. Browse and list studs in CDMX, Guadalajara, Monterrey, Tijuana, Cancún, and more — all in Spanish.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/es" className="inline-block px-5 py-2.5 rounded-md text-sm font-semibold text-white" style={{ backgroundColor: '#2F7D5C' }}>
                  Ver en Español →
                </Link>
                <Link href="/studs" className="inline-block px-5 py-2.5 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:border-gray-900 transition-colors">
                  Browse All Listings
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['CDMX', 'Guadalajara', 'Monterrey', 'Tijuana', 'Cancún', 'Puebla', 'Mérida', 'León'].map(city => (
                <Link
                  key={city}
                  href={`/es/ciudades/${city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
                  className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-900 transition-colors"
                >
                  <span>🐾</span> {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to list your stud?</h2>
          <p className="text-white/60 mb-8">Free listings. No commissions. No account required.</p>
          <Link
            href="/list-your-stud"
            className="inline-block px-8 py-3.5 rounded-md text-base font-semibold transition-colors"
            style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
          >
            List Your Stud Dog — Free
          </Link>
          <p className="text-white/40 text-xs mt-3">Takes 60 seconds</p>
        </div>
      </section>
    </div>
  )
}
