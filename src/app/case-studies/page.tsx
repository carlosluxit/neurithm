'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Building2,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
  Quote,
  CheckCircle2,
  Filter,
} from 'lucide-react'
import Link from 'next/link'

const Orb = dynamic(() => import('@/components/reactbits/Orb'), { ssr: false })

const industries = ['All', 'Healthcare', 'Financial Services', 'E-Commerce', 'Legal'] as const
type Industry = (typeof industries)[number]

interface CaseStudy {
  id: string
  industry: Exclude<Industry, 'All'>
  icon: string
  company: string
  companyDescription: string
  headline: string
  challenge: {
    summary: string
    details: string[]
  }
  approach: string[]
  solution: {
    summary: string
    details: string[]
  }
  results: {
    label: string
    value: string
    description: string
  }[]
  quote: {
    text: string
    author: string
    role: string
  }
}

const caseStudies: CaseStudy[] = [
  {
    id: 'healthcare-patient-flow',
    industry: 'Healthcare',
    icon: '/icons/industry-healthcare.png',
    company: 'Regional Healthcare Network',
    companyDescription:
      'A multi-location healthcare provider with 12 clinics, 200+ physicians, and over 500,000 annual patient visits across the Midwest.',
    headline: 'Patient Flow Optimization',
    challenge: {
      summary:
        'Average patient wait times had ballooned to 45 minutes, scheduling staff were overwhelmed with manual coordination, and patient satisfaction scores were declining quarter over quarter.',
      details: [
        '45-minute average wait times across all clinic locations',
        'Scheduling staff handling 2,000+ calls daily with a 23% abandonment rate',
        'No-show rates exceeding 18%, costing an estimated $3.2M annually',
        'Patient satisfaction scores dropped to 71%, threatening payer contracts',
      ],
    },
    approach: [
      'Phase 1 — Discovery: Analyzed 18 months of scheduling data, patient flow logs, and staff workflows to identify bottleneck patterns and peak-demand windows.',
      'Phase 2 — Design: Architected a dual-system solution combining an AI triage agent for intake prioritization with an intelligent scheduling engine that factors in provider specialty, patient history, and real-time capacity.',
      'Phase 3 — Deploy: Rolled out across 3 pilot clinics with parallel operation, followed by a phased expansion. Staff received hands-on training integrated into their existing workflows.',
      'Phase 4 — Scale: Extended to all 12 locations with continuous model refinement based on outcomes data and feedback loops from both staff and patients.',
    ],
    solution: {
      summary:
        'An AI triage agent paired with an intelligent scheduling system that dynamically optimizes patient flow in real time.',
      details: [
        'AI triage agent that pre-screens symptoms via SMS and patient portal, routing urgent cases immediately and grouping routine visits efficiently',
        'Predictive scheduling engine that accounts for appointment duration variability, provider preferences, and historical no-show probability per patient',
        'Automated waitlist management that fills cancellations within minutes instead of hours',
        'Real-time capacity dashboard giving clinic managers visibility across all locations',
      ],
    },
    results: [
      {
        label: 'Wait Time Reduction',
        value: '62%',
        description: 'Average wait dropped from 45 to 17 minutes',
      },
      {
        label: 'Annual Savings',
        value: '$1.2M',
        description: 'Reduced overtime, fewer no-shows, optimized staffing',
      },
      {
        label: 'Patient Satisfaction',
        value: '94%',
        description: 'Up from 71%, exceeding payer contract requirements',
      },
      {
        label: 'No-Show Reduction',
        value: '41%',
        description: 'Predictive reminders cut no-shows nearly in half',
      },
    ],
    quote: {
      text: 'We went from drowning in scheduling chaos to having a system that actually anticipates our needs. Our physicians can focus on care, not logistics. The transformation happened faster than we expected.',
      author: 'Dr. Sarah Mitchell',
      role: 'Chief Medical Officer',
    },
  },
  {
    id: 'finance-compliance-automation',
    industry: 'Financial Services',
    icon: '/icons/industry-finance.png',
    company: 'Mid-Market Investment Advisory',
    companyDescription:
      'A registered investment advisory firm managing $4.2B in assets, serving institutional clients with a compliance team of 15 analysts handling regulatory obligations across SEC, FINRA, and state regulators.',
    headline: 'Compliance Automation',
    challenge: {
      summary:
        'Manual compliance reviews consumed over 200 hours per month, error rates were climbing, and the team struggled to keep pace with evolving regulatory requirements.',
      details: [
        'Compliance analysts spending 200+ hours monthly on manual document review',
        'Error rate of 4.3% on regulatory filings, risking penalties and reputational damage',
        'New regulatory changes required 6-8 weeks to incorporate into workflows',
        'Growing backlog of client onboarding reviews delayed revenue by an average of 12 days',
      ],
    },
    approach: [
      'Phase 1 — Discovery: Mapped the entire compliance workflow end-to-end, catalogued 340+ document types, and identified which review tasks were rule-based versus judgment-dependent.',
      'Phase 2 — Design: Built a compliance AI stack with document analysis models trained on the firm\'s historical review decisions, paired with automated monitoring that tracks regulatory updates in real time.',
      'Phase 3 — Deploy: Deployed with a "co-pilot" model where AI handled initial review and flagging while senior analysts made final determinations, ensuring trust and accuracy from day one.',
      'Phase 4 — Scale: Expanded coverage to all document types and regulatory bodies, with the system now autonomously handling 78% of routine reviews with human oversight on exceptions.',
    ],
    solution: {
      summary:
        'AI-powered document analysis and automated compliance monitoring that transforms a reactive process into a proactive, continuous compliance operation.',
      details: [
        'Document analysis AI trained on 50,000+ historical compliance decisions specific to the firm\'s regulatory landscape',
        'Automated regulatory change tracker that monitors SEC, FINRA, and state regulators, flagging relevant updates and suggesting workflow adjustments',
        'Intelligent risk scoring for client onboarding that prioritizes high-risk reviews and fast-tracks low-risk cases',
        'Audit-ready reporting that generates compliance documentation automatically with full decision traceability',
      ],
    },
    results: [
      {
        label: 'Faster Reviews',
        value: '89%',
        description: 'Review time cut from hours to minutes per document',
      },
      {
        label: 'Accuracy Rate',
        value: '99.7%',
        description: 'Down from 4.3% error rate to near-perfect precision',
      },
      {
        label: 'Annual Savings',
        value: '$800K',
        description: 'Reduced headcount needs and eliminated penalty risk',
      },
      {
        label: 'Onboarding Speed',
        value: '3x',
        description: 'Client onboarding review reduced from 12 to 4 days',
      },
    ],
    quote: {
      text: 'The AI doesn\'t just speed things up — it catches patterns our team would miss. We went from dreading audit season to being confidently audit-ready every single day. That peace of mind is invaluable.',
      author: 'James Thornton',
      role: 'Chief Compliance Officer',
    },
  },
  {
    id: 'ecommerce-customer-experience',
    industry: 'E-Commerce',
    icon: '/icons/industry-ecommerce.png',
    company: 'Direct-to-Consumer Lifestyle Brand',
    companyDescription:
      'A fast-growing DTC brand with $85M annual revenue, 2.4 million active customers, and a product catalog spanning 3,000+ SKUs across home goods, wellness, and lifestyle categories.',
    headline: 'Customer Experience Transformation',
    challenge: {
      summary:
        'A 24-hour average customer support response time was eroding brand loyalty, while a 68% cart abandonment rate signaled friction throughout the shopping experience.',
      details: [
        '24-hour average response time for customer inquiries across email, chat, and social',
        '68% cart abandonment rate, with exit surveys citing confusion about sizing, shipping, and product fit',
        'Support team of 35 agents unable to scale with 40% YoY growth in customer inquiries',
        'Return rate of 22% driven partly by customers purchasing incorrect items due to lack of guidance',
      ],
    },
    approach: [
      'Phase 1 — Discovery: Analyzed 14 months of support tickets, cart abandonment funnel data, and return reasons to build a comprehensive picture of customer friction points.',
      'Phase 2 — Design: Designed a multi-channel AI support agent capable of handling product questions, order status, and returns, integrated with a personalized recommendation engine powered by browsing and purchase behavior.',
      'Phase 3 — Deploy: Launched the AI agent on web chat first, then expanded to SMS and social DMs. A/B tested recommendation placements across the purchase funnel to optimize conversion impact.',
      'Phase 4 — Scale: Refined the models with 90 days of live data, achieving autonomous resolution on 73% of inquiries. Extended personalization to email campaigns and post-purchase follow-ups.',
    ],
    solution: {
      summary:
        'A multi-channel AI support agent combined with a personalized product recommendation engine that transforms the entire customer journey from browsing to post-purchase.',
      details: [
        'Conversational AI agent deployed across web chat, SMS, Instagram DMs, and email with consistent brand voice and full order management capabilities',
        'Real-time product recommendation engine analyzing browsing patterns, purchase history, and similar-customer behavior to suggest relevant products at key decision moments',
        'Proactive cart recovery system that detects abandonment triggers and intervenes with personalized incentives or answers to likely objections',
        'AI-powered sizing and fit guidance that reduced return rates by helping customers select the right product the first time',
      ],
    },
    results: [
      {
        label: 'Response Time',
        value: '12s',
        description: 'Down from 24 hours to 12 seconds average',
      },
      {
        label: 'Cart Abandonment',
        value: '-34%',
        description: 'Abandonment rate dropped from 68% to 45%',
      },
      {
        label: 'Revenue Increase',
        value: '$2.1M',
        description: 'Additional annual revenue from improved conversion',
      },
      {
        label: 'Return Rate',
        value: '-31%',
        description: 'Returns reduced through better pre-purchase guidance',
      },
    ],
    quote: {
      text: 'Our customers now get instant, personalized help around the clock. The AI knows our catalog better than most of our team. Sales went up, returns went down, and our human agents now focus on the interactions that truly need a personal touch.',
      author: 'Rachel Nguyen',
      role: 'VP of Customer Experience',
    },
  },
  {
    id: 'legal-document-intelligence',
    industry: 'Legal',
    icon: '/icons/industry-legal.png',
    company: 'National Commercial Law Firm',
    companyDescription:
      'A 180-attorney commercial law firm specializing in M&A, corporate governance, and regulatory compliance, handling 400+ active matters and processing thousands of contracts monthly.',
    headline: 'Document Intelligence',
    challenge: {
      summary:
        'Junior associates were spending 60% of their time on document review and precedent research, limiting the firm\'s capacity for billable strategic work and contributing to high associate turnover.',
      details: [
        'Junior associates dedicating 60% of their hours to manual contract review and precedent research',
        'Average document review cycle of 5 days for complex commercial agreements',
        'Precedent research requiring 8-12 hours per matter, often duplicating work done on similar cases',
        'Associate burnout contributing to 28% annual turnover, with each departure costing approximately $250K in recruitment and training',
      ],
    },
    approach: [
      'Phase 1 — Discovery: Shadowed associate workflows, analyzed time-tracking data across 200+ matters, and catalogued the firm\'s precedent library of 15,000+ documents to identify automation opportunities.',
      'Phase 2 — Design: Built a two-part AI system: a contract analysis engine that extracts, compares, and flags key provisions, and a precedent research agent that searches the firm\'s knowledge base with semantic understanding.',
      'Phase 3 — Deploy: Rolled out to the M&A practice group first with a mentorship model where senior associates validated AI outputs, building confidence and refining accuracy. Integrated into the firm\'s existing document management system.',
      'Phase 4 — Scale: Expanded to all practice areas with customized models per specialty. The system now processes initial contract review autonomously and surfaces relevant precedents proactively when new matters are opened.',
    ],
    solution: {
      summary:
        'AI-powered contract analysis and intelligent precedent research that augment attorney capabilities, freeing associates for higher-value strategic work.',
      details: [
        'Contract analysis AI that extracts key provisions, identifies non-standard clauses, compares against templates, and generates redline summaries in minutes instead of days',
        'Semantic precedent research agent that understands legal concepts, not just keywords, surfacing relevant case law, prior firm work product, and clause libraries',
        'Risk flagging system that highlights unusual terms, missing provisions, and potential liability issues with explanations referencing firm standards',
        'Knowledge capture pipeline that continuously enriches the firm\'s precedent library as attorneys complete matters, building institutional intelligence',
      ],
    },
    results: [
      {
        label: 'Faster Review',
        value: '75%',
        description: 'Document review time cut from 5 days to 1.2 days',
      },
      {
        label: 'More Billable Hours',
        value: '+40%',
        description: 'Associates redirected to strategic, billable work',
      },
      {
        label: 'Revenue Gain',
        value: '$1.8M',
        description: 'Annual revenue increase from higher-value utilization',
      },
      {
        label: 'Associate Retention',
        value: '+52%',
        description: 'Turnover dropped as associates engaged in meaningful work',
      },
    ],
    quote: {
      text: 'Our associates used to dread document review. Now they arrive with AI-generated summaries and spend their time on strategy and client relationships. We\'re a more competitive firm because of it, and our people are happier.',
      author: 'David Park',
      role: 'Managing Partner',
    },
  },
]

export default function CaseStudiesPage() {
  const [activeFilter, setActiveFilter] = useState<Industry>('All')

  const filteredStudies =
    activeFilter === 'All'
      ? caseStudies
      : caseStudies.filter((s) => s.industry === activeFilter)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        {/* Interactive Orb background */}
        <div className="absolute inset-0 z-0 opacity-80">
          <Orb
            hue={260}
            hoverIntensity={8}
            rotateOnHover
            forceHoverState={false}
            backgroundColor="#050510"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-32 pb-20">
          <p className="section-label mb-6">Proven Outcomes</p>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] heading-display uppercase mb-8">
            Real Results. Real Transformation.
          </h1>
          <p className="text-2xl sm:text-3xl text-muted leading-relaxed max-w-3xl mx-auto">
            See how organizations like yours have leveraged AI to eliminate
            inefficiencies, unlock revenue, and transform operations.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section aria-label="Filter by industry" className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Filter className="w-5 h-5 text-muted" />
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => setActiveFilter(industry)}
              className={`px-6 py-3 rounded-full text-base font-bold transition-all duration-300 cursor-pointer ${
                activeFilter === industry
                  ? 'btn-primary'
                  : 'glass-card text-muted hover:text-foreground'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </section>

      {/* Case Study Cards */}
      <section aria-label="Case study overview cards" className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {filteredStudies.map((study) => (
            <a
              key={study.id}
              href={`#${study.id}`}
              className="rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] block bg-[#0f0f1a] border border-white/[0.08] hover:border-accent/20"
            >
              {/* Visual header — results dashboard */}
              <div className="relative h-56 bg-[#141422] border-b border-white/[0.06] p-8 flex flex-col justify-end overflow-hidden">
                <div className="absolute top-0 right-0 w-56 h-56 orb-gradient orb-purple opacity-15 -translate-y-1/3 translate-x-1/3" />
                <div className="relative z-10 grid grid-cols-2 gap-6">
                  {study.results.slice(0, 2).map((result) => (
                    <div key={result.label}>
                      <p className="text-5xl font-extrabold text-white heading-display">
                        {result.value}
                      </p>
                      <p className="text-sm text-muted mt-1 font-medium">
                        {result.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <span className="section-label text-accent-light">
                  {study.industry}
                </span>
                <h3 className="text-3xl font-bold mt-3 mb-2 heading-section text-white group-hover:text-accent-light transition-colors">
                  {study.headline}
                </h3>
                <p className="text-lg text-muted mb-6">
                  {study.company}
                </p>

                {/* Feature-list rows */}
                <div className="space-y-0 border-t border-white/[0.06]">
                  {study.results.map((result) => (
                    <div
                      key={result.label}
                      className="flex items-center justify-between py-3.5 border-b border-white/[0.06] last:border-b-0"
                    >
                      <span className="text-base text-foreground/80">{result.description}</span>
                      <span className="text-base font-bold text-accent-light ml-4 whitespace-nowrap">{result.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Light contrast summary */}
      <section className="section-light py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] font-black tracking-tight leading-[0.85] uppercase heading-display mb-10">
            Measurable
            <br />
            Impact
          </h2>
          <p className="text-2xl sm:text-3xl text-muted leading-relaxed max-w-3xl mx-auto mb-16">
            Every engagement is measured by outcomes, not hours.
            Here&apos;s the proof.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <p className="text-5xl sm:text-6xl font-black heading-display mb-2">62%</p>
              <p className="text-lg text-muted font-medium">Wait time cut</p>
            </div>
            <div>
              <p className="text-5xl sm:text-6xl font-black heading-display mb-2">99.7%</p>
              <p className="text-lg text-muted font-medium">Accuracy rate</p>
            </div>
            <div>
              <p className="text-5xl sm:text-6xl font-black heading-display mb-2">$5.9M</p>
              <p className="text-lg text-muted font-medium">Total savings</p>
            </div>
            <div>
              <p className="text-5xl sm:text-6xl font-black heading-display mb-2">12s</p>
              <p className="text-lg text-muted font-medium">Response time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Case Studies */}
      {caseStudies.map((study, idx) => (
        <section
          key={study.id}
          id={study.id}
          className={`relative section-spacing ${
            idx % 2 === 0 ? 'section-elevated' : ''
          }`}
        >
          {/* Subtle orb per section */}
          <div className="orb-gradient orb-purple w-[400px] h-[400px] absolute -top-20 -right-20 opacity-10" />

          <div className="max-w-5xl mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="mb-16">
              <span className="section-label inline-block mb-4">
                {study.industry}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold heading-display uppercase mb-4">
                {study.headline}
              </h2>
              <p className="text-xl text-muted">{study.company}</p>
            </div>

            {/* Company Profile */}
            <div className="glass-card rounded-2xl p-8 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-accent-light" />
                <h3 className="section-label">
                  Company Profile
                </h3>
              </div>
              <p className="text-xl text-foreground leading-relaxed">
                {study.companyDescription}
              </p>
            </div>

            {/* Challenge & Solution Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Challenge */}
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-error" />
                  <h3 className="text-2xl font-bold text-white heading-section">
                    The Challenge
                  </h3>
                </div>
                <p className="text-lg text-muted mb-6 leading-relaxed">
                  {study.challenge.summary}
                </p>
                <ul className="space-y-4">
                  {study.challenge.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-base text-foreground/80 leading-relaxed"
                    >
                      <span className="w-2 h-2 rounded-full bg-error mt-2 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution */}
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-success" />
                  <h3 className="text-2xl font-bold text-white heading-section">
                    The Solution
                  </h3>
                </div>
                <p className="text-lg text-muted mb-6 leading-relaxed">
                  {study.solution.summary}
                </p>
                <ul className="space-y-4">
                  {study.solution.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-base text-foreground/80 leading-relaxed"
                    >
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Our Approach */}
            <div className="glass-card rounded-2xl p-8 mb-10">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-accent-light" />
                <h3 className="text-2xl font-bold text-white heading-section">
                  Our Approach
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {study.approach.map((phase, i) => {
                  const dashIdx = phase.indexOf(':')
                  const label = dashIdx > -1 ? phase.slice(0, dashIdx + 1) : ''
                  const desc = dashIdx > -1 ? phase.slice(dashIdx + 1) : phase
                  return (
                    <div
                      key={i}
                      className="p-6 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-accent/20 transition-colors"
                    >
                      {label && (
                        <p className="text-base font-bold text-white mb-3 heading-section">{label}</p>
                      )}
                      <p className="text-base text-muted leading-relaxed">
                        {desc.trim()}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {study.results.map((result) => (
                <div
                  key={result.label}
                  className="glass-card rounded-2xl p-8 text-center"
                >
                  <p className="text-4xl md:text-5xl font-extrabold text-white mb-2 heading-display">
                    {result.value}
                  </p>
                  <p className="text-base font-bold text-foreground mb-1">
                    {result.label}
                  </p>
                  <p className="text-sm text-muted">
                    {result.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="glass-card rounded-2xl p-10 relative overflow-hidden">
              <Quote className="w-12 h-12 text-accent opacity-30 mb-6" />
              <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 italic">
                &ldquo;{study.quote.text}&rdquo;
              </blockquote>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {study.quote.author}
                </p>
                <p className="text-base text-muted">
                  {study.quote.role}
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 orb-gradient orb-purple opacity-20" />
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="relative section-spacing overflow-hidden">
        <div className="orb-gradient orb-purple w-[700px] h-[700px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 animate-pulse-glow" />
        <div className="orb-gradient orb-indigo w-[400px] h-[400px] absolute -bottom-20 -right-20 opacity-15" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="section-label mb-6">Your Turn</p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold heading-display uppercase mb-8">
            Ready To Be Next?
          </h2>
          <p className="text-2xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Every transformation starts with a conversation. Tell us about your
            challenges, and we&apos;ll show you what&apos;s possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="btn-primary text-lg py-4 px-8 inline-flex items-center justify-center gap-3 group"
            >
              Get Your Free Assessment
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="btn-secondary text-lg py-4 px-8 inline-flex items-center justify-center gap-3"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
