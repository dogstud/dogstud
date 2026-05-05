import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sementales en Mérida | Servicio de Monta en Yucatán',
  description:
    'Encuentra sementales caninos en Mérida, Yucatán. Conecta con criadores verificados en la Ciudad Blanca. Servicio de monta sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/merida',
    languages: {
      'es-MX': 'https://dogstud.com/es/ciudades/merida',
      'x-default': 'https://dogstud.com/es/ciudades/merida',
    },
  },
  openGraph: {
    title: 'Sementales en Mérida | Servicio de Monta en Yucatán',
    description: 'Encuentra sementales caninos en Mérida. Contacto directo con criadores verificados.',
    url: 'https://dogstud.com/es/ciudades/merida',
  },
}

export default function MeridaPage() {
  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/60 text-sm font-medium mb-3 uppercase tracking-widest">Mérida, Yucatán</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Sementales en Mérida
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Encuentra el perro semental ideal en Mérida. Servicio de monta confiable en la Ciudad Blanca —
            contacto directo con criadores verificados en Yucatán.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/studs"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              Ver Sementales Disponibles
            </Link>
            <Link
              href="/signup"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold transition-colors"
              style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
            >
              Publicar mi Semental
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicio de Monta en Mérida</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Mérida es una de las ciudades con mayor calidad de vida en México y cuenta con una activa comunidad de
            criadores caninos. En DOGSTUD puedes encontrar sementales de razas destacadas — French Bulldog,
            Labrador, Golden Retriever, Rottweiler y más — con perfiles detallados y contacto directo.
          </p>
          <p className="text-gray-600 leading-relaxed mb-10">
            Busca sementales en el norte de Mérida, Cholul, Temozón Norte o el centro histórico. Conecta
            directamente con los criadores en Yucatán sin comisiones ni intermediarios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Razas Disponibles', desc: 'French Bulldog, Labrador, Golden Retriever, Rottweiler, Boxer y más.' },
              { title: 'Contacto Directo', desc: 'Habla directamente con el criador en Mérida. Sin intermediarios.' },
              { title: 'Criadores Verificados', desc: 'Perfiles completos con fotos, pedigree y pruebas de salud.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-gray-50 border border-gray-100 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/studs"
              className="inline-block px-6 py-3 rounded-md text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#2F7D5C' }}
            >
              Ver todos los sementales →
            </Link>
            <Link
              href="/es"
              className="inline-block px-6 py-3 rounded-md text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-400 transition-colors"
            >
              ← Volver a inicio en español
            </Link>
          </div>
        </div>
      </section>

      {/* OTHER CITIES */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sementales en otras ciudades</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Ciudad de México', href: '/es/ciudades/cdmx' },
              { label: 'Cancún', href: '/es/ciudades/cancun' },
              { label: 'Guadalajara', href: '/es/ciudades/guadalajara' },
              { label: 'Monterrey', href: '/es/ciudades/monterrey' },
              { label: 'Puebla', href: '/es/ciudades/puebla' },
              { label: 'Veracruz', href: '/es/ciudades/veracruz' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-[#2F7D5C] hover:text-[#2F7D5C] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
