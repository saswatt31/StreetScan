'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Clock, AlertCircle, CheckCircle2, Car, Plane, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStoredReports, type CitizenReport } from '@/lib/issues'

type ReportSource = 'citizen' | 'drone' | 'government_vehicle' | 'cctv'

interface Report {
  id: string
  location: string
  type: string
  severity: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'resolved'
  timestamp: string
  description: string
  source: ReportSource
  reportedBy?: string
}

// Base dummy data for reports table
const BASE_REPORTS: Report[] = [
  {
    id: 'RPT-001',
    location: 'Badambadi Chowk, Cuttack',
    type: 'Pothole',
    severity: 'high',
    status: 'in_progress',
    timestamp: '2 hours ago',
    description: 'Large pothole causing vehicle damage near Badambadi bus stand junction.',
    source: 'citizen',
    reportedBy: 'Ramesh Pradhan',
  },
  {
    id: 'RPT-002',
    location: 'Buxi Bazar Road, Cuttack',
    type: 'Surface Crack',
    severity: 'medium',
    status: 'pending',
    timestamp: '4 hours ago',
    description: 'Multiple surface cracks spreading across the road near Buxi Bazar market area.',
    source: 'drone',
    reportedBy: 'Drone Unit #D-04',
  },
  {
    id: 'RPT-003',
    location: 'Mahanadi Bridge, NH-16',
    type: 'Bridge Crack',
    severity: 'high',
    status: 'in_progress',
    timestamp: '6 hours ago',
    description: 'Cracks detected on bridge railing and surface near Mahanadi river crossing.',
    source: 'government_vehicle',
    reportedBy: 'Patrol Vehicle #GV-12',
  },
  {
    id: 'RPT-004',
    location: 'College Square, Cuttack',
    type: 'Water Logging',
    severity: 'medium',
    status: 'pending',
    timestamp: '3 hours ago',
    description: 'Waterlogging and road erosion near College Square roundabout.',
    source: 'cctv',
    reportedBy: 'CCTV Camera #C-07',
  },
  {
    id: 'RPT-005',
    location: 'Tulsidas Nagar, Link Road',
    type: 'Pothole',
    severity: 'low',
    status: 'resolved',
    timestamp: '1 day ago',
    description: 'Small pothole near Tulsidas Nagar residential colony entrance.',
    source: 'drone',
    reportedBy: 'Drone Unit #D-02',
  },
  {
    id: 'RPT-006',
    location: 'Kathajodi Bridge, Cuttack',
    type: 'Bridge Crack',
    severity: 'high',
    status: 'pending',
    timestamp: '5 hours ago',
    description: 'Deep surface cracks found on Kathajodi bridge approach road.',
    source: 'government_vehicle',
    reportedBy: 'Patrol Vehicle #GV-07',
  },
  {
    id: 'RPT-007',
    location: 'Jagatpur Road, Industrial Area',
    type: 'Water Logging',
    severity: 'medium',
    status: 'in_progress',
    timestamp: '8 hours ago',
    description: 'Multiple potholes along Jagatpur industrial road stretch causing heavy vehicle issues.',
    source: 'citizen',
    reportedBy: 'Ajay Kumar Das',
  },
  {
    id: 'RPT-008',
    location: 'Mahanadi River Road, Cuttack',
    type: 'Debris on Road',
    severity: 'low',
    status: 'pending',
    timestamp: '12 hours ago',
    description: 'Construction debris blocking one lane of the road near river approach.',
    source: 'cctv',
    reportedBy: 'CCTV Camera #C-03',
  },
  {
    id: 'RPT-009',
    location: 'Cuttack-Puri Highway Km 18',
    type: 'Structural Damage',
    severity: 'high',
    status: 'in_progress',
    timestamp: '10 hours ago',
    description: 'Guardrail damage and road surface deterioration detected on highway stretch.',
    source: 'government_vehicle',
    reportedBy: 'Patrol Vehicle #GV-03',
  },
  {
    id: 'RPT-010',
    location: 'Sri Sri University Road, Cuttack',
    type: 'Pothole',
    severity: 'medium',
    status: 'pending',
    timestamp: '7 hours ago',
    description: 'Multiple potholes near university entrance causing traffic slowdown.',
    source: 'citizen',
    reportedBy: 'Priyanka Mohapatra',
  },
]

// Convert CitizenReport to ReportsTable format
function convertToTableReport(report: CitizenReport): Report {
  const location = `${report.landmark || report.address}, ${report.city}`
  
  return {
    id: report.id,
    location: location,
    type: report.type,
    severity: report.severity,
    status: report.status,
    timestamp: new Date(report.timestamp).toLocaleString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    description: report.description || 'No description provided',
    source: report.source,
    reportedBy: report.isAnonymous ? 'Anonymous Citizen' : (report.contactName || 'Unknown')
  }
}

const sourceConfig: Record<ReportSource, { label: string; Icon: React.ElementType; color: string; bg: string }> = {
  citizen: {
    label: 'Citizen Report',
    Icon: User,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  drone: {
    label: 'Drone Detection',
    Icon: Plane,
    color: 'text-violet-600',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
  government_vehicle: {
    label: 'Govt. Vehicle',
    Icon: Car,
    color: 'text-orange-600',
    bg: 'bg-orange-500/10 border-orange-500/20',
  },
  cctv: {
    label: 'CCTV Camera',
    Icon: ({ className, size }: { className?: string; size?: number }) => (
      <svg className={className} width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
        <circle cx="12" cy="13" r="3"/>
      </svg>
    ),
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
}

const getSeverityStyles = (severity: Report['severity']) => {
  switch (severity) {
    case 'high':   return 'bg-red-500/10 text-red-500 border border-red-500/20'
    case 'medium': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
    case 'low':    return 'bg-green-500/10 text-green-600 border border-green-500/20'
  }
}

const getStatusConfig = (status: Report['status']) => {
  switch (status) {
    case 'pending':     return { color: 'text-muted-foreground', dot: 'bg-muted-foreground', Icon: Clock }
    case 'in_progress': return { color: 'text-amber-500', dot: 'bg-amber-500', Icon: AlertCircle }
    case 'resolved':    return { color: 'text-green-600', dot: 'bg-green-500', Icon: CheckCircle2 }
  }
}

interface ReportsTableProps {
  onReportSelect?: (report: Report) => void
}

export function ReportsTable({ onReportSelect }: ReportsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'severity'>('newest')
  const [filterSource, setFilterSource] = useState<ReportSource | 'all'>('all')
  const [reports, setReports] = useState<Report[]>(BASE_REPORTS)

  useEffect(() => {
    // Load reports from localStorage on mount
    const stored = getStoredReports()
    const converted = stored.map(convertToTableReport)
    // Combine base dummy data with stored reports
    setReports([ ...converted,...BASE_REPORTS])
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
      
      const converted = updatedReports.map(convertToTableReport)
      setReports([...BASE_REPORTS, ...converted])
    }

    window.addEventListener('storage-update', handleStorageUpdate as EventListener)
    window.addEventListener('storage', handleStorageUpdate as EventListener)

    return () => {
      window.removeEventListener('storage-update', handleStorageUpdate as EventListener)
      window.removeEventListener('storage', handleStorageUpdate as EventListener)
    }
  }, [])

  const filtered = reports.filter(r => filterSource === 'all' || r.source === filterSource)
  const sortedReports = [...filtered].sort((a, b) => {
    if (sortBy === 'severity') {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.severity] - order[b.severity]
    }
    return 0
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading font-bold text-foreground">Recent Reports</h2>
        <div className="flex flex-wrap gap-2">
          {/* Source filter */}
          <div className="flex gap-1 p-1 rounded-lg border border-border bg-muted/30">
            {(['all', 'citizen', 'drone', 'government_vehicle', 'cctv'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterSource(s)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                  filterSource === s
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s === 'all' ? 'All' : (
                  <>
                    {(() => { const { Icon } = sourceConfig[s]; return <Icon className="w-3 h-3" /> })()}
                    {sourceConfig[s].label}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <Button variant={sortBy === 'newest' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('newest')}>
              Newest
            </Button>
            <Button variant={sortBy === 'severity' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('severity')}>
              Priority
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-28">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-32">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell w-28">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell w-36">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell w-32">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell w-28">Time</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {sortedReports.map((report) => {
                const isExpanded = expandedId === report.id
                const statusCfg = getStatusConfig(report.status)
                const srcCfg = sourceConfig[report.source]
                const SrcIcon = srcCfg.Icon
                const StatusIcon = statusCfg.Icon

                return (
                  <>
                    <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 align-middle">
                        <span className="font-mono text-xs font-semibold text-foreground">{report.id}</span>
                      </td>

                      <td className="px-4 py-3 align-middle hidden sm:table-cell max-w-[180px]">
                        <span className="text-xs text-muted-foreground truncate block">{report.location}</span>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <span className="text-xs font-medium text-foreground">{report.type}</span>
                      </td>

                      <td className="px-4 py-3 align-middle hidden md:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityStyles(report.severity)}`}>
                          {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-middle hidden lg:table-cell">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${srcCfg.bg} ${srcCfg.color}`}>
                          <SrcIcon className="w-3 h-3 shrink-0" />
                          {srcCfg.label}
                        </div>
                      </td>

                      <td className="px-4 py-3 align-middle hidden lg:table-cell">
                        <div className={`flex items-center gap-1.5 ${statusCfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-xs font-medium capitalize whitespace-nowrap">
                            {report.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 align-middle hidden xl:table-cell">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{report.timestamp}</span>
                      </td>

                      <td className="px-4 py-3 align-middle text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setExpandedId(isExpanded ? null : report.id)}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={8} className="px-6 py-5">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Location</p>
                              <p className="text-sm font-medium text-foreground">{report.location}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Reported By</p>
                              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${srcCfg.bg} ${srcCfg.color}`}>
                                <SrcIcon className="w-3 h-3" />
                                {report.reportedBy ?? srcCfg.label}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Status</p>
                              <div className={`flex items-center gap-1.5 ${statusCfg.color}`}>
                                <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                                <span className="text-sm font-medium capitalize">{report.status.replace('_', ' ')}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Severity</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityStyles(report.severity)}`}>
                                {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)} Priority
                              </span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Details</p>
                            <p className="text-sm text-foreground">{report.description}</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => onReportSelect?.(report)}>
                            View Full Report
                          </Button>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}