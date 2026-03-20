'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const TrueFocus = dynamic(() => import('@/components/reactbits/TrueFocus'), { ssr: false })

export default function CTA() {
  return (
    <section id="contact" className="section-spacing relative overflow-hidden">
      {/* Background orbs — purple family */}
      <div className="orb-gradient orb-purple w-[600px] h-[600px] -left-64 top-0 opacity-20" />
      <div className="orb-gradient orb-indigo w-[400px] h-[400px] right-0 bottom-0 opacity-15" />
      <div className="orb-gradient orb-blue w-[300px] h-[300px] right-32 top-16 opacity-10" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="glass-card rounded-3xl p-12 lg:p-16 text-center gradient-border">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
            <span className="section-label">
              Start Your Transformation
            </span>
          </div>

          <div className="mb-6">
            <TrueFocus
              sentence="Your AI Edge Starts Here."
              manualMode={false}
              blurAmount={4}
              borderColor="#7c5cfc"
              glowColor="rgba(124, 92, 252, 0.6)"
              animationDuration={0.6}
              pauseBetweenAnimations={1.5}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl heading-display uppercase justify-center"
            />
          </div>

          <p className="text-xl text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
            Smarter decisions, lower costs, and faster AI launches — powered by
            data clarity and agile execution. Take the first step with a free
            AI readiness assessment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="btn-primary text-base py-4 px-8 inline-flex items-center gap-3 group"
            >
              Get Your Free AI Score
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/calculator"
              className="btn-secondary text-base py-4 px-8"
            >
              Calculate ROI First
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
