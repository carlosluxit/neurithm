import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, whitepaper_id } = body

    if (!email || !whitepaper_id) {
      return NextResponse.json({ error: 'Email and whitepaper ID required' }, { status: 400 })
    }

    // Save lead
    await supabase.from('leads').insert([{
      name: name || '',
      email,
      company: company || '',
      source: 'whitepaper',
      status: 'new',
      assessment_data: { whitepaper_id },
    }])

    // Log download
    try {
      await supabase.from('downloads').insert([{
        email,
        resource_type: 'whitepaper',
        resource_id: whitepaper_id,
      }])
    } catch {
      // downloads table may not exist yet
    }

    // Send email
    try {
      await fetch(new URL('/api/email', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          name,
          source: 'whitepaper',
        }),
      })
    } catch {
      // Continue even if email fails
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
