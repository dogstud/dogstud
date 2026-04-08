export const metadata = {
  title: 'Privacy Policy — DOGSTUD',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: January 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>
            We collect information you provide directly: name, email address, and any content you
            post (listings, profile information). We also collect usage data including IP addresses
            and browser information for security and abuse prevention.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">2. How We Use Information</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>To operate and improve the Service</li>
            <li>To send inquiries between users (your contact info is shared with breeders you contact)</li>
            <li>To detect and prevent fraud and abuse</li>
            <li>To respond to your requests and questions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">3. Data Sharing</h2>
          <p>
            We do not sell your personal information. When you submit an inquiry to a breeder, your
            name, email, phone (if provided), and message are shared with that breeder. Your contact
            information is not shared with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">4. Data Storage</h2>
          <p>
            Your data is stored securely using Supabase infrastructure. Authentication is handled
            by Supabase Auth. We use industry-standard security measures.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">5. Your Rights</h2>
          <p>
            You may request deletion of your account and associated data by emailing{' '}
            <a href="mailto:hello@dogstud.com" className="underline">
              hello@dogstud.com
            </a>
            . We will process your request within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">6. Cookies</h2>
          <p>
            We use cookies solely for authentication session management. We do not use advertising
            or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">7. Contact</h2>
          <p>
            Privacy questions? Email us at{' '}
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
