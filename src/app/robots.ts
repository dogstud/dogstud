import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/studs/', '/studs/breed/', '/list-your-stud', '/es/', '/es/ciudades/'],
        disallow: [
          '/admin',
          '/admin/',
          '/edit-listing/',
          '/dashboard/',
          '/api/',
          '/login',
          '/signup',
        ],
      },
    ],
    sitemap: 'https://dogstud.com/sitemap.xml',
  }
}
