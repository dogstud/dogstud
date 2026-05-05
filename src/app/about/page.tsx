import Link from 'next/link'

export const metadata = {
  title: 'About — DOGSTUD',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">About DOGSTUD</h1>
      <p className="text-gray-500 mb-10">Proven Dog Studs. Trusted Breeders.</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <p>
          DOGSTUD is a marketplace built for serious breeders who want a clean, professional way to
          list and discover proven dog studs. We focus on the information that matters — pedigree,
          health testing, location, and direct contact — without the noise.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Our Mission</h2>
        <p>
          We believe that quality breeding starts with quality connections. DOGSTUD provides a
          structured platform where stud owners can showcase their dogs and breeders can find the
          right match for their program.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Why DOGSTUD?</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Structured listings with consistent information across all breeds</li>
          <li>Direct contact — inquiries go straight to the breeder</li>
          <li>Clean, professional interface designed for working breeders</li>
          <li>No middlemen, no brokerage fees</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Contact</h2>
        <p>
          Have questions or feedback?{' '}
          <Link href="/contact" className="underline font-medium" style={{ color: '#0B1F2A' }}>
            Get in touch
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
