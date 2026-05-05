import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en Querétaro | Servicio de Monta',
  description: 'Encuentra sementales caninos en Querétaro. Contacta directamente con criadores — sin comisiones.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/queretaro',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/queretaro', 'x-default': 'https://dogstud.com/es/ciudades/queretaro' },
  },
  openGraph: {
    title: 'Sementales en Querétaro | Servicio de Monta',
    description: 'Encuentra sementales caninos en Querétaro. Contacta directamente con criadores — sin comisiones.',
    url: 'https://dogstud.com/es/ciudades/queretaro',
  },
}

export default async function Page() {
  const ciudad = getCiudad('queretaro')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
