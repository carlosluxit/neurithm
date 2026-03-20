'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import BlurText from '@/components/reactbits/BlurText'
import DecryptedText from '@/components/reactbits/DecryptedText'
import RotatingText from '@/components/reactbits/RotatingText'

const FloatingLines = dynamic(() => import('@/components/reactbits/FloatingLines'), { ssr: false })

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* FloatingLines Background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines
          linesGradient={['#7D74F9', '#675FCC', '#4B3BA0', '#121127']}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[8, 6, 4]}
          lineDistance={[4, 3, 5]}
          topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
          middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
          bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
          animationSpeed={0.8}
          interactive
          bendRadius={5.0}
          bendStrength={-0.5}
          mouseDamping={0.04}
          parallax
          parallaxStrength={0.15}
          mixBlendMode="screen"
        />
      </div>

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-background/50 to-background" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center pt-32 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
          <span className="section-label">
            <DecryptedText
              text="AI Transformation Partners"
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
          text="EVERY REVOLUTION NEEDS A RHYTHM"
          delay={80}
          className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] heading-display uppercase"
          animateBy="words"
          direction="bottom"
        />

        {/* Subheadline with Rotating Text */}
        <div className="mt-10 text-xl sm:text-2xl text-muted max-w-3xl mx-auto leading-relaxed text-center">
          <div>Neurithm empowers enterprises to</div>
          <RotatingText
            texts={['harness AI strategically', 'automate intelligently', 'scale efficiently', 'transform boldly']}
            mainClassName="text-accent-light font-medium inline-flex justify-center"
            rotationInterval={3000}
            staggerDuration={0.02}
            staggerFrom="first"
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          />
        </div>

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

      </div>
    </section>
  )
}
