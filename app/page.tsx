import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Benefits } from "@/components/landing/benefits"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

export default function Home() {
  return (
    <main
      className="relative min-h-screen bg-background transition-colors"
      style={{
        backgroundImage: "url('/background.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for text readability - stronger in light mode */}
<div className="absolute inset-0 bg-white/60 dark:bg-black/50 z-0 pointer-events-none" />

      <header className="fixed left-1/2 top-6 z-40 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2">
        <div className="flex h-14 items-center justify-between gap-6 rounded-full border bg-background/60 dark:bg-background/40 border-border px-5 py-2 shadow-xl backdrop-blur-xl sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logo.png"
              alt="StreetScan Logo"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              StreetScan
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/citizen-report"
              className="transition-colors hover:text-foreground"
            >
              Citizen Portal
            </Link>
            <Link
              href="/admin/dashboard"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>

            <Link href="/citizen-report">
              <Button
                size="sm"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
              </Button>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Page content sits above the overlay */}
      <div className="relative z-10">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Footer />
      </div>
    </main>
  )
}