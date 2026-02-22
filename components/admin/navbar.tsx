'use client'

import { Bell, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function AdminNavbar() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo & Title */}
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-foreground font-heading font-bold">
          <img
  src="/logo.png"
  alt="StreetScan Logo"
  className="h-10 w-10 rounded-full object-cover"
/>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading font-bold text-foreground">StreetScan</h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-foreground" />
          </Button>

          {/* Profile / Logout */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">Inspector</p>
            </div>
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 text-foreground" />
              </Button>
            </Link>
          </div>

          {/* Theme toggle */}
          <div className="pl-3">
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
