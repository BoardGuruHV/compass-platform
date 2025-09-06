'use client'

import { Investor } from '@/types/database'
import { Building2, MapPin, DollarSign, ExternalLink, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface InvestorCardProps {
  investor: Investor
  onClick: () => void
}

export function InvestorCard({ investor, onClick }: InvestorCardProps) {
  const getEngagementStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      not_contacted: 'bg-gray-100 text-gray-700',
      initial_outreach: 'bg-blue-100 text-blue-700',
      in_discussion: 'bg-yellow-100 text-yellow-700',
      due_diligence: 'bg-purple-100 text-purple-700',
      term_sheet: 'bg-indigo-100 text-indigo-700',
      closed_deal: 'bg-green-100 text-green-700',
      passed: 'bg-red-100 text-red-700',
      no_response: 'bg-gray-100 text-gray-500',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount}`
  }

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {investor.logo_url ? (
              <img
                src={investor.logo_url}
                alt={investor.name}
                className="w-12 h-12 rounded-lg mr-3"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {investor.name}
              </h3>
              <span className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1',
                investor.type === 'debt' ? 'bg-orange-100 text-orange-700' :
                investor.type === 'equity' ? 'bg-blue-100 text-blue-700' :
                investor.type === 'grant' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              )}>
                {investor.type}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              // Handle menu
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Description */}
        {investor.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {investor.description}
          </p>
        )}

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>
              {formatCurrency(investor.investment_size_min)} - {formatCurrency(investor.investment_size_max)}
            </span>
          </div>
          {investor.regions.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{investor.regions.slice(0, 2).join(', ')}</span>
              {investor.regions.length > 2 && (
                <span className="ml-1">+{investor.regions.length - 2}</span>
              )}
            </div>
          )}
        </div>

        {/* Sectors */}
        {investor.sectors.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {investor.sectors.slice(0, 3).map((sector) => (
              <span
                key={sector}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
              >
                {sector}
              </span>
            ))}
            {investor.sectors.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                +{investor.sectors.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getEngagementStatusColor(investor.engagement_status)
          )}>
            {investor.engagement_status.replace(/_/g, ' ')}
          </span>
          {investor.website && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                window.open(investor.website!, '_blank')
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}