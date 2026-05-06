export const metadata = {
  title: 'Privacy Policy — DOGSTUD',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: May 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>
            We collect information you provide directly: name, email address, phone number, and any
            content you submit through listing forms. We also collect usage data including IP
            addresses and browser information for security and abuse prevention.
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
          <h2 className="text-base font-semibold text-gray-900 mb-2">3. Listing Submissions</h2>
          <p>
            When you submit a stud listing, we collect the dog&apos;s information (name, breed, age,
            photos, health details) along with your contact information (name, phone number, email).
            This information is used to create and display your public listing on the site. Your
            contact details are visible to breeders viewing your listing so they can reach you
            directly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">4. Event Tracking</h2>
          <p>
            We log listing views and contact button clicks for analytics purposes. These events are
            used to improve the platform and understand how breeders engage with listings. No
            personal data is stored in event logs — only aggregate metrics like view counts and
            click rates.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">5. Data Sharing</h2>
          <p>
            We do not sell your personal information. When you submit an inquiry to a breeder, your
            name, email, phone (if provided), and message are shared with that breeder. Your contact
            information is not shared with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">6. Third-Party Services</h2>
          <p>
            We use the following third-party services to operate the platform:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
            <li><strong>Supabase</strong> — database and file storage (photos uploaded with listings)</li>
            <li><strong>Vercel</strong> — hosting and deployment infrastructure</li>
            <li><strong>Resend</strong> — transactional email delivery (listing confirmations, notifications)</li>
          </ul>
          <p className="mt-2">
            Each of these providers has their own privacy policies governing how they handle data
            processed on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">7. Data Storage</h2>
          <p>
            Your data is stored securely using Supabase infrastructure. We use industry-standard
            security measures to protect data in transit and at rest.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">8. Listing Removal</h2>
          <p>
            To remove your listing or have your submitted data deleted, email us at{' '}
            <a href="mailto:hello@dogstud.com" className="underline">
              hello@dogstud.com
            </a>
            . We will process your request within 30 days. You can also use the edit link sent to
            your email at the time of submission.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">9. Cookies</h2>
          <p>
            We use cookies solely for session management. We do not use advertising or tracking
            cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">10. Contact</h2>
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
