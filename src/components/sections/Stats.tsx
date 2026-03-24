'use client'

import CountUp from '@/components/reactbits/CountUp'

const stats = [
  { value: 14, suffix: 'x', label: 'Average ROI for clients' },
  { value: 67, suffix: '%', label: 'Faster time to value' },
  { value: 89, suffix: '%', label: 'Process efficiency gain' },
  { value: 24, suffix: '/7', label: 'AI agent availability' },
]

export default function Stats() {
  return (
    <section aria-label="Key statistics" className="relative section-elevated">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-6xl lg:text-8xl font-extrabold text-white heading-display">
                <CountUp to={stat.value} duration={2.5} suffix={stat.suffix} />
              </div>
              <p className="mt-4 text-lg lg:text-xl text-muted font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
