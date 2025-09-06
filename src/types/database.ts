export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      investors: {
        Row: {
          id: string
          name: string
          type: 'debt' | 'equity' | 'grant' | 'hybrid'
          website: string | null
          description: string | null
          investment_size_min: number | null
          investment_size_max: number | null
          regions: string[]
          sectors: string[]
          stage_focus: InvestorStage[]
          portfolio_companies: string[]
          engagement_status: EngagementStatus
          tags: string[]
          logo_url: string | null
          founded_year: number | null
          aum: number | null
          notable_investments: string[]
          investment_thesis: string | null
          preferred_contact_method: string | null
          is_active: boolean
          metadata: Json
          created_by: string | null
          created_at: string
          updated_at: string
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          name: string
          type: 'debt' | 'equity' | 'grant' | 'hybrid'
          website?: string | null
          description?: string | null
          investment_size_min?: number | null
          investment_size_max?: number | null
          regions?: string[]
          sectors?: string[]
          stage_focus?: InvestorStage[]
          portfolio_companies?: string[]
          engagement_status?: EngagementStatus
          tags?: string[]
          logo_url?: string | null
          founded_year?: number | null
          aum?: number | null
          notable_investments?: string[]
          investment_thesis?: string | null
          preferred_contact_method?: string | null
          is_active?: boolean
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'debt' | 'equity' | 'grant' | 'hybrid'
          website?: string | null
          description?: string | null
          investment_size_min?: number | null
          investment_size_max?: number | null
          regions?: string[]
          sectors?: string[]
          stage_focus?: InvestorStage[]
          portfolio_companies?: string[]
          engagement_status?: EngagementStatus
          tags?: string[]
          logo_url?: string | null
          founded_year?: number | null
          aum?: number | null
          notable_investments?: string[]
          investment_thesis?: string | null
          preferred_contact_method?: string | null
          is_active?: boolean
          metadata?: Json
          updated_at?: string
        }
      }
      investor_contacts: {
        Row: {
          id: string
          investor_id: string | null
          name: string
          title: string | null
          email: string | null
          phone: string | null
          linkedin: string | null
          twitter: string | null
          notes: string | null
          is_primary: boolean
          last_contacted: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          investor_id?: string | null
          name: string
          title?: string | null
          email?: string | null
          phone?: string | null
          linkedin?: string | null
          twitter?: string | null
          notes?: string | null
          is_primary?: boolean
          last_contacted?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          investor_id?: string | null
          name?: string
          title?: string | null
          email?: string | null
          phone?: string | null
          linkedin?: string | null
          twitter?: string | null
          notes?: string | null
          is_primary?: boolean
          last_contacted?: string | null
          updated_at?: string
        }
      }
      engagement_history: {
        Row: {
          id: string
          investor_id: string | null
          contact_id: string | null
          date: string
          type: EngagementType
          subject: string | null
          notes: string | null
          outcome: string | null
          next_steps: string | null
          attachments: string[]
          reminder_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          investor_id?: string | null
          contact_id?: string | null
          date: string
          type: EngagementType
          subject?: string | null
          notes?: string | null
          outcome?: string | null
          next_steps?: string | null
          attachments?: string[]
          reminder_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          investor_id?: string | null
          contact_id?: string | null
          date?: string
          type?: EngagementType
          subject?: string | null
          notes?: string | null
          outcome?: string | null
          next_steps?: string | null
          attachments?: string[]
          reminder_date?: string | null
          updated_at?: string
        }
      }
      investor_documents: {
        Row: {
          id: string
          investor_id: string | null
          name: string
          type: string | null
          url: string
          file_size: number | null
          uploaded_by: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          investor_id?: string | null
          name: string
          type?: string | null
          url: string
          file_size?: number | null
          uploaded_by?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          investor_id?: string | null
          name?: string
          type?: string | null
          url?: string
          file_size?: number | null
        }
      }
      saved_searches: {
        Row: {
          id: string
          user_id: string | null
          name: string
          filters: Json
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          filters: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          filters?: Json
          is_default?: boolean
          updated_at?: string
        }
      }
      investor_notes: {
        Row: {
          id: string
          investor_id: string | null
          user_id: string | null
          note: string
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          investor_id?: string | null
          user_id?: string | null
          note: string
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          note?: string
          is_private?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type InvestorType = 'debt' | 'equity' | 'grant' | 'hybrid'

export type InvestorStage = 
  | 'pre_seed' 
  | 'seed' 
  | 'series_a' 
  | 'series_b' 
  | 'series_c' 
  | 'growth' 
  | 'late_stage'

export type EngagementStatus = 
  | 'not_contacted' 
  | 'initial_outreach' 
  | 'in_discussion' 
  | 'due_diligence' 
  | 'term_sheet' 
  | 'closed_deal' 
  | 'passed' 
  | 'no_response'

export type EngagementType = 
  | 'email' 
  | 'call' 
  | 'meeting' 
  | 'conference' 
  | 'introduction' 
  | 'follow_up' 
  | 'document_shared'

// Helper types for easier usage
export type Investor = Database['public']['Tables']['investors']['Row']
export type InvestorInsert = Database['public']['Tables']['investors']['Insert']
export type InvestorUpdate = Database['public']['Tables']['investors']['Update']

export type InvestorContact = Database['public']['Tables']['investor_contacts']['Row']
export type InvestorContactInsert = Database['public']['Tables']['investor_contacts']['Insert']
export type InvestorContactUpdate = Database['public']['Tables']['investor_contacts']['Update']

export type EngagementHistory = Database['public']['Tables']['engagement_history']['Row']
export type EngagementHistoryInsert = Database['public']['Tables']['engagement_history']['Insert']
export type EngagementHistoryUpdate = Database['public']['Tables']['engagement_history']['Update']

export type InvestorDocument = Database['public']['Tables']['investor_documents']['Row']
export type InvestorDocumentInsert = Database['public']['Tables']['investor_documents']['Insert']

export type SavedSearch = Database['public']['Tables']['saved_searches']['Row']
export type SavedSearchInsert = Database['public']['Tables']['saved_searches']['Insert']

export type InvestorNote = Database['public']['Tables']['investor_notes']['Row']
export type InvestorNoteInsert = Database['public']['Tables']['investor_notes']['Insert']

// Filter types
export interface InvestorFilters {
  search?: string
  type?: InvestorType[]
  regions?: string[]
  sectors?: string[]
  stage_focus?: InvestorStage[]
  engagement_status?: EngagementStatus[]
  investment_size_min?: number
  investment_size_max?: number
  tags?: string[]
  is_active?: boolean
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: keyof Investor
  sortOrder?: 'asc' | 'desc'
}

// API Response types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}