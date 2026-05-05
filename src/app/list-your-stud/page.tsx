import type { Metadata } from 'next'
import ListYourStudForm from '@/components/submissions/ListYourStudForm'

export const metadata: Metadata = {
  title: 'List Your Stud Dog Free | DOGSTUD',
  description: 'Submit your stud dog listing for free. No account required. Takes 60 seconds. Reach breeders nationwide.',
  alternates: { canonical: 'https://dogstud.com/list-your-stud' },
  robots: { index: true, follow: true },
}

export default function ListYourStudPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Stud Dog — Free</h1>
        <p className="text-gray-500 text-base">No account needed. Fill out the form below and your listing will be reviewed within 24 hours.</p>
      </div>
      <ListYourStudForm />
    </div>
  )
}
