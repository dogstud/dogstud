import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Chihuahua | Servicio de Monta',
  description: 'Encuentra sementales caninos en Chihuahua. Contacta al dueño directamente — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/chihuahua',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/chihuahua', 'x-default': 'https://dogstud.com/es/ciudades/chihuahua' },
  },
  openGraph: {
    title: 'Sementales en Chihuahua | Servicio de Monta',
    description: 'Encuentra sementales caninos en Chihuahua. Contacta al dueño directamente — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/chihuahua',
  },
}

export default async function Page() {
  const ciudad = getCiudad('chihuahua')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
