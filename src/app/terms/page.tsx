export const metadata = {
  title: 'Terms of Service — DOGSTUD',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: January 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using DOGSTUD (&ldquo;the Service&rdquo;), you agree to be bound by these Terms
            of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">2. Use of the Service</h2>
          <p>
            DOGSTUD provides a marketplace platform for listing and discovering dog stud services.
            You are responsible for the accuracy of information you post. You agree not to post
            false, misleading, or fraudulent listings.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activities under your account. You must be at least 18 years old to create an
            account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">4. Listings</h2>
          <p>
            By posting a listing, you represent that the information is accurate and that you have
            the right to offer the described services. DOGSTUD reserves the right to remove listings
            that violate these terms or applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">5. Limitation of Liability</h2>
          <p>
            DOGSTUD is a marketplace platform only. We are not a party to any breeding agreements
            between users. We disclaim all liability for transactions, disputes, or outcomes between
            users.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">6. Changes to Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Continued use of the Service
            after changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">7. Contact</h2>
          <p>
            Questions about these Terms? Email us at{' '}
            <a href="mailto:hello@dogstud.com" className="underline">
              hello@dogstud.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
