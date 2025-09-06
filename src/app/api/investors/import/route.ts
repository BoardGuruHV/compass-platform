import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { InvestorImportRow, ImportResult, ImportError } from '@/types/investor'

// POST /api/investors/import - Import investors from CSV
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { data: importData }: { data: InvestorImportRow[] } = body

    if (!importData || !Array.isArray(importData)) {
      return NextResponse.json(
        { error: 'Invalid import data' },
        { status: 400 }
      )
    }

    const result: ImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [],
    }

    // Process each row
    for (let i = 0; i < importData.length; i++) {
      const row = importData[i]
      const rowNumber = i + 2 // Assuming row 1 is headers

      try {
        // Validate required fields
        if (!row.name || !row.type) {
          result.errors.push({
            row: rowNumber,
            field: !row.name ? 'name' : 'type',
            message: 'Required field is missing',
            data: row,
          })
          result.failed++
          continue
        }

        // Validate type
        const validTypes = ['debt', 'equity', 'grant', 'hybrid']
        if (!validTypes.includes(row.type.toLowerCase())) {
          result.errors.push({
            row: rowNumber,
            field: 'type',
            message: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
            data: row,
          })
          result.failed++
          continue
        }

        // Parse arrays from CSV strings
        const regions = row.regions ? row.regions.split(',').map(s => s.trim()) : []
        const sectors = row.sectors ? row.sectors.split(',').map(s => s.trim()) : []
        const stageFocus = row.stage_focus ? row.stage_focus.split(',').map(s => s.trim()) : []

        // Parse numbers
        const investmentSizeMin = row.investment_size_min 
          ? parseInt(row.investment_size_min.replace(/[^0-9]/g, ''))
          : null
        const investmentSizeMax = row.investment_size_max
          ? parseInt(row.investment_size_max.replace(/[^0-9]/g, ''))
          : null

        // Insert investor
        const { data: investor, error: investorError } = await supabase
          .from('investors')
          .insert({
            name: row.name,
            type: row.type.toLowerCase() as any,
            website: row.website || null,
            description: row.description || null,
            investment_size_min: investmentSizeMin,
            investment_size_max: investmentSizeMax,
            regions,
            sectors,
            stage_focus: stageFocus as any,
            created_by: user.id,
          })
          .select()
          .single()

        if (investorError) {
          result.errors.push({
            row: rowNumber,
            field: 'general',
            message: investorError.message,
            data: row,
          })
          result.failed++
          continue
        }

        // If contact information is provided, create a contact
        if (investor && (row.contact_name || row.contact_email)) {
          await supabase
            .from('investor_contacts')
            .insert({
              investor_id: investor.id,
              name: row.contact_name || 'Primary Contact',
              email: row.contact_email || null,
              phone: row.contact_phone || null,
              title: row.contact_title || null,
              is_primary: true,
            })
        }

        result.imported++
      } catch (error) {
        result.errors.push({
          row: rowNumber,
          field: 'general',
          message: error instanceof Error ? error.message : 'Unknown error',
          data: row,
        })
        result.failed++
      }
    }

    result.success = result.failed === 0

    return NextResponse.json(result)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}