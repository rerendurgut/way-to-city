import { MetadataRoute } from 'next'
import { getCountries, getCities, getContinents } from '@/lib/sheets'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waytocity.com'

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  try {
    const continents = await getContinents()
    for (const continent of continents) {
      routes.push({
        url: `${baseUrl}/continent/${encodeURIComponent(continent.toLowerCase())}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    const countries = await getCountries()
    for (const country of countries) {
      routes.push({
        url: `${baseUrl}/${encodeURIComponent(country.name.toLowerCase())}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      })

      const cities = await getCities(country.name)
      for (const city of cities) {
        routes.push({
          url: `${baseUrl}/${encodeURIComponent(country.name.toLowerCase())}/${encodeURIComponent(city.name.toLowerCase())}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err)
  }

  return routes
}
