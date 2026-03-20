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
        <div className="max-w-5xl mx-auto text-center mb-20 lg:mb-28">
          <p className="section-label mb-6">Industry Expertise</p>
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] heading-display uppercase">
            Fast. Efficient. Sector-Smart.
          </h2>
          <p className="mt-8 text-2xl sm:text-3xl text-muted leading-relaxed max-w-3xl mx-auto">
            We understand your industry's unique challenges. AI solutions
            tailored to deliver maximum impact.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="glass-card rounded-2xl p-8 text-center group cursor-pointer transition-all duration-300 hover:border-accent/20"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6">
                <Image
                  src={industry.icon}
                  alt={industry.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-bold text-xl mb-3 heading-section">{industry.name}</h4>
              <p className="text-base text-muted leading-relaxed">{industry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
