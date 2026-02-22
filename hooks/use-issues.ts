'use client'

import { useState, useEffect, useCallback } from 'react'
import { CUTTACK_ISSUES, getStoredReports, type Issue, type CitizenReport } from '@/lib/issues'

/**
 * Custom hook to manage issues state with localStorage sync
 * Automatically syncs across tabs using storage events
 */
export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [reports, setReports] = useState<CitizenReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = getStoredReports()
    setReports(stored)
    
    // Merge base issues with stored reports
    const allIssues: Issue[] = [
      ...CUTTACK_ISSUES,
      ...stored.map((r) => ({
        id: r.id,
        lat: typeof r.latitude === 'number' ? r.latitude : 20.4625,
        lng: typeof r.longitude === 'number' ? r.longitude : 85.8930,
        severity: r.severity,
        type: r.type,
        address: r.address
      }))
    ]
    setIssues(allIssues)
    setIsLoading(false)
  }, [])

  // Listen for storage updates from other tabs/pages
  useEffect(() => {
    const handleStorageUpdate = (event: StorageEvent | CustomEvent) => {
      let updatedReports: CitizenReport[]
      
      if ('detail' in event) {
        // Custom event from same tab
        updatedReports = event.detail as CitizenReport[]
      } else {
        // Storage event from other tab
        if (event.key !== 'cuttack_issues') return
        updatedReports = event.newValue ? JSON.parse(event.newValue) : []
      }
      
      setReports(updatedReports)
      
      const allIssues: Issue[] = [
        ...CUTTACK_ISSUES,
        ...updatedReports.map((r) => ({
          id: r.id,
          lat: typeof r.latitude === 'number' ? r.latitude : 20.4625,
          lng: typeof r.longitude === 'number' ? r.longitude : 85.8930,
          severity: r.severity,
          type: r.type,
          address: r.address
        }))
      ]
      setIssues(allIssues)
    }

    // Listen for custom events (same tab)
    window.addEventListener('storage-update', handleStorageUpdate as EventListener)
    
    // Listen for storage events (other tabs)
    window.addEventListener('storage', handleStorageUpdate as EventListener)

    return () => {
      window.removeEventListener('storage-update', handleStorageUpdate as EventListener)
      window.removeEventListener('storage', handleStorageUpdate as EventListener)
    }
  }, [])

  const addReport = useCallback((report: CitizenReport) => {
    setReports((prev) => {
      const updated = [...prev, report]
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cuttack_issues', JSON.stringify(updated))
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new CustomEvent('storage-update', { detail: updated }))
      }
      
      return updated
    })
  }, [])

  return {
    issues,
    reports,
    isLoading,
    addReport,
    refresh: () => {
      const stored = getStoredReports()
      setReports(stored)
      const allIssues: Issue[] = [
        ...CUTTACK_ISSUES,
        ...stored.map((r) => ({
          id: r.id,
          lat: typeof r.latitude === 'number' ? r.latitude : 20.4625,
          lng: typeof r.longitude === 'number' ? r.longitude : 85.8930,
          severity: r.severity,
          type: r.type,
          address: r.address
        }))
      ]
      setIssues(allIssues)
    }
  }
}

/**
 * Hook specifically for severity statistics
 */
export function useSeverityStats() {
  const { issues } = useIssues()
  
  const severityData = [
    { name: 'High Priority', value: issues.filter(i => i.severity === 'high').length, color: '#dc2626' },
    { name: 'Medium Priority', value: issues.filter(i => i.severity === 'medium').length, color: '#d97706' },
    { name: 'Low Priority', value: issues.filter(i => i.severity === 'low').length, color: '#059669' },
  ]
  
  const stats = {
    total: issues.length,
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    low: issues.filter(i => i.severity === 'low').length,
  }
  
  return { severityData, stats }
}
