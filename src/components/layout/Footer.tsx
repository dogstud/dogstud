import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/dogstud-logo.png"
                alt="DOGSTUD"
                width={140}
                height={46}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm font-semibold text-gray-800 mb-1">
              Proven Dog Studs. Trusted Breeders.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Connect with trusted breeders and browse proven stud listings nationwide.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-widest">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/studs" className="text-gray-500 hover:text-[#2F7D5C] transition-colors">Browse Studs</Link></li>
              <li><Link href="/signup" className="text-gray-500 hover:text-[#2F7D5C] transition-colors">List Your Stud</Link></li>
              <li><Link href="/how-it-works" className="text-gray-500 hover:text-[#2F7D5C] transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-widest">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-500 hover:text-[#2F7D5C] transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-[#2F7D5C] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-gray-500 hover:text-[#2F7D5C] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-[#2F7D5C] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} DOGSTUD. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            For breeders, by breeders.
          </p>
        </div>
      </div>
    </footer>
  )
}
