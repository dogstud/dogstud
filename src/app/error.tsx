'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-6">
          An unexpected error occurred. Try again or go back to the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-md text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#2F7D5C' }}
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
