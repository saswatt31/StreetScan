'use client'

import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, MapPin } from 'lucide-react'
import { useIssues } from '@/hooks/use-issues'
import type { Issue } from '@/lib/issues'

export function MapView() {
  const { issues } = useIssues()
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

      issues.forEach((issue) => {
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
  }, [isMounted, issues])

  return (
    <div className="w-full space-y-4 bg-card p-4 rounded-2xl border border-border">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-foreground font-bold text-lg flex items-center gap-2">
          <MapPin className="text-indigo-500 dark:text-indigo-400" size={20} />
          Cuttack Live Incident Map
        </h2>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
          Showing {issues.length} reports
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