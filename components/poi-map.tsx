'use client'

import { useEffect } from 'react'
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import { LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type MapPoi = {
  id: string
  name: string
  lat: number
  lng: number
}

const EMERALD = 'oklch(0.596 0.118 163)'

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 14)
      return
    }
    map.fitBounds(new LatLngBounds(points), { padding: [32, 32] })
  }, [map, points])
  return null
}

export default function PoiMap({ pois }: { pois: MapPoi[] }) {
  const points = pois.map((p) => [p.lat, p.lng] as [number, number])
  const center = points[0] ?? [39.0, 35.0]

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      className="h-72 w-full sm:h-80"
      style={{ background: 'var(--secondary)' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds points={points} />
      {pois.map((poi) => (
        <CircleMarker
          key={poi.id}
          center={[poi.lat, poi.lng]}
          radius={7}
          pathOptions={{
            color: EMERALD,
            fillColor: EMERALD,
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            <span className="font-medium">{poi.name}</span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
