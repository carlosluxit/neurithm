import Link from 'next/link'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import { SITE } from '@/lib/constants'

const footerLinks = {
  services: [
    { label: 'AI Strategy & Consulting', href: '#services' },
    { label: 'AI Agent Development', href: '#services' },
    { label: 'Process Automation', href: '#services' },
    { label: 'Training & Enablement', href: '#services' },
  ],
  resources: [
    { label: 'AI Readiness Assessment', href: '/assessment' },
    { label: 'ROI Calculator', href: '/calculator' },
    { label: 'Blog & Insights', href: '/blog' },
    { label: 'Case Studies', href: '/case-studies' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                <span className="text-foreground">Neu</span>
                <span className="text-accent-light">Rithm</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-6 max-w-xs">
              {SITE.tagline}. Empowering enterprises to harness AI strategically,
              intelligently, and efficiently.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Neurithm. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            AI Transformation, synchronized.
          </p>
        </div>
      </div>
    </footer>
  )
}
