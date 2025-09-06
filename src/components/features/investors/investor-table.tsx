'use client'

import { useState } from 'react'
import { Investor } from '@/types/database'
import { MoreVertical, ExternalLink, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface InvestorTableProps {
  investors: Investor[]
  selectedInvestors: string[]
  onSelectInvestors: (ids: string[]) => void
  onInvestorClick: (id: string) => void
}

export function InvestorTable({
  investors,
  selectedInvestors,
  onSelectInvestors,
  onInvestorClick,
}: InvestorTableProps) {
  const [sortField, setSortField] = useState<keyof Investor>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleSelectAll = () => {
    if (selectedInvestors.length === investors.length) {
      onSelectInvestors([])
    } else {
      onSelectInvestors(investors.map(i => i.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedInvestors.includes(id)) {
      onSelectInvestors(selectedInvestors.filter(i => i !== id))
    } else {
      onSelectInvestors([...selectedInvestors, id])
    }
  }

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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      debt: 'bg-orange-100 text-orange-700',
      equity: 'bg-blue-100 text-blue-700',
      grant: 'bg-green-100 text-green-700',
      hybrid: 'bg-purple-100 text-purple-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedInvestors.length === investors.length && investors.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Investment Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sectors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {investors.map((investor) => (
              <tr
                key={investor.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onInvestorClick(investor.id)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedInvestors.includes(investor.id)}
                    onChange={() => handleSelectOne(investor.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {investor.logo_url ? (
                      <img
                        src={investor.logo_url}
                        alt={investor.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {investor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {investor.name}
                      </div>
                      {investor.website && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {investor.website.replace(/^https?:\/\//, '')}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getTypeColor(investor.type)
                  )}>
                    {investor.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatCurrency(investor.investment_size_min)} - {formatCurrency(investor.investment_size_max)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {investor.sectors.slice(0, 2).map((sector) => (
                      <span
                        key={sector}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                      >
                        {sector}
                      </span>
                    ))}
                    {investor.sectors.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{investor.sectors.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getEngagementStatusColor(investor.engagement_status)
                  )}>
                    {investor.engagement_status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    {investor.website && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(investor.website!, '_blank')
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}