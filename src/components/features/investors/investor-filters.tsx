'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InvestorFilters as IInvestorFilters } from '@/types/database'

interface InvestorFiltersProps {
  filters: IInvestorFilters
  onFiltersChange: (filters: IInvestorFilters) => void
}

export function InvestorFilters({ filters, onFiltersChange }: InvestorFiltersProps) {
  const [localFilters, setLocalFilters] = useState<IInvestorFilters>(filters)

  const investorTypes = ['debt', 'equity', 'grant', 'hybrid']
  const stages = ['pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth', 'late_stage']
  const statuses = [
    'not_contacted',
    'initial_outreach',
    'in_discussion',
    'due_diligence',
    'term_sheet',
    'closed_deal',
    'passed',
    'no_response',
  ]
  
  const commonRegions = ['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Global']
  const commonSectors = [
    'FinTech',
    'Healthcare',
    'Education',
    'Agriculture',
    'Energy',
    'Transportation',
    'E-commerce',
    'SaaS',
    'Mobile',
    'AI/ML',
    'Blockchain',
    'Clean Tech',
  ]

  const handleTypeToggle = (type: string) => {
    const currentTypes = localFilters.type || []
    const newTypes = currentTypes.includes(type as any)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type as any]
    setLocalFilters({ ...localFilters, type: newTypes as any })
  }

  const handleStageToggle = (stage: string) => {
    const currentStages = localFilters.stage_focus || []
    const newStages = currentStages.includes(stage as any)
      ? currentStages.filter(s => s !== stage)
      : [...currentStages, stage as any]
    setLocalFilters({ ...localFilters, stage_focus: newStages as any })
  }

  const handleStatusToggle = (status: string) => {
    const currentStatuses = localFilters.engagement_status || []
    const newStatuses = currentStatuses.includes(status as any)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status as any]
    setLocalFilters({ ...localFilters, engagement_status: newStatuses as any })
  }

  const handleRegionToggle = (region: string) => {
    const currentRegions = localFilters.regions || []
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter(r => r !== region)
      : [...currentRegions, region]
    setLocalFilters({ ...localFilters, regions: newRegions })
  }

  const handleSectorToggle = (sector: string) => {
    const currentSectors = localFilters.sectors || []
    const newSectors = currentSectors.includes(sector)
      ? currentSectors.filter(s => s !== sector)
      : [...currentSectors, sector]
    setLocalFilters({ ...localFilters, sectors: newSectors })
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
  }

  const clearFilters = () => {
    setLocalFilters({})
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(localFilters).some(key => {
    const value = localFilters[key as keyof IInvestorFilters]
    return Array.isArray(value) ? value.length > 0 : value !== undefined
  })

  return (
    <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-4">
      {/* Investor Type */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Investor Type
        </label>
        <div className="flex flex-wrap gap-2">
          {investorTypes.map(type => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                localFilters.type?.includes(type as any)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Investment Stage */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Investment Stage
        </label>
        <div className="flex flex-wrap gap-2">
          {stages.map(stage => (
            <button
              key={stage}
              onClick={() => handleStageToggle(stage)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                localFilters.stage_focus?.includes(stage as any)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {stage.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Regions */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Regions
        </label>
        <div className="flex flex-wrap gap-2">
          {commonRegions.map(region => (
            <button
              key={region}
              onClick={() => handleRegionToggle(region)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                localFilters.regions?.includes(region)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Sectors */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Sectors
        </label>
        <div className="flex flex-wrap gap-2">
          {commonSectors.map(sector => (
            <button
              key={sector}
              onClick={() => handleSectorToggle(sector)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                localFilters.sectors?.includes(sector)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Engagement Status */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Engagement Status
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => handleStatusToggle(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                localFilters.engagement_status?.includes(status as any)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Investment Size Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Min Investment Size
          </label>
          <input
            type="number"
            placeholder="e.g., 100000"
            value={localFilters.investment_size_min || ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              investment_size_min: e.target.value ? parseInt(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Max Investment Size
          </label>
          <input
            type="number"
            placeholder="e.g., 5000000"
            value={localFilters.investment_size_max || ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              investment_size_max: e.target.value ? parseInt(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
        >
          Clear All
        </Button>
        <Button onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}