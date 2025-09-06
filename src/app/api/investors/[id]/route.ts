import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { InvestorFormData } from '@/types/investor'

// GET /api/investors/[id] - Get a single investor
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Fetch investor with related data
    const { data: investor, error: investorError } = await supabase
      .from('investors')
      .select(`
        *,
        investor_contacts (*),
        engagement_history (*),
        investor_documents (*),
        investor_notes (*)
      `)
      .eq('id', id)
      .single()

    if (investorError) {
      if (investorError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
      }
      console.error('Error fetching investor:', investorError)
      return NextResponse.json({ error: investorError.message }, { status: 500 })
    }

    return NextResponse.json({ data: investor })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/investors/[id] - Update an investor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body: Partial<InvestorFormData> = await request.json()

    // Remove any fields that shouldn't be updated
    const { ...updateData } = body

    // Update investor
    const { data, error } = await supabase
      .from('investors')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
      }
      console.error('Error updating investor:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/investors/[id] - Delete an investor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Delete investor (cascades to related tables)
    const { error } = await supabase
      .from('investors')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting investor:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Investor deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}