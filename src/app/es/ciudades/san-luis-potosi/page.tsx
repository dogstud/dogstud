import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCiudad } from '@/lib/ciudades'
import { getApprovedListings } from '@/lib/submissions'
import CiudadPage from '@/components/directory/CiudadPage'

export const metadata: Metadata = {
  title: 'Sementales en San Luis Potosí | Servicio de Monta',
  description: 'Encuentra sementales caninos en San Luis Potosí. Contacta al dueño directamente.',
  alternates: {
    canonical: 'https://dogstud.com/es/ciudades/san-luis-potosi',
    languages: { 'es-MX': 'https://dogstud.com/es/ciudades/san-luis-potosi', 'x-default': 'https://dogstud.com/es/ciudades/san-luis-potosi' },
  },
  openGraph: {
    title: 'Sementales en San Luis Potosí | Servicio de Monta',
    description: 'Encuentra sementales caninos en San Luis Potosí. Contacta al dueño directamente.',
    url: 'https://dogstud.com/es/ciudades/san-luis-potosi',
  },
}

export default async function Page() {
  const ciudad = getCiudad('san-luis-potosi')
  if (!ciudad) notFound()
  const listings = await getApprovedListings({ city: ciudad.searchName, limit: 12 }).catch(() => [])
  return <CiudadPage ciudad={ciudad} listings={listings} />
}
