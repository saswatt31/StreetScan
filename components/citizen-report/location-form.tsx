'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, User, FileText, Send } from 'lucide-react'

interface LocationFormProps {
  onSubmit: (data: LocationData) => void
  isLoading?: boolean
}

export interface LocationData {
  address: string
  city: string
  zipCode: string
  latitude: number | ''
  longitude: number | ''
  contactName: string
  contactPhone: string
  contactEmail: string
  description: string
}

export function LocationForm({ onSubmit, isLoading = false }: LocationFormProps) {
  const [formData, setFormData] = useState<LocationData>({
    address: '',
    city: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    description: '',
  })

  const [focused, setFocused] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const inputClass = (name: string) =>
    `w-full rounded-lg border bg-background text-foreground text-sm px-3 py-2.5 placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-150 ${
      focused === name
        ? 'border-foreground ring-1 ring-foreground/30'
        : 'border-border'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Location Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-border">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Location Details</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Street Address <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onFocus={() => setFocused('address')}
            onBlur={() => setFocused(null)}
            required
            placeholder="Street name or road where issue was found"
            className={inputClass('address')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onFocus={() => setFocused('city')}
              onBlur={() => setFocused(null)}
              placeholder="City or town"
              className={inputClass('city')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Zip / PIN Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              onFocus={() => setFocused('zipCode')}
              onBlur={() => setFocused(null)}
              placeholder="Postal code"
              className={inputClass('zipCode')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Latitude</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              onFocus={() => setFocused('latitude')}
              onBlur={() => setFocused(null)}
              step="0.0001"
              placeholder="e.g. 20.2961"
              className={inputClass('latitude')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Longitude</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              onFocus={() => setFocused('longitude')}
              onBlur={() => setFocused(null)}
              step="0.0001"
              placeholder="e.g. 85.8245"
              className={inputClass('longitude')}
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-border">
          <User className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Your Information</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            onFocus={() => setFocused('contactName')}
            onBlur={() => setFocused(null)}
            required
            placeholder="Your full name"
            className={inputClass('contactName')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              onFocus={() => setFocused('contactPhone')}
              onBlur={() => setFocused(null)}
              placeholder="+91 00000 00000"
              className={inputClass('contactPhone')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              onFocus={() => setFocused('contactEmail')}
              onBlur={() => setFocused(null)}
              required
              placeholder="your@email.com"
              className={inputClass('contactEmail')}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-border">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Additional Details</h3>
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onFocus={() => setFocused('description')}
          onBlur={() => setFocused(null)}
          rows={3}
          placeholder="How long has this been there? Traffic impact? Any other details..."
          className={inputClass('description') + ' resize-none'}
        />
      </div>

      <div className="pt-1">
        <Button type="submit" disabled={isLoading} className="w-full gap-2">
          <Send className="w-4 h-4" />
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Fields marked <span className="text-destructive">*</span> are required
        </p>
      </div>
    </form>
  )
}