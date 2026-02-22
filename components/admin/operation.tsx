'use client'

import { useState } from 'react'
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

interface Report {
  id: string
  type: 'Pothole' | 'Bridge Crack' | 'Water Logging' | 'Tree on Road'
  severity: 'High' | 'Medium' | 'Low'
  location: string
  reportedAt: string
  assignedTeam: string
}

const INITIAL_REPORTS: Report[] = [
  { id: 'REP-001', type: 'Bridge Crack', severity: 'High', location: 'Brooklyn Bridge North', reportedAt: '10 mins ago', assignedTeam: 'None' },
  { id: 'REP-002', type: 'Water Logging', severity: 'Medium', location: 'Canal St Station', reportedAt: '25 mins ago', assignedTeam: 'None' },
  { id: 'REP-003', type: 'Pothole', severity: 'High', location: 'Broadway & Wall St', reportedAt: '1 hour ago', assignedTeam: 'Alpha Squad' },
  { id: 'REP-004', type: 'Tree on Road', severity: 'Low', location: 'West Side Hwy Exit 4', reportedAt: '2 hours ago', assignedTeam: 'None' },
]

const teams = ['None', 'Alpha Squad', 'Rapid Response', 'Engineering B', 'Drainage Specialists']

export default function OperationsPanel() {
  const [reports, setReports] = useState(INITIAL_REPORTS)

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