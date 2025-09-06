import { 
  Investor, 
  InvestorContact, 
  EngagementHistory,
  InvestorDocument,
  InvestorNote 
} from './database'

// Extended investor type with relationships
export interface InvestorWithRelations extends Investor {
  contacts?: InvestorContact[]
  engagement_history?: EngagementHistory[]
  documents?: InvestorDocument[]
  notes?: InvestorNote[]
}

// Form data types
export interface InvestorFormData {
  name: string
  type: 'debt' | 'equity' | 'grant' | 'hybrid'
  website?: string
  description?: string
  investment_size_min?: number
  investment_size_max?: number
  regions: string[]
  sectors: string[]
  stage_focus: string[]
  tags: string[]
  logo_url?: string
  founded_year?: number
  aum?: number
  investment_thesis?: string
  preferred_contact_method?: string
}

export interface ContactFormData {
  name: string
  title?: string
  email?: string
  phone?: string
  linkedin?: string
  twitter?: string
  notes?: string
  is_primary: boolean
}

export interface EngagementFormData {
  investor_id: string
  contact_id?: string
  date: string
  type: 'email' | 'call' | 'meeting' | 'conference' | 'introduction' | 'follow_up' | 'document_shared'
  subject?: string
  notes?: string
  outcome?: string
  next_steps?: string
  reminder_date?: string
}

// Import/Export types
export interface InvestorImportRow {
  name: string
  type: string
  website?: string
  description?: string
  investment_size_min?: string
  investment_size_max?: string
  regions?: string
  sectors?: string
  stage_focus?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  contact_title?: string
}

export interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: ImportError[]
}

export interface ImportError {
  row: number
  field: string
  message: string
  data?: any
}

// Analytics types
export interface InvestorMetrics {
  total_investors: number
  by_type: Record<string, number>
  by_stage: Record<string, number>
  by_region: Record<string, number>
  by_sector: Record<string, number>
  by_engagement_status: Record<string, number>
  recent_engagements: number
  upcoming_reminders: number
}

export interface EngagementMetrics {
  total_engagements: number
  by_type: Record<string, number>
  by_month: Array<{
    month: string
    count: number
  }>
  average_response_time: number
  conversion_rate: number
}