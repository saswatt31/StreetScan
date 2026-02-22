import { BarChart3, Clock, Users } from "lucide-react"

const benefits = [
  {
    title: "Real-Time Monitoring",
    description: "Track status across locations with live updates and instant alerts.",
    icon: BarChart3,
  },
  {
    title: "Faster Response",
    description: "Smart prioritization and automated allocation cut repair times.",
    icon: Clock,
  },
  {
    title: "Community Engagement",
    description: "Citizens report directly—building a collaborative maintenance ecosystem.",
    icon: Users,
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-muted/5 to-background" />
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">
            Key benefits
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for modern cities
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Smarter workflows and better outcomes for agencies and residents.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 dark:border-border bg-card/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 dark:hover:border-muted-foreground hover:bg-card/80 hover:shadow-lg hover:shadow-black/10 sf-fade-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 dark:bg-muted text-foreground transition-colors group-hover:bg-white/15 dark:hover:bg-muted/80">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
