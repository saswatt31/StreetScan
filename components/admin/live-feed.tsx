'use client'

import { AlertCircle, CheckCircle2, Zap } from 'lucide-react'

interface FeedItem {
  id: string
  type: 'new_report' | 'status_update' | 'resolved'
  title: string
  description: string
  timestamp: string
  severity?: 'high' | 'medium' | 'low'
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: '1',
    type: 'new_report',
    title: 'New Report: Pothole',
    description: '142 Oak Street - High priority hazard',
    timestamp: '2 minutes ago',
    severity: 'high',
  },
  {
    id: '2',
    type: 'status_update',
    title: 'Status Updated',
    description: 'Report RPT-004 marked as in progress',
    timestamp: '15 minutes ago',
  },
  {
    id: '3',
    type: 'resolved',
    title: 'Issue Resolved',
    description: 'Water damage under bridge - repair completed',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    type: 'new_report',
    title: 'New Report: Surface Crack',
    description: '567 Elm Avenue - Medium priority',
    timestamp: '2 hours ago',
    severity: 'medium',
  },
  {
    id: '5',
    type: 'status_update',
    title: 'Team Assignment',
    description: 'Maintenance crew assigned to northern district',
    timestamp: '3 hours ago',
  },
]

const getIcon = (type: FeedItem['type']) => {
  switch (type) {
    case 'new_report':
      return AlertCircle
    case 'status_update':
      return Zap
    case 'resolved':
      return CheckCircle2
  }
}

const getIconColor = (type: FeedItem['type'], severity?: string) => {
  switch (type) {
    case 'new_report':
      if (severity === 'high') return 'text-red-400'
      if (severity === 'medium') return 'text-amber-400'
      return 'text-blue-400'
    case 'status_update':
      return 'text-amber-400'
    case 'resolved':
      return 'text-green-400'
  }
}

export function LiveFeed() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <h3 className="font-heading font-bold text-foreground">Live Activity Feed</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {FEED_ITEMS.map((item) => {
          const Icon = getIcon(item.type)
          const iconColor = getIconColor(item.type, item.severity)

          return (
            <div
              key={item.id}
              className="flex gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200"
            >
              {/* Icon */}
              <div className="flex-shrink-0 pt-1">
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium text-foreground text-sm leading-tight">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground/60">{item.timestamp}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-4">
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all activity →
        </button>
      </div>
    </div>
  )
}
