import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

function getResendClient() {
  const key = process.env.RESEND_API_KEY
  if (!key || key === 're_your_resend_api_key') return null
  return new Resend(key)
}

function baseLayout(content: string) {
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #050510; color: #f0f0f5;">
      <div style="padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="https://neurithm.ai/logo.svg" alt="Neurithm" width="180" height="42" style="display: inline-block;" />
          <p style="color: #6a6a7a; font-size: 12px; margin: 8px 0 0 0;">AI Transformation, synchronized.</p>
        </div>
        ${content}
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
  `
}

function metricBlock(label: string, value: string, color = '#f0f0f5') {
  return `
    <div style="text-align: center; padding: 16px;">
      <p style="font-size: 28px; font-weight: 700; color: ${color}; margin: 0;">${value}</p>
      <p style="font-size: 12px; color: #8a8a9a; margin: 6px 0 0 0;">${label}</p>
    </div>
  `
}

function ctaButton(text: string, href: string) {
  return `
    <div style="text-align: center; margin: 32px 0;">
      <a href="${href}" style="display: inline-block; background: linear-gradient(135deg, #2EA3F2 0%, #1A7CC4 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 15px;">
        ${text}
      </a>
    </div>
  `
}

interface AssessmentData {
  score?: number
  dimensions?: { category: string; score: number }[]
}

interface CalculatorData {
  results?: {
    annualSavings?: number
    roi?: number
    paybackMonths?: number
    fteEquivalent?: number
    netSavings?: number
    implementationCost?: number
    annualAgentCost?: number
    hoursAutomated?: number
  }
  employees?: number
  avgSalary?: number
  hoursOnRepetitive?: number
}

const emailTemplates = {
  assessment: (name: string, score?: number, data?: AssessmentData) => {
    const s = score || data?.score || 0
    let level = 'AI-Exploring'
    let levelColor = '#8a8a9a'
    if (s >= 80) { level = 'AI-Ready Leader'; levelColor = '#34d399' }
    else if (s >= 60) { level = 'AI-Prepared'; levelColor = '#52B5F7' }
    else if (s >= 40) { level = 'AI-Emerging'; levelColor = '#fbbf24' }

    return {
      subject: `Your AI Readiness Score: ${s}/100 — ${level}`,
      html: baseLayout(`
        <h2 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px;">
          Your AI Readiness Results
        </h2>
        <p style="color: #8a8a9a; text-align: center; font-size: 15px; margin-bottom: 32px;">
          Hi ${name || 'there'}, here are your personalized AI readiness results.
        </p>

        <div style="background: rgba(46, 163, 242, 0.1); border: 1px solid rgba(46, 163, 242, 0.2); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 56px; font-weight: 700; color: #f0f0f5; margin: 0;">${s}</p>
          <p style="font-size: 14px; color: #8a8a9a; margin: 4px 0 12px 0;">out of 100</p>
          <p style="font-size: 18px; font-weight: 600; color: ${levelColor}; margin: 0;">${level}</p>
        </div>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">What This Means</h3>
          <p style="color: #8a8a9a; font-size: 14px; line-height: 1.6; margin: 0;">
            ${s >= 80
              ? 'Your organization is well-positioned for advanced AI implementation. You have strong data infrastructure, processes, and team capabilities. The next step is identifying high-impact use cases and deploying AI agents that deliver immediate ROI.'
              : s >= 60
              ? 'You have a solid foundation for AI transformation. With targeted investments in a few key areas, you can accelerate your AI adoption and start seeing significant returns within months.'
              : s >= 40
              ? 'You are in a good starting position with clear opportunities for improvement. A structured approach to AI adoption — starting with quick wins — will maximize your investment and build organizational momentum.'
              : 'You are at the beginning of your AI journey, which is an exciting place to be. Our Discovery phase is designed for organizations at your stage, helping you build the foundations for successful AI transformation.'
            }
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Recommended Next Steps</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #52B5F7; font-size: 14px; font-weight: 600; width: 24px; vertical-align: top;">1.</td>
              <td style="padding: 8px 0; color: #8a8a9a; font-size: 14px;">Schedule a free Discovery Call to discuss your specific challenges</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #52B5F7; font-size: 14px; font-weight: 600; vertical-align: top;">2.</td>
              <td style="padding: 8px 0; color: #8a8a9a; font-size: 14px;">Try our AI ROI Calculator to estimate potential savings</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #52B5F7; font-size: 14px; font-weight: 600; vertical-align: top;">3.</td>
              <td style="padding: 8px 0; color: #8a8a9a; font-size: 14px;">Read our AI Transformation Roadmap for a step-by-step guide</td>
            </tr>
          </table>
        </div>

        ${ctaButton('Book a Free Discovery Call', 'https://neurithm.ai/contact')}
      `),
    }
  },

  calculator: (name: string, _score?: number, data?: CalculatorData) => {
    const r = data?.results
    const annualSavings = r?.annualSavings || 0
    const roi = r?.roi || 0
    const payback = r?.paybackMonths || 0
    const fte = r?.fteEquivalent || 0
    const netSavings = r?.netSavings || 0
    const implCost = r?.implementationCost || 0
    const agentCost = r?.annualAgentCost || 0
    const hoursAutomated = r?.hoursAutomated || 0
    const employees = data?.employees || 0

    return {
      subject: `Your AI ROI Projection: $${Math.round(netSavings / 1000)}K Annual Savings — Neurithm`,
      html: baseLayout(`
        <h2 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px;">
          Your AI ROI Report
        </h2>
        <p style="color: #8a8a9a; text-align: center; font-size: 15px; margin-bottom: 32px;">
          Hi ${name || 'there'}, here's your personalized AI ROI projection based on ${employees} employees.
        </p>

        <div style="background: rgba(46, 163, 242, 0.1); border: 1px solid rgba(46, 163, 242, 0.2); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <div style="display: flex; text-align: center;">
            ${metricBlock('Annual Savings', `$${Math.round(annualSavings / 1000)}K`, '#34d399')}
            ${metricBlock('ROI', `${roi}%`, '#52B5F7')}
            ${metricBlock('Payback', `${payback} mo`, '#f0f0f5')}
            ${metricBlock('FTE Saved', `${fte}`, '#f0f0f5')}
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Financial Breakdown</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #8a8a9a; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.06);">Hours automatable annually</td>
              <td style="padding: 10px 0; color: #f0f0f5; font-size: 14px; text-align: right; font-family: monospace; border-bottom: 1px solid rgba(255,255,255,0.06);">${hoursAutomated.toLocaleString()} hrs</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8a8a9a; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.06);">Gross annual savings</td>
              <td style="padding: 10px 0; color: #34d399; font-size: 14px; text-align: right; font-family: monospace; border-bottom: 1px solid rgba(255,255,255,0.06);">$${annualSavings.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8a8a9a; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.06);">Implementation cost (one-time)</td>
              <td style="padding: 10px 0; color: #f0f0f5; font-size: 14px; text-align: right; font-family: monospace; border-bottom: 1px solid rgba(255,255,255,0.06);">-$${implCost.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8a8a9a; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.06);">AI operations cost (annual)</td>
              <td style="padding: 10px 0; color: #f0f0f5; font-size: 14px; text-align: right; font-family: monospace; border-bottom: 1px solid rgba(255,255,255,0.06);">-$${agentCost.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #f0f0f5; font-size: 14px; font-weight: 600;">Net annual savings (Year 2+)</td>
              <td style="padding: 10px 0; color: #34d399; font-size: 14px; text-align: right; font-family: monospace; font-weight: 600;">$${netSavings.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">3-Year Projection</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #8a8a9a; font-size: 14px;">Year 1</td>
              <td style="padding: 8px 0; color: #f0f0f5; font-size: 14px; text-align: right; font-family: monospace;">$${(netSavings - implCost).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #8a8a9a; font-size: 14px;">Year 2</td>
              <td style="padding: 8px 0; color: #34d399; font-size: 14px; text-align: right; font-family: monospace;">$${netSavings.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #8a8a9a; font-size: 14px;">Year 3</td>
              <td style="padding: 8px 0; color: #34d399; font-size: 14px; text-align: right; font-family: monospace;">$${Math.round(netSavings * 1.15).toLocaleString()}</td>
            </tr>
            <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
              <td style="padding: 12px 0 8px; color: #f0f0f5; font-size: 14px; font-weight: 600;">3-Year Total</td>
              <td style="padding: 12px 0 8px; color: #34d399; font-size: 14px; text-align: right; font-family: monospace; font-weight: 600;">$${Math.round((netSavings - implCost) + netSavings + netSavings * 1.15).toLocaleString()}</td>
            </tr>
          </table>
        </div>

        ${ctaButton('Discuss Your ROI Opportunity', 'https://neurithm.ai/contact')}
      `),
    }
  },

  whitepaper: (name: string, _score?: number, data?: Record<string, unknown>) => {
    const wpId = (data as Record<string, string>)?.whitepaper_id || 'state-of-ai-2026'
    const wpMap: Record<string, { title: string; file: string }> = {
      'state-of-ai-2026': { title: 'The State of AI Transformation 2026', file: 'state-of-ai-2026.pdf' },
      'agent-architecture': { title: 'AI Agent Architecture Patterns', file: 'agent-architecture.pdf' },
      'ai-governance': { title: 'Enterprise AI Governance Framework', file: 'ai-governance.pdf' },
    }
    const wp = wpMap[wpId] || wpMap['state-of-ai-2026']
    const downloadUrl = `https://neurithm.ai/whitepapers/${wp.file}`

    return {
      subject: `Your Download: ${wp.title} — Neurithm`,
      html: baseLayout(`
        <h2 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px;">
          Your Guide is Ready
        </h2>
        <p style="color: #8a8a9a; text-align: center; font-size: 15px; margin-bottom: 32px;">
          Hi ${name || 'there'}, thank you for requesting <strong style="color: #f0f0f5;">${wp.title}</strong>.
        </p>

        ${ctaButton('Download PDF', downloadUrl)}

        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">What's Inside</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2713;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;">Industry benchmarks and adoption rates</td></tr>
            <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2713;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;">Step-by-step transformation frameworks</td></tr>
            <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2713;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;">ROI calculation methodology</td></tr>
            <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2713;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;">Real-world case studies and results</td></tr>
          </table>
        </div>

        <div style="background: rgba(46, 163, 242, 0.1); border: 1px solid rgba(46, 163, 242, 0.2); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #52B5F7; margin: 0 0 8px 0;">Want a personalized assessment?</p>
          <p style="font-size: 13px; color: #8a8a9a; margin: 0 0 16px 0;">Get your AI readiness score in 2 minutes</p>
        </div>

        ${ctaButton('Take the AI Assessment', 'https://neurithm.ai/assessment')}
      `),
    }
  },

  contact: (name: string, _score?: number, _data?: unknown) => ({
    subject: `Thank you for reaching out — Neurithm`,
    html: baseLayout(`
      <h2 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px;">
        We've Received Your Message
      </h2>
      <p style="color: #8a8a9a; text-align: center; font-size: 15px; margin-bottom: 32px;">
        Hi ${name || 'there'}, thank you for reaching out. Our team will review your inquiry and respond within 24 hours.
      </p>

      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">While You Wait</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2192;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;"><a href="https://neurithm.ai/assessment" style="color: #52B5F7; text-decoration: none;">Take the AI Readiness Assessment</a></td></tr>
          <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2192;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;"><a href="https://neurithm.ai/calculator" style="color: #52B5F7; text-decoration: none;">Calculate Your AI ROI</a></td></tr>
          <tr><td style="padding: 6px 0; color: #52B5F7; font-size: 14px;">&#x2192;</td><td style="padding: 6px 0; color: #8a8a9a; font-size: 14px;"><a href="https://neurithm.ai/blog" style="color: #52B5F7; text-decoration: none;">Read Our Latest Insights</a></td></tr>
        </table>
      </div>

      ${ctaButton('Explore Our Case Studies', 'https://neurithm.ai/case-studies')}
    `),
  }),
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, name, source, score, calculator_data, assessment_data } = body

    if (!to) {
      return NextResponse.json({ error: 'Email address required' }, { status: 400 })
    }

    const resend = getResendClient()
    if (!resend) {
      console.warn('Resend API key not configured, skipping email')
      return NextResponse.json({ success: true, skipped: true })
    }

    const templateKey = source as keyof typeof emailTemplates
    const templateFn = emailTemplates[templateKey] || emailTemplates.assessment
    const template = templateFn(name, score, calculator_data || assessment_data)

    const { data, error } = await resend.emails.send({
      from: 'Neurithm <onboarding@resend.dev>',
      to: [to],
      subject: template.subject,
      html: template.html,
    })

    if (error) {
      console.error('Resend error:', error)
      // Log failed email
      try {
        await supabase.from('email_logs').insert([{
          lead_id: body.lead_id || null,
          template: templateKey,
          subject: template.subject,
          to_email: to,
          status: 'failed',
          metadata: { error: error.message },
        }])
      } catch { /* ignore logging failures */ }
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // Log successful email
    try {
      await supabase.from('email_logs').insert([{
        lead_id: body.lead_id || null,
        template: templateKey,
        subject: template.subject,
        to_email: to,
        status: 'sent',
        resend_id: data?.id || null,
      }])
    } catch { /* ignore logging failures */ }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
