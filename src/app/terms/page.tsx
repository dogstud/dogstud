export const metadata = {
  title: 'Terms of Service — DOGSTUD',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: May 2026</p>

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
            DOGSTUD is a listing directory for dog stud services. We are not a party to any
            breeding agreement between listing owners and breeders who contact them. You are
            responsible for the accuracy of information you post. You agree not to post false,
            misleading, or fraudulent listings.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">3. Listing Submissions</h2>
          <p>
            By submitting a listing, you represent that:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
            <li>You own the dog or have explicit authorization from the owner to list it</li>
            <li>All information provided is accurate and up to date</li>
            <li>You own or have the right to use any photos submitted with the listing</li>
            <li>You are at least 18 years old</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">4. Photo Rights</h2>
          <p>
            You must own or have explicit rights to any photos submitted with your listing. By
            submitting photos, you grant DOGSTUD a non-exclusive license to display them on the
            platform. Do not submit photos you do not own.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">5. Listing Moderation</h2>
          <p>
            DOGSTUD may edit or remove listings at our discretion. This includes listings that
            contain inaccurate information, violate these terms, or do not meet our quality
            standards. We will make reasonable efforts to notify listing owners of removals via the
            email provided at submission.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">6. No Guarantee of Outcomes</h2>
          <p>
            DOGSTUD does not guarantee breeding outcomes. We are a directory only. Any breeding
            agreement, payment, or arrangement made between parties is entirely between those
            parties. DOGSTUD is not responsible for the results of any breeding, the health of any
            offspring, or any dispute arising from a breeding arrangement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
          <p>
            DOGSTUD is a marketplace platform only. We are not a party to any breeding agreements
            between users. We disclaim all liability for transactions, disputes, or outcomes between
            users.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">8. Changes to Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Continued use of the Service
            after changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">9. Contact</h2>
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
