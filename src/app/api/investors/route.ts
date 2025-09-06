import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { InvestorFilters, PaginationParams } from '@/types/database'
import { InvestorFormData } from '@/types/investor'

// GET /api/investors - Get all investors with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search') || ''
    
    // Parse filters
    const filters: InvestorFilters = {
      type: searchParams.get('type')?.split(',').filter(Boolean) as any,
      regions: searchParams.get('regions')?.split(',').filter(Boolean),
      sectors: searchParams.get('sectors')?.split(',').filter(Boolean),
      stage_focus: searchParams.get('stage_focus')?.split(',').filter(Boolean) as any,
      engagement_status: searchParams.get('engagement_status')?.split(',').filter(Boolean) as any,
      investment_size_min: searchParams.get('investment_size_min') 
        ? parseInt(searchParams.get('investment_size_min')!)
        : undefined,
      investment_size_max: searchParams.get('investment_size_max')
        ? parseInt(searchParams.get('investment_size_max')!)
        : undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean),
      is_active: searchParams.get('is_active') === 'true' ? true : 
                 searchParams.get('is_active') === 'false' ? false : undefined,
    }

    // Build query
    let query = supabase
      .from('investors')
      .select('*', { count: 'exact' })

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply filters
    if (filters.type?.length) {
      query = query.in('type', filters.type)
    }
    if (filters.engagement_status?.length) {
      query = query.in('engagement_status', filters.engagement_status)
    }
    if (filters.regions?.length) {
      query = query.contains('regions', filters.regions)
    }
    if (filters.sectors?.length) {
      query = query.contains('sectors', filters.sectors)
    }
    if (filters.stage_focus?.length) {
      query = query.contains('stage_focus', filters.stage_focus)
    }
    if (filters.tags?.length) {
      query = query.contains('tags', filters.tags)
    }
    if (filters.investment_size_min !== undefined) {
      query = query.gte('investment_size_max', filters.investment_size_min)
    }
    if (filters.investment_size_max !== undefined) {
      query = query.lte('investment_size_min', filters.investment_size_max)
    }
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    // Apply sorting
    query = query.order(sortBy as any, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching investors:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/investors - Create a new investor
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: InvestorFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Insert investor
    const { data, error } = await supabase
      .from('investors')
      .insert({
        ...body,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating investor:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}