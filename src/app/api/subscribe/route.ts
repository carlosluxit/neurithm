import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

function getResendClient() {
  const key = process.env.RESEND_API_KEY
  if (!key || key === 're_your_resend_api_key') return null
  return new Resend(key)
}

function welcomeEmail(name: string) {
  return {
    subject: 'Welcome to the Neurithm Newsletter',
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #050510; color: #f0f0f5;">
        <div style="padding: 40px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://neurithm.ai/logo.svg" alt="Neurithm" width="180" height="42" style="display: inline-block;" />
            <p style="color: #6a6a7a; font-size: 12px; margin: 8px 0 0 0;">AI Transformation, synchronized.</p>
          </div>

          <h2 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px;">
            You're In.
          </h2>
          <p style="color: #8a8a9a; text-align: center; font-size: 15px; margin-bottom: 32px;">
            Hi ${name || 'there'}, welcome to the Neurithm newsletter. You'll get weekly insights on AI transformation, new case studies, and actionable frameworks.
          </p>

          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">What to Expect</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2713;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;">Weekly AI transformation insights</td></tr>
              <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2713;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;">Real-world case studies with measurable results</td></tr>
              <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2713;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;">Actionable frameworks you can apply immediately</td></tr>
              <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2713;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;">Early access to whitepapers and tools</td></tr>
            </table>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://neurithm.ai/assessment" style="display: inline-block; background: linear-gradient(135deg, #2EA3F2 0%, #1A7CC4 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 15px;">
              Take the AI Readiness Assessment
            </a>
          </div>

          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08);">
            <p style="color: #6a6a7a; font-size: 12px; text-align: center; margin: 0;">
              &copy; ${new Date().getFullYear()} Neurithm. All rights reserved.
            </p>
            <p style="color: #6a6a7a; font-size: 11px; text-align: center; margin: 8px 0 0 0;">
              <a href="https://neurithm.ai" style="color: #52B5F7; text-decoration: none;">neurithm.ai</a>
            </p>
          </div>
        </div>
      </div>
    `,
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Insert into subscribers table
    const { error: dbError } = await supabase
      .from('subscribers')
      .insert([{ email, name: name || '', source: 'blog' }])

    if (dbError) {
      // Unique constraint violation = already subscribed
      if (dbError.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already subscribed' })
      }
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    // Send welcome email
    const resend = getResendClient()
    if (resend) {
      const template = welcomeEmail(name || '')
      try {
        await resend.emails.send({
          from: 'Neurithm <onboarding@resend.dev>',
          to: [email],
          subject: template.subject,
          html: template.html,
        })
      } catch (emailError) {
        console.error('Welcome email failed:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
