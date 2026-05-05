import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Puebla | Servicio de Monta Puebla',
  description: 'Encuentra sementales caninos en Puebla. Contacta al dueño directamente — sin intermediarios ni comisiones.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/puebla',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/puebla', 'x-default': 'https://dogstud.com/es/ciudades/puebla' },
  },
  openGraph: {
    title: 'Sementales en Puebla | Servicio de Monta Puebla',
    description: 'Encuentra sementales caninos en Puebla. Contacta al dueño directamente — sin intermediarios ni comisiones.',
    url: 'https://dogstud.com/es/ciudades/puebla',
  },
}

export default async function Page() {
  const ciudad = getCiudad('puebla')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
