import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/studs/', '/studs/breed/', '/list-your-stud', '/es/', '/es/ciudades/', '/es/publicar', '/es/sementales', '/about', '/contact', '/how-it-works', '/terms', '/privacy'],
        disallow: [
          '/admin',
          '/admin/',
          '/edit-listing/',
          '/dashboard/',
          '/dashboard',
          '/api/',
          '/login',
          '/signup',
          '/register',
          '/es/registrarse',
        ],
      },
    ],
    sitemap: 'https://dogstud.com/sitemap.xml',
  }
}
