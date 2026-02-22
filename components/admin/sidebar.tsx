'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Map, BarChart3, Settings, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    label: 'Reports',
    href: 'reports',
    icon: ClipboardList,
    description: 'View and manage reports',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    iconColor: 'text-blue-500',
  },
  {
    label: 'Map View',
    href: 'map',
    icon: Map,
    description: 'Interactive location map',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    iconColor: 'text-emerald-500',
  },
  {
    label: 'Analytics',
    href: 'analytics',
    icon: BarChart3,
    description: 'Dashboard metrics',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    iconColor: 'text-amber-500',
  },
  {
    label: 'Operations',
    href: 'operations',
    icon: Settings,
    description: 'System settings',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    iconColor: 'text-purple-500',
  },
]

interface AdminSidebarProps {
  activeSection?: string
  onNavigate?: (section: string) => void
}

export function AdminSidebar({ activeSection, onNavigate }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (href: string) => {
    onNavigate?.(href)
    setIsOpen(false)
  }

  return (
    <div className="bg-background text-foreground">
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-6 right-6 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transition-transform duration-200',
          'lg:sticky lg:translate-x-0 lg:top-[73px] lg:h-[calc(100vh-73px)]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="h-full overflow-y-auto p-4 space-y-1.5">
          <div className="px-2 py-4 lg:py-0 lg:pb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </p>
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.href

            return (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  'w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left group border',
                  isActive
                    ? cn('border', item.color)
                    : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                {/* Icon wrapper — coloured when active */}
                <div
                  className={cn(
                    'flex-shrink-0 mt-0.5 p-1 rounded-md transition-colors duration-200',
                    isActive
                      ? item.color
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <p
                    className={cn(
                      'font-medium text-sm transition-colors duration-200',
                      isActive ? item.iconColor : ''
                    )}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>

                {/* Active indicator dot */}
                {isActive && (
                  <div
                    className={cn(
                      'ml-auto self-center w-1.5 h-1.5 rounded-full flex-shrink-0',
                      item.iconColor.replace('text-', 'bg-')
                    )}
                  />
                )}
              </button>
            )
          })}

          {/* Quick Links */}
          <div className="border-t border-border mt-8 pt-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
              Quick Links
            </p>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors block px-3 py-2 rounded-lg hover:bg-muted/50"
                >
                  Help &amp; Support
                </a>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors block px-3 py-2 rounded-lg hover:bg-muted/50"
                >
                  Back to Home
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}