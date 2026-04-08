import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0B1F2A' }} className="text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image
                src="/dogstud-logo.png"
                alt="DOGSTUD"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-white font-bold text-lg tracking-wide">DOGSTUD</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Proven Dog Studs. Trusted Breeders.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/studs" className="hover:text-white transition-colors">Browse Studs</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">List Your Stud</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} DOGSTUD. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            For breeders, by breeders.
          </p>
        </div>
      </div>
    </footer>
  )
}
