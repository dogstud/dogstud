import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Aguascalientes | Servicio de Monta',
  description: 'Encuentra sementales caninos en Aguascalientes. Contacta directamente con criadores — sin comisiones.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/aguascalientes',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/aguascalientes', 'x-default': 'https://dogstud.com/es/ciudades/aguascalientes' },
  },
  openGraph: {
    title: 'Sementales en Aguascalientes | Servicio de Monta',
    description: 'Encuentra sementales caninos en Aguascalientes. Contacta directamente con criadores — sin comisiones.',
    url: 'https://dogstud.com/es/ciudades/aguascalientes',
  },
}

export default async function Page() {
  const ciudad = getCiudad('aguascalientes')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
