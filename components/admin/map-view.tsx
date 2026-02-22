'use client'

import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, MapPin } from 'lucide-react'

interface Issue {
  id: string
  lat: number
  lng: number
  severity: 'high' | 'medium' | 'low'
  type: 'Pothole' | 'Bridge Crack' | 'Water Logging' | 'Tree on Road'
  address: string
}

const CUTTACK_ISSUES: Issue[] = [
  { id: 'CTC-006', lat: 20.4285, lng: 85.8340, severity: 'high', type: 'Pothole', address: 'Trisulia Bridge Entry Point' },
  { id: 'CTC-007', lat: 20.4150, lng: 85.8210, severity: 'medium', type: 'Street Light Out', address: 'Sri Sri University Main Gate Road' },
  { id: 'CTC-008', lat: 20.4020, lng: 85.8550, severity: 'high', type: 'Water Logging', address: 'Metro Satellite City Entrance' },
  { id: 'CTC-009', lat: 20.4410, lng: 85.8620, severity: 'low', type: 'Garbage Dump', address: 'Netaji Subhash Chandra Bose Setu' },
  { id: 'CTC-010', lat: 20.4855, lng: 85.9230, severity: 'high', type: 'Road Crack', address: 'Jagatpur Industrial Estate Lane 2' },
  { id: 'CTC-011', lat: 20.4610, lng: 85.8720, severity: 'medium', type: 'Broken Divider', address: 'Ranihat Canal Road' },
  { id: 'CTC-012', lat: 20.4520, lng: 85.8980, severity: 'low', type: 'Stray Animal Zone', address: 'Khannagar Park Road' },
  { id: 'CTC-013', lat: 20.4780, lng: 85.8450, severity: 'high', type: 'Pothole', address: 'Bidanasi Housing Board Road' },
  { id: 'CTC-014', lat: 20.4680, lng: 85.8820, severity: 'medium', type: 'Manhole Open', address: 'Chandi Chowk Junction' },
  { id: 'CTC-015', lat: 20.4350, lng: 85.8280, severity: 'high', type: 'Dust Pollution', address: 'Naraj Road near Godi Sahi' }]

export function MapView() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current) return

    // Dynamically import leaflet only on client
    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      // Prevent double init
      if (mapRef.current) return

      const map = L.map(mapContainerRef.current!, {
        center: [20.4625, 85.8930],
        zoom: 13,
      })

      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map)

      CUTTACK_ISSUES.forEach((issue) => {
        const color =
          issue.severity === 'high' ? '#f43f5e' :
          issue.severity === 'medium' ? '#f59e0b' : '#10b981'

        const iconSvg =
          issue.type === 'Water Logging' ? '💧' :
          issue.type === 'Tree on Road' ? '🌳' : '⚠️'

        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background:${color};width:34px;height:34px;border-radius:10px;border:2px solid #1e293b;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.5);">${iconSvg}</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        })

        const marker = L.marker([issue.lat, issue.lng], { icon }).addTo(map)

        marker.bindPopup(`
          <div style="font-family:sans-serif;padding:4px">
            <p style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;margin:0">${issue.id}</p>
            <h3 style="margin:4px 0;color:#0f172a">${issue.type}</h3>
            <p style="font-size:12px;color:#475569;margin-bottom:8px">${issue.address}</p>
            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;color:white;background:${color}">
              ${issue.severity.toUpperCase()} PRIORITY
            </span>
          </div>
        `)

        marker.on('click', () => {
          setSelectedIssue(issue)
        })
      })
    }

    initMap()

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [isMounted])

  return (
    <div className="w-full space-y-4 bg-card p-4 rounded-2xl border border-border">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-foreground font-bold text-lg flex items-center gap-2">
          <MapPin className="text-indigo-500 dark:text-indigo-400" size={20} />
          Cuttack Live Incident Map
        </h2>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
          Showing {CUTTACK_ISSUES.length} reports
        </span>
      </div>

      <div className="h-[550px] w-full rounded-xl overflow-hidden border border-border shadow-2xl">
        {/* Placeholder shown during SSR */}
        {!isMounted ? (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Loading map...</p>
          </div>
        ) : (
          <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
        )}
      </div>

      {selectedIssue && (
        <div className="bg-card p-5 rounded-xl border-l-4 border-l-indigo-500 border border-border animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <AlertTriangle className={selectedIssue.severity === 'high' ? 'text-rose-500' : 'text-amber-500'} />
              </div>
              <div>
                <h4 className="text-foreground font-bold text-xl">{selectedIssue.type}</h4>
                <p className="text-muted-foreground flex items-center gap-1 text-sm mt-1">
                  <MapPin size={14} /> {selectedIssue.address}, Cuttack
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedIssue(null)}
              className="text-muted-foreground hover:text-foreground text-xs bg-muted px-2 py-1 rounded border border-border"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}