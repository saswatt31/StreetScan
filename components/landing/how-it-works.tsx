'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertCircle, MapPin, CheckCircle2 } from "lucide-react"
import dynamic from 'next/dynamic'

const MapPreview = dynamic(() => import('./MapPreviewComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center">
      <span className="text-muted-foreground text-xs tracking-widest uppercase">Loading map...</span>
    </div>
  )
})

const steps = [
  {
    number: "01",
    title: "Report Issues",
    description: "Citizens upload photos of infrastructure problems with location. Fast and simple.",
    icon: AlertCircle,
    accent: "#ef4444",
    glow: "rgba(239,68,68,0.15)",
  },
  {
    number: "02",
    title: "Smart Detection",
    description: "AI identifies hazard type and severity so teams know what to fix first.",
    icon: MapPin,
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    number: "03",
    title: "Track Resolution",
    description: "Agencies dispatch resources and you can track progress in real time.",
    icon: CheckCircle2,
    accent: "#10b981",
    glow: "rgba(16,185,129,0.15)",
  },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(target / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function HowItWorks() {
  const { ref: sectionRef, inView: sectionInView } = useInView(0.05)

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-background overflow-hidden"
    >
      {/* Dark overlay for light theme - hidden in dark mode */}
      <div className="dark:hidden absolute inset-0 bg-black/5 pointer-events-none" />
      
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.3,
        }}
      />

      {/* Radial glow center */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, var(--chart-5) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">

        {/* Header */}
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: sectionInView ? 1 : 0,
            transform: sectionInView ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-amber-500 mb-4">
            How it works
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
            Three steps to{' '}
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: '1px var(--chart-5)',
                color: 'transparent',
              }}
            >
              safer streets
            </span>
          </h2>
          <p className="mt-4 max-w-md mx-auto text-sm text-muted-foreground leading-relaxed">
            From report to resolution — transparent, fast, and AI-powered.
          </p>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1"
                style={{
                  opacity: sectionInView ? 1 : 0,
                  transform: sectionInView ? 'translateY(0)' : 'translateY(32px)',
                  transitionDelay: `${idx * 120}ms`,
                  transitionProperty: 'opacity, transform',
                  transitionDuration: '600ms',
                }}
              >
                {/* Glow on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${step.glow} 0%, transparent 70%)` }}
                />

                {/* Top accent line */}
                <div
                  className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)` }}
                />

                {/* Number */}
                <span className="absolute right-5 top-5 font-mono text-xs text-muted-foreground">
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300"
                  style={{
                    borderColor: `${step.accent}33`,
                    background: `${step.accent}11`,
                    color: step.accent,
                  }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>

                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>

                {/* Bottom connector arrow (not on last) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-px bg-border" />
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent"
                      style={{ borderLeftColor: 'var(--border)' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Stats row */}
        <div
          className="mt-10 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-muted/40 overflow-hidden transition-all duration-700"
          style={{
            opacity: sectionInView ? 1 : 0,
            transform: sectionInView ? 'translateY(0)' : 'translateY(24px)',
            transitionDelay: '400ms',
          }}
        >
          {[
            { label: 'Reports filed', value: 1284 },
            { label: 'Issues resolved', value: 947 },
            { label: 'Avg. response (hrs)', value: 48 },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center py-5 px-4">
              <span className="text-2xl sm:text-3xl font-bold text-foreground font-mono tabular-nums">
                <AnimatedCounter target={value} />
              </span>
              <span className="text-xs text-muted-foreground mt-1 text-center">{label}</span>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div
          className="mt-10 overflow-hidden rounded-2xl border border-border bg-muted shadow-2xl transition-all duration-700"
          style={{
            opacity: sectionInView ? 1 : 0,
            transform: sectionInView ? 'translateY(0)' : 'translateY(32px)',
            transitionDelay: '550ms',
          }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left panel */}
            <div className="flex-shrink-0 p-7 lg:w-72 border-b lg:border-b-0 lg:border-r border-border">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-500 mb-3">
                Live Data
              </p>
              <p className="text-lg font-bold text-foreground leading-tight">
                Cuttack Infrastructure Map
              </p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Real-time issues reported across Cuttack. AI optimizes repair routes automatically.
              </p>

              <div className="mt-8 space-y-2">
                {[
                  { color: '#ef4444', label: 'High Priority', sublabel: 'Badambadi', pulse: true },
                  { color: '#f59e0b', label: 'In Progress', sublabel: 'Jagatpur', pulse: false },
                  { color: '#10b981', label: 'Resolved', sublabel: 'Link Road', pulse: false },
                ].map(({ color, label, sublabel, pulse }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50 border border-border hover:border-muted-foreground/30 transition-colors"
                  >
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      {pulse && (
                        <span
                          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      <span
                        className="relative inline-flex rounded-full h-2.5 w-2.5"
                        style={{ backgroundColor: color }}
                      />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{sublabel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="relative min-h-[320px] flex-1">
              <MapPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}