import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getApprovedListings } from '@/lib/submissions'
import StudDirectoryGrid from '@/components/directory/StudDirectoryGrid'

interface PageProps {
  params: Promise<{ breed: string }>
}

function formatBreed(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const SUPPORTED_BREEDS = [
  'french-bulldog', 'english-bulldog', 'american-bully', 'cane-corso',
  'rottweiler', 'german-shepherd', 'doberman-pinscher', 'belgian-malinois',
  'labrador-retriever', 'golden-retriever', 'siberian-husky', 'bullmastiff',
  'boxer', 'boston-terrier', 'poodle', 'mastiff', 'great-dane',
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { breed } = await params
  const breedName = formatBreed(breed)
  return {
    title: `${breedName} Stud Dogs | DogStud`,
    description: `Browse ${breedName} stud dogs available for breeding. Find proven ${breedName} studs and contact owners directly through DogStud.`,
    alternates: { canonical: `https://dogstud.com/studs/breed/${breed}` },
    openGraph: {
      title: `${breedName} Stud Dogs | DogStud`,
      description: `Browse ${breedName} stud dogs available for breeding.`,
      url: `https://dogstud.com/studs/breed/${breed}`,
    },
  }
}

export default async function BreedDirectoryPage({ params }: PageProps) {
  const { breed } = await params

  if (!SUPPORTED_BREEDS.includes(breed)) notFound()

  const breedName = formatBreed(breed)
  const listings = await getApprovedListings({ breed: breedName, limit: 48 })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/studs" className="hover:text-gray-700 transition-colors">Browse Studs</Link>
        <span>/</span>
        <span className="text-gray-700">{breedName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {breedName} Stud Dogs
        </h1>
        <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
          Browse {breedName} stud dogs listed by breeders across the United States.
          {listings.length > 0
            ? ` ${listings.length} listing${listings.length !== 1 ? 's' : ''} currently available.`
            : ''
          } Contact owners directly — no fees, no middleman.
        </p>
      </div>

      {/* SEO text */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8 text-sm text-gray-600 leading-relaxed">
        <p>
          Finding a quality {breedName} stud can take time. DogStud makes it easier by listing
          proven {breedName} studs in one searchable directory. Each listing includes photos, health
          information, stud fee, and location so you can make an informed decision before reaching out.
          All listings are submitted directly by stud owners — what you see is what they&apos;ve shared.
          Contact them by phone or text directly from the listing page.
        </p>
      </div>

      {/* Results */}
      <StudDirectoryGrid
        listings={listings}
        emptyMessage={`No ${breedName} studs listed yet.`}
      />

      {/* CTA */}
      <div className="mt-12 text-center py-10 border-t border-gray-100">
        <p className="text-gray-500 text-sm mb-4">Own a {breedName} stud? Get in front of breeders for free.</p>
        <Link
          href="/list-your-stud"
          className="inline-block px-7 py-3 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#1F4D3A' }}
        >
          List Your {breedName} Stud — Free
        </Link>
      </div>
    </div>
  )
}
