'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  Droplets,
  Trees,
  Construction,
  MapPin,
  ChevronDown,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStoredReports, type CitizenReport } from '@/lib/issues'

interface Report {
  id: string
  type: string
  severity: 'High' | 'Medium' | 'Low'
  location: string
  reportedAt: string
  assignedTeam: string
}

const teams = ['None', 'Alpha Squad', 'Rapid Response', 'Engineering B', 'Drainage Specialists']

// Base dummy data for operations
const BASE_OPERATIONS_REPORTS: Report[] = [
  { id: 'REP-001', type: 'Bridge Crack', severity: 'High', location: 'Mahanadi Bridge North Entry', reportedAt: '10 mins ago', assignedTeam: 'None' },
  { id: 'REP-002', type: 'Water Logging', severity: 'Medium', location: 'Buxi Bazar Road Junction', reportedAt: '25 mins ago', assignedTeam: 'None' },
  { id: 'REP-003', type: 'Pothole', severity: 'High', location: 'Broadway & College Square', reportedAt: '1 hour ago', assignedTeam: 'Alpha Squad' },
  { id: 'REP-004', type: 'Tree on Road', severity: 'Low', location: 'Link Road Exit 4', reportedAt: '2 hours ago', assignedTeam: 'None' },
  { id: 'REP-005', type: 'Bridge Crack', severity: 'High', location: 'Kathajodi Bridge Approach', reportedAt: '3 hours ago', assignedTeam: 'Rapid Response' },
  { id: 'REP-006', type: 'Water Logging', severity: 'High', location: 'Badambadi Chowk Low Point', reportedAt: '4 hours ago', assignedTeam: 'None' },
  { id: 'REP-007', type: 'Structural Damage', severity: 'Medium', location: 'Cuttack-Puri Highway Km 12', reportedAt: '5 hours ago', assignedTeam: 'Engineering B' },
  { id: 'REP-008', type: 'Debris on Road', severity: 'Low', location: 'Mahanadi River Road', reportedAt: '6 hours ago', assignedTeam: 'None' },
]

// Convert CitizenReport to Operations Report format
function convertToOperationReport(report: CitizenReport): Report {
  const severityMap: Record<string, 'High' | 'Medium' | 'Low'> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  }
  
  // Format timestamp to relative time
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 60) return `${diffMins} mins ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }
  
  // Build location from address parts
  const location = `${report.landmark || report.address}, ${report.city}`
  
  return {
    id: report.id,
    type: report.type,
    severity: severityMap[report.severity] || 'Medium',
    location: location,
    reportedAt: getRelativeTime(report.timestamp),
    assignedTeam: 'None'
  }
}

export default function OperationsPanel() {
  const [reports, setReports] = useState<Report[]>(BASE_OPERATIONS_REPORTS)

  useEffect(() => {
    // Load reports from localStorage on mount
    const stored = getStoredReports()
    const converted = stored.map(convertToOperationReport)
    // Combine base dummy data with stored reports
    setReports([ ...converted,...BASE_OPERATIONS_REPORTS])
  }, [])

  // Listen for storage updates
  useEffect(() => {
    const handleStorageUpdate = (event: StorageEvent | CustomEvent) => {
      let updatedReports: CitizenReport[]
      
      if ('detail' in event) {
        updatedReports = event.detail as CitizenReport[]
      } else {
        if (event.key !== 'cuttack_issues') return
        updatedReports = event.newValue ? JSON.parse(event.newValue) : []
      }
      
      const converted = updatedReports.map(convertToOperationReport)
      setReports([ ...converted,...BASE_OPERATIONS_REPORTS])
    }

    window.addEventListener('storage-update', handleStorageUpdate as EventListener)
    window.addEventListener('storage', handleStorageUpdate as EventListener)

    return () => {
      window.removeEventListener('storage-update', handleStorageUpdate as EventListener)
      window.removeEventListener('storage', handleStorageUpdate as EventListener)
    }
  }, [])

  const handleAssign = (id: string, team: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, assignedTeam: team } : r))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'Water Logging': return <Droplets className="text-[var(--accent)]" size={18} />
      case 'Bridge Crack': return <Construction className="text-[var(--accent)]" size={18} />
      case 'Tree on Road': return <Trees className="text-[var(--accent)]" size={18} />
      default: return <AlertTriangle className="text-[var(--destructive)]" size={18} />
    }
  }

  return (
    <div className="p-6 bg-background min-h-screen font-sans text-foreground">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl border"
              style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--sidebar-border)' }}
            >
              <Activity className="text-[var(--accent)]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Ops Control Center</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Real-time incident management</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Live Incidents</span>
            <p className="text-3xl font-mono" style={{ color: 'var(--accent)' }}>{reports.length}</p>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl overflow-hidden backdrop-blur-md" style={{ backgroundColor: 'var(--card)', border: '1px solid', borderColor: 'var(--border)' }}>
          <table className="w-full text-left">
            <thead style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid', borderColor: 'var(--border)' }}>
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>Issue</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>Location</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>Assigned Team</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {reports.map((report) => (
                <tr key={report.id} className="transition-all hover:bg-[var(--muted)]">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                        {getIcon(report.type)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{report.type}</p>
                        <p className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>{report.id} • {report.reportedAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      <MapPin size={14} className="text-[var(--muted-foreground)]" />
                      {report.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <select 
                        value={report.assignedTeam}
                        onChange={(e) => handleAssign(report.id, e.target.value)}
                        className="w-full appearance-none py-1.5 px-4 pr-10 rounded-lg text-xs cursor-pointer outline-none transition-all"
                        style={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid',
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)'
                        }}
                      >
                        {teams.map(team => <option key={team} value={team} className="" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>{team}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter"
                      style={{
                        color: report.severity === 'High' ? 'var(--destructive)' : 'var(--accent)',
                        border: '1px solid',
                        borderColor: report.severity === 'High' ? 'var(--destructive)' : 'var(--accent)',
                        backgroundColor: 'var(--muted)'
                      }}
                    >
                      {report.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)', border: '1px solid', borderColor: 'var(--border)' }}>
           <p className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>Detections are updated every 60 seconds.</p>
           <Button className="font-bold text-xs uppercase tracking-widest px-6 py-2 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--accent)', color: 'var(--primary-foreground)', boxShadow: '0 10px 20px rgba(0,0,0,0.06)' }}>
             Finalize Reports
           </Button>
        </div>

      </div>
    </div>
  )
}