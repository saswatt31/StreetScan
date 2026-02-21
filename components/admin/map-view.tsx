'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AlertTriangle, Droplets, Trees, Construction, MapPin } from 'lucide-react'

// Icon fix for Leaflet
import 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/images/marker-icon.png'

interface Issue {
  id: string
  lat: number
  lng: number
  severity: 'high' | 'medium' | 'low'
  type: 'Pothole' | 'Bridge Crack' | 'Water Logging' | 'Tree on Road'
  address: string
}

// Cuttack Specific Mock Data
const CUTTACK_ISSUES: Issue[] = [
  { id: 'CTC-001', lat: 20.4631, lng: 85.8792, severity: 'high', type: 'Pothole', address: 'Badambadi Bus Stand Main Road' },
  { id: 'CTC-002', lat: 20.4812, lng: 85.9145, severity: 'medium', type: 'Bridge Crack', address: 'Mahanadi Bridge (Near Jagatpur)' },
  { id: 'CTC-003', lat: 20.4550, lng: 85.8850, severity: 'high', type: 'Water Logging', address: 'Link Road Junction' },
  { id: 'CTC-004', lat: 20.4725, lng: 85.8660, severity: 'low', type: 'Tree on Road', address: 'SCB Medical College Internal Road' },
  { id: 'CTC-005', lat: 20.4650, lng: 85.8890, severity: 'medium', type: 'Pothole', address: 'Dolamundai Square' },
]

const createCustomIcon = (type: string, severity: string) => {
  const color = severity === 'high' ? '#f43f5e' : severity === 'medium' ? '#f59e0b' : '#10b981';
  
  // Choose icon based on type
  const iconSvg = type === 'Water Logging' ? '💧' : type === 'Tree on Road' ? '🌳' : '⚠️';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 10px; border: 2px solid #1e293b; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            ${iconSvg}
           </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}

export function MapView() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

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
        <MapContainer 
          center={[20.4625, 85.8930]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          {/* Dark Mode Tiles for high-tech look */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />

          {CUTTACK_ISSUES.map((issue) => (
            <Marker 
              key={issue.id} 
              position={[issue.lat, issue.lng]}
              icon={createCustomIcon(issue.type, issue.severity)}
              eventHandlers={{
                click: () => setSelectedIssue(issue),
              }}
            >
              <Popup className="dark-popup">
                <div className="p-2 font-sans">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{issue.id}</p>
                  <h3 className="font-bold text-slate-900">{issue.type}</h3>
                  <p className="text-xs text-slate-600 mb-2">{issue.address}</p>
                  <div className={`text-[10px] font-bold py-1 px-2 rounded text-white inline-block ${
                    issue.severity === 'high' ? 'bg-rose-500' : 'bg-amber-500'
                  }`}>
                    {issue.severity.toUpperCase()} PRIORITY
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Detail Card Overlay */}
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