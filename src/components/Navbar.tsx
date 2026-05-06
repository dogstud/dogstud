'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav style={{backgroundColor:'#1E2A38', borderBottom:'2px solid #C6922F', position:'sticky', top:0, zIndex:50}}>
      <div style={{maxWidth:'1200px', margin:'0 auto', padding:'0 24px', height:'72px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>

        {/* LOGO — text-based, always visible */}
        <Link href="/" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'10px'}}>
          {/* Pin icon SVG */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="13" r="10" fill="#C6922F"/>
            <path d="M16 36 C16 36 6 22 6 13 A10 10 0 0 1 26 13 C26 22 16 36 16 36Z" fill="#C6922F"/>
            <circle cx="16" cy="13" r="5" fill="#1E2A38"/>
            {/* Dog silhouette simplified */}
            <ellipse cx="16" cy="12" rx="3" ry="2.5" fill="white"/>
            <circle cx="14.5" cy="10.5" r="0.8" fill="white"/>
            <circle cx="17.5" cy="10.5" r="0.8" fill="white"/>
          </svg>
          <div style={{display:'flex', flexDirection:'column', lineHeight:1.1}}>
            <span style={{color:'white', fontSize:'22px', fontWeight:900, letterSpacing:'-0.5px', fontFamily:'system-ui, -apple-system, sans-serif'}}>
              Stud<span style={{color:'#C6922F'}}>List</span>
            </span>
            <span style={{color:'rgba(255,255,255,0.5)', fontSize:'10px', fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase'}}>
              Stud Dog Marketplace
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div style={{display:'flex', alignItems:'center', gap:'8px'}} className="hidden sm:flex">
          <Link href="/studs" style={{color:'rgba(255,255,255,0.75)', fontSize:'14px', fontWeight:500, padding:'8px 12px', borderRadius:'8px', textDecoration:'none', transition:'color 0.15s'}}
            onMouseEnter={e => (e.currentTarget.style.color='white')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.75)')}>
            Browse Studs
          </Link>

          {user ? (
            <>
              <Link href="/inbox" style={{color:'rgba(255,255,255,0.75)', fontSize:'14px', fontWeight:500, padding:'8px 12px', borderRadius:'8px', textDecoration:'none'}}>
                Inbox
              </Link>
              <Link href="/dashboard" style={{color:'rgba(255,255,255,0.75)', fontSize:'14px', fontWeight:500, padding:'8px 12px', borderRadius:'8px', textDecoration:'none'}}>
                Dashboard
              </Link>
              <Link href="/list" style={{backgroundColor:'#C6922F', color:'white', fontSize:'14px', fontWeight:700, padding:'10px 20px', borderRadius:'10px', textDecoration:'none', boxShadow:'0 2px 8px rgba(198,146,47,0.4)'}}>
                + List Your Stud
              </Link>
              <button onClick={signOut} style={{color:'rgba(255,255,255,0.5)', fontSize:'13px', background:'none', border:'none', cursor:'pointer', padding:'8px 12px'}}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/list" style={{backgroundColor:'#C6922F', color:'white', fontSize:'14px', fontWeight:700, padding:'10px 20px', borderRadius:'10px', textDecoration:'none', boxShadow:'0 2px 8px rgba(198,146,47,0.4)'}}>
                List Your Stud (Free)
              </Link>
              <Link href="/list-your-stud" style={{color:'rgba(255,255,255,0.75)', fontSize:'14px', fontWeight:500, padding:'10px 16px', borderRadius:'10px', textDecoration:'none', border:'1px solid rgba(255,255,255,0.2)'}}>
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* MOBILE */}
        <div style={{display:'flex', alignItems:'center', gap:'8px'}} className="flex sm:hidden">
          <Link href="/list" style={{backgroundColor:'#C6922F', color:'white', fontSize:'12px', fontWeight:700, padding:'8px 14px', borderRadius:'8px', textDecoration:'none'}}>
            List Free
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{color:'white', background:'none', border:'none', cursor:'pointer', padding:'8px'}}>
            {menuOpen ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{backgroundColor:'#162030', borderTop:'1px solid rgba(255,255,255,0.1)', padding:'16px 24px', display:'flex', flexDirection:'column', gap:'4px'}} className="sm:hidden">
          <Link href="/studs" style={{color:'rgba(255,255,255,0.8)', fontSize:'15px', fontWeight:500, padding:'10px 0', textDecoration:'none'}} onClick={() => setMenuOpen(false)}>Browse Studs</Link>
          {user ? (
            <>
              <Link href="/inbox" style={{color:'rgba(255,255,255,0.8)', fontSize:'15px', fontWeight:500, padding:'10px 0', textDecoration:'none'}} onClick={() => setMenuOpen(false)}>Inbox</Link>
              <Link href="/dashboard" style={{color:'rgba(255,255,255,0.8)', fontSize:'15px', fontWeight:500, padding:'10px 0', textDecoration:'none'}} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/list" style={{backgroundColor:'#C6922F', color:'white', fontSize:'14px', fontWeight:700, padding:'12px 16px', borderRadius:'10px', textDecoration:'none', textAlign:'center', marginTop:'8px'}} onClick={() => setMenuOpen(false)}>+ List Your Stud</Link>
              <button onClick={signOut} style={{color:'rgba(255,255,255,0.4)', fontSize:'13px', background:'none', border:'none', cursor:'pointer', padding:'10px 0', textAlign:'left'}}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/list" style={{backgroundColor:'#C6922F', color:'white', fontSize:'14px', fontWeight:700, padding:'12px 16px', borderRadius:'10px', textDecoration:'none', textAlign:'center', marginTop:'8px'}} onClick={() => setMenuOpen(false)}>List Your Stud (Free)</Link>
              <Link href="/list-your-stud" style={{color:'rgba(255,255,255,0.8)', fontSize:'14px', fontWeight:500, padding:'10px 0', textDecoration:'none', textAlign:'center'}} onClick={() => setMenuOpen(false)}>Sign In</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
