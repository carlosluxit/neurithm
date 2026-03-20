'use client'

import Image from 'next/image'
import { PHASES } from '@/lib/constants'

const phaseIcons = [
  '/icons/process-discovery.png',
  '/icons/process-strategy.png',
  '/icons/process-implementation.png',
  '/icons/process-scaling.png',
]

export default function Process() {
  return (
    <section id="process" className="section-spacing relative section-raised line-pattern">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-5xl mx-auto text-center mb-20 lg:mb-28">
          <p className="section-label mb-6">Our Approach</p>
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] heading-display uppercase">
            AI Adoption, Step by Step
          </h2>
          <p className="mt-8 text-xl sm:text-2xl text-muted leading-relaxed max-w-3xl mx-auto">
            A clear, four-phase roadmap. Each phase builds on
            the last — sustainable transformation with measurable results.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {PHASES.map((phase, index) => (
              <div key={phase.title} className="relative group">
                <div className="glass-card rounded-2xl p-8 h-full transition-all duration-300 hover:border-accent/20">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-accent/20">{phase.number}</span>
                    <div className="w-11 h-11 rounded-xl overflow-hidden">
                      <Image
                        src={phaseIcons[index]}
                        alt={phase.title}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 heading-section">{phase.title}</h3>
                  <p className="text-base text-muted leading-relaxed mb-4">
                    {phase.description}
                  </p>
                  <div className="text-sm text-accent-light font-medium">
                    {phase.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
