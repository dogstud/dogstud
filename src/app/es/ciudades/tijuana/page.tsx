import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Tijuana | Servicio de Monta Baja California',
  description: 'Encuentra sementales caninos en Tijuana, Baja California. Contacta al dueño directamente — sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/tijuana',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/tijuana', 'x-default': 'https://dogstud.com/es/ciudades/tijuana' },
  },
  openGraph: {
    title: 'Sementales en Tijuana | Servicio de Monta Baja California',
    description: 'Encuentra sementales caninos en Tijuana, Baja California. Contacta al dueño directamente — sin intermediarios.',
    url: 'https://dogstud.com/es/ciudades/tijuana',
  },
}

export default async function Page() {
  const ciudad = getCiudad('tijuana')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
