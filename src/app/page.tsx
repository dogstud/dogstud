'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import StudCard from '@/components/StudCard'
import MessageModal from '@/components/MessageModal'
import { DEMO_STUDS } from '@/lib/demoData'

const FEATURED_BREEDS = [
  'French Bulldog', 'English Bulldog', 'German Shepherd', 'Golden Retriever',
  'Labrador Retriever', 'Poodle', 'Rottweiler', 'Doberman', 'Siberian Husky',
  'Great Dane', 'Boxer', 'Bullmastiff', 'Cane Corso', 'Dachshund',
  'Australian Shepherd', 'Shih Tzu', 'Boston Terrier', 'Pomeranian', 'Chihuahua',
]

export default function HomePage() {
  const router = useRouter()
  const [breed, setBreed] = useState('')
  const [location, setLocation] = useState('')
  const [modal, setModal] = useState<{ studId: string; studName: string; ownerId: string; breed: string } | null>(null)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (breed) params.set('breed', breed)
    if (location) params.set('location', location)
    router.push(`/studs?${params.toString()}`)
  }

  const featured = DEMO_STUDS.filter(s => s.is_featured).slice(0, 6)

  return (
    <div className="min-h-screen bg-[#F8F9FB]">

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1E2A38 0%, #0F1923 100%)' }}>
        <div className="max-w-5xl mx-auto px-5 py-20 text-center">
          {/* Authority badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
            <span className="text-white/80 text-sm font-medium">The #1 Stud Dog Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4">
            Find Verified Stud Dogs.<br />
            <span style={{ color: '#C6922F' }}>Message Breeders Directly.</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            The modern stud marketplace trusted by breeders worldwide. No middlemen, no waiting — just direct connections.
          </p>

          {/* Search card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl mx-auto text-left">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Breed</label>
                <input
                  type="text"
                  value={breed}
                  onChange={e => setBreed(e.target.value)}
                  placeholder="e.g. French Bulldog"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6922F] text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="City or State"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6922F] text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto font-bold text-white rounded-xl px-8 py-3.5 text-sm shadow-lg hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#C6922F' }}
                >
                  Find Studs
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-400 mt-3 text-center">Free to browse · No account required</p>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Built for Serious Breeders</h2>
            <p className="text-gray-500 text-base">StudList sets the standard other stud directories can&apos;t match.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '✓',
                title: 'Verified Listings',
                desc: 'Every stud owner is reviewed before going live. No fake profiles, no spam.',
              },
              {
                icon: '💬',
                title: 'Direct Messaging',
                desc: 'Message stud owners instantly through our built-in inbox. No forms, no waiting.',
              },
              {
                icon: '🌍',
                title: 'Worldwide Reach',
                desc: 'Studs listed across the US, UK, Europe, and beyond. Chilled or live cover.',
              },
            ].map(item => (
              <div key={item.title} className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-base mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED STUDS */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#1E2A38] relative inline-block">
              Featured Studs
              <span
                className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full"
                style={{ backgroundColor: '#C6922F' }}
              />
            </h2>
          </div>
          <Link href="/studs" className="text-sm font-semibold hover:underline" style={{ color: '#C6922F' }}>
            View All Studs →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(stud => (
            <StudCard
              key={stud.id}
              stud={stud}
              onMessageClick={() => setModal({ studId: stud.id, studName: stud.name, ownerId: '', breed: stud.breed })}
            />
          ))}
        </div>
      </section>

      {/* BROWSE BY BREED */}
      <section className="bg-[#F8F9FB] py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-[#1E2A38] mb-6">Browse by Breed</h2>
          <div className="flex flex-wrap gap-2">
            {FEATURED_BREEDS.map(b => (
              <Link
                key={b}
                href={`/studs?breed=${encodeURIComponent(b)}`}
                className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-[#1E2A38] hover:border-[#C6922F] hover:text-[#C6922F] transition-colors"
              >
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="text-2xl font-black text-[#1E2A38] text-center mb-10">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          {[
            { n: '1', title: 'Search', desc: 'Filter by breed, location, health testing, and price to find the right match.' },
            { n: '2', title: 'Message the Owner', desc: 'Send a direct message — no intermediary, no brokerage fee. Just a direct connection.' },
            { n: '3', title: 'Find Your Match', desc: "Arrange the details and move forward. It's that simple." },
          ].map(step => (
            <div key={step.n} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#1E2A38] text-white font-black text-xl flex items-center justify-center mb-4">
                {step.n}
              </div>
              <h3 className="font-bold text-[#1E2A38] text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-[#1E2A38] py-12 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-3">Own a stud? List for free →</h2>
          <p className="text-[#9DB5C8] mb-6">Get in front of buyers searching right now. No upfront cost.</p>
          <Link
            href="/list"
            className="text-white font-bold px-8 py-3 rounded-lg inline-block hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#C6922F' }}
          >
            List Your Stud Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1E2A38] border-t border-white/10 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <span className="text-white/60 font-bold tracking-wide">StudList</span>
          <a href="mailto:hello@studlist.com" className="text-white/60 hover:text-white">hello@studlist.com</a>
          <span className="text-white/60">© 2026 StudList. All rights reserved.</span>
        </div>
      </footer>

      {modal && (
        <MessageModal
          studId={modal.studId}
          studName={modal.studName}
          ownerId={modal.ownerId}
          breed={modal.breed}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
