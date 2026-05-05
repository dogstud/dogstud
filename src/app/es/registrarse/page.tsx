'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function RegistrarseePage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (authError) {
      setError('Error al crear la cuenta. Verifica tus datos e intenta de nuevo.')
      setLoading(false)
      return
    }

    fetch('/api/auth/welcome', { method: 'POST' }).catch(() => {})
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', { content_name: 'Breeder Signup ES' })
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/es" className="inline-flex items-center gap-2">
            <Image src="/dogstud-logo.png" alt="DOGSTUD" width={40} height={40} className="rounded" />
            <span className="font-bold text-xl tracking-wide" style={{ color: '#1F4D3A' }}>
              DOGSTUD
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Publica tu semental en minutos</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium underline" style={{ color: '#1F4D3A' }}>
              Inicia sesión
            </Link>
          </p>
          <div className="mt-4 flex flex-col gap-1.5 text-left max-w-xs mx-auto">
            {[
              'Exposición a criadores en todo México y EE.UU.',
              'Contacto directo — sin intermediarios',
              'Publicación gratis, sin comisiones',
            ].map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-[#2F7D5C] font-bold">✓</span> {b}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              placeholder="Juan Pérez"
            />
            <Input
              label="Correo electrónico"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="tu@correo.com"
            />
            <Input
              label="Contraseña"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Mín. 8 caracteres"
              minLength={8}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Crear cuenta gratis
            </Button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">
            Al registrarte aceptas nuestros{' '}
            <Link href="/terms" className="underline">Términos de servicio</Link>{' '}
            y{' '}
            <Link href="/privacy" className="underline">Política de privacidad</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
