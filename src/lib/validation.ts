const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const HTML_TAG_REGEX = /<[^>]*>/g

export function isValidEmail(email: string): boolean {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim()) && email.length <= 320
}

export function sanitizeString(str: unknown, maxLength = 500): string {
  if (typeof str !== 'string') return ''
  return str.trim().replace(HTML_TAG_REGEX, '').slice(0, maxLength)
}

const ALLOWED_SOURCES = ['contact', 'assessment', 'calculator', 'whitepaper', 'blog'] as const
const ALLOWED_INDUSTRIES = [
  'Healthcare', 'Financial Services', 'Real Estate', 'E-Commerce',
  'Legal', 'Manufacturing', 'Professional Services', 'Technology', 'Other', '',
] as const
const ALLOWED_COMPANY_SIZES = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', '',
] as const
const ALLOWED_WHITEPAPER_IDS = ['state-of-ai-2026', 'agent-architecture', 'ai-governance'] as const
const ALLOWED_EMAIL_TEMPLATES = ['assessment', 'calculator', 'whitepaper', 'contact'] as const

interface ValidationResult<T> {
  valid: boolean
  errors: string[]
  data: T
}

export interface LeadInput {
  email: string
  name: string
  company: string
  role: string
  industry: string
  company_size: string
  phone: string
  source: string
  score?: number
  assessment_data?: unknown
  calculator_data?: unknown
}

export function validateLeadInput(body: Record<string, unknown>): ValidationResult<LeadInput> {
  const errors: string[] = []
  const email = sanitizeString(body.email, 320)
  const name = sanitizeString(body.name, 200)
  const company = sanitizeString(body.company, 200)
  const role = sanitizeString(body.role, 200)
  const industry = sanitizeString(body.industry, 100)
  const company_size = sanitizeString(body.company_size, 20)
  const phone = sanitizeString(body.phone, 30)
  const source = sanitizeString(body.source, 50)

  if (!email) errors.push('Email is required')
  else if (!isValidEmail(email)) errors.push('Invalid email format')

  if (!name) errors.push('Name is required')

  if (source && !ALLOWED_SOURCES.includes(source as typeof ALLOWED_SOURCES[number])) {
    errors.push('Invalid source')
  }

  if (industry && !ALLOWED_INDUSTRIES.includes(industry as typeof ALLOWED_INDUSTRIES[number])) {
    errors.push('Invalid industry')
  }

  if (company_size && !ALLOWED_COMPANY_SIZES.includes(company_size as typeof ALLOWED_COMPANY_SIZES[number])) {
    errors.push('Invalid company size')
  }

  if (phone && !/^[\d\s\-()+]+$/.test(phone)) {
    errors.push('Invalid phone format')
  }

  const score = typeof body.score === 'number' ? body.score : undefined

  return {
    valid: errors.length === 0,
    errors,
    data: {
      email, name, company, role, industry, company_size, phone,
      source: source || 'contact',
      score,
      assessment_data: body.assessment_data,
      calculator_data: body.calculator_data,
    },
  }
}

export function validateSubscribeInput(body: Record<string, unknown>): ValidationResult<{ email: string; name: string }> {
  const errors: string[] = []
  const email = sanitizeString(body.email, 320)
  const name = sanitizeString(body.name, 200)

  if (!email) errors.push('Email is required')
  else if (!isValidEmail(email)) errors.push('Invalid email format')

  return { valid: errors.length === 0, errors, data: { email, name } }
}

export function validateWhitepaperInput(body: Record<string, unknown>): ValidationResult<{ email: string; name: string; company: string; whitepaper_id: string }> {
  const errors: string[] = []
  const email = sanitizeString(body.email, 320)
  const name = sanitizeString(body.name, 200)
  const company = sanitizeString(body.company, 200)
  const whitepaper_id = sanitizeString(body.whitepaper_id, 50)

  if (!email) errors.push('Email is required')
  else if (!isValidEmail(email)) errors.push('Invalid email format')

  if (!whitepaper_id) errors.push('Whitepaper ID is required')
  else if (!ALLOWED_WHITEPAPER_IDS.includes(whitepaper_id as typeof ALLOWED_WHITEPAPER_IDS[number])) {
    errors.push('Invalid whitepaper ID')
  }

  return { valid: errors.length === 0, errors, data: { email, name, company, whitepaper_id } }
}

export function validateEmailInput(body: Record<string, unknown>): ValidationResult<{ to: string; source: string }> {
  const errors: string[] = []
  const to = sanitizeString(body.to, 320)
  const source = sanitizeString(body.source, 50)

  if (!to) errors.push('Recipient email is required')
  else if (!isValidEmail(to)) errors.push('Invalid recipient email')

  if (source && !ALLOWED_EMAIL_TEMPLATES.includes(source as typeof ALLOWED_EMAIL_TEMPLATES[number])) {
    errors.push('Invalid email template')
  }

  return { valid: errors.length === 0, errors, data: { to, source: source || 'contact' } }
}

const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above)/i,
  /system\s*:/i,
  /\bnsfw\b/i,
  /\bnude\b/i,
  /\bviolence\b/i,
  /\bweapon\b/i,
]

export function validateImagePrompt(prompt: unknown): { valid: boolean; error?: string; prompt: string } {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return { valid: false, error: 'Prompt is required', prompt: '' }
  }

  const cleaned = prompt.trim().replace(HTML_TAG_REGEX, '').slice(0, 500)

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(cleaned)) {
      return { valid: false, error: 'Prompt contains prohibited content', prompt: '' }
    }
  }

  return { valid: true, prompt: cleaned }
}
