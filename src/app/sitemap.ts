import { MetadataRoute } from 'next'
import { getApprovedListings, getApprovedBreeds, getApprovedStates } from '@/lib/submissions'

function slugifyForUrl(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dogstud.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/studs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/list-your-stud`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    // Spanish pages
    { url: `${baseUrl}/es`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...['cdmx','guadalajara','monterrey','tijuana','puebla','cancun','merida','leon',
        'queretaro','san-luis-potosi','hermosillo','culiacan','mexicali','chihuahua',
        'aguascalientes','veracruz','toluca','torreon','ciudad-juarez'].map(slug => ({
      url: `${baseUrl}/es/ciudades/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  // Approved listing pages
  let listingPages: MetadataRoute.Sitemap = []
  let breedPages: MetadataRoute.Sitemap = []
  let statePages: MetadataRoute.Sitemap = []

  try {
    const [listings, breeds, states] = await Promise.all([
      getApprovedListings({ limit: 1000 }),
      getApprovedBreeds(),
      getApprovedStates(),
    ])

    listingPages = listings
      .filter(l => l.slug)
      .map(l => ({
        url: `${baseUrl}/studs/${l.slug}`,
        lastModified: new Date(l.published_at ?? l.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    breedPages = breeds.map(breed => ({
      url: `${baseUrl}/studs/breed/${slugifyForUrl(breed)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.75,
    }))

    statePages = states.map(state => ({
      url: `${baseUrl}/studs?state=${encodeURIComponent(state)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.65,
    }))
  } catch {
    // DB unavailable during build — skip dynamic pages
  }

  return [...staticPages, ...listingPages, ...breedPages, ...statePages]
}
