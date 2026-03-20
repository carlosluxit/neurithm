'use client'

import {
  Heart,
  Building2,
  Home,
  ShoppingCart,
  Scale,
  Factory,
  Briefcase,
  Code2,
} from 'lucide-react'

const industries = [
  { name: 'Healthcare', icon: Heart, description: 'Patient scheduling, clinical documentation, revenue cycle' },
  { name: 'Financial Services', icon: Building2, description: 'KYC automation, fraud detection, portfolio analysis' },
  { name: 'Real Estate', icon: Home, description: 'Lead qualification, property valuation, CRM automation' },
  { name: 'E-Commerce', icon: ShoppingCart, description: 'Dynamic pricing, personalization, customer service' },
  { name: 'Legal', icon: Scale, description: 'Contract review, legal research, client intake' },
  { name: 'Manufacturing', icon: Factory, description: 'Predictive maintenance, quality control, supply chain' },
  { name: 'Professional Services', icon: Briefcase, description: 'Proposal generation, project management, billing' },
  { name: 'Technology', icon: Code2, description: 'DevOps automation, code review, documentation' },
]

export default function Industries() {
  return (
    <section className="section-spacing relative bg-surface/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-accent-light tracking-widest uppercase mb-4">
            Industry Expertise
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Fast. Efficient.{' '}
            <span className="gradient-text">Sector-Smart.</span>
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            We understand the unique challenges and regulations of your industry.
            Our AI solutions are tailored to deliver maximum impact.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map((industry) => {
            const Icon = industry.icon
            return (
              <div
                key={industry.name}
                className="glass-card rounded-xl p-6 text-center group cursor-pointer transition-all duration-300 hover:border-accent/20"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent-light" />
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
