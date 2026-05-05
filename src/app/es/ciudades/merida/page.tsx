import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Mérida | Servicio de Monta Yucatán',
  description: 'Encuentra sementales caninos en Mérida, Yucatán. Contacta directamente con criadores — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/merida',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/merida', 'x-default': 'https://dogstud.com/es/ciudades/merida' },
  },
  openGraph: {
    title: 'Sementales en Mérida | Servicio de Monta Yucatán',
    description: 'Encuentra sementales caninos en Mérida, Yucatán. Contacta directamente con criadores — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/merida',
  },
}

export default async function Page() {
  const ciudad = getCiudad('merida')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
