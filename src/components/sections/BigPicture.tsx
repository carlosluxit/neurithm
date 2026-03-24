const pillars = [
  'AI Strategy & Consulting',
  'Tailored Training & Workshops',
  'Organizational Transformation',
]

export default function BigPicture() {
  return (
    <section className="section-light section-spacing relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <p className="section-label mb-6">Our Vision</p>
        <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] font-black tracking-tight leading-[0.85] uppercase heading-display mb-10">
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
              <div className="w-2 h-2 rounded-full bg-accent-dark shrink-0" />
              <span className="text-lg sm:text-xl font-semibold">{pillar}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
