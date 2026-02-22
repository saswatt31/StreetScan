'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, User, FileText, Send, EyeOff, Eye, Landmark } from 'lucide-react'

interface LocationFormProps {
  onSubmit: (data: LocationData) => void
  isLoading?: boolean
}

export interface LocationData {
  address: string
  landmark: string
  city: string
  district: string
  state: string
  zipCode: string
  latitude: number | ''
  longitude: number | ''
  isAnonymous: boolean
  contactName: string
  contactPhone: string
  contactEmail: string
  description: string
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

export function LocationForm({ onSubmit, isLoading = false }: LocationFormProps) {
  const [formData, setFormData] = useState<LocationData>({
    address: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    isAnonymous: false,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    description: '',
  })

  const [focused, setFocused] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAnonymousToggle = () => {
    setFormData((prev) => ({
      ...prev,
      isAnonymous: !prev.isAnonymous,
      // Clear contact fields when switching to anonymous
      ...(!prev.isAnonymous ? { contactName: '', contactPhone: '', contactEmail: '' } : {}),
    }))
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

  const selectClass = (name: string) =>
    `w-full rounded-lg border bg-background text-foreground text-sm px-3 py-2.5 focus:outline-none transition-all duration-150 ${
      focused === name
        ? 'border-foreground ring-1 ring-foreground/30'
        : 'border-border'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Anonymous Toggle Banner */}
      <div
        onClick={handleAnonymousToggle}
        className={`relative flex items-center justify-between gap-3 rounded-xl border p-4 cursor-pointer select-none transition-all duration-200 ${
          formData.isAnonymous
            ? 'border-foreground/40 bg-foreground/5 ring-1 ring-foreground/20'
            : 'border-border bg-muted/30 hover:border-foreground/20 hover:bg-muted/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 ${
            formData.isAnonymous ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
          }`}>
            {formData.isAnonymous ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {formData.isAnonymous ? 'Reporting Anonymously' : 'Report Anonymously?'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formData.isAnonymous
                ? 'Your identity will not be stored or shared.'
                : 'Toggle to hide your personal information from the report.'}
            </p>
          </div>
        </div>

        {/* Toggle pill */}
        <div className={`relative flex-shrink-0 w-11 h-6 rounded-full border-2 transition-colors duration-200 ${
          formData.isAnonymous ? 'bg-foreground border-foreground' : 'bg-muted border-border'
        }`}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
            formData.isAnonymous
              ? 'left-[calc(100%-1.125rem)] bg-background'
              : 'left-0.5 bg-muted-foreground/50'
          }`} />
        </div>
      </div>

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

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-muted-foreground" />
            Nearby Landmark <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            onFocus={() => setFocused('landmark')}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Near City Hospital gate, Opposite bus stand…"
            className={inputClass('landmark')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">City / Town <span className="text-destructive">*</span></label>
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
            <label className="block text-sm font-medium text-foreground mb-1.5">District <span className="text-destructive">*</span></label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              onFocus={() => setFocused('district')}
              onBlur={() => setFocused(null)}
              placeholder="District name"
              className={inputClass('district')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              State <span className="text-destructive">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              onFocus={() => setFocused('state')}
              onBlur={() => setFocused(null)}
              required
              className={selectClass('state')}
            >
              <option value="" disabled>Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Zip / PIN Code <span className="text-destructive">*</span></label>
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

      {/* Contact Section — hidden when anonymous */}
      <div className={`space-y-3 transition-all duration-300 overflow-hidden ${
        formData.isAnonymous ? 'opacity-0 max-h-0 pointer-events-none' : 'opacity-100 max-h-[600px]'
      }`}>
        <div className="flex items-center gap-2 pb-1 border-b border-border">
          <User className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Your Information</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Full Name {!formData.isAnonymous && <span className="text-destructive">*</span>}
          </label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            onFocus={() => setFocused('contactName')}
            onBlur={() => setFocused(null)}
            required={!formData.isAnonymous}
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
              <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email{' '}
              {!formData.isAnonymous && <span className="text-destructive">*</span>}
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              onFocus={() => setFocused('contactEmail')}
              onBlur={() => setFocused(null)}
              required={!formData.isAnonymous}
              placeholder="your@email.com"
              className={inputClass('contactEmail')}
            />
          </div>
        </div>
      </div>

      {/* Anonymous notice shown instead of contact form */}
      {formData.isAnonymous && (
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted px-4 py-3">
          <EyeOff className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            You're reporting anonymously. No personal information will be collected or linked to this report. 
            Note that we won't be able to follow up with you on this submission.
          </p>
        </div>
      )}

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

      <div className="pt-6">
        <div className="w-fit mx-auto rounded-xl border border-border p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-card">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 transition-transform active:scale-95"
          >
            {formData.isAnonymous ? <EyeOff className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {isLoading ? 'Submitting...' : formData.isAnonymous ? 'Submit Anonymously' : 'Submit Report'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2 whitespace-nowrap px-2">
          {formData.isAnonymous
            ? 'This report will be submitted without any identifying information.'
            : <>Fields marked <span className="text-destructive">*</span> are required</>
          }
        </p>
      </div>

    </form>
  )
}
