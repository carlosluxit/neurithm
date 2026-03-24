import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Target,
  Eye,
  Leaf,
  Heart,
  ArrowRight,
  Users,
  TrendingUp,
  Zap,
  Building2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Neurithm — The Team Behind the Transformation',
  description:
    'Neurithm empowers enterprises to harness AI strategically. Learn about our mission, values, and the 4-phase methodology that drives lasting transformation.',
  openGraph: {
    title: 'About Neurithm — The Team Behind the Transformation',
    description:
      'Founded on the belief that AI transformation should be synchronized to each organization\'s unique ambition and pace.',
    type: 'website',
    siteName: 'Neurithm',
  },
}

const values = [
  {
    icon: Target,
    title: 'Precision Over Speed',
    description:
      'We measure twice and deploy once. Every recommendation is backed by data.',
  },
  {
    icon: Eye,
    title: 'Transparency First',
    description:
      'No black boxes. We explain our methodologies, share our reasoning, and keep you informed.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Impact',
    description:
      'Quick wins matter, but lasting transformation is our north star.',
  },
  {
    icon: Heart,
    title: 'Human-Centered AI',
    description:
      'Technology serves people. We design AI that amplifies human potential.',
  },
]

const phases = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We assess your current AI readiness, map existing workflows, and identify the highest-impact opportunities across your organization.',
  },
  {
    number: '02',
    title: 'Strategy',
    description:
      'We build a tailored AI roadmap with clear milestones, ROI projections, and a phased implementation plan aligned to your business goals.',
  },
  {
    number: '03',
    title: 'Implementation',
    description:
      'Our engineers deploy AI solutions — from custom agents to process automation — with rigorous testing and change management built in.',
  },
  {
    number: '04',
    title: 'Scaling',
    description:
      'We optimize performance, expand successful pilots across departments, and ensure your team is equipped to sustain and evolve AI capabilities.',
  },
]

const stats = [
  { icon: Users, value: '50+', label: 'Enterprise Clients' },
  { icon: TrendingUp, value: '$2.4B+', label: 'Revenue Impact' },
  { icon: Zap, value: '14x', label: 'Average ROI' },
  { icon: Building2, value: '8', label: 'Industries Served' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative section-spacing overflow-hidden">
        <div className="orb-gradient orb-purple w-[500px] h-[500px] -right-48 -top-24 opacity-20" />
        <div className="orb-gradient orb-indigo w-[400px] h-[400px] -left-32 bottom-0 opacity-15" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center pt-20">
          <p className="section-label mb-6">About Neurithm</p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9] heading-display uppercase">
            The Team Behind the Transformation
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Neurithm empowers enterprises to harness AI strategically. Founded
            on the belief that AI transformation should be synchronized to each
            organization&apos;s unique ambition and pace.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-spacing relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-label mb-6">Our Values</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 heading-section">
              What We Stand For
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Our values shape every engagement, every recommendation, and every
              line of code we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="glass-card rounded-2xl p-8 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
                  <value.icon className="w-5 h-5 text-accent-light" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach / 4-Phase Methodology */}
      <section className="section-spacing relative overflow-hidden">
        <div className="orb-gradient orb-blue w-[500px] h-[500px] -left-48 top-1/2 -translate-y-1/2 opacity-15" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="section-label mb-6">Our Methodology</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 heading-section">
              Our 4-Phase Approach
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Every transformation follows a proven methodology — disciplined
              enough to deliver results, flexible enough to fit your reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {phases.map((phase) => (
              <div
                key={phase.number}
                className="glass-card rounded-2xl p-8 transition-all duration-300 group"
              >
                <span className="text-sm font-mono text-accent-light/60 mb-3 block">
                  Phase {phase.number}
                </span>
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-accent-light transition-colors">
                  {phase.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-16 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-4 h-4 text-accent-light" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing relative overflow-hidden">
        <div className="orb-gradient orb-purple w-[500px] h-[500px] -right-48 top-0 opacity-15" />

        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="glass-card rounded-3xl p-12 lg:p-16 text-center gradient-border">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 heading-section">
              Ready to Begin? Let&apos;s Talk.
            </h2>
            <p className="text-lg text-muted leading-relaxed mb-10 max-w-xl mx-auto">
              Let&apos;s discuss your AI transformation and build a roadmap
              tailored to your organization.
            </p>
            <Link
              href="/contact"
              className="btn-primary text-base py-4 px-8 inline-flex items-center gap-3 group"
            >
              Let&apos;s discuss your AI transformation
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
