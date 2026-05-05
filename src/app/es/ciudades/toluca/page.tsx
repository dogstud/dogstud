import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Toluca | Servicio de Monta Estado de México',
  description: 'Encuentra sementales caninos en Toluca. Contacta directamente con criadores del Estado de México.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/toluca',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/toluca', 'x-default': 'https://dogstud.com/es/ciudades/toluca' },
  },
  openGraph: {
    title: 'Sementales en Toluca | Servicio de Monta Estado de México',
    description: 'Encuentra sementales caninos en Toluca. Contacta directamente con criadores del Estado de México.',
    url: 'https://dogstud.com/es/ciudades/toluca',
  },
}

export default async function Page() {
  const ciudad = getCiudad('toluca')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
