import type { CityGuide, EventItem } from '@/lib/sheets'

interface CityJsonLdProps {
  guide: CityGuide
}

export function CityJsonLd({ guide }: CityJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waytocity.com'
  const city = guide.city
  const country = guide.countryData
  const currency = country?.currencyShort || 'TRY'

  const cityUrl = `${siteUrl}/${encodeURIComponent(city.country)}/${encodeURIComponent(city.name)}`
  const countryUrl = `${siteUrl}/${encodeURIComponent(city.country)}`

  // 1. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: city.country,
        item: countryUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: city.name,
        item: cityUrl,
      },
    ],
  }

  // 2. TouristDestination & TransportationService Schema with PriceSpecification
  const offers = []

  if (guide.transport?.fare) {
    const numericFare = parseFloat(guide.transport.fare.replace(/[^0-9.]/g, '')) || guide.transport.fare
    offers.push({
      '@type': 'Offer',
      name: `${city.name} Single Transit Fare`,
      description: `Single public transit fare in ${city.name}`,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: numericFare,
        priceCurrency: currency,
        valueAddedTaxIncluded: true,
      },
    })
  }

  if (guide.transport?.cardPrice) {
    const numericCard = parseFloat(guide.transport.cardPrice.replace(/[^0-9.]/g, '')) || guide.transport.cardPrice
    offers.push({
      '@type': 'Offer',
      name: guide.transport.cardName || `${city.name} Transit Card`,
      description: `Public transport card price in ${city.name}`,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: numericCard,
        priceCurrency: currency,
        valueAddedTaxIncluded: true,
      },
    })
  }

  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: `${city.name}, ${city.country}`,
    description: city.desc || `Urban transit guide, public transport fares, top POIs, and travel tips for ${city.name}, ${city.country}.`,
    url: cityUrl,
    containedInPlace: {
      '@type': 'Country',
      name: city.country,
    },
    includesAttraction: guide.pois.map((poi) => ({
      '@type': 'TouristAttraction',
      name: poi.title,
      description: poi.desc,
      category: poi.category,
    })),
  }

  const transportationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TransportationService',
    name: `${city.name} Public Transit System`,
    serviceType: 'Public Transportation & Urban Transit',
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'Country',
        name: city.country,
      },
    },
    provider: {
      '@type': 'Organization',
      name: guide.transport?.cardName || `${city.name} Transit Authority`,
    },
    offers: offers.length > 0 ? offers : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(transportationSchema) }}
      />
    </>
  )
}

interface EventsJsonLdProps {
  events: EventItem[]
}

export function EventsJsonLd({ events }: EventsJsonLdProps) {
  if (!events || events.length === 0) return null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waytocity.com'

  const eventsSchema = events.map((evt) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: evt.title,
    description: evt.desc || `${evt.title} event in ${evt.city}, ${evt.country}`,
    startDate: evt.eventDate,
    endDate: evt.endDate || evt.eventDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: `${evt.city}, ${evt.country}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: evt.city,
        addressCountry: evt.country,
      },
    },
    url: `${siteUrl}/${encodeURIComponent(evt.country)}/${encodeURIComponent(evt.city)}`,
  }))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
    />
  )
}
