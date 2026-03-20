'use client'

import { Brain, Bot, Workflow, GraduationCap, ArrowRight } from 'lucide-react'
import SpotlightCard from '@/components/reactbits/SpotlightCard'
import { SERVICES } from '@/lib/constants'

const iconMap = {
  Brain,
  Bot,
  Workflow,
  GraduationCap,
} as const

export default function Services() {
  return (
    <section id="services" className="section-spacing relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="text-sm font-medium text-accent-light tracking-widest uppercase mb-4">
            What We Do
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Every Phase.{' '}
            <span className="gradient-text">One Partner.</span>
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            From strategy to deployment, we provide end-to-end AI transformation
            services tailored to your industry and ambition.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon]
            return (
              <SpotlightCard
                key={service.title}
                className="group cursor-pointer transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent-light" />
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
