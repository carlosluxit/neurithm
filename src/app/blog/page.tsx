import { ArrowRight, Clock, BookOpen } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Insights & Resources — Neurithm',
  description: 'Expert insights on AI transformation, automation strategies, and enterprise AI deployment. Download whitepapers and stay ahead of the AI revolution.',
}

const posts = [
  {
    slug: 'ai-transformation-roadmap-2026',
    title: 'The Complete AI Transformation Roadmap for 2026',
    excerpt: 'A step-by-step guide to implementing AI across your organization, from assessment through scaling.',
    category: 'Strategy',
    readTime: '12 min',
    date: 'March 2026',
    featured: true,
  },
  {
    slug: 'ai-agents-revenue-use-cases',
    title: '15 AI Agent Use Cases Generating Revenue Right Now',
    excerpt: 'From customer service to lead qualification, discover how AI agents are driving measurable ROI.',
    category: 'Use Cases',
    readTime: '8 min',
    date: 'March 2026',
    featured: true,
  },
  {
    slug: 'openclaw-enterprise-deployment',
    title: 'OpenClaw for Enterprise: Deployment Guide & Best Practices',
    excerpt: 'How to deploy, customize, and govern OpenClaw-based AI agents in production environments.',
    category: 'Technical',
    readTime: '15 min',
    date: 'February 2026',
  },
  {
    slug: 'ai-readiness-assessment-guide',
    title: 'How to Assess Your Organization\'s AI Readiness',
    excerpt: 'The 5 dimensions of AI readiness and how to score your organization across each one.',
    category: 'Assessment',
    readTime: '6 min',
    date: 'February 2026',
  },
  {
    slug: 'ai-roi-calculator-methodology',
    title: 'Calculating AI ROI: The Methodology Behind the Numbers',
    excerpt: 'Understanding the true cost and return of AI automation, including hidden savings and implementation costs.',
    category: 'ROI',
    readTime: '10 min',
    date: 'January 2026',
  },
  {
    slug: 'multi-agent-systems-business',
    title: 'Multi-Agent Systems: The Future of Business Automation',
    excerpt: 'How CrewAI, LangGraph, and AutoGen are enabling sophisticated multi-agent workflows for enterprise.',
    category: 'Technical',
    readTime: '14 min',
    date: 'January 2026',
  },
]

const whitepapers = [
  {
    title: 'The State of AI Transformation 2026',
    description: 'Comprehensive analysis of AI adoption across industries, with benchmarks and projections.',
    pages: '42 pages',
  },
  {
    title: 'AI Agent Architecture Patterns',
    description: 'Technical guide to designing, building, and deploying production-grade AI agent systems.',
    pages: '28 pages',
  },
  {
    title: 'Enterprise AI Governance Framework',
    description: 'A practical framework for managing AI risk, compliance, and ethical considerations.',
    pages: '35 pages',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-accent-light tracking-widest uppercase mb-4">
            Insights & Resources
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Behind the{' '}
            <span className="gradient-text">Breakthrough</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            How bold thinking, smart execution, and data-driven strategy
            come together to solve real challenges.
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
              <div className="flex items-center gap-2 text-sm text-accent-light">
                Read article
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
                </div>
                <ArrowRight className="w-4 h-4 text-muted flex-shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>

        {/* Whitepapers */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-3">
              Gated Resources & <span className="gradient-text">Whitepapers</span>
            </h3>
            <p className="text-muted text-sm">Subscribe to access our in-depth research and frameworks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whitepapers.map((wp) => (
              <div key={wp.title} className="glass-card rounded-2xl p-8 gradient-border">
                <BookOpen className="w-8 h-8 text-accent-light mb-4" />
                <h4 className="font-semibold mb-2">{wp.title}</h4>
                <p className="text-xs text-muted leading-relaxed mb-4">{wp.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{wp.pages}</span>
                  <button className="text-xs text-accent-light font-medium hover:underline inline-flex items-center gap-1">
                    Download
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
