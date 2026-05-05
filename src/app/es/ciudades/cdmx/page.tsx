import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Ciudad de México | Servicio de Monta CDMX',
  description: 'Encuentra sementales caninos en Ciudad de México. Contacta directamente con criadores en CDMX — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/cdmx',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/cdmx', 'x-default': 'https://dogstud.com/es/ciudades/cdmx' },
  },
  openGraph: {
    title: 'Sementales en Ciudad de México | Servicio de Monta CDMX',
    description: 'Encuentra sementales caninos en Ciudad de México. Contacta directamente con criadores en CDMX — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/cdmx',
  },
}

export default async function Page() {
  const ciudad = getCiudad('cdmx')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
