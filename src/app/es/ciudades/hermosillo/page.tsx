import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sementales en Hermosillo | Servicio de Monta en Sonora',
  description:
    'Encuentra sementales caninos en Hermosillo, Sonora. Conecta con criadores verificados en la capital sonorense. Servicio de monta sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/hermosillo',
    languages: {
      'es-MX': 'https://dogstud.com/es/ciudades/hermosillo',
      'x-default': 'https://dogstud.com/es/ciudades/hermosillo',
    },
  },
  openGraph: {
    title: 'Sementales en Hermosillo | Servicio de Monta en Sonora',
    description: 'Encuentra sementales caninos en Hermosillo. Contacto directo con criadores verificados.',
    url: 'https://dogstud.com/es/ciudades/hermosillo',
  },
}

export default function HermosilloPage() {
  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/60 text-sm font-medium mb-3 uppercase tracking-widest">Hermosillo, Sonora</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Sementales en Hermosillo
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Encuentra el perro semental ideal en Hermosillo. Servicio de monta confiable en Sonora —
            contacto directo con criadores verificados en la capital del estado.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicio de Monta en Hermosillo</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Hermosillo es la capital de Sonora y centro de una activa comunidad de criadores caninos en el
            noroeste de México. En DOGSTUD puedes encontrar sementales de razas selectas — American Bully,
            Rottweiler, German Shepherd, Doberman y más — con perfiles detallados y contacto directo.
          </p>
          <p className="text-gray-600 leading-relaxed mb-10">
            Busca sementales en Villa de Seris, Bugambilias, Pima o cualquier colonia de Hermosillo. Conecta
            directamente con los criadores en Sonora sin comisiones ni intermediarios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Razas Disponibles', desc: 'American Bully, Rottweiler, German Shepherd, Doberman, French Bulldog y más.' },
              { title: 'Contacto Directo', desc: 'Habla directamente con el criador en Hermosillo. Sin intermediarios.' },
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
              { label: 'Mexicali', href: '/es/ciudades/mexicali' },
              { label: 'Culiacán', href: '/es/ciudades/culiacan' },
              { label: 'Chihuahua', href: '/es/ciudades/chihuahua' },
              { label: 'Ciudad Juárez', href: '/es/ciudades/ciudad-juarez' },
              { label: 'Tijuana', href: '/es/ciudades/tijuana' },
              { label: 'Guadalajara', href: '/es/ciudades/guadalajara' },
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
