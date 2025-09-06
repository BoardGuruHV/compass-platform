'use client'

import { useState, useEffect, useCallback } from 'react'
import { Investor, InvestorFilters } from '@/types/database'

interface UseInvestorsOptions {
  search?: string
  filters?: InvestorFilters
  page?: number
  limit?: number
}

export function useInvestors(options: UseInvestorsOptions = {}) {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(options.page || 1)
  const [total, setTotal] = useState(0)

  const fetchInvestors = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append('page', currentPage.toString())
      params.append('limit', (options.limit || 20).toString())
      
      if (options.search) {
        params.append('search', options.search)
      }

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              if (value.length > 0) {
                params.append(key, value.join(','))
              }
            } else {
              params.append(key, value.toString())
            }
          }
        })
      }

      const response = await fetch(`/api/investors?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch investors: ${response.statusText}`)
      }

      const data = await response.json()
      
      setInvestors(data.data || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error('Error fetching investors:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch investors')
    } finally {
      setLoading(false)
    }
  }, [currentPage, options.search, options.filters, options.limit])

  useEffect(() => {
    fetchInvestors()
  }, [fetchInvestors])

  const refresh = useCallback(() => {
    fetchInvestors()
  }, [fetchInvestors])

  return {
    investors,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    refresh,
  }
}