'use client'

import { PHASES } from '@/lib/constants'
import {
  ShapeDiscovery,
  ShapeCompass,
  ShapeImplementation,
  ShapeScaling,
} from '@/components/ui/AbstractShapes'

const phaseIcons = [ShapeDiscovery, ShapeCompass, ShapeImplementation, ShapeScaling]

const phaseColors = [
  { bg: 'bg-accent/10', text: 'text-accent-light', num: 'text-accent/20' },
  { bg: 'bg-accent-cool/10', text: 'text-accent-cool-light', num: 'text-accent-cool/20' },
  { bg: 'bg-accent-warm/10', text: 'text-accent-warm-light', num: 'text-accent-warm/20' },
  { bg: 'bg-accent/10', text: 'text-accent-light', num: 'text-accent/20' },
]

export default function Process() {
  return (
    <section id="process" className="section-spacing relative section-raised line-pattern">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="text-sm font-medium text-accent-warm-light tracking-widest uppercase mb-4">
            Our Approach
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl heading-section">
            AI Adoption, Step by Step
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            A clear, four-phase roadmap for AI adoption. Each phase builds on
            the last, ensuring sustainable transformation with measurable results.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cool/30 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {PHASES.map((phase, index) => {
              const Icon = phaseIcons[index]
              const colors = phaseColors[index]
              return (
                <div key={phase.title} className="relative group">
                  <div className="glass-card rounded-2xl p-8 h-full transition-all duration-300 hover:border-accent-cool/20">
                    <div className="flex items-center gap-4 mb-6">
                      <span className={`text-4xl font-bold ${colors.num}`}>{phase.number}</span>
                      <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3">{phase.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">
                      {phase.description}
                    </p>
                    <div className={`text-xs ${colors.text} font-medium`}>
                      {phase.duration}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
