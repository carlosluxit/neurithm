import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateWhitepaperInput } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valid, errors, data: validated } = validateWhitepaperInput(body)

    if (!valid) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 })
    }

    const { email, name, company, whitepaper_id } = validated

    // Save lead
    await supabase.from('leads').insert([{
      name,
      email,
      company,
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
