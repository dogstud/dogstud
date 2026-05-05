import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Guadalajara | Servicio de Monta Jalisco',
  description: 'Encuentra sementales caninos en Guadalajara, Jalisco. Contacta directamente con criadores — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/guadalajara',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/guadalajara', 'x-default': 'https://dogstud.com/es/ciudades/guadalajara' },
  },
  openGraph: {
    title: 'Sementales en Guadalajara | Servicio de Monta Jalisco',
    description: 'Encuentra sementales caninos en Guadalajara, Jalisco. Contacta directamente con criadores — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/guadalajara',
  },
}

export default async function Page() {
  const ciudad = getCiudad('guadalajara')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
