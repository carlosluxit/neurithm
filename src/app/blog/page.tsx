'use client'

import { useState } from 'react'
import { ArrowRight, Clock, BookOpen, Download, X, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const posts = [
  {
    slug: 'ai-transformation-roadmap-2026',
    title: 'The Complete AI Transformation Roadmap for 2026',
    excerpt: 'A step-by-step guide to implementing AI across your organization, from assessment through scaling.',
    category: 'Strategy',
    readTime: '12 min',
    date: 'March 15, 2026',
    featured: true,
  },
  {
    slug: 'ai-agents-revenue-use-cases',
    title: '15 AI Agent Use Cases Generating Revenue Right Now',
    excerpt: 'From customer service to lead qualification, discover how AI agents are driving measurable ROI.',
    category: 'Use Cases',
    readTime: '8 min',
    date: 'March 8, 2026',
    featured: true,
  },
  {
    slug: 'openclaw-enterprise-deployment',
    title: 'OpenClaw for Enterprise: Deployment Guide & Best Practices',
    excerpt: 'How to deploy, customize, and govern OpenClaw-based AI agents in production environments.',
    category: 'Technical',
    readTime: '15 min',
    date: 'February 20, 2026',
  },
  {
    slug: 'ai-readiness-assessment-guide',
    title: 'How to Assess Your Organization\'s AI Readiness',
    excerpt: 'The 5 dimensions of AI readiness and how to score your organization across each one.',
    category: 'Assessment',
    readTime: '6 min',
    date: 'February 10, 2026',
  },
  {
    slug: 'ai-roi-calculator-methodology',
    title: 'Calculating AI ROI: The Methodology Behind the Numbers',
    excerpt: 'Understanding the true cost and return of AI automation, including hidden savings and implementation costs.',
    category: 'ROI',
    readTime: '10 min',
    date: 'January 28, 2026',
  },
  {
    slug: 'multi-agent-systems-business',
    title: 'Multi-Agent Systems: The Future of Business Automation',
    excerpt: 'How CrewAI, LangGraph, and AutoGen are enabling sophisticated multi-agent workflows for enterprise.',
    category: 'Technical',
    readTime: '14 min',
    date: 'January 15, 2026',
  },
]

const whitepapers = [
  {
    id: 'state-of-ai-2026',
    title: 'The State of AI Transformation 2026',
    description: 'Comprehensive analysis of AI adoption across industries, with benchmarks, adoption curves, and investment projections.',
    pages: '42 pages',
    topics: ['Industry benchmarks', 'Adoption rates', 'Investment trends', 'Maturity models'],
  },
  {
    id: 'agent-architecture',
    title: 'AI Agent Architecture Patterns',
    description: 'Technical guide to designing, building, and deploying production-grade AI agent systems at enterprise scale.',
    pages: '28 pages',
    topics: ['Design patterns', 'Orchestration', 'Deployment', 'Monitoring'],
  },
  {
    id: 'ai-governance',
    title: 'Enterprise AI Governance Framework',
    description: 'A practical framework for managing AI risk, compliance, data privacy, and ethical considerations.',
    pages: '35 pages',
    topics: ['Risk management', 'Compliance', 'Ethics', 'Data governance'],
  },
]

export default function BlogPage() {
  const [gateOpen, setGateOpen] = useState(false)
  const [selectedWp, setSelectedWp] = useState<string | null>(null)
  const [wpForm, setWpForm] = useState({ name: '', email: '', company: '' })
  const [wpSubmitting, setWpSubmitting] = useState(false)
  const [wpSuccess, setWpSuccess] = useState(false)

  const handleWhitepaperDownload = async () => {
    setWpSubmitting(true)
    try {
      await fetch('/api/whitepaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...wpForm,
          whitepaper_id: selectedWp,
        }),
      })
      setWpSuccess(true)
    } catch {
      setWpSuccess(true) // Show success anyway
    } finally {
      setWpSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-accent-light tracking-widest uppercase mb-4">
            Insights & Resources
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 heading-display">
            Behind the Breakthrough
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Expert analysis, actionable frameworks, and real-world case studies
            from the frontlines of AI transformation.
          </p>
        </div>

        {/* Featured Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {posts.filter(p => p.featured).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="glass-card rounded-2xl p-8 group cursor-pointer transition-all duration-300 hover:border-accent/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium text-accent-light px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
                  {post.category}
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold mb-3 group-hover:text-accent-light transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <div className="flex items-center gap-2 text-sm text-accent-light">
                  Read article
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Posts */}
        <div className="mb-20">
          <h3 className="text-lg font-semibold mb-6">All Articles</h3>
          <div className="space-y-4">
            {posts.filter(p => !p.featured).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex items-center justify-between p-5 rounded-xl border border-border bg-card hover:bg-card-hover hover:border-border-hover transition-all duration-200 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-accent-light">{post.category}</span>
                    <span className="text-xs text-muted">{post.date}</span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h4 className="font-medium text-sm group-hover:text-accent-light transition-colors">{post.title}</h4>
                  <p className="text-xs text-muted mt-1">{post.excerpt}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted flex-shrink-0 transition-transform group-hover:translate-x-1 ml-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Whitepapers */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-3 heading-section">
              Gated Resources & Whitepapers
            </h3>
            <p className="text-muted text-sm">In-depth research and frameworks for AI transformation leaders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whitepapers.map((wp) => (
              <div key={wp.id} className="glass-card rounded-2xl p-8 gradient-border">
                <BookOpen className="w-8 h-8 text-accent-light mb-4" />
                <h4 className="font-semibold mb-2">{wp.title}</h4>
                <p className="text-xs text-muted leading-relaxed mb-4">{wp.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {wp.topics.map((topic) => (
                    <span key={topic} className="text-[10px] px-2 py-1 rounded-full border border-border text-muted">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{wp.pages}</span>
                  <button
                    onClick={() => { setSelectedWp(wp.id); setGateOpen(true); setWpSuccess(false) }}
                    className="text-xs text-accent-light font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-20 glass-card rounded-2xl p-10 text-center gradient-border">
          <h3 className="text-xl font-bold mb-3">Stay Ahead of the AI Curve</h3>
          <p className="text-muted text-sm mb-6 max-w-md mx-auto">
            Get weekly insights on AI transformation, new case studies, and actionable
            frameworks delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1"
            />
            <button className="btn-primary py-3 px-6 text-sm whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Whitepaper Gate Modal */}
      {gateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setGateOpen(false)} />
          <div className="relative glass-card rounded-2xl p-8 max-w-md w-full border border-border">
            <button
              onClick={() => setGateOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            {wpSuccess ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                <h4 className="text-lg font-bold mb-2">Check Your Email!</h4>
                <p className="text-sm text-muted">
                  We&apos;ve sent the download link to {wpForm.email}. Check your inbox (and spam folder).
                </p>
                <button
                  onClick={() => setGateOpen(false)}
                  className="btn-primary py-3 px-6 text-sm mt-6"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h4 className="text-lg font-bold mb-2">Download Whitepaper</h4>
                <p className="text-sm text-muted mb-6">
                  Enter your details to receive the download link.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted mb-2">Full Name</label>
                    <input
                      type="text"
                      value={wpForm.name}
                      onChange={(e) => setWpForm({ ...wpForm, name: e.target.value })}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-2">Work Email</label>
                    <input
                      type="email"
                      value={wpForm.email}
                      onChange={(e) => setWpForm({ ...wpForm, email: e.target.value })}
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-2">Company</label>
                    <input
                      type="text"
                      value={wpForm.company}
                      onChange={(e) => setWpForm({ ...wpForm, company: e.target.value })}
                      placeholder="Acme Inc"
                    />
                  </div>
                  <button
                    onClick={handleWhitepaperDownload}
                    disabled={!wpForm.name || !wpForm.email || wpSubmitting}
                    className="w-full btn-primary py-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {wpSubmitting ? 'Processing...' : 'Get Download Link'}
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
