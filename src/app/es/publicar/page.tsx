import type { Metadata } from 'next'
import ListYourStudForm from '@/components/submissions/ListYourStudForm'

export const metadata: Metadata = {
  title: 'Publica tu Semental Gratis | DOGSTUD',
  description: 'Publica tu semental canino gratis. Sin cuenta. Sin comisiones. Llega a criadores en México y EE.UU. en menos de 60 segundos.',
  alternates: { canonical: 'https://dogstud.com/es/publicar' },
  robots: { index: true, follow: true },
}

export default function PublicarPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Publica tu Semental — Gratis
        </h1>
        <p className="text-gray-500 text-base">
          Sin cuenta. Sin comisiones. Completa el formulario y tu anuncio será revisado en menos de 24 horas.
          Los criadores podrán contactarte directamente por teléfono.
        </p>
      </div>
      {/* Reuse the same submission form — fields are universal */}
      <ListYourStudForm locale="es" />
    </div>
  )
}
