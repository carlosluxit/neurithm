import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateLeadInput } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valid, errors, data } = validateLeadInput(body)

    if (!valid) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 })
    }

    const lead = {
      ...data,
      status: 'new',
    }

    const { data: inserted, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    // Trigger welcome email
    if (lead.email) {
      try {
        await fetch(new URL('/api/email', request.url).toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: lead.email,
            name: lead.name,
            source: lead.source,
            score: lead.score,
            lead_id: inserted?.[0]?.id,
            calculator_data: data.calculator_data || null,
            assessment_data: data.assessment_data || null,
          }),
        })
      } catch (emailError) {
        console.error('Email trigger failed:', emailError)
      }
    }

    return NextResponse.json({ success: true, data: inserted })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
