import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Dog Stud Services | Find Stud Dogs Near You',
    template: '%s | DOGSTUD',
  },
  description:
    'Browse stud dogs near you. Connect with trusted breeders and find proven studs for breeding.',
  metadataBase: new URL('https://dogstud.com'),
  openGraph: {
    type: 'website',
    siteName: 'DOGSTUD',
    title: 'Dog Stud Services | Find Stud Dogs Near You',
    description: 'Browse stud dogs near you. Connect with trusted breeders and find proven studs for breeding.',
    url: 'https://dogstud.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dog Stud Services | Find Stud Dogs Near You',
    description: 'Browse stud dogs near you. Connect with trusted breeders and find proven studs for breeding.',
  },
  icons: { icon: '/favicon.png' },
  alternates: {
    canonical: 'https://dogstud.com',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://dogstud.com/#website',
        url: 'https://dogstud.com',
        name: 'DOGSTUD',
        description: 'Dog stud marketplace — browse proven stud dogs and connect with trusted breeders.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://dogstud.com/studs?keyword={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://dogstud.com/#organization',
        name: 'DOGSTUD',
        url: 'https://dogstud.com',
        description: 'Proven Dog Studs. Trusted Breeders.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: 'https://dogstud.com/contact',
        },
      },
    ],
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
