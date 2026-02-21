'use client'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapPreviewComponent() {
  const center = [20.4625, 85.8830]; // Cuttack Center
  
  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {/* Markers as simple glow circles for the "preview" look */}
      <Circle center={[20.4631, 85.8792]} radius={200} pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.6 }} />
      <Circle center={[20.4812, 85.9145]} radius={200} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.6 }} />
      <Circle center={[20.4520, 85.8750]} radius={200} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.6 }} />
    </MapContainer>
  )
}