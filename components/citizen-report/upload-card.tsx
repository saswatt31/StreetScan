'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadCardProps {
  onImageSelect: (file: File, preview: string) => void
  selectedImage: string | null
}

export function UploadCard({ onImageSelect, selectedImage }: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      onImageSelect(file, reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative rounded-lg border-2 border-dashed transition-colors duration-200 overflow-hidden ${
        isDragActive
          ? 'border-foreground/50 bg-muted/30'
          : 'border-border bg-card/50'
      }`}
    >
      {selectedImage ? (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Uploaded infrastructure image"
            className="w-full h-auto max-h-96 object-contain bg-background/50"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            onClick={() => {
              onImageSelect(new File([], ''), '')
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="p-12 text-center space-y-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              Drag and drop your image here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse from your device
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPG, PNG, WebP
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload infrastructure image"
      />
    </div>
  )
}
