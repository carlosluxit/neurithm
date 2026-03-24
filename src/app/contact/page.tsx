'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  ArrowRight,
  Building2,
  MessageSquare,
} from 'lucide-react'

const industries = [
  'Healthcare',
  'Finance',
  'Real Estate',
  'E-Commerce',
  'Legal',
  'Manufacturing',
  'Professional Services',
  'Technology',
  'Other',
]

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-1,000 employees',
  '1,001-5,000 employees',
  '5,001-10,000 employees',
  '10,000+ employees',
]

const faqs = [
  {
    question: 'What industries do you work with?',
    answer:
      'Healthcare, Finance, Real Estate, E-Commerce, Legal, Manufacturing, Professional Services, and Technology. Our frameworks adapt to any industry with structured workflows and data.',
  },
  {
    question: 'How long does a typical engagement last?',
    answer:
      'Discovery takes 2\u20133 weeks, and full implementation typically runs 3\u20136 months depending on scope and complexity. We work in agile sprints so you see progress early and often.',
  },
  {
    question: 'Do you offer ongoing support?',
    answer:
      'Yes, our Scaling phase includes continuous optimization, performance monitoring, and iterative improvements. We stay engaged to ensure your AI solutions evolve with your business.',
  },
  {
    question: "What's the minimum engagement size?",
    answer:
      'We work with companies from 10 to 10,000+ employees. Our engagements are scoped to your needs \u2014 from focused automation projects to enterprise-wide AI transformation.',
  },
]

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@luxit.io',
    href: 'mailto:hello@luxit.io',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24 hours',
  },
  {
    icon: Calendar,
    label: 'Office Hours',
    value: 'Mon\u2013Fri 9am\u20136pm EST',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    industry: '',
    company_size: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'contact' }),
      })

      if (!res.ok) throw new Error('Failed to submit')

      setIsSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative section-spacing overflow-hidden">
        <div className="orb-gradient orb-purple w-[500px] h-[500px] -right-48 -top-24 opacity-20" />
        <div className="orb-gradient orb-indigo w-[400px] h-[400px] -left-32 bottom-0 opacity-15" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center pt-20">
          <p className="section-label mb-6">Get in Touch</p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9] heading-display uppercase">
            Let&apos;s Build Something Intelligent
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Tell us about your organization and goals. We&apos;ll respond within
            24 hours with a tailored perspective on how AI can move your business
            forward.
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="relative pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <div className="glass-card rounded-2xl p-12 text-center gradient-border">
                  <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">
                    Message Received
                  </h2>
                  <p className="text-muted text-lg mb-8 max-w-md mx-auto">
                    Thank you for reaching out. A member of our team will get
                    back to you within 24 hours.
                  </p>
                  <Link
                    href="/assessment"
                    className="btn-primary inline-flex items-center gap-3 group"
                  >
                    Take the AI Readiness Assessment
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="glass-card rounded-2xl p-8 sm:p-10 space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Work Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium mb-2"
                      >
                        Company *
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium mb-2"
                      >
                        Your Role
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="VP of Operations"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="industry"
                        className="block text-sm font-medium mb-2"
                      >
                        Industry
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                      >
                        <option value="">Select industry</option>
                        {industries.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="company_size"
                        className="block text-sm font-medium mb-2"
                      >
                        Company Size
                      </label>
                      <select
                        id="company_size"
                        name="company_size"
                        value={formData.company_size}
                        onChange={handleChange}
                      >
                        <option value="">Select company size</option>
                        {companySizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      How can we help? *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your goals, challenges, or questions..."
                    />
                  </div>

                  {error && (
                    <div className="text-error text-sm bg-error/10 border border-error/20 rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-accent-light" />
                      </div>
                      <div>
                        <div className="text-sm text-muted mb-0.5">
                          {item.label}
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm font-medium hover:text-accent-light transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="text-sm font-medium">
                            {item.value}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-lg font-semibold mb-3">
                  Not ready to talk?
                </h3>
                <p className="text-sm text-muted mb-5 leading-relaxed">
                  Take our free AI Readiness Assessment to see where you stand
                  before reaching out.
                </p>
                <Link
                  href="/assessment"
                  className="btn-secondary text-sm py-3 px-5 inline-flex items-center gap-2 group"
                >
                  Take the Assessment
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-spacing relative border-t border-border">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 heading-section">
              Frequently Asked Questions
            </h2>
            <p className="text-muted text-lg">
              Common questions about working with Luxit.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-accent-light shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 -mt-1">
                    <p className="text-muted leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Building2 className="w-8 h-8 text-accent-light mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">
            Enterprise inquiries welcome
          </h3>
          <p className="text-muted mb-6">
            For partnerships, press, or enterprise-scale engagements, email us
            directly at{' '}
            <a
              href="mailto:hello@luxit.io"
              className="text-accent-light hover:underline"
            >
              hello@luxit.io
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
