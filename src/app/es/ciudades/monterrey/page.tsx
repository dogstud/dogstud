import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Monterrey | Servicio de Monta Nuevo León',
  description: 'Encuentra sementales caninos en Monterrey. Contacta directamente con criadores en Nuevo León — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/monterrey',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/monterrey', 'x-default': 'https://dogstud.com/es/ciudades/monterrey' },
  },
  openGraph: {
    title: 'Sementales en Monterrey | Servicio de Monta Nuevo León',
    description: 'Encuentra sementales caninos en Monterrey. Contacta directamente con criadores en Nuevo León — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/monterrey',
  },
}

export default async function Page() {
  const ciudad = getCiudad('monterrey')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
