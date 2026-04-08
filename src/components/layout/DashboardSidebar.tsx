'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Overview', exact: true },
  { href: '/dashboard/listings', label: 'My Listings', exact: false },
  { href: '/dashboard/profile', label: 'Profile', exact: true },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full md:w-56 shrink-0">
      <nav className="flex md:flex-col gap-1">
        {links.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                active
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={active ? { backgroundColor: '#0B1F2A' } : {}}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
