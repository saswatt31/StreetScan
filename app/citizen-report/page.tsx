'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UploadCard } from '@/components/citizen-report/upload-card'
import {
  DetectionPreview,
  type DetectionResult,
} from '@/components/citizen-report/detection-preview'
import { LocationForm, type LocationData } from '@/components/citizen-report/location-form'
import { locationDataToReport, saveReport } from '@/lib/issues'

type SubmissionStep = 'idle' | 'submitted' | 'error'

export default function CitizenReportPage() {
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null)
  const [detectionLoading, setDetectionLoading] = useState(false)
  const [detectionError, setDetectionError] = useState<string | null>(null)
  const [submissionState, setSubmissionState] = useState<SubmissionStep>('idle')
  const [submitError, setSubmitError] = useState('')

  const runDetection = useCallback(async (file: File) => {
    setDetectionLoading(true)
    setDetectionError(null)
    setDetectionResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/detect-potholes', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Detection failed')
      }
      setDetectionResult({
        detections: data.detections ?? [],
        annotated_image_base64: data.annotated_image_base64 ?? null,
        pothole_count: data.pothole_count ?? 0,
      })
    } catch (err) {
      setDetectionError(
        err instanceof Error ? err.message : 'Could not run pothole detection. You can still submit your report.'
      )
      setDetectionResult(null)
    } finally {
      setDetectionLoading(false)
    }
  }, [])

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(preview)
    setSelectedFile(file)
    setDetectionResult(null)
    setDetectionError(null)
    if (file.size > 0) {
      runDetection(file)
    }
  }

  const handleFormSubmit = async (formData: LocationData) => {
    try {
      // Convert form data to report format
      const potholeCount = detectionResult?.pothole_count ?? 0
      const report = locationDataToReport(formData, potholeCount)
      
      // Save to localStorage (this also dispatches the storage-update event)
      saveReport(report)
      
      setSubmissionState('submitted')
      
      console.log('Report submitted:', report, {
        hasImage: !!selectedFile,
        detectionCount: potholeCount,
      })
    } catch (error) {
      setSubmissionState('error')
      setSubmitError(error instanceof Error ? error.message : 'Submission failed')
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
            Report Infrastructure Issue
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload a photo of the road. Our pothole detection will analyze it, then you can submit the report.
          </p>
        </div>
      </header>

      {submissionState === 'submitted' && (
        <div className="mx-auto max-w-4xl px-6 sm:px-8 py-16">
          <div className="rounded-lg border border-border bg-background p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <CheckCircle2 className="w-8 h-8 text-background" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Report Submitted Successfully
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you for helping us maintain our infrastructure. Your report has been received and will be reviewed by our maintenance team.
              </p>
            </div>
            <div className="pt-6">
              {/* Added transition, hover scale, and shadow */}
              <div className='max-w-fit rounded-md mx-auto border border-border transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 p-4 text-center'>
                <Link href="/">
                  {/* Added w-full to make the button fill the container */}
                  <Button className="w-full transition-colors active:scale-95">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {submissionState === 'idle' && (
        <div className="mx-auto max-w-4xl px-6 sm:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-heading font-bold text-foreground">
                  Step 1: Upload Photo
                </h2>
                <p className="text-sm text-muted-foreground">
                  Take or upload a clear photo of the road or pothole
                </p>
              </div>

              <UploadCard
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
              />

          <div className="space-y-4">
  <div className="space-y-2">
    <h3 className="text-lg font-heading font-bold text-foreground">
      Step 2: Pothole Detection
    </h3>
    <p className="text-sm text-muted-foreground">
      {selectedImage
        ? 'YOLO-based detection has analyzed your image. Results are below.'
        : 'Upload a photo above to run AI pothole detection.'}
    </p>
  </div>
  <DetectionPreview
    imageUrl={selectedImage}
    detectionResult={detectionResult}
    isLoading={detectionLoading}
    error={detectionError}
  />
</div>
            </div>

            <div className="space-y-6">
              <div className="sticky top-6 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-heading font-bold text-foreground">
                    Step 3: Your Details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Help us locate and contact you about this issue
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-foreground text-sm">
                        Important
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Please provide accurate location information so our team can address this issue promptly.
                      </p>
                    </div>
                  </div>
                </div>

                <LocationForm onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </div>
      )}

      {submissionState === 'error' && (
        <div className="mx-auto max-w-4xl px-6 sm:px-8 py-16">
          <div className="rounded-lg border border-border bg-card p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Submission Failed
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {submitError || 'There was an error submitting your report. Please try again.'}
              </p>
            </div>
            <div className="pt-6">
              <Button
                onClick={() => setSubmissionState('idle')}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
