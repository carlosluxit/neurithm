import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Wifi,
  Phone,
  Tv,
  Shield,
  Monitor,
  Users,
  Cloud,
  Wrench,
  ClipboardList,
  Headset,
  Plug,
  Palette,
  MapPin,
  Presentation,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hospitality Technology Solutions | Luxit',
  description:
    'End-to-end hospitality IT solutions — from network infrastructure and VoIP to in-room entertainment and security. 35 years of collective experience elevating property technology.',
  openGraph: {
    title: 'Hospitality Technology Solutions | Luxit',
    description:
      'End-to-end hospitality IT solutions — from network infrastructure and VoIP to in-room entertainment and security.',
    type: 'website',
    siteName: 'Luxit',
  },
}

const services = [
  {
    icon: ClipboardList,
    title: 'Project Management',
    description:
      'Efficiently manage hospitality tech projects. Seasoned project managers plan, execute, audit and oversee all details.',
  },
  {
    icon: Headset,
    title: 'IT Support',
    description:
      'Optimize back-office operations with proactive support. Reliable managed IT and responsive help desk.',
  },
  {
    icon: Plug,
    title: 'Technology Integration',
    description:
      'Meet technical requirements when integrating mission-critical systems. Expert advice for operational efficiency.',
  },
  {
    icon: Palette,
    title: 'Branding & Web Services',
    description:
      'Build impactful online presence aligned with brand identity.',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions & Hosting',
    description:
      'Unlock cloud technology with expert consulting. Strategic roadmap to maximize benefits.',
  },
  {
    icon: Shield,
    title: 'Security Services',
    description:
      'Advanced CCTV surveillance, access control. Protect guests and assets with state-of-the-art security.',
  },
  {
    icon: MapPin,
    title: 'Digital Signage & Wayfinding',
    description:
      'Interactive digital signage and wayfinding solutions.',
  },
  {
    icon: Presentation,
    title: 'Meeting Rooms & Conferencing',
    description:
      'Transform conference spaces with cutting-edge technology.',
  },
]

const solutions = [
  {
    icon: Wifi,
    title: 'Network Solutions',
    description:
      'Future-proof infrastructure, reliable Wi-Fi, secure guest and employee network segments.',
  },
  {
    icon: Phone,
    title: 'VoIP Solutions',
    description:
      'Elevate guest communications with cutting-edge VoIP for high-quality interactions.',
  },
  {
    icon: Tv,
    title: 'Entertainment Solutions',
    description:
      'Tailor-made in-room entertainment, interactive options, streaming services.',
  },
]

export default function HospitalityPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative section-spacing overflow-hidden">
        <div className="orb-gradient orb-purple w-[600px] h-[600px] -right-48 -top-24 opacity-20" />
        <div className="orb-gradient orb-indigo w-[400px] h-[400px] -left-32 bottom-0 opacity-15" />

        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center pt-24 pb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
            <span className="section-label text-accent-light">
              Hospitality Technology
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9] heading-display uppercase">
            IT Solutions at Your Service
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Enhancing your guests&apos; digital experience through innovative
            hospitality technology.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-primary text-base py-4 px-8 inline-flex items-center gap-3 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#approach"
              className="btn-secondary text-base py-4 px-8 inline-flex items-center gap-3"
            >
              View Our Approach
            </Link>
          </div>
        </div>
      </section>

      {/* Approach Section (Light) */}
      <section id="approach" className="section-spacing section-light relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-6">Our Approach</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] heading-display uppercase mb-6">
              How We Do It
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              A holistic approach to hospitality technology. From meticulous
              planning to procurement, project management, and IT support — say
              goodbye to fragmented service providers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-10 lg:p-12 text-center">
              <p className="text-xl sm:text-2xl font-medium leading-relaxed italic">
                &ldquo;Your one-stop-shop of trusted allies committed to
                elevating your property&apos;s technology landscape.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-spacing relative">
        <div className="orb-gradient orb-blue w-[500px] h-[500px] -left-48 top-1/4 opacity-15" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="section-label mb-6">Services</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] heading-display uppercase mb-6">
              Leave the Tech to Us
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto">
              Dedicate your energy to exceeding guest expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="glass-card rounded-2xl p-7 transition-all duration-300 group hover:border-accent/30"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
                  <service.icon className="w-5 h-5 text-accent-light" />
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-accent-light transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="section-spacing relative">
        <div className="orb-gradient orb-purple w-[500px] h-[500px] -right-48 top-1/3 opacity-15" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="section-label mb-6">Solutions</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] heading-display uppercase mb-6">
              Tailored to Your Property
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto">
              Experience personalized technology solutions as unique as your
              brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="glass-card rounded-2xl p-10 transition-all duration-300 group gradient-border"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                  <solution.icon className="w-6 h-6 text-accent-light" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-accent-light transition-colors">
                  {solution.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Procurement Section (Light) */}
      <section className="section-spacing section-light relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="section-label mb-6">Technology Procurement</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] heading-display uppercase mb-6">
              Smarter Sourcing
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Our team streamlines supplier selection and provisioning to achieve
              maximum cost efficiency and economies of scale.
            </p>
          </div>
        </div>
      </section>

      {/* Experience / Why Luxit Section */}
      <section className="section-spacing relative overflow-hidden">
        <div className="orb-gradient orb-indigo w-[500px] h-[500px] -left-48 top-0 opacity-15" />

        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <p className="section-label mb-6">Why Luxit</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] heading-display uppercase mb-10">
            Hospitality Focused
          </h2>

          <div className="mb-10">
            <span className="text-7xl sm:text-8xl lg:text-9xl font-bold heading-display text-accent-light">
              35+
            </span>
            <p className="text-xl sm:text-2xl text-muted mt-4">
              Years of collective experience
            </p>
          </div>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Profound expertise crafting innovative solutions tailored to the
            distinctive requirements of the hospitality industry.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing relative overflow-hidden">
        <div className="orb-gradient orb-purple w-[500px] h-[500px] -right-48 top-0 opacity-15" />

        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="glass-card rounded-3xl p-12 lg:p-16 text-center gradient-border">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[0.95] heading-display uppercase mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted leading-relaxed mb-10 max-w-xl mx-auto">
              Get in touch to learn how we can take your hospitality tech to the
              next level.
            </p>
            <Link
              href="/contact"
              className="btn-primary text-base py-4 px-8 inline-flex items-center gap-3 group"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
