'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import SpotlightCard from '@/components/reactbits/SpotlightCard'
import { SERVICES } from '@/lib/constants'

const iconMap: Record<string, string> = {
  Brain: '/icons/service-strategy.png',
  Bot: '/icons/service-agent.png',
  Workflow: '/icons/service-automation.png',
  GraduationCap: '/icons/service-enablement.png',
}

const spotlightColors = [
  'rgba(124, 92, 252, 0.15)',
  'rgba(129, 140, 248, 0.15)',
  'rgba(192, 132, 252, 0.15)',
  'rgba(124, 92, 252, 0.15)',
]

export default function Services() {
  return (
    <section id="services" className="section-spacing relative dot-grid">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="section-label mb-4">What We Do</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl heading-section">
            Every Phase. One Partner.
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            From strategy to deployment, we provide end-to-end AI transformation
            services tailored to your industry and ambition.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, index) => {
            const iconSrc = iconMap[service.icon]
            return (
              <SpotlightCard
                key={service.title}
                className="group cursor-pointer transition-all duration-300"
                spotlightColor={spotlightColors[index]}
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl overflow-hidden mb-6">
                    <Image
                      src={iconSrc}
                      alt={service.title}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 heading-section">{service.title}</h3>
                  <p className="text-muted text-base leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm text-muted-foreground flex items-center gap-2 font-medium"
                      >
                        <div className="w-1 h-1 rounded-full bg-accent-light" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-sm text-accent-light opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </SpotlightCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
