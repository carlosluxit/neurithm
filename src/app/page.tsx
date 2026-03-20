import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Demos from '@/components/sections/Demos'
import Industries from '@/components/sections/Industries'
import CTA from '@/components/sections/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <div className="section-divider" />
      <Services />
      <div className="section-divider" />
      <Process />
      <div className="section-divider" />
      <Demos />
      <div className="section-divider" />
      <Industries />
      <div className="section-divider" />
      <CTA />
    </>
  )
}
