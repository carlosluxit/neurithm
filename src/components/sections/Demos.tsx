'use client'

import { useState, useEffect } from 'react'
import {
  MessageSquare,
  BarChart3,
  FileText,
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  ArrowRight,
  Zap,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

const demos = [
  {
    id: 'chatbot',
    title: 'AI Support Agent',
    description: 'Real-time customer query handling with human-like understanding.',
    icon: MessageSquare,
    color: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    id: 'analytics',
    title: 'Smart Analytics',
    description: 'Transform raw data into actionable insights in seconds.',
    icon: BarChart3,
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'content',
    title: 'Content Engine',
    description: 'On-brand content across channels with AI that knows your voice.',
    icon: FileText,
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'workflow',
    title: 'Workflow Automation',
    description: 'End-to-end process automation with intelligent decision routing.',
    icon: Zap,
    color: 'from-amber-500/20 to-orange-500/20',
  },
]

const chatMessages = [
  { role: 'user', text: 'I need help setting up automated invoicing for my 50-person team' },
  { role: 'assistant', text: 'I can help with that! Based on your team size, I recommend our Enterprise Automation Suite. It integrates with QuickBooks, Xero, and SAP. Want me to set up a demo environment?' },
  { role: 'user', text: 'Yes, and can it handle multi-currency billing?' },
  { role: 'assistant', text: 'Absolutely. Our system supports 135+ currencies with real-time exchange rates. I\'ll configure a sandbox with multi-currency enabled. You\'ll have it in 2 minutes.' },
  { role: 'user', text: 'Perfect. What about tax compliance across regions?' },
  { role: 'assistant', text: 'Built-in tax engine covers 40+ jurisdictions including VAT, GST, and sales tax. I\'m pulling your regional requirements now — I see you operate in the US, UK, and Canada. I\'ll pre-configure all three.' },
]

const workflowSteps = [
  { label: 'Document Received', status: 'complete', detail: 'Invoice #4892 from Acme Corp' },
  { label: 'AI Classification', status: 'complete', detail: 'Type: Purchase Order — 99.2% confidence' },
  { label: 'Data Extraction', status: 'complete', detail: 'Amount: $24,500 | Due: March 30' },
  { label: 'Approval Routing', status: 'active', detail: 'Routed to Finance Lead (>$10K policy)' },
  { label: 'Payment Processing', status: 'pending', detail: 'Queued for batch processing' },
]

export default function Demos() {
  const [activeDemo, setActiveDemo] = useState('chatbot')
  const [chatStep, setChatStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [analyticsAnimated, setAnalyticsAnimated] = useState(false)

  useEffect(() => {
    if (activeDemo === 'analytics') {
      setAnalyticsAnimated(false)
      const timer = setTimeout(() => setAnalyticsAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [activeDemo])

  const advanceChat = () => {
    if (chatStep < chatMessages.length - 1 && !isTyping) {
      setIsTyping(true)
      setTimeout(() => {
        setChatStep(prev => prev + 1)
        setIsTyping(false)
      }, 800)
    }
  }

  return (
    <section id="demos" className="section-spacing relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <p className="section-label mb-4">
            See It In Action
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl heading-section">
            Interactive AI Demos
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Experience the power of our AI solutions firsthand.
            These are live demos of what we build for clients.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demo Selector */}
          <div className="space-y-3">
            {demos.map((demo) => {
              const Icon = demo.icon
              const isActive = activeDemo === demo.id
              return (
                <button
                  key={demo.id}
                  onClick={() => { setActiveDemo(demo.id); setChatStep(0) }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'border-accent/30 bg-accent/5'
                      : 'border-border bg-card hover:bg-card-hover hover:border-border-hover'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-0.5">{demo.title}</h4>
                      <p className="text-xs text-muted leading-relaxed">{demo.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}

            <Link
              href="/contact"
              className="block w-full text-center p-4 rounded-xl border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-all duration-300"
            >
              <span className="text-sm text-accent-light font-medium inline-flex items-center gap-2">
                Request Custom Demo
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Demo Window */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-6 py-3.5 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-surface text-xs text-muted">
                    neurithm.ai / demo / {activeDemo}
                  </div>
                </div>
              </div>

              {/* Chat Demo */}
              {activeDemo === 'chatbot' && (
                <div className="p-6 min-h-[420px] flex flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto">
                    {chatMessages.slice(0, chatStep + 1).map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''} animate-slide-up`}
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-accent-light" />
                          </div>
                        )}
                        <div
                          className={`max-w-xs lg:max-w-sm rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-accent text-white rounded-br-md'
                              : 'bg-surface-raised border border-border rounded-bl-md'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-accent-light" />
                        </div>
                        <div className="bg-surface-raised border border-border rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="flex-1 flex items-center gap-3 bg-surface rounded-xl px-4 py-3 border border-border">
                      <input
                        type="text"
                        placeholder="Try asking something..."
                        className="flex-1 bg-transparent text-sm outline-none border-none p-0"
                        readOnly
                      />
                    </div>
                    <button
                      onClick={advanceChat}
                      className="btn-primary py-3 px-4 rounded-xl"
                      disabled={chatStep >= chatMessages.length - 1 || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Analytics Demo */}
              {activeDemo === 'analytics' && (
                <div className="p-6 min-h-[420px]">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-accent-light" />
                    <h4 className="font-medium text-sm">AI-Generated Insights</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">Live</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Customer Acquisition Cost', value: '$12.40', change: '-34%', positive: true, bar: 34 },
                      { label: 'Lead Response Time', value: '12s', change: '-99%', positive: true, bar: 99 },
                      { label: 'Conversion Rate', value: '3.4%', change: '+62%', positive: true, bar: 62 },
                      { label: 'Monthly Revenue Impact', value: '+$142K', change: '+67%', positive: true, bar: 67 },
                      { label: 'Customer Satisfaction', value: '94%', change: '+28%', positive: true, bar: 28 },
                    ].map((metric, i) => (
                      <div key={metric.label} className="p-3 rounded-xl bg-surface border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted">{metric.label}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{metric.value}</span>
                            <span className={`text-xs font-medium ${metric.positive ? 'text-success' : 'text-error'}`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent to-success transition-all duration-1000 ease-out"
                            style={{ width: analyticsAnimated ? `${metric.bar}%` : '0%', transitionDelay: `${i * 150}ms` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-xl border border-accent/20 bg-accent/5">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-4 h-4 text-accent-light mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted leading-relaxed">
                        <span className="text-foreground font-medium">AI Insight:</span> Lead response time
                        improvement is driving 62% conversion increase. Expanding AI agent coverage
                        to after-hours inquiries could add $48K/month.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Demo */}
              {activeDemo === 'content' && (
                <div className="p-6 min-h-[420px]">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-5 h-5 text-accent-light" />
                    <h4 className="font-medium text-sm">Multi-Channel Content Generation</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">LinkedIn</span>
                        <span className="text-[10px] text-muted">Generated in 3.2s</span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        We deployed 47 AI agents last quarter. Here&apos;s what nobody tells you about the first week:
                        <br /><br />
                        The agents don&apos;t replace your team. They amplify them.
                        <br /><br />
                        Our client&apos;s customer service team went from dreading Monday mornings to actually being excited —
                        the AI handles repetitive queries while they focus on complex, meaningful work.
                        <br /><br />
                        <span className="text-accent-light">#AITransformation #FutureOfWork #Enterprise</span>
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Email Campaign</span>
                        <span className="text-[10px] text-muted">A/B Tested Subject Lines</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { line: 'Your team is spending 40% of their time on tasks AI can handle', rate: '34.2%' },
                          { line: 'The $2.3M mistake companies make with AI adoption', rate: '28.7%' },
                          { line: 'What 89% of successful AI transformations have in common', rate: '31.5%' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-accent-light font-mono w-4">#{i + 1}</span>
                              <span className="text-xs">{item.line}</span>
                            </div>
                            <span className="text-[10px] text-success font-mono whitespace-nowrap">{item.rate} open</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Workflow Demo */}
              {activeDemo === 'workflow' && (
                <div className="p-6 min-h-[420px]">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-5 h-5 text-accent-light" />
                    <h4 className="font-medium text-sm">Intelligent Document Processing</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent-light border border-accent/20">Processing</span>
                  </div>
                  <div className="space-y-1">
                    {workflowSteps.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.status === 'complete' ? 'bg-success/20' :
                            step.status === 'active' ? 'bg-accent/20 animate-pulse' :
                            'bg-surface border border-border'
                          }`}>
                            {step.status === 'complete' ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : step.status === 'active' ? (
                              <Sparkles className="w-4 h-4 text-accent-light" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-muted" />
                            )}
                          </div>
                          {i < workflowSteps.length - 1 && (
                            <div className={`w-px h-10 ${
                              step.status === 'complete' ? 'bg-success/30' : 'bg-border'
                            }`} />
                          )}
                        </div>
                        <div className="pb-6">
                          <p className={`text-sm font-medium ${
                            step.status === 'pending' ? 'text-muted' : ''
                          }`}>{step.label}</p>
                          <p className="text-xs text-muted mt-1">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 p-3 rounded-xl border border-accent/20 bg-accent/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">Processing time: <span className="text-foreground font-mono">4.2s</span></span>
                      <span className="text-xs text-muted">Manual equivalent: <span className="text-foreground font-mono">~45 min</span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
