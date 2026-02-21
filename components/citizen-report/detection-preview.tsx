'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Zap, Loader2, TriangleAlert } from 'lucide-react'

export interface ApiDetection {
  class: string
  confidence: number
  bbox: [number, number, number, number]
  severity: 'low' | 'medium' | 'high'
  urgency: string
  description: string
  priority: number
  area_px: number
}

export interface DetectionSummary {
  overall_severity: 'none' | 'low' | 'medium' | 'high'
  overall_urgency: string
  high_count: number
  medium_count: number
  low_count: number
}

export interface DetectionResult {
  detections: ApiDetection[]
  annotated_image_base64: string | null
  pothole_count: number
  summary?: DetectionSummary
}

interface DetectionPreviewProps {
  imageUrl: string
  detectionResult?: DetectionResult | null
  isLoading?: boolean
  error?: string | null
}

const severityConfig = {
  high: {
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.08)',
    border: 'rgba(220, 38, 38, 0.3)',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    label: 'High Severity',
    Icon: AlertCircle,
  },
  medium: {
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.08)',
    border: 'rgba(217, 119, 6, 0.3)',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    label: 'Medium Severity',
    Icon: Zap,
  },
  low: {
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.08)',
    border: 'rgba(5, 150, 105, 0.3)',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    label: 'Low Severity',
    Icon: CheckCircle2,
  },
}

export function DetectionPreview({
  imageUrl,
  detectionResult = null,
  isLoading = false,
  error = null,
}: DetectionPreviewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const detections = detectionResult?.detections ?? []
  const summary = detectionResult?.summary
  const displayUrl = detectionResult?.annotated_image_base64 || imageUrl

  return (
    <div className="space-y-4">
      {/* Annotated Image */}
      <div className="relative rounded-lg overflow-hidden border border-border bg-background/50">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="text-sm font-medium">Detecting potholes…</p>
            </div>
          </div>
        )}
        {displayUrl && (
          <img
            src={displayUrl}
            alt="Detection result"
            className="w-full h-auto max-h-[500px] object-contain"
          />
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Overall Summary Card */}
      {summary && detections.length > 0 && (
        <div
          className="rounded-lg border p-4 space-y-2"
          style={{
            background: (severityConfig[summary.overall_severity as 'low' | 'medium' | 'high'] ?? severityConfig.low).bg,
            borderColor: (severityConfig[summary.overall_severity as 'low' | 'medium' | 'high'] ?? severityConfig.low).border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TriangleAlert className="w-4 h-4" style={{ color: severityConfig[summary.overall_severity as 'low' | 'medium' | 'high']?.color }} />
              <span className="font-semibold text-foreground text-sm">Road Condition Report</span>
            </div>
            <span
              className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded"
              style={{
                color: severityConfig[summary.overall_severity as 'low' | 'medium' | 'high']?.color,
                background: severityConfig[summary.overall_severity as 'low' | 'medium' | 'high']?.bg,
              }}
            >
              {summary.overall_severity} risk
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{summary.overall_urgency}</p>
          <div className="flex gap-3 text-xs text-muted-foreground pt-1">
            {summary.high_count > 0 && <span className="text-red-500 font-medium">{summary.high_count} high</span>}
            {summary.medium_count > 0 && <span className="text-amber-500 font-medium">{summary.medium_count} medium</span>}
            {summary.low_count > 0 && <span className="text-emerald-500 font-medium">{summary.low_count} low</span>}
            <span>· {detections.length} total pothole{detections.length !== 1 ? 's' : ''} detected</span>
          </div>
        </div>
      )}

      {/* Per-detection Cards */}
      {detections.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-foreground text-sm">Detection Details</h3>
          <div className="space-y-2">
            {detections.map((d, idx) => {
              const cfg = severityConfig[d.severity] ?? severityConfig['low']
              const Icon = cfg.Icon
              const id = `det-${idx}`
              const isOpen = selectedId === id

              return (
                <div
                  key={id}
                  className="rounded-lg border overflow-hidden transition-all duration-200"
                  style={{ borderColor: isOpen ? cfg.color : undefined }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(isOpen ? null : id)}
                    className="w-full text-left p-3 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground text-sm capitalize">{idx + 1}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Confidence: {(d.confidence * 100).toFixed(1)}% · {d.urgency}
                        </p>
                      </div>
                    </div>
                    <Icon className="w-4 h-4 shrink-0" style={{ color: cfg.color }} />
                  </button>

                  {isOpen && (
                    <div
                      className="px-4 pb-4 pt-2 space-y-3 text-sm border-t"
                      style={{ background: cfg.bg, borderColor: cfg.border }}
                    >
                      <p className="text-muted-foreground">{d.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded bg-background/60 px-3 py-2">
                          <p className="text-muted-foreground">Confidence</p>
                          <p className="font-semibold text-foreground">{(d.confidence * 100).toFixed(1)}%</p>
                        </div>
                        <div className="rounded bg-background/60 px-3 py-2">
                          <p className="text-muted-foreground">Detection Area</p>
                          <p className="font-semibold text-foreground">{d.area_px.toLocaleString()} px²</p>
                        </div>
                        <div className="rounded bg-background/60 px-3 py-2 col-span-2">
                          <p className="text-muted-foreground">Recommended Action</p>
                          <p className="font-semibold text-foreground">{d.urgency}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {detections.length === 0 && !isLoading && !error && detectionResult && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground text-center">
          No potholes detected in this image. You can still submit your report.
        </div>
      )}
    </div>
  )
}
