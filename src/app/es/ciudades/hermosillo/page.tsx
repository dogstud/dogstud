import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Hermosillo | Servicio de Monta Sonora',
  description: 'Encuentra sementales caninos en Hermosillo, Sonora. Contacta directamente con criadores — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/hermosillo',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/hermosillo', 'x-default': 'https://dogstud.com/es/ciudades/hermosillo' },
  },
  openGraph: {
    title: 'Sementales en Hermosillo | Servicio de Monta Sonora',
    description: 'Encuentra sementales caninos en Hermosillo, Sonora. Contacta directamente con criadores — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/hermosillo',
  },
}

export default async function Page() {
  const ciudad = getCiudad('hermosillo')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
