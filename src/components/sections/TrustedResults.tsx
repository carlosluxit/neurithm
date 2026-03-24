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
          <p className="section-label mb-6">Proven Impact</p>
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] font-black tracking-tight leading-[0.85] heading-display uppercase mb-6">
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0a0a2e] text-white text-lg font-semibold hover:bg-[#1a1a4e] transition-all duration-300 group"
          >
            Read the case studies
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
