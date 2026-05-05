'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  user: User | null
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isES = pathname?.startsWith('/es')

  const nav = isES
    ? [
        { label: 'Ver Sementales', href: '/es/sementales' },
        { label: 'Cómo Funciona', href: '/es/como-funciona' },
        { label: 'EE.UU. 🇺🇸', href: '/' },
      ]
    : [
        { label: 'Browse Studs', href: '/studs' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'México 🇲🇽', href: '/es' },
      ]

  const signupHref = isES ? '/es/registrarse' : '/list-your-stud'
  const signinHref = '/login'
  const signupLabel = isES ? 'Publicar mi Semental' : 'List Your Stud'
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={isES ? '/es' : '/'} className="flex items-center shrink-0">
            <Image
              src="/dogstud-logo.png"
              alt="DOGSTUD — Proven Dog Studs. Trusted Breeders."
              width={200}
              height={66}
              className="h-12 md:h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {nav.map(({ label, href }) => (
              <Link key={href} href={href} className="text-gray-600 hover:text-[#1F4D3A] text-sm font-medium transition-colors">
                {label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-[#1F4D3A] text-sm font-medium transition-colors">
                  {isES ? 'Panel' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium px-4 py-2 rounded border border-gray-300 text-gray-700 hover:border-[#1F4D3A] hover:text-[#1F4D3A] transition-colors"
                >
                  {isES ? 'Cerrar sesión' : 'Sign Out'}
                </button>
              </>
            ) : (
              <>
                <Link href={signinHref} className="text-gray-600 hover:text-[#1F4D3A] text-sm font-medium transition-colors">
                  {isES ? 'Iniciar sesión' : 'Sign In'}
                </Link>
                <Link
                  href={signupHref}
                  className="text-sm font-semibold px-4 py-2 rounded"
                  style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
                >
                  {signupLabel}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            {nav.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block text-gray-600 hover:text-[#1F4D3A] text-sm font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block text-gray-600 hover:text-[#1F4D3A] text-sm font-medium py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    {isES ? 'Panel' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleSignOut() }}
                    className="text-left text-gray-600 hover:text-[#1F4D3A] text-sm font-medium py-2"
                  >
                    {isES ? 'Cerrar sesión' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={signinHref}
                    className="block text-gray-600 hover:text-[#1F4D3A] text-sm font-medium py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    {isES ? 'Iniciar sesión' : 'Sign In'}
                  </Link>
                  <Link
                    href={signupHref}
                    className="inline-block text-sm font-semibold px-4 py-2 rounded text-center"
                    style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {signupLabel}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
