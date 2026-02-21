'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, Map, BarChart3, Settings, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    label: 'Reports',
    href: '#reports',
    icon: ClipboardList,
    description: 'View and manage reports',
  },
  {
    label: 'Map View',
    href: '#map',
    icon: Map,
    description: 'Interactive location map',
  },
  {
    label: 'Analytics',
    href: '#analytics',
    icon: BarChart3,
    description: 'Dashboard metrics',
  },
  {
    label: 'Operations',
    href: '#operations',
    icon: Settings,
    description: 'System settings',
  },
]

interface AdminSidebarProps {
  onNavigate?: (section: string) => void
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleNavigate = (href: string) => {
    const section = href.replace('#', '')
    onNavigate?.(section)
    setIsOpen(false)
  }

  return (
    <>
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
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transition-transform duration-200 lg:sticky lg:translate-x-0 lg:top-[73px] lg:h-[calc(100vh-73px)]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="h-full overflow-y-auto p-4 space-y-2">
          <div className="px-2 py-4 lg:py-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Navigation
            </p>
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.includes(item.label.toLowerCase())

            return (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  'w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-colors duration-200 text-left group',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                    {item.description}
                  </p>
                </div>
              </button>
            )
          })}

          {/* Footer Section */}
          <div className="border-t border-border mt-8 pt-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
              Quick Links
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors block px-3 py-2 rounded hover:bg-muted/50"
                >
                  Help & Support
                </a>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors block px-3 py-2 rounded hover:bg-muted/50"
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
    </>
  )
}
