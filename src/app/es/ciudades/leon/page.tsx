import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en León | Servicio de Monta Guanajuato',
  description: 'Encuentra sementales caninos en León, Guanajuato. Contacta al dueño directamente — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/leon',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/leon', 'x-default': 'https://dogstud.com/es/ciudades/leon' },
  },
  openGraph: {
    title: 'Sementales en León | Servicio de Monta Guanajuato',
    description: 'Encuentra sementales caninos en León, Guanajuato. Contacta al dueño directamente — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/leon',
  },
}

export default async function Page() {
  const ciudad = getCiudad('leon')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
