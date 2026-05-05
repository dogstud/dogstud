import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Cancún | Servicio de Monta Quintana Roo',
  description: 'Encuentra sementales caninos en Cancún. Contacta directamente con criadores en Quintana Roo — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/cancun',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/cancun', 'x-default': 'https://dogstud.com/es/ciudades/cancun' },
  },
  openGraph: {
    title: 'Sementales en Cancún | Servicio de Monta Quintana Roo',
    description: 'Encuentra sementales caninos en Cancún. Contacta directamente con criadores en Quintana Roo — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/cancun',
  },
}

export default async function Page() {
  const ciudad = getCiudad('cancun')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
