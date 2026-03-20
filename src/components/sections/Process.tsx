'use client'

import { PHASES } from '@/lib/constants'
import { Search, Compass, Rocket, TrendingUp } from 'lucide-react'

const phaseIcons = [Search, Compass, Rocket, TrendingUp]

export default function Process() {
  return (
    <section id="process" className="section-spacing relative bg-surface/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="text-sm font-medium text-accent-light tracking-widest uppercase mb-4">
            Our Approach
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            AI Adoption,{' '}
            <span className="gradient-text">Step by Step</span>
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            A clear, four-phase roadmap for AI adoption. Each phase builds on
            the last, ensuring sustainable transformation with measurable results.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {PHASES.map((phase, index) => {
              const Icon = phaseIcons[index]
              return (
                <div key={phase.title} className="relative group">
                  {/* Phase card */}
                  <div className="glass-card rounded-2xl p-8 h-full transition-all duration-300 hover:border-accent/20">
                    {/* Number + Icon */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-4xl font-bold text-accent/20">{phase.number}</span>
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent-light" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3">{phase.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">
                      {phase.description}
                    </p>
                    <div className="text-xs text-accent-light font-medium">
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
