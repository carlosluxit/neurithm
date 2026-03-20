import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const lead = {
      name: body.name || '',
      email: body.email || '',
      company: body.company || '',
      role: body.role || '',
      industry: body.industry || '',
      company_size: body.company_size || '',
      phone: body.phone || '',
      source: body.source || 'contact',
      score: body.score || null,
      assessment_data: body.assessment_data || null,
      calculator_data: body.calculator_data || null,
      status: 'new',
    }

    const { data, error } = await supabase
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
            lead_id: data?.[0]?.id,
          }),
        })
      } catch (emailError) {
        console.error('Email trigger failed:', emailError)
      }
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}
