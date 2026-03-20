import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const highlights = [
  { value: '$5.9M+', label: 'Client savings generated' },
  { value: '4', label: 'Industries transformed' },
  { value: '75%', label: 'Avg. time-to-value reduction' },
]

export default function TrustedResults() {
  return (
    <section className="section-light py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="section-label mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Proven Impact
          </p>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl heading-display uppercase mb-6">
            Results That Speak
          </h2>
          <p className="text-xl sm:text-2xl text-muted max-w-2xl mx-auto leading-relaxed">
            Real outcomes from real engagements. Every number backed by a transformation story.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14">
          {highlights.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-5xl sm:text-6xl lg:text-7xl font-black heading-display mb-3">
                {item.value}
              </p>
              <p className="text-lg text-muted font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-3 text-lg font-semibold text-accent-dark hover:gap-4 transition-all duration-300"
          >
            Read the case studies
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
