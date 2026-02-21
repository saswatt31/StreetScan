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
  { id: 'CTC-001', lat: 20.4631, lng: 85.8792, severity: 'high', type: 'Pothole', address: 'Badambadi Bus Stand Main Road' },
  { id: 'CTC-002', lat: 20.4812, lng: 85.9145, severity: 'medium', type: 'Bridge Crack', address: 'Mahanadi Bridge (Near Jagatpur)' },
  { id: 'CTC-003', lat: 20.4550, lng: 85.8850, severity: 'high', type: 'Water Logging', address: 'Link Road Junction' },
  { id: 'CTC-004', lat: 20.4725, lng: 85.8660, severity: 'low', type: 'Tree on Road', address: 'SCB Medical College Internal Road' },
  { id: 'CTC-005', lat: 20.4650, lng: 85.8890, severity: 'medium', type: 'Pothole', address: 'Dolamundai Square' },
]

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
    <div className="w-full space-y-4 bg-slate-950 p-4 rounded-2xl">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <MapPin className="text-indigo-400" size={20} />
          Cuttack Live Incident Map
        </h2>
        <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Showing {CUTTACK_ISSUES.length} reports
        </span>
      </div>

      <div className="h-[550px] w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Placeholder shown during SSR */}
        {!isMounted ? (
          <div className="h-full w-full bg-slate-900 flex items-center justify-center">
            <p className="text-slate-500 text-sm">Loading map...</p>
          </div>
        ) : (
          <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
        )}
      </div>

      {selectedIssue && (
        <div className="bg-slate-900 p-5 rounded-xl border-l-4 border-l-indigo-500 border border-slate-800 animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="p-3 bg-slate-800 rounded-lg">
                <AlertTriangle className={selectedIssue.severity === 'high' ? 'text-rose-500' : 'text-amber-500'} />
              </div>
              <div>
                <h4 className="text-white font-bold text-xl">{selectedIssue.type}</h4>
                <p className="text-slate-400 flex items-center gap-1 text-sm mt-1">
                  <MapPin size={14} /> {selectedIssue.address}, Cuttack
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedIssue(null)}
              className="text-slate-500 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}