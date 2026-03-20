import { NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResendClient() {
  const key = process.env.RESEND_API_KEY
  if (!key || key === 're_your_resend_api_key') return null
  return new Resend(key)
}

const emailTemplates = {
  assessment: (name: string, score?: number) => ({
    subject: `Your AI Readiness Score: ${score || 'Ready'} — Neurithm`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #050510; color: #f0f0f5; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0;">
            <span style="color: #f0f0f5;">Neu</span><span style="color: #9b7fff;">Rithm</span>
          </h1>
        </div>
        <h2 style="font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 16px;">
          Your AI Readiness Score: ${score || '—'}/100
        </h2>
        <p style="color: #8a8a9a; text-align: center; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          Hi ${name || 'there'}, thank you for completing the Neurithm AI Readiness Assessment.
          Your personalized report is attached below.
        </p>
        <div style="background: rgba(124, 92, 252, 0.1); border: 1px solid rgba(124, 92, 252, 0.2); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <p style="font-size: 14px; color: #9b7fff; margin: 0 0 16px 0;">Ready to take the next step?</p>
          <a href="https://neurithm.ai" style="display: inline-block; background: linear-gradient(135deg, #7c5cfc 0%, #5a3dd6 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 500;">
            Book a Discovery Call
          </a>
        </div>
        <p style="color: #6a6a7a; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Neurithm. AI Transformation, synchronized.
        </p>
      </div>
    `,
  }),
  calculator: (name: string) => ({
    subject: 'Your AI ROI Report — Neurithm',
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #050510; color: #f0f0f5; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0;">
            <span style="color: #f0f0f5;">Neu</span><span style="color: #9b7fff;">Rithm</span>
          </h1>
        </div>
        <h2 style="font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 16px;">
          Your AI ROI Report
        </h2>
        <p style="color: #8a8a9a; text-align: center; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          Hi ${name || 'there'}, thank you for using the Neurithm AI ROI Calculator.
          Your detailed analysis is ready.
        </p>
        <div style="background: rgba(124, 92, 252, 0.1); border: 1px solid rgba(124, 92, 252, 0.2); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <p style="font-size: 14px; color: #9b7fff; margin: 0 0 16px 0;">Want to discuss your results?</p>
          <a href="https://neurithm.ai" style="display: inline-block; background: linear-gradient(135deg, #7c5cfc 0%, #5a3dd6 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 500;">
            Schedule a Call
          </a>
        </div>
        <p style="color: #6a6a7a; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Neurithm. AI Transformation, synchronized.
        </p>
      </div>
    `,
  }),
  whitepaper: (name: string) => ({
    subject: 'Your AI Transformation Guide — Neurithm',
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #050510; color: #f0f0f5; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0;">
            <span style="color: #f0f0f5;">Neu</span><span style="color: #9b7fff;">Rithm</span>
          </h1>
        </div>
        <h2 style="font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 16px;">
          Your Guide is Ready
        </h2>
        <p style="color: #8a8a9a; text-align: center; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          Hi ${name || 'there'}, thank you for downloading our AI Transformation Guide.
          The PDF is attached to this email.
        </p>
        <div style="background: rgba(124, 92, 252, 0.1); border: 1px solid rgba(124, 92, 252, 0.2); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <p style="font-size: 14px; color: #9b7fff; margin: 0 0 16px 0;">Want a personalized assessment?</p>
          <a href="https://neurithm.ai/assessment" style="display: inline-block; background: linear-gradient(135deg, #7c5cfc 0%, #5a3dd6 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 500;">
            Take the AI Assessment
          </a>
        </div>
        <p style="color: #6a6a7a; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Neurithm. AI Transformation, synchronized.
        </p>
      </div>
    `,
  }),
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, name, source, score, lead_id } = body

    if (!to) {
      return NextResponse.json({ error: 'Email address required' }, { status: 400 })
    }

    const resend = getResendClient()
    if (!resend) {
      console.warn('Resend API key not configured, skipping email')
      return NextResponse.json({ success: true, skipped: true })
    }

    const templateFn = emailTemplates[source as keyof typeof emailTemplates] || emailTemplates.assessment
    const template = templateFn(name, score)

    const { data, error } = await resend.emails.send({
      from: 'Neurithm <hello@neurithm.ai>',
      to: [to],
      subject: template.subject,
      html: template.html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
