'use client'

import { ArrowRight } from 'lucide-react'
import SpotlightCard from '@/components/reactbits/SpotlightCard'
import { SERVICES } from '@/lib/constants'
import {
  ShapeStrategy,
  ShapeAgent,
  ShapeAutomation,
  ShapeEnablement,
} from '@/components/ui/AbstractShapes'

const iconMap = {
  Brain: ShapeStrategy,
  Bot: ShapeAgent,
  Workflow: ShapeAutomation,
  GraduationCap: ShapeEnablement,
} as const

const colorAccents = [
  { bg: 'bg-accent/10', hover: 'group-hover:bg-accent/20', text: 'text-accent-light', dot: 'bg-accent-light' },
  { bg: 'bg-accent-cool/10', hover: 'group-hover:bg-accent-cool/20', text: 'text-accent-cool-light', dot: 'bg-accent-cool-light' },
  { bg: 'bg-accent-warm/10', hover: 'group-hover:bg-accent-warm/20', text: 'text-accent-warm-light', dot: 'bg-accent-warm-light' },
  { bg: 'bg-accent/10', hover: 'group-hover:bg-accent/20', text: 'text-accent-light', dot: 'bg-accent-light' },
]

export default function Services() {
  return (
    <section id="services" className="section-spacing relative dot-grid">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="text-sm font-medium text-accent-cool-light tracking-widest uppercase mb-4">
            What We Do
          </p>
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
            const Icon = iconMap[service.icon]
            const colors = colorAccents[index]
            return (
              <SpotlightCard
                key={service.title}
                className="group cursor-pointer transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-6 ${colors.hover} transition-colors`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <div className={`w-1 h-1 rounded-full ${colors.dot}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className={`flex items-center gap-2 text-sm ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
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
