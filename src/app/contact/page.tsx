export const metadata = {
  title: 'Contact — DOGSTUD',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-10">We&apos;d love to hear from you.</p>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          For questions, support, or partnership inquiries, please email us at:
        </p>
        <a
          href="mailto:hello@dogstud.com"
          className="text-base font-semibold underline"
          style={{ color: '#0B1F2A' }}
        >
          hello@dogstud.com
        </a>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Common Questions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-800">How do I list my stud?</p>
              <p className="text-gray-500 mt-0.5">
                Create a free account, then go to Dashboard &rarr; New Listing.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Is it free to list?</p>
              <p className="text-gray-500 mt-0.5">
                Yes, basic listings are free. Contact us for information about featured placements.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-800">How do I report an issue?</p>
              <p className="text-gray-500 mt-0.5">
                Email us with the listing URL and a description of the issue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
