import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-bold text-foreground">
              StreetScan
            </h3>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring and management platform for modern infrastructure.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/citizen-report" className="text-muted-foreground hover:text-foreground transition-colors">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-foreground">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 StreetScan. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for government agencies and modern cities
          </p>
        </div>
      </div>
    </footer>
  )
}
