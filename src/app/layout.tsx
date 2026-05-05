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
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/favicon-192.png',
  },
  alternates: {
    canonical: 'https://dogstud.com',
    languages: {
      'en-US': 'https://dogstud.com',
      'es-MX': 'https://dogstud.com/es',
      'x-default': 'https://dogstud.com',
    },
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
        description_es: 'Sementales caninos probados. Criadores de confianza en EE.UU. y México.',
        areaServed: ['US', 'MX'],
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
        <link rel="alternate" hrefLang="en" href="https://dogstud.com" />
        <link rel="alternate" hrefLang="es-MX" href="https://dogstud.com/es" />
        <link rel="alternate" hrefLang="x-default" href="https://dogstud.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Meta Pixel */}
        <script dangerouslySetInnerHTML={{ __html: `
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1646419166390228');
          fbq('track', 'PageView');
        ` }} />
        <noscript><img height="1" width="1" style={{display:'none'}} src="https://www.facebook.com/tr?id=1646419166390228&ev=PageView&noscript=1" alt="" /></noscript>
      </head>
      <body>
        <Navbar user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
