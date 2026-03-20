import { Sparkles } from 'lucide-react'

const pillars = [
  'AI Strategy & Consulting',
  'Tailored Training & Workshops',
  'Organizational Transformation',
]

export default function BigPicture() {
  return (
    <section className="section-light section-spacing relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-7xl sm:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[12rem] font-black tracking-tight leading-[0.85] uppercase heading-display mb-10">
          The Big
          <br />
          Picture
        </h2>
        <p className="text-2xl sm:text-3xl leading-relaxed max-w-3xl mx-auto mb-14 text-muted">
          We don&apos;t just implement AI — we synchronize it to your
          ambition, your pace, and your competitive edge.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
          {pillars.map((pillar) => (
            <div key={pillar} className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent-dark shrink-0" />
              <span className="text-lg sm:text-xl font-semibold">{pillar}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
