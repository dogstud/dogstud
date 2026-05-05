import Link from 'next/link'

export const metadata = {
  title: 'How It Works — DOGSTUD',
}

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h1>
      <p className="text-gray-500 mb-12">
        DOGSTUD makes it simple to list your stud or find the right breeding match.
      </p>

      <div className="space-y-12">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6">For Stud Owners</h2>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                desc: 'Sign up with your email. Your breeder profile is created automatically.',
              },
              {
                step: '2',
                title: 'List Your Stud',
                desc: 'Fill in your dog\'s details — breed, age, health testing, pedigree, photos, and stud fee. Publish when ready.',
              },
              {
                step: '3',
                title: 'Receive Inquiries',
                desc: 'Interested breeders send you inquiries directly. View and manage all inquiries from your dashboard.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5"
                  style={{ backgroundColor: '#0B1F2A' }}
                >
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">For Breeders Searching</h2>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Browse or Search',
                desc: 'Filter listings by breed, state, and availability. No account required to browse.',
              },
              {
                step: '2',
                title: 'Review Listing Details',
                desc: 'Each listing shows the dog\'s pedigree, health testing, photos, location, and fee.',
              },
              {
                step: '3',
                title: 'Contact the Breeder',
                desc: 'Submit an inquiry directly from the listing page. The breeder receives your message and contact details.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5"
                  style={{ backgroundColor: '#C8A951', color: '#0B1F2A' }}
                >
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        <Link
          href="/studs"
          className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Browse Studs
        </Link>
        <Link
          href="/signup"
          className="px-5 py-2.5 text-sm font-semibold rounded-md text-white"
          style={{ backgroundColor: '#0B1F2A' }}
        >
          List Your Stud
        </Link>
      </div>
    </div>
  )
}
