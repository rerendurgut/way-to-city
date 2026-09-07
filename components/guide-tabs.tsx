'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  BedDouble,
  CreditCard,
  Map,
  PlaneLanding,
  Utensils,
  Calendar,
  type LucideIcon,
} from 'lucide-react'
import type { CityGuide, TabId } from '@/lib/sheets'
import {
  ArrivalPanel,
  FoodPanel,
  PoisPanel,
  StayPanel,
  TransitPanel,
  EventsPanel,
} from '@/components/tab-panels'

type Tab = {
  id: TabId
  label: string
  icon: LucideIcon
}

const tabs: Tab[] = [
  { id: 'arrival', label: 'Arrival & Intercity', icon: PlaneLanding },
  { id: 'transit', label: 'Transit Guide', icon: CreditCard },
  { id: 'pois', label: 'POIs & Map', icon: Map },
  { id: 'stay', label: 'Where to Stay', icon: BedDouble },
  { id: 'food', label: 'Local Food', icon: Utensils },
  { id: 'events', label: 'Upcoming Events', icon: Calendar },
]

function GuideTabsContent({ guide }: { guide: CityGuide }) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as TabId | null
  const validTab = tabParam && tabs.some((t) => t.id === tabParam) ? tabParam : 'arrival'

  const [active, setActive] = useState<TabId>(validTab)

  useEffect(() => {
    if (tabParam && tabs.some((t) => t.id === tabParam)) {
      setActive(tabParam)
    }
  }, [tabParam])

  return (
    <section className="mt-10">
      <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          role="tablist"
          aria-label="City guide sections"
          className="flex min-w-max gap-1 border-b border-border"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const selected = active === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActive(tab.id)}
                className={`-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
                  selected
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`size-4 ${selected ? 'text-primary' : ''}`} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="pt-6"
      >
        {active === 'arrival' && (
          <ArrivalPanel
            arrivals={guide.arrivals}
            country={guide.city.country}
            city={guide.city.name}
          />
        )}
        {active === 'transit' && (
          <TransitPanel
            transport={guide.transport}
            countryData={guide.countryData}
            country={guide.city.country}
            city={guide.city.name}
          />
        )}
        {active === 'pois' && (
          <PoisPanel
            pois={guide.pois}
            country={guide.city.country}
            city={guide.city.name}
          />
        )}
        {active === 'stay' && (
          <StayPanel
            stays={guide.stays}
            country={guide.city.country}
            city={guide.city.name}
          />
        )}
        {active === 'food' && (
          <FoodPanel
            foods={guide.foods}
            country={guide.city.country}
            city={guide.city.name}
          />
        )}
        {active === 'events' && (
          <EventsPanel
            events={guide.events}
            country={guide.city.country}
            city={guide.city.name}
          />
        )}
      </div>
    </section>
  )
}

export function GuideTabs({ guide }: { guide: CityGuide }) {
  return (
    <Suspense fallback={<div className="mt-10 min-h-[300px]" />}>
      <GuideTabsContent guide={guide} />
    </Suspense>
  )
}

