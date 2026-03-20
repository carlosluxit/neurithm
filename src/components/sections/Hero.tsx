'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Aurora from '@/components/reactbits/Aurora'
import BlurText from '@/components/reactbits/BlurText'
import DecryptedText from '@/components/reactbits/DecryptedText'

const Orb = dynamic(() => import('@/components/reactbits/Orb'), { ssr: false })

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={['#5227FF', '#7c5cfc', '#06b6d4']}
          amplitude={1.2}
          blend={0.6}
          speed={0.8}
        />
      </div>

      {/* Orb */}
      <div className="absolute z-[1] w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <Orb hue={10} hoverIntensity={0.3} rotateOnHover forceHoverState={false} backgroundColor="#050510" />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-background/40 via-background/60 to-background" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center pt-32 pb-20" style={{ zIndex: 10 }}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-cool animate-pulse" />
          <span className="text-xs font-medium text-accent-light tracking-wide uppercase">
            <DecryptedText
              text="AI Transformation Agency"
              speed={40}
              maxIterations={15}
              sequential
              animateOn="view"
              className="text-accent-light"
              encryptedClassName="text-accent/40"
            />
          </span>
        </div>

        {/* Main Headline */}
        <BlurText
          text="Every Revolution Needs a Rhythm"
          delay={80}
          className="text-6xl sm:text-7xl lg:text-8xl xl:text-[6.5rem] heading-display"
          animateBy="words"
          direction="bottom"
        />

        {/* Subheadline */}
        <p className="mt-8 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Neurithm empowers enterprises to harness AI strategically, intelligently,
          and efficiently. From discovery to scaling — synchronized to your ambition.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/assessment"
            className="btn-primary text-base py-4 px-8 inline-flex items-center gap-3 group"
          >
            Get Your AI Readiness Score
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/calculator"
            className="btn-secondary text-base py-4 px-8 inline-flex items-center gap-3"
          >
            Calculate Your ROI
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex items-center justify-center gap-8 text-xs text-muted-foreground">
          <span>Enterprise-grade security</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>SOC 2 compliant</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>Results in weeks, not months</span>
        </div>
      </div>
    </section>
  )
}
