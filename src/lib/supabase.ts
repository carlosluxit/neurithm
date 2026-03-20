import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Lead = {
  id?: string
  email: string
  name: string
  company: string
  role: string
  industry: string
  company_size: string
  phone?: string
  source: 'assessment' | 'calculator' | 'whitepaper' | 'contact' | 'demo'
  score?: number
  assessment_data?: Record<string, unknown>
  calculator_data?: Record<string, unknown>
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost'
  created_at?: string
  updated_at?: string
}

export type EmailLog = {
  id?: string
  lead_id: string
  template: string
  subject: string
  status: 'sent' | 'failed' | 'opened' | 'clicked'
  sent_at?: string
  metadata?: Record<string, unknown>
}
