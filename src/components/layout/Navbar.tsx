'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  user: User | null
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav
      style={{ backgroundColor: '#0B1F2A' }}
      className="sticky top-0 z-50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/dogstud-logo.jpg"
              alt="DOGSTUD"
              width={44}
              height={44}
              className="rounded"
              priority
            />
            <span
              className="text-white font-extrabold text-xl tracking-wide hidden sm:block"
              style={{ letterSpacing: '0.08em' }}
            >
              DOGSTUD
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/studs" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Browse Studs
            </Link>
            <Link href="/how-it-works" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              How It Works
            </Link>
            <Link href="/studs?breed=" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Breeds
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium px-4 py-2 rounded border border-white/30 text-white hover:bg-white/10 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold px-4 py-2 rounded text-navy"
                  style={{ backgroundColor: '#C8A951', color: '#0B1F2A' }}
                >
                  List Your Stud
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
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
          <div className="md:hidden border-t border-white/10 py-4 space-y-3">
            <Link
              href="/studs"
              className="block text-white/80 hover:text-white text-sm font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              Browse Studs
            </Link>
            <Link
              href="/how-it-works"
              className="block text-white/80 hover:text-white text-sm font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/studs"
              className="block text-white/80 hover:text-white text-sm font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              Breeds
            </Link>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block text-white/80 hover:text-white text-sm font-medium py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleSignOut() }}
                    className="text-left text-white/80 hover:text-white text-sm font-medium py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-white/80 hover:text-white text-sm font-medium py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-block text-sm font-semibold px-4 py-2 rounded text-center"
                    style={{ backgroundColor: '#C8A951', color: '#0B1F2A' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    List Your Stud
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
