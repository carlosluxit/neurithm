'use client'

import Image from 'next/image'
import { Hotel } from 'lucide-react'
import Link from 'next/link'

const industries = [
  { name: 'Hospitality', icon: '/icons/industry-hospitality.png', description: 'Guest experience, property IT, networking, VoIP, entertainment, security', featured: true },
  { name: 'Healthcare', icon: '/icons/industry-healthcare.png', description: 'Patient scheduling, clinical documentation, revenue cycle', featured: false },
  { name: 'Financial Services', icon: '/icons/industry-finance.png', description: 'KYC automation, fraud detection, portfolio analysis', featured: false },
  { name: 'Real Estate', icon: '/icons/industry-realestate.png', description: 'Lead qualification, property valuation, CRM automation', featured: false },
  { name: 'E-Commerce', icon: '/icons/industry-ecommerce.png', description: 'Dynamic pricing, personalization, customer service', featured: false },
  { name: 'Legal', icon: '/icons/industry-legal.png', description: 'Contract review, legal research, client intake', featured: false },
  { name: 'Manufacturing', icon: '/icons/industry-manufacturing.png', description: 'Predictive maintenance, quality control, supply chain', featured: false },
  { name: 'Professional Services', icon: '/icons/industry-professional.png', description: 'Proposal generation, project management, billing', featured: false },
  { name: 'Technology', icon: '/icons/industry-technology.png', description: 'DevOps automation, code review, documentation', featured: false },
]

export default function Industries() {
  const featured = industries.find(i => i.featured)
  const others = industries.filter(i => !i.featured)

  return (
    <section id="industries" className="section-spacing relative section-elevated noise-overlay">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-5xl mx-auto text-center mb-20 lg:mb-28">
          <p className="section-label mb-6">Industry Expertise</p>
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] heading-display uppercase">
            Fast. Efficient. Sector-Smart.
          </h2>
          <p className="mt-8 text-2xl sm:text-3xl text-muted leading-relaxed max-w-3xl mx-auto">
            We understand your industry&apos;s unique challenges. Technology and AI solutions
            tailored to deliver maximum impact.
          </p>
        </div>

        {/* Featured: Hospitality */}
        {featured && (
          <div className="mb-12">
            <div className="glass-card rounded-3xl p-10 lg:p-14 gradient-border group cursor-pointer transition-all duration-300">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Hotel className="w-12 h-12 text-accent-light" />
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <p className="section-label mb-3 text-accent-light">Featured Industry</p>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl heading-display uppercase mb-4">
                    Hospitality
                  </h3>
                  <p className="text-xl text-muted leading-relaxed max-w-2xl">
                    35 years of collective experience in hospitality technology. From network infrastructure
                    and VoIP to in-room entertainment and security — we&apos;re your one-stop-shop for
                    elevating your property&apos;s technology landscape.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/hospitality"
                    className="btn-primary text-base py-4 px-8 inline-flex items-center gap-2"
                  >
                    Explore Hospitality
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Industry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {others.map((industry) => (
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
