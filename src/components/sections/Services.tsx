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
        <div className="max-w-5xl mx-auto text-center mb-20 lg:mb-28">
          <p className="section-label mb-6">What We Do</p>
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] heading-display uppercase">
            Every Phase. One Partner.
          </h2>
          <p className="mt-8 text-xl sm:text-2xl text-muted leading-relaxed max-w-3xl mx-auto">
            From strategy to deployment — end-to-end AI transformation
            tailored to your industry and ambition.
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
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-8">
                    <Image
                      src={iconSrc}
                      alt={service.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 heading-section">{service.title}</h3>
                  <p className="text-muted text-xl leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-lg text-foreground/80 flex items-center gap-3 font-medium"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-light" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent-light font-semibold text-base group-hover:bg-accent/20 group-hover:border-accent/40 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
