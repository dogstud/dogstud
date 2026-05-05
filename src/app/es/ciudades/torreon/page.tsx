import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Torreón | Servicio de Monta Coahuila',
  description: 'Encuentra sementales caninos en Torreón, Coahuila. Contacta al dueño directamente — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/torreon',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/torreon', 'x-default': 'https://dogstud.com/es/ciudades/torreon' },
  },
  openGraph: {
    title: 'Sementales en Torreón | Servicio de Monta Coahuila',
    description: 'Encuentra sementales caninos en Torreón, Coahuila. Contacta al dueño directamente — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/torreon',
  },
}

export default async function Page() {
  const ciudad = getCiudad('torreon')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
