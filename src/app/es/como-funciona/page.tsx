import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '¿Cómo Funciona? | DOGSTUD — Directorio de Sementales',
  description: 'Aprende cómo publicar tu semental en DOGSTUD. Gratis, sin intermediarios. Recibe consultas directas de criadores en México y EE.UU.',
  alternates: { canonical: 'https://dogstud.com/es/como-funciona' },
}

export default function ComoFuncionaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">¿Cómo funciona DOGSTUD?</h1>
        <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
          La plataforma más sencilla para publicar y encontrar sementales caninos en México y EE.UU. Sin intermediarios. Sin comisiones.
        </p>
      </div>

      {/* For breeders seeking a stud */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">Si buscas un semental</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Busca por raza y ciudad',
              desc: 'Filtra por raza, ubicación y disponibilidad. Todos los perfiles incluyen fotos, genética, precio y pruebas de salud.',
            },
            {
              step: '2',
              title: 'Revisa el perfil completo',
              desc: 'Cada semental tiene ficha completa: peso, edad, linaje, historial de salud y precio de monta.',
            },
            {
              step: '3',
              title: 'Contacta directo al criador',
              desc: 'Manda un mensaje directo al dueño del semental. Sin plataforma de por medio, sin comisiones.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
                style={{ backgroundColor: '#2F7D5C' }}
              >
                {step}
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/es/sementales"
            className="inline-block px-6 py-3 rounded-md text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#2F7D5C' }}
          >
            Ver sementales disponibles →
          </Link>
        </div>
      </section>

      <hr className="border-gray-100 mb-16" />

      {/* For stud owners */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">Si tienes un semental</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Crea tu perfil gratis',
              desc: 'Regístrate en segundos. Agrega nombre de tu criadero, ubicación y experiencia.',
            },
            {
              step: '2',
              title: 'Publica tu semental',
              desc: 'Sube fotos, describe la genética de tu perro, establece tu precio de monta y activa el anuncio.',
            },
            {
              step: '3',
              title: 'Recibe consultas directas',
              desc: 'Criadores interesados te contactan directo. Tú decides con quién trabajas — sin intermediarios.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
                style={{ backgroundColor: '#1F4D3A' }}
              >
                {step}
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/es/publicar"
            className="inline-block px-6 py-3 rounded-md text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#1F4D3A' }}
          >
            Publicar mi semental gratis →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 rounded-xl p-8 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
        <div className="space-y-5">
          {[
            {
              q: '¿Cuánto cuesta publicar un semental?',
              a: 'Gratis. DOGSTUD no cobra comisiones ni tarifas por publicar. El trato es directo entre criadores.',
            },
            {
              q: '¿En qué países está disponible?',
              a: 'México y Estados Unidos. Estamos expandiendo a Colombia, Reino Unido y Brasil próximamente.',
            },
            {
              q: '¿Qué razas puedo publicar?',
              a: 'Todas las razas. French Bulldog, English Bulldog, Pastor Alemán, American Bully, Rottweiler, y más.',
            },
            {
              q: '¿Cómo me contactan los criadores?',
              a: 'Recibes un mensaje directo en tu correo registrado. Tú decides si continúas o no.',
            },
            {
              q: '¿Necesito experiencia en tecnología?',
              a: 'No. El proceso toma menos de 5 minutos. Solo necesitas fotos de tu semental y los datos básicos.',
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <p className="font-semibold text-gray-900 text-sm mb-1">{q}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
