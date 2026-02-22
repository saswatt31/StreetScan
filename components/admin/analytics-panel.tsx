'use client'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

const dailyData = [
  { date: 'Mon', reports: 12, resolved: 8 },
  { date: 'Tue', reports: 19, resolved: 12 },
  { date: 'Wed', reports: 15, resolved: 10 },
  { date: 'Thu', reports: 25, resolved: 18 },
  { date: 'Fri', reports: 22, resolved: 15 },
  { date: 'Sat', reports: 18, resolved: 12 },
  { date: 'Sun', reports: 14, resolved: 10 },
]

const severityData = [
  { name: 'High Priority', value: 24, color: '#dc2626' },
  { name: 'Medium Priority', value: 38, color: '#d97706' },
  { name: 'Low Priority', value: 28, color: '#059669' },
]

const stats = [
  {
    label: 'Total Reports',
    value: '125',
    change: '+12%',
    icon: AlertCircle,
    color: 'text-blue-400',
  },
  {
    label: 'Resolved',
    value: '85',
    change: '+8%',
    icon: CheckCircle2,
    color: 'text-green-400',
  },
  {
    label: 'In Progress',
    value: '32',
    change: '-3%',
    icon: Clock,
    color: 'text-amber-400',
  },
  {
    label: 'Avg Response',
    value: '2.5h',
    change: '+5%',
    icon: TrendingUp,
    color: 'text-purple-400',
  },
]

export function AnalyticsPanel() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-heading font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className={`text-xs font-medium ${stat.color}`}>
                {stat.change} from last week
              </p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Trend */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="font-heading font-bold text-foreground">Reports Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '0.5rem',
                }}
                cursor={{ stroke: '#475569' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="reports"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Breakdown */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="font-heading font-bold text-foreground">
            Severity Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
<Tooltip
  cursor={{ fill: 'transparent' }} // This removes the gray box
  contentStyle={{
    backgroundColor: '#000000',
    border: '1px solid #475569',
    borderRadius: '0.5rem',
  }}
/>
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="font-heading font-bold text-foreground">
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Resolution Rate</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-400">68%</span>
              <span className="text-xs text-muted-foreground">↑ 2%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Average Response Time</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-400">2.5h</span>
              <span className="text-xs text-muted-foreground">↓ 0.5h</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-blue-500" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Active Areas</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-400">12</span>
              <span className="text-xs text-muted-foreground">↑ 3</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-amber-500" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Team Efficiency</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-purple-400">85%</span>
              <span className="text-xs text-muted-foreground">↑ 5%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-5/6 bg-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
