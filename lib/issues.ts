/**
 * Shared types and utilities for StreetScan issue reporting
 */

export interface Issue {
  id: string
  lat: number
  lng: number
  severity: 'high' | 'medium' | 'low'
  type: string
  address: string
}

export interface CitizenReport {
  id: string
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
  severity: 'high' | 'medium' | 'low'
  type: string
  timestamp: string
  status: 'pending' | 'in_progress' | 'resolved'
  source: 'citizen' | 'drone' | 'government_vehicle'
}

/**
 * Base dummy data for Cuttack issues
 */
export const CUTTACK_ISSUES: Issue[] = [
  { id: 'CTC-006', lat: 20.4285, lng: 85.8340, severity: 'high', type: 'Pothole', address: 'Trisulia Bridge Entry Point' },
  { id: 'CTC-007', lat: 20.4150, lng: 85.8210, severity: 'medium', type: 'Street Light Out', address: 'Sri Sri University Main Gate Road' },
  { id: 'CTC-008', lat: 20.4020, lng: 85.8550, severity: 'high', type: 'Water Logging', address: 'Metro Satellite City Entrance' },
  { id: 'CTC-009', lat: 20.4410, lng: 85.8620, severity: 'low', type: 'Garbage Dump', address: 'Netaji Subhash Chandra Bose Setu' },
  { id: 'CTC-010', lat: 20.4855, lng: 85.9230, severity: 'high', type: 'Road Crack', address: 'Jagatpur Industrial Estate Lane 2' },
  { id: 'CTC-011', lat: 20.4610, lng: 85.8720, severity: 'medium', type: 'Broken Divider', address: 'Ranihat Canal Road' },
  { id: 'CTC-012', lat: 20.4520, lng: 85.8980, severity: 'low', type: 'Stray Animal Zone', address: 'Khannagar Park Road' },
  { id: 'CTC-013', lat: 20.4780, lng: 85.8450, severity: 'high', type: 'Pothole', address: 'Bidanasi Housing Board Road' },
  { id: 'CTC-014', lat: 20.4680, lng: 85.8820, severity: 'medium', type: 'Manhole Open', address: 'Chandi Chowk Junction' },
  { id: 'CTC-015', lat: 20.4350, lng: 85.8280, severity: 'high', type: 'Dust Pollution', address: 'Naraj Road near Godi Sahi' }
]

/**
 * LocalStorage key for citizen reports
 */
export const STORAGE_KEY = 'cuttack_issues'

/**
 * Get all reports from localStorage
 */
export function getStoredReports(): CitizenReport[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Save a new report to localStorage
 */
export function saveReport(report: CitizenReport): void {
  if (typeof window === 'undefined') return
  const reports = getStoredReports()
  reports.push(report)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  // Dispatch event to notify other tabs/pages
  window.dispatchEvent(new CustomEvent('storage-update', { detail: reports }))
}

/**
 * Convert LocationData to CitizenReport format
 */
export function locationDataToReport(
  data: any,
  detectionCount: number = 0
): CitizenReport {
  // Determine severity based on detection count
  let severity: 'high' | 'medium' | 'low' = 'medium'
  if (detectionCount >= 3) severity = 'high'
  else if (detectionCount === 0) severity = 'low'

  // Determine type based on detection
  let type = 'Pothole'
  if (detectionCount > 0) type = 'Pothole'

  return {
    id: `CIT-${Date.now()}`,
    address: data.address,
    landmark: data.landmark,
    city: data.city,
    district: data.district,
    state: data.state,
    zipCode: data.zipCode,
    latitude: data.latitude,
    longitude: data.longitude,
    isAnonymous: data.isAnonymous,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail,
    description: data.description,
    severity,
    type,
    timestamp: new Date().toISOString(),
    status: 'pending' as const,
    source: 'citizen' as const
  }
}

/**
 * Convert Issue to CitizenReport format for consistency
 */
export function issueToReport(issue: Issue): CitizenReport {
  return {
    id: issue.id,
    address: issue.address,
    landmark: '',
    city: 'Cuttack',
    district: 'Cuttack',
    state: 'Odisha',
    zipCode: '',
    latitude: issue.lat,
    longitude: issue.lng,
    isAnonymous: true,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    description: '',
    severity: issue.severity,
    type: issue.type,
    timestamp: new Date().toISOString(),
    status: 'pending' as const,
    source: 'citizen' as const
  }
}
