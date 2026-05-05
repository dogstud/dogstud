import Link from 'next/link'
import StudDirectoryCard from './StudDirectoryCard'
import type { PublicSubmission } from '@/lib/submissions'
import type { CiudadConfig } from '@/lib/ciudades'
import { OTHER_CITIES } from '@/lib/ciudades'

interface Props {
  ciudad: CiudadConfig
  listings: PublicSubmission[]
}

export default function CiudadPage({ ciudad, listings }: Props) {
  const others = OTHER_CITIES.filter(c => c.href !== `/es/ciudades/${ciudad.slug}`).slice(0, 6)

  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/60 text-sm font-medium mb-3 uppercase tracking-widest">
            {ciudad.estado}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Sementales en {ciudad.nombreLargo}
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            {ciudad.intro}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/es/sementales"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              Ver Todos los Sementales
            </Link>
            <Link
              href="/es/publicar"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold transition-colors"
              style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
            >
              Publicar mi Semental Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {listings.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {listings.length} semental{listings.length !== 1 ? 'es' : ''} en {ciudad.nombreLargo}
                </h2>
                <Link href="/es/sementales" className="text-sm text-gray-500 hover:text-gray-900 underline">
                  Ver todos →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map(listing => (
                  <StudDirectoryCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Aún no hay sementales en {ciudad.nombreLargo}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Sé el primero en publicar tu semental en {ciudad.nombre} — es gratis.
              </p>
              <Link
                href="/es/publicar"
                className="inline-block px-6 py-3 rounded-md text-sm font-semibold text-white"
                style={{ backgroundColor: '#2F7D5C' }}
              >
                Publicar mi Semental →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* INFO */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Servicio de Monta en {ciudad.nombreLargo}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-2">Razas Disponibles</h3>
              <p>French Bulldog, American Bully, Rottweiler, Cane Corso, Doberman y más según disponibilidad en {ciudad.nombre}.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-2">Contacto Directo</h3>
              <p>Habla directamente con el dueño del semental. Sin plataformas intermediarias, sin comisiones ocultas.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-2">Publica Gratis</h3>
              <p>¿Tienes un semental en {ciudad.nombre}? Publica tu anuncio gratis en menos de 60 segundos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OTHER CITIES */}
      <section className="py-10 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-base font-bold text-gray-900 mb-4">Sementales en otras ciudades</h2>
          <div className="flex flex-wrap gap-2">
            {others.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-gray-900 transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/es/sementales"
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white"
            >
              Ver todos →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
