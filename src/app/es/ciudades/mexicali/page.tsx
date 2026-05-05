import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Mexicali | Servicio de Monta',
  description: 'Encuentra sementales caninos en Mexicali, Baja California. Contacta directamente con criadores.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/mexicali',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/mexicali', 'x-default': 'https://dogstud.com/es/ciudades/mexicali' },
  },
  openGraph: {
    title: 'Sementales en Mexicali | Servicio de Monta',
    description: 'Encuentra sementales caninos en Mexicali, Baja California. Contacta directamente con criadores.',
    url: 'https://dogstud.com/es/ciudades/mexicali',
  },
}

export default async function Page() {
  const ciudad = getCiudad('mexicali')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
