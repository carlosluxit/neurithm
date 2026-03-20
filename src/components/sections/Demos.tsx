'use client'

import { useState } from 'react'
import {
  MessageSquare,
  BarChart3,
  FileText,
  Play,
  ArrowRight,
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react'
import SpotlightCard from '@/components/reactbits/SpotlightCard'

const demos = [
  {
    id: 'chatbot',
    title: 'AI Support Agent',
    description: 'See how our AI handles real customer queries with human-like understanding.',
    icon: MessageSquare,
    color: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    id: 'analytics',
    title: 'Smart Analytics',
    description: 'Watch AI transform raw data into actionable insights in seconds.',
    icon: BarChart3,
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'content',
    title: 'Content Engine',
    description: 'Generate on-brand content across channels with AI that knows your voice.',
    icon: FileText,
    color: 'from-emerald-500/20 to-teal-500/20',
  },
]

const chatMessages = [
  { role: 'user', text: 'I need help setting up automated invoicing for my 50-person team' },
  { role: 'assistant', text: 'I can help with that! Based on your team size, I recommend our Enterprise Automation Suite. It integrates with QuickBooks, Xero, and SAP. Want me to set up a demo environment?' },
  { role: 'user', text: 'Yes, and can it handle multi-currency billing?' },
  { role: 'assistant', text: 'Absolutely. Our system supports 135+ currencies with real-time exchange rates. I\'ll configure a sandbox with multi-currency enabled. You\'ll have it in 2 minutes.' },
]

export default function Demos() {
  const [activeDemo, setActiveDemo] = useState('chatbot')
  const [chatStep, setChatStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

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
          <p className="text-sm font-medium text-accent-light tracking-widest uppercase mb-4">
            See It In Action
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Interactive{' '}
            <span className="gradient-text">AI Demos</span>
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Experience the power of our AI solutions firsthand.
            These are live demos of what we build for clients.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demo Selector */}
          <div className="space-y-4">
            {demos.map((demo) => {
              const Icon = demo.icon
              const isActive = activeDemo === demo.id
              return (
                <button
                  key={demo.id}
                  onClick={() => { setActiveDemo(demo.id); setChatStep(0) }}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'border-accent/30 bg-accent/5'
                      : 'border-border bg-card hover:bg-card-hover hover:border-border-hover'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">{demo.title}</h4>
                      <p className="text-xs text-muted leading-relaxed">{demo.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Demo Window */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
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
                <div className="p-6 min-h-[400px] flex flex-col">
                  <div className="flex-1 space-y-4">
                    {chatMessages.slice(0, chatStep + 1).map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
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

                  {/* Chat Input */}
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
                <div className="p-6 min-h-[400px]">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-accent-light" />
                    <h4 className="font-medium text-sm">AI-Generated Insights</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Customer Acquisition Cost', value: '$12.40', change: '-34%', positive: true },
                      { label: 'Lead Response Time', value: '12s', change: '-99%', positive: true },
                      { label: 'Conversion Rate', value: '3.4%', change: '+62%', positive: true },
                      { label: 'Monthly Revenue Impact', value: '+$142K', change: '+67%', positive: true },
                    ].map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
                        <div>
                          <p className="text-xs text-muted mb-1">{metric.label}</p>
                          <p className="text-lg font-semibold">{metric.value}</p>
                        </div>
                        <div className={`text-sm font-medium ${metric.positive ? 'text-success' : 'text-error'}`}>
                          {metric.change}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-xl border border-accent/20 bg-accent/5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent-light mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted leading-relaxed">
                        <span className="text-foreground font-medium">AI Insight:</span> Your lead response time
                        improvement is driving a 62% increase in conversions. Recommend expanding AI agent coverage
                        to after-hours inquiries for an estimated additional $48K/month.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Demo */}
              {activeDemo === 'content' && (
                <div className="p-6 min-h-[400px]">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-5 h-5 text-accent-light" />
                    <h4 className="font-medium text-sm">Content Generation Preview</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface border border-border">
                      <p className="text-xs text-muted mb-2">LinkedIn Post</p>
                      <p className="text-sm leading-relaxed">
                        We just deployed 47 AI agents last quarter. Here&apos;s what nobody tells you about the first week:
                        <br /><br />
                        The agents don&apos;t replace your team. They amplify them.
                        <br /><br />
                        Our client&apos;s customer service team went from dreading Monday mornings to actually being excited —
                        because the AI handles the repetitive queries while they focus on complex, meaningful work.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface border border-border">
                      <p className="text-xs text-muted mb-2">Email Subject Lines (A/B Tested)</p>
                      <div className="space-y-2">
                        {['Your team is spending 40% of their time on tasks AI can handle',
                          'The $2.3M mistake companies make with AI adoption',
                          'What 89% of successful AI transformations have in common'
                        ].map((line, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <span className="text-xs text-accent-light font-mono w-4">#{i + 1}</span>
                            {line}
                          </div>
                        ))}
                      </div>
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
