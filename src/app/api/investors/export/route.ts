import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET /api/investors/export - Export investors to CSV
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'
    const ids = searchParams.get('ids')?.split(',').filter(Boolean)

    // Build query
    let query = supabase
      .from('investors')
      .select(`
        *,
        investor_contacts!investor_contacts_investor_id_fkey (
          name,
          email,
          phone,
          title
        )
      `)

    // If specific IDs provided, filter by them
    if (ids && ids.length > 0) {
      query = query.in('id', ids)
    }

    const { data: investors, error } = await query

    if (error) {
      console.error('Error exporting investors:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (format === 'csv') {
      // Generate CSV content
      const headers = [
        'Name',
        'Type',
        'Website',
        'Description',
        'Investment Size Min',
        'Investment Size Max',
        'Regions',
        'Sectors',
        'Stage Focus',
        'Engagement Status',
        'Founded Year',
        'AUM',
        'Contact Name',
        'Contact Email',
        'Contact Phone',
        'Contact Title',
      ]

      const rows = investors?.map(investor => {
        const primaryContact = investor.investor_contacts?.[0]
        return [
          investor.name,
          investor.type,
          investor.website || '',
          investor.description || '',
          investor.investment_size_min || '',
          investor.investment_size_max || '',
          investor.regions?.join(', ') || '',
          investor.sectors?.join(', ') || '',
          investor.stage_focus?.join(', ') || '',
          investor.engagement_status || '',
          investor.founded_year || '',
          investor.aum || '',
          primaryContact?.name || '',
          primaryContact?.email || '',
          primaryContact?.phone || '',
          primaryContact?.title || '',
        ]
      }) || []

      // Create CSV string
      const csvContent = [
        headers.join(','),
        ...rows.map(row => 
          row.map(cell => 
            typeof cell === 'string' && cell.includes(',') 
              ? `"${cell.replace(/"/g, '""')}"` 
              : cell
          ).join(',')
        )
      ].join('\n')

      // Return CSV file
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="investors_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    } else if (format === 'json') {
      // Return JSON
      return NextResponse.json({ data: investors })
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Use csv or json' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}