'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  ChevronDown,
  MoreVertical,
  Building2,
  MapPin,
  DollarSign,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InvestorCard } from '@/components/features/investors/investor-card'
import { InvestorTable } from '@/components/features/investors/investor-table'
import { InvestorFilters } from '@/components/features/investors/investor-filters'
import { ImportModal } from '@/components/features/investors/import-modal'
import { useInvestors } from '@/hooks/use-investors'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function InvestorsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [showFilters, setShowFilters] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([])

  const {
    investors,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    refresh,
  } = useInvestors({ search: searchQuery, filters })

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedInvestors.length > 0) {
        params.append('ids', selectedInvestors.join(','))
      }
      
      const response = await fetch(`/api/investors/export?${params}`)
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `investors_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Investors
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage and track potential investors for your business
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowImportModal(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => router.push('/investors/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Investor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Investors"
            value="0"
            icon={Building2}
            change="+0%"
          />
          <StatsCard
            title="Active Discussions"
            value="0"
            icon={MapPin}
            change="+0%"
          />
          <StatsCard
            title="Total Funding"
            value="$0"
            icon={DollarSign}
            change="+0%"
          />
          <StatsCard
            title="Success Rate"
            value="0%"
            icon={Tag}
            change="+0%"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search investors by name, sector, or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            <div className="flex gap-2 border-l pl-4">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
            </div>
          </div>

          {showFilters && (
            <InvestorFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-red-600 dark:text-red-400">
            Error loading investors: {error}
          </div>
        ) : investors.length === 0 ? (
          <EmptyState onAddClick={() => router.push('/investors/new')} />
        ) : (
          <>
            {viewMode === 'table' ? (
              <InvestorTable
                investors={investors}
                selectedInvestors={selectedInvestors}
                onSelectInvestors={setSelectedInvestors}
                onInvestorClick={(id) => router.push(`/investors/${id}`)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investors.map((investor) => (
                  <InvestorCard
                    key={investor.id}
                    investor={investor}
                    onClick={() => router.push(`/investors/${investor.id}`)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <ImportModal
            onClose={() => setShowImportModal(false)}
            onImportComplete={() => {
              setShowImportModal(false)
              refresh()
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

function StatsCard({ title, value, icon: Icon, change }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
      <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No investors yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Get started by adding your first investor to track
      </p>
      <Button onClick={onAddClick}>
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Investor
      </Button>
    </div>
  )
}