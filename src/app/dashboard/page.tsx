'use client'

import { useRouter } from 'next/navigation'
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Activity,
  Target,
  Briefcase
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()

  const stats = [
    {
      title: 'Total Investors',
      value: '0',
      change: '+0%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Active Partners',
      value: '0',
      change: '+0%',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Upcoming Events',
      value: '0',
      change: '+0',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Funding Opportunities',
      value: '0',
      change: '+0',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ]

  const quickActions = [
    {
      title: 'Add Investor',
      description: 'Track a new potential investor',
      icon: Users,
      href: '/investors/new',
      color: 'text-blue-600',
    },
    {
      title: 'New Partner',
      description: 'Add a BaaS or financial partner',
      icon: Building2,
      href: '/partners/new',
      color: 'text-green-600',
    },
    {
      title: 'Log Engagement',
      description: 'Record investor interaction',
      icon: Activity,
      href: '/investors',
      color: 'text-purple-600',
    },
    {
      title: 'Import Data',
      description: 'Bulk import from CSV',
      icon: Target,
      href: '/investors?import=true',
      color: 'text-orange-600',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your investor pipeline.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <p className={`text-xs mt-1 ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.title}
                  onClick={() => router.push(action.href)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow text-left"
                >
                  <Icon className={`w-8 h-8 ${action.color} mb-3`} />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {action.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recent Activity & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Button variant="outline" size="sm" onClick={() => router.push('/investors')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No recent activity
              </p>
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Reminders
              </h2>
              <Button variant="outline" size="sm" onClick={() => router.push('/events')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No upcoming reminders
              </p>
            </div>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pipeline Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { stage: 'Not Contacted', count: 0, color: 'bg-gray-200' },
              { stage: 'Initial Outreach', count: 0, color: 'bg-blue-200' },
              { stage: 'In Discussion', count: 0, color: 'bg-yellow-200' },
              { stage: 'Due Diligence', count: 0, color: 'bg-green-200' },
            ].map((item) => (
              <div key={item.stage} className="text-center">
                <div className={`h-24 ${item.color} rounded-lg flex items-center justify-center mb-2`}>
                  <span className="text-2xl font-bold text-gray-700">{item.count}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}