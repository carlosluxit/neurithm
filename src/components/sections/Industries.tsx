'use client'

import Image from 'next/image'

const industries = [
  { name: 'Healthcare', icon: '/icons/industry-healthcare.png', description: 'Patient scheduling, clinical documentation, revenue cycle' },
  { name: 'Financial Services', icon: '/icons/industry-finance.png', description: 'KYC automation, fraud detection, portfolio analysis' },
  { name: 'Real Estate', icon: '/icons/industry-realestate.png', description: 'Lead qualification, property valuation, CRM automation' },
  { name: 'E-Commerce', icon: '/icons/industry-ecommerce.png', description: 'Dynamic pricing, personalization, customer service' },
  { name: 'Legal', icon: '/icons/industry-legal.png', description: 'Contract review, legal research, client intake' },
  { name: 'Manufacturing', icon: '/icons/industry-manufacturing.png', description: 'Predictive maintenance, quality control, supply chain' },
  { name: 'Professional Services', icon: '/icons/industry-professional.png', description: 'Proposal generation, project management, billing' },
  { name: 'Technology', icon: '/icons/industry-technology.png', description: 'DevOps automation, code review, documentation' },
]

export default function Industries() {
  return (
    <section className="section-spacing relative section-elevated noise-overlay">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="section-label mb-4">Industry Expertise</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl heading-section">
            Fast. Efficient. Sector-Smart.
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            We understand the unique challenges and regulations of your industry.
            Our AI solutions are tailored to deliver maximum impact.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="glass-card rounded-xl p-6 text-center group cursor-pointer transition-all duration-300 hover:border-accent/20"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden mx-auto mb-4">
                <Image
                  src={industry.icon}
                  alt={industry.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-medium text-sm mb-2">{industry.name}</h4>
              <p className="text-xs text-muted leading-relaxed">{industry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
