'use client'

import { useState } from 'react'
import { AdminNavbar } from '@/components/admin/navbar'
import { AdminSidebar } from '@/components/admin/sidebar'
import { MapView } from '@/components/admin/map-view'
import { ReportsTable } from '@/components/admin/reports-table'
import { AnalyticsPanel } from '@/components/admin/analytics-panel'
import { LiveFeed } from '@/components/admin/live-feed'
import OperationsPanel from '@/components/admin/operation'

type DashboardSection = 'dashboard' | 'reports' | 'map' | 'analytics' | 'operations'

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard')

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <div className="flex">
        {/* Sidebar */}
<AdminSidebar
  activeSection={activeSection}
  onNavigate={(section) => setActiveSection(section)}
/>
        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="border-l border-border lg:border-l-0">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 py-8">
              {/* Dashboard Overview */}
              {(activeSection === 'dashboard' || activeSection.includes('analytics')) && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-heading font-bold text-foreground">
                      Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                      Real-time infrastructure monitoring and management
                    </p>
                  </div>

                  <AnalyticsPanel />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <ReportsTable />
                    </div>
                    <div>
                      <LiveFeed />
                    </div>
                  </div>
                </div>
              )}

              {/* Map View */}
              {activeSection.includes('map') && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-heading font-bold text-foreground">
                      Map View
                    </h1>
                    <p className="text-muted-foreground">
                      Interactive infrastructure map with live markers
                    </p>
                  </div>

                  <MapView />
                </div>
              )}

              {/* Reports */}
              {activeSection.includes('reports') && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-heading font-bold text-foreground">
                      Reports
                    </h1>
                    <p className="text-muted-foreground">
                      Manage and review all infrastructure reports
                    </p>
                  </div>

                  <ReportsTable />
                </div>
              )}

              {/* Operations */}
              {activeSection.includes('operations') && (
                <div className="space-y-6">
                 <OperationsPanel />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
