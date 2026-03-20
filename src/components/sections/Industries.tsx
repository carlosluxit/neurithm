'use client'

import {
  ShapeHealthcare,
  ShapeFinance,
  ShapeRealEstate,
  ShapeEcommerce,
  ShapeLegal,
  ShapeManufacturing,
  ShapeProfessional,
  ShapeTechnology,
} from '@/components/ui/AbstractShapes'

const industries = [
  { name: 'Healthcare', Icon: ShapeHealthcare, description: 'Patient scheduling, clinical documentation, revenue cycle', color: 'accent-cool' },
  { name: 'Financial Services', Icon: ShapeFinance, description: 'KYC automation, fraud detection, portfolio analysis', color: 'accent' },
  { name: 'Real Estate', Icon: ShapeRealEstate, description: 'Lead qualification, property valuation, CRM automation', color: 'accent-warm' },
  { name: 'E-Commerce', Icon: ShapeEcommerce, description: 'Dynamic pricing, personalization, customer service', color: 'accent-cool' },
  { name: 'Legal', Icon: ShapeLegal, description: 'Contract review, legal research, client intake', color: 'accent' },
  { name: 'Manufacturing', Icon: ShapeManufacturing, description: 'Predictive maintenance, quality control, supply chain', color: 'accent-warm' },
  { name: 'Professional Services', Icon: ShapeProfessional, description: 'Proposal generation, project management, billing', color: 'accent-cool' },
  { name: 'Technology', Icon: ShapeTechnology, description: 'DevOps automation, code review, documentation', color: 'accent' },
]

const colorClasses: Record<string, { bg: string; hover: string; text: string }> = {
  accent: { bg: 'bg-accent/10', hover: 'group-hover:bg-accent/20', text: 'text-accent-light' },
  'accent-cool': { bg: 'bg-accent-cool/10', hover: 'group-hover:bg-accent-cool/20', text: 'text-accent-cool-light' },
  'accent-warm': { bg: 'bg-accent-warm/10', hover: 'group-hover:bg-accent-warm/20', text: 'text-accent-warm-light' },
}

export default function Industries() {
  return (
    <section className="section-spacing relative section-elevated noise-overlay">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-accent-cool-light tracking-widest uppercase mb-4">
            Industry Expertise
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl heading-section">
            Fast. Efficient.{' '}
            <span className="gradient-text-warm">Sector-Smart.</span>
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            We understand the unique challenges and regulations of your industry.
            Our AI solutions are tailored to deliver maximum impact.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map((industry) => {
            const colors = colorClasses[industry.color]
            return (
              <div
                key={industry.name}
                className="glass-card rounded-xl p-6 text-center group cursor-pointer transition-all duration-300 hover:border-accent/20"
              >
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mx-auto mb-4 ${colors.hover} transition-colors`}>
                  <industry.Icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <h4 className="font-medium text-sm mb-2">{industry.name}</h4>
                <p className="text-xs text-muted leading-relaxed">{industry.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
