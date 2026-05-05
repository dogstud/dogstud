import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { getListings } from '@/lib/queries/listings'
import ListingGrid from '@/components/listings/ListingGrid'
import type { StudListing } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Sementales en Venta | Directorio de Sementales Caninos en México',
  description: 'Encuentra sementales caninos en México y EE.UU. French Bulldog, English Bulldog, Pastor Alemán y más. Contacta al criador directo — sin intermediarios.',
  alternates: { canonical: 'https://dogstud.com/es/sementales' },
}

const RAZAS = [
  'French Bulldog', 'English Bulldog', 'Pastor Alemán', 'American Bully',
  'Rottweiler', 'Doberman', 'Cane Corso', 'Bullmastiff',
  'Labrador', 'Golden Retriever', 'Boxer', 'Gran Danés',
]

const CIUDADES_MX = [
  { nombre: 'CDMX', slug: 'cdmx' },
  { nombre: 'Guadalajara', slug: 'guadalajara' },
  { nombre: 'Monterrey', slug: 'monterrey' },
  { nombre: 'Tijuana', slug: 'tijuana' },
  { nombre: 'Cancún', slug: 'cancun' },
  { nombre: 'Puebla', slug: 'puebla' },
  { nombre: 'Mérida', slug: 'merida' },
  { nombre: 'León', slug: 'leon' },
]

async function ResultadosSementales() {
  let listings: StudListing[] = []
  try {
    listings = await getListings({})
  } catch { /* DB not seeded */ }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        {listings.length > 0
          ? `Mostrando ${listings.length} semental${listings.length !== 1 ? 'es' : ''} disponible${listings.length !== 1 ? 's' : ''}`
          : 'Nuevos sementales se agregan regularmente. Publica el tuyo gratis.'}
      </p>
      {listings.length > 0 ? (
        <ListingGrid listings={listings} />
      ) : (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-gray-500 text-base font-medium mb-2">Aún no hay sementales en esta búsqueda</p>
          <p className="text-gray-400 text-sm mb-6">Sé el primer criador en tu área en publicar un semental.</p>
          <Link
            href="/es/registrarse"
            className="inline-block px-6 py-3 rounded-md text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#2F7D5C' }}
          >
            Publicar mi semental gratis →
          </Link>
        </div>
      )}
    </div>
  )
}

export default async function SementalesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Sementales Disponibles</h1>
        <p className="text-gray-600 text-base max-w-2xl">
          Encuentra sementales caninos en México y EE.UU. Todas las razas. Contacta al dueño directamente — sin intermediarios, sin comisiones.
        </p>
      </div>

      {/* Results */}
      <Suspense fallback={<div className="h-48 bg-gray-50 rounded-xl animate-pulse" />}>
        <ResultadosSementales />
      </Suspense>

      {/* Browse by breed */}
      <section className="mt-16 pt-12 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Buscar por Raza</h2>
        <p className="text-sm text-gray-500 mb-6">Encuentra el semental ideal para tu programa de cría.</p>
        <div className="flex flex-wrap gap-2">
          {RAZAS.map((raza) => (
            <Link
              key={raza}
              href={`/studs?breed=${encodeURIComponent(raza)}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-[#2F7D5C] hover:text-[#2F7D5C] transition-colors"
            >
              Semental {raza}
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by city */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Buscar por Ciudad</h2>
        <p className="text-sm text-gray-500 mb-6">Sementales en las principales ciudades de México.</p>
        <div className="flex flex-wrap gap-2">
          {CIUDADES_MX.map(({ nombre, slug }) => (
            <Link
              key={slug}
              href={`/es/ciudades/${slug}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-[#2F7D5C] hover:text-[#2F7D5C] transition-colors"
            >
              {nombre}
            </Link>
          ))}
        </div>
      </section>

      {/* SEO block */}
      <section className="mt-12 bg-gray-50 rounded-xl p-8 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3">¿Cómo funciona DOGSTUD?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 leading-relaxed">
          <div>
            <p className="font-semibold text-gray-800 mb-1">Para criadores que buscan semental</p>
            <p>Navega perfiles completos con fotos, genética, precio y pruebas de salud. Contacta al dueño directamente — sin intermediarios ni comisiones.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Para dueños de sementales</p>
            <p>Publica gratis en minutos. Sube fotos, establece tu precio y describe la genética de tu perro. Recibe consultas directo a tu bandeja de entrada.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Cobertura en México y EE.UU.</p>
            <p>DOGSTUD conecta criadores en todo México y Estados Unidos. CDMX, Guadalajara, Monterrey, Tijuana y más de 15 ciudades.</p>
          </div>
        </div>
      </section>

    </div>
  )
}
