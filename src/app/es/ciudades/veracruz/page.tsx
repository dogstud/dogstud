import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sementales en Veracruz | Servicio de Monta en Veracruz',
  description:
    'Encuentra sementales caninos en Veracruz. Conecta con criadores verificados en el puerto de Veracruz. Servicio de monta sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/veracruz',
    languages: {
      'es-MX': 'https://dogstud.com/es/ciudades/veracruz',
      'x-default': 'https://dogstud.com/es/ciudades/veracruz',
    },
  },
  openGraph: {
    title: 'Sementales en Veracruz | Servicio de Monta en Veracruz',
    description: 'Encuentra sementales caninos en Veracruz. Contacto directo con criadores verificados.',
    url: 'https://dogstud.com/es/ciudades/veracruz',
  },
}

export default function VeracruzPage() {
  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/60 text-sm font-medium mb-3 uppercase tracking-widest">Veracruz, Veracruz</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Sementales en Veracruz
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Encuentra el perro semental ideal en Veracruz. Servicio de monta confiable en el principal puerto
            de México — contacto directo con criadores verificados en el estado de Veracruz.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicio de Monta en Veracruz</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Veracruz cuenta con una rica tradición canina en el golfo de México. En DOGSTUD puedes encontrar
            sementales de razas populares — Rottweiler, French Bulldog, Labrador, American Bully, Cane Corso y
            más — con perfiles detallados y contacto directo con el criador.
          </p>
          <p className="text-gray-600 leading-relaxed mb-10">
            Busca sementales en Xalapa, Coatzacoalcos, Orizaba o el puerto de Veracruz. Conecta directamente
            con los criadores en el estado de Veracruz sin comisiones ni intermediarios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Razas Disponibles', desc: 'Rottweiler, French Bulldog, Labrador, American Bully, Cane Corso y más.' },
              { title: 'Contacto Directo', desc: 'Habla directamente con el criador en Veracruz. Sin intermediarios.' },
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
              { label: 'Puebla', href: '/es/ciudades/puebla' },
              { label: 'Cancún', href: '/es/ciudades/cancun' },
              { label: 'Mérida', href: '/es/ciudades/merida' },
              { label: 'Guadalajara', href: '/es/ciudades/guadalajara' },
              { label: 'Toluca', href: '/es/ciudades/toluca' },
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
