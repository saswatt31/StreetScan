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
      case 'Water Logging': return <Droplets className="text-cyan-400" size={18} />
      case 'Bridge Crack': return <Construction className="text-amber-500" size={18} />
      case 'Tree on Road': return <Trees className="text-emerald-400" size={18} />
      default: return <AlertTriangle className="text-rose-500" size={18} />
    }
  }

  return (
    <div className="p-6 bg-background min-h-screen font-sans text-foreground">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Activity className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Ops Control Center</h1>
              <p className="text-slate-500 text-sm">Real-time incident management</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Incidents</span>
            <p className="text-3xl font-mono text-indigo-400">{reports.length}</p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-md">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Issue</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">{getIcon(report.type)}</div>
                      <div>
                        <p className="font-semibold text-slate-100 text-sm">{report.type}</p>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">{report.id} • {report.reportedAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                      report.severity === 'High' 
                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPin size={14} className="text-slate-600" />
                      {report.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <select 
                        value={report.assignedTeam}
                        onChange={(e) => handleAssign(report.id, e.target.value)}
                        className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 py-1.5 px-4 pr-10 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none hover:bg-slate-750 transition-all"
                      >
                        {teams.map(team => <option key={team} value={team} className="bg-slate-900">{team}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center bg-indigo-600/5 border border-indigo-500/10 p-4 rounded-xl">
           <p className="text-xs text-slate-500 italic">Detections are updated every 60 seconds.</p>
           <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest px-6 py-2 rounded-lg shadow-lg shadow-indigo-500/20">
             Finalize Reports
           </Button>
        </div>

      </div>
    </div>
  )
}