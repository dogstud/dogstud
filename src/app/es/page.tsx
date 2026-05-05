import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Servicio de Semental Canino | Encuentra Sementales Cerca de Ti',
  description:
    'Encuentra sementales caninos probados cerca de ti. Conecta con criadores verificados en México y EE.UU. Servicio de monta confiable sin intermediarios.',
  alternates: {
    canonical: 'https://dogstud.com/es',
    languages: {
      'en-US': 'https://dogstud.com',
      'es-MX': 'https://dogstud.com/es',
      'x-default': 'https://dogstud.com',
    },
  },
  openGraph: {
    title: 'Servicio de Semental Canino | Encuentra Sementales Cerca de Ti',
    description:
      'Encuentra sementales caninos probados cerca de ti. Conecta con criadores verificados en México y EE.UU.',
    url: 'https://dogstud.com/es',
  },
}

export default function SpanishHomePage() {
  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Encuentra Sementales Caninos Cerca de Ti
          </h1>
          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Conecta con criadores verificados y reserva tu próxima monta de forma rápida y segura.
            Semental perro México — sin intermediarios, sin comisiones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/es/sementales"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              Ver Sementales Disponibles
            </Link>
            <Link
              href="/es/registrarse"
              className="inline-block px-8 py-3.5 rounded-md text-base font-semibold transition-colors"
              style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
            >
              Publicar mi Semental Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 text-center">
        <p className="text-sm text-gray-500 font-medium tracking-wide">
          ✔ Criadores Verificados  ✔ Anuncios Reales  ✔ Contacto Directo  ✔ Cobertura en México y EE.UU.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">¿Cómo Funciona?</h2>
          <p className="text-center text-gray-500 text-sm mb-12 max-w-xl mx-auto">
            El servicio de monta más sencillo para criadores en México — perro semental a tu alcance en tres pasos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: '1',
                title: 'Crea tu Perfil',
                description:
                  'Regístrate gratis y construye tu perfil de criador. Muestra tu criadero, ubicación y experiencia a criadores de todo México.',
              },
              {
                step: '2',
                title: 'Publica tu Semental',
                description:
                  'Sube fotos, establece tu tarifa de monta y describe el pedigree y pruebas de salud de tu perro semental.',
              },
              {
                step: '3',
                title: 'Conecta con Criadores',
                description:
                  'Contáctate directamente con los dueños de sementales — sin plataformas intermediarias, sin comisiones ocultas.',
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
                  style={{ backgroundColor: '#2F7D5C' }}
                >
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="py-16 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Encuentra Sementales en tu Ciudad
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10 max-w-xl mx-auto">
            Explora sementales disponibles por ciudad en todo México.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'CDMX', href: '/es/ciudades/cdmx' },
              { label: 'Guadalajara', href: '/es/ciudades/guadalajara' },
              { label: 'Monterrey', href: '/es/ciudades/monterrey' },
              { label: 'Tijuana', href: '/es/ciudades/tijuana' },
              { label: 'Puebla', href: '/es/ciudades/puebla' },
              { label: 'Cancún', href: '/es/ciudades/cancun' },
              { label: 'Mérida', href: '/es/ciudades/merida' },
              { label: 'León', href: '/es/ciudades/leon' },
              { label: 'Querétaro', href: '/es/ciudades/queretaro' },
              { label: 'San Luis Potosí', href: '/es/ciudades/san-luis-potosi' },
              { label: 'Hermosillo', href: '/es/ciudades/hermosillo' },
              { label: 'Culiacán', href: '/es/ciudades/culiacan' },
              { label: 'Mexicali', href: '/es/ciudades/mexicali' },
              { label: 'Chihuahua', href: '/es/ciudades/chihuahua' },
              { label: 'Aguascalientes', href: '/es/ciudades/aguascalientes' },
              { label: 'Veracruz', href: '/es/ciudades/veracruz' },
              { label: 'Toluca', href: '/es/ciudades/toluca' },
              { label: 'Torreón', href: '/es/ciudades/torreon' },
              { label: 'Ciudad Juárez', href: '/es/ciudades/ciudad-juarez' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-center bg-white border border-gray-200 rounded-lg px-4 py-5 text-sm font-semibold text-gray-700 hover:border-[#2F7D5C] hover:text-[#2F7D5C] hover:shadow-sm transition-all text-center"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Hecho para Criadores Serios en México
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Perfiles Completos',
                description:
                  'Cada anuncio incluye raza, pruebas de salud, pedigree y ubicación — para que sepas exactamente con quién trata.',
              },
              {
                title: 'Contacto Directo',
                description:
                  'Comunícate directamente con el dueño del semental. Sin intermediarios. Sin comisiones de corretaje.',
              },
              {
                title: 'Servicio de Monta Organizado',
                description:
                  'Todos los sementales, consultas y perfiles de criadores en un solo marketplace limpio y fácil de usar.',
              },
            ].map(({ title, description }) => (
              <div
                key={title}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div
                  className="w-8 h-8 rounded mb-4"
                  style={{ backgroundColor: '#1F4D3A' }}
                />
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#1F4D3A' }} className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">¿Listo para publicar tu semental?</h2>
          <p className="text-white/60 mb-8">
            Únete a criadores de México y EE.UU. que ya usan DOGSTUD — sin intermediarios, sin comisiones. Contacto directo con otros criadores.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 rounded-md text-base font-semibold transition-colors"
            style={{ backgroundColor: '#2F7D5C', color: '#ffffff' }}
          >
            Comenzar Gratis
          </Link>
        </div>
      </section>
    </div>
  )
}
