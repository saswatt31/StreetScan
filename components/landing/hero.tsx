'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

function useInView(threshold = 0.1) {
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

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(target / 50)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 25)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{count.toLocaleString()}{suffix}</span>
}

function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full animate-pulse
        bg-amber-500/20 dark:bg-amber-400/30"
      style={style}
    />
  )
}

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    const handle = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  const particles = [
    { width: 6,  height: 6,  top: '18%', left: '12%',  animationDelay: '0s',   animationDuration: '3s'   },
    { width: 4,  height: 4,  top: '65%', left: '8%',   animationDelay: '1s',   animationDuration: '4s'   },
    { width: 8,  height: 8,  top: '30%', right: '10%', animationDelay: '0.5s', animationDuration: '3.5s' },
    { width: 5,  height: 5,  top: '75%', right: '15%', animationDelay: '1.5s', animationDuration: '2.8s' },
    { width: 3,  height: 3,  top: '50%', left: '20%',  animationDelay: '2s',   animationDuration: '4.5s' },
    { width: 6,  height: 6,  top: '20%', right: '25%', animationDelay: '0.8s', animationDuration: '3.2s' },
  ]

  return (
    <section className="relative overflow-hidden bg-transparent pt-28 pb-20 sm:pt-40 sm:pb-32 min-h-screen flex items-center">

      {/* ─── Vignette overlay ─────────────────────────────────────────────────
          Light mode: soft white wash around edges so the photo doesn't fight
          the light foreground text.
          Dark mode: dark vignette as before.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          background:
'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.10) 60%, rgba(255,255,255,0.40) 100%)'        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Mouse-tracking glow */}
      {mounted && (
        <div
          className="pointer-events-none absolute z-0 rounded-full transition-all duration-700 ease-out
            opacity-10 dark:opacity-20"
          style={{
            width: 600,
            height: 600,
            left: mousePos.x - 300,
            top: mousePos.y - 300,
            background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Center glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[700px]
          opacity-10 dark:opacity-20"
        style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.8) 0%, transparent 65%)' }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <Particle
          key={i}
          style={{
            width: p.width,
            height: p.height,
            top: p.top,
            left: (p as any).left,
            right: (p as any).right,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 w-full">
        <div className="text-center space-y-8">

          {/* ── Badge ────────────────────────────────────────────────────────── */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm backdrop-blur-md
              border border-foreground/20 bg-background/60 text-foreground
              transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-12px)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Government Infrastructure Platform
          </div>

          {/* ── Headline ─────────────────────────────────────────────────────── */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '100ms',
            }}
          >
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl">
              {/* In light mode: dark solid text; in dark mode: light solid text */}
              <span className="text-foreground drop-shadow-sm dark:drop-shadow-lg">
                Street
              </span>
              {/* Amber outline letter — readable on both bg tones */}
              <span
                className="dark:drop-shadow-lg"
                style={{
                  WebkitTextStroke: '2px #f59e0b',
                  color: 'transparent',
                }}
              >
                Scan
              </span>
            </h1>

            {/* Amber divider */}
            <div
              className="mx-auto mt-3 h-px w-24 transition-all duration-1000"
              style={{
                background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
                opacity: mounted ? 1 : 0,
                transitionDelay: '600ms',
              }}
            />
          </div>

          {/* ── Subheading ───────────────────────────────────────────────────── */}
          <p
            className="max-w-xl mx-auto text-base leading-relaxed sm:text-lg
              text-foreground/70 dark:text-muted-foreground
              transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '200ms',
            }}
          >
            Report issues, track fixes, and keep your city safe.{' '}
            <span className="text-foreground font-medium">
              Real-time AI monitoring
            </span>{' '}
            for agencies and citizens.
          </p>

          {/* ── CTAs ─────────────────────────────────────────────────────────── */}
          <div
            className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-center transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '300ms',
            }}
          >
            <Link href="/citizen-report">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8
                  bg-amber-500 hover:bg-amber-400
                  text-black font-semibold
                  shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50
                  transition-all duration-200 hover:scale-105"
              >
                Report an Issue
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button
                size="lg"
                 variant="ghost"
                className="w-full sm:w-auto rounded-full px-8 backdrop-blur-sm
                  border-foreground/80 text-foreground
                  hover:border-foreground/20 hover:bg-foreground/10
                  transition-all duration-200"
              >
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* ── Stats ────────────────────────────────────────────────────────── */}
          <div
            className="grid grid-cols-3 gap-0 pt-16 sm:pt-20 divide-x
              divide-foreground/10
              border border-foreground/10 rounded-2xl overflow-hidden
              bg-background/50 dark:bg-black/30
              backdrop-blur-md
              transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: '450ms',
            }}
          >
            {[
              { target: 2450, suffix: '+', label: 'Reports filed' },
              { target: 340,  suffix: '+', label: 'Issues resolved' },
              { target: 45,   suffix: '',  label: 'Active areas' },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="relative group py-6 px-4 flex flex-col items-center overflow-hidden">
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-2xl sm:text-3xl font-bold tabular-nums font-mono text-foreground drop-shadow-sm">
                  <AnimatedCounter target={target} suffix={suffix} />
                </div>
                <div className="text-xs text-foreground/50 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* ── Scroll indicator ─────────────────────────────────────────────── */}
          <div
            className="flex justify-center pt-4 transition-all duration-700"
            style={{ opacity: mounted ? 1 : 0, transitionDelay: '700ms' }}
          >
            <div className="flex flex-col items-center gap-1 text-foreground/40">
              <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-foreground/40 to-transparent animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}