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
  Phone,
  Mic,
  MicOff,
  PhoneOff,
  User,
  Calendar,
  ShoppingBag,
  Headphones,
} from 'lucide-react'
import Link from 'next/link'

const demos = [
  {
    id: 'voice',
    title: 'Voice Agents',
    description: 'AI-powered phone agents for sales, support, and scheduling.',
    icon: Phone,
    color: 'from-accent/20 to-accent-light/20',
  },
  {
    id: 'chatbot',
    title: 'AI Support Agent',
    description: 'Real-time customer query handling with human-like understanding.',
    icon: MessageSquare,
    color: 'from-accent/15 to-indigo-500/15',
  },
  {
    id: 'analytics',
    title: 'Smart Analytics',
    description: 'Transform raw data into actionable insights in seconds.',
    icon: BarChart3,
    color: 'from-purple-500/20 to-accent/20',
  },
  {
    id: 'content',
    title: 'Content Engine',
    description: 'On-brand content across channels with AI that knows your voice.',
    icon: FileText,
    color: 'from-indigo-500/15 to-accent/15',
  },
  {
    id: 'workflow',
    title: 'Workflow Automation',
    description: 'End-to-end process automation with intelligent decision routing.',
    icon: Zap,
    color: 'from-accent/20 to-purple-500/20',
  },
]

const voiceScenarios = [
  {
    id: 'sdr',
    label: 'SDR Outbound',
    icon: User,
    caller: 'AI Sales Agent',
    recipient: 'Marketing Director',
    company: 'TechCorp Inc.',
    duration: '2:34',
    transcript: [
      { speaker: 'agent', text: 'Hi Sarah, this is Alex from Neurithm. I noticed TechCorp recently expanded your customer support team to 40 agents. Are you still handling ticket routing manually?' },
      { speaker: 'customer', text: 'Actually yes, it\'s been a pain point. How did you know about that?' },
      { speaker: 'agent', text: 'We work with companies scaling their support operations. Our AI routing system cut ticket resolution time by 62% for a similar-sized team at Meridian Health. Would a 15-minute demo next Tuesday work?' },
      { speaker: 'customer', text: 'That\'s impressive. Tuesday afternoon works, send me an invite.' },
      { speaker: 'agent', text: 'Perfect, I\'ll send a calendar invite for 2 PM EST with a brief overview. Looking forward to showing you the results, Sarah.' },
    ],
    metrics: { sentiment: 'Positive', outcome: 'Meeting Booked', confidence: '94%' },
  },
  {
    id: 'appointment',
    label: 'Appointment Verification',
    icon: Calendar,
    caller: 'AI Scheduler',
    recipient: 'Patient',
    company: 'Apex Medical Group',
    duration: '1:12',
    transcript: [
      { speaker: 'agent', text: 'Hello, this is a courtesy call from Apex Medical Group. Am I speaking with James Rodriguez?' },
      { speaker: 'customer', text: 'Yes, that\'s me.' },
      { speaker: 'agent', text: 'Great, James. I\'m confirming your appointment with Dr. Chen this Thursday, March 26th at 10:30 AM. Can you still make it?' },
      { speaker: 'customer', text: 'Actually, can we push it to the afternoon?' },
      { speaker: 'agent', text: 'Absolutely. I have 2:15 PM or 3:45 PM available with Dr. Chen that same day. Which works better?' },
      { speaker: 'customer', text: '3:45 please.' },
      { speaker: 'agent', text: 'Done — rescheduled to Thursday March 26th at 3:45 PM. You\'ll get a confirmation text shortly. Is there anything else I can help with?' },
    ],
    metrics: { sentiment: 'Neutral', outcome: 'Rescheduled', confidence: '98%' },
  },
  {
    id: 'concierge',
    label: 'Concierge Service',
    icon: Headphones,
    caller: 'AI Concierge',
    recipient: 'Hotel Guest',
    company: 'The Laurent Hotel',
    duration: '1:48',
    transcript: [
      { speaker: 'agent', text: 'Good evening and welcome to The Laurent. This is your AI concierge. How can I make your stay exceptional tonight?' },
      { speaker: 'customer', text: 'Hi, we just checked in. Looking for a great Italian restaurant nearby for two, maybe something with a view?' },
      { speaker: 'agent', text: 'Wonderful taste. I\'d recommend Terrazza — it\'s a 7-minute walk, rooftop seating overlooking the harbor. They have a seasonal truffle menu right now that guests love. Shall I reserve a table?' },
      { speaker: 'customer', text: 'Yes, 8 PM if possible.' },
      { speaker: 'agent', text: 'Reserved — 8 PM, table for two, rooftop section. I\'ve also arranged a complimentary aperitivo on arrival since you\'re a Laurent guest. I\'ll send walking directions to your room tablet.' },
    ],
    metrics: { sentiment: 'Positive', outcome: 'Reservation Made', confidence: '97%' },
  },
  {
    id: 'sales',
    label: 'Inbound Sales',
    icon: ShoppingBag,
    caller: 'AI Sales Agent',
    recipient: 'Inbound Lead',
    company: 'CloudSync Solutions',
    duration: '3:05',
    transcript: [
      { speaker: 'customer', text: 'Hi, I saw your website. We\'re looking for an automation solution for our logistics team, about 200 shipments a day.' },
      { speaker: 'agent', text: 'Thanks for reaching out! 200 shipments daily — are you currently tracking those manually, or do you have a system that\'s just not keeping up?' },
      { speaker: 'customer', text: 'We use spreadsheets and it\'s a nightmare. We\'re losing packages and customers are complaining.' },
      { speaker: 'agent', text: 'I hear that a lot. Our AI routing engine processes shipments in real time — one client at your volume reduced lost packages by 94% in the first month. What\'s your biggest pain: tracking accuracy, delivery speed, or customer notifications?' },
      { speaker: 'customer', text: 'All three honestly. What would this cost us?' },
      { speaker: 'agent', text: 'For 200 daily shipments, you\'re looking at the Growth tier — $890/month. But based on your loss rate, most clients at your scale see ROI within 3 weeks. I can set up a pilot with your real data this week. Want me to connect you with our solutions team?' },
    ],
    metrics: { sentiment: 'High Intent', outcome: 'Qualified Lead', confidence: '91%' },
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
  const [activeDemo, setActiveDemo] = useState('voice')
  const [chatStep, setChatStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [analyticsAnimated, setAnalyticsAnimated] = useState(false)
  const [activeVoiceScenario, setActiveVoiceScenario] = useState('sdr')
  const [voiceStep, setVoiceStep] = useState(0)
  const [callActive, setCallActive] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (activeDemo === 'analytics') {
      setAnalyticsAnimated(false)
      const timer = setTimeout(() => setAnalyticsAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [activeDemo])

  const currentScenario = voiceScenarios.find(s => s.id === activeVoiceScenario) ?? voiceScenarios[0]

  useEffect(() => {
    setVoiceStep(0)
    setCallActive(true)
    setIsMuted(false)
  }, [activeVoiceScenario])

  useEffect(() => {
    if (activeDemo !== 'voice' || !callActive) return
    if (voiceStep >= currentScenario.transcript.length - 1) return
    const delay = currentScenario.transcript[voiceStep].speaker === 'agent' ? 2200 : 1800
    const timer = setTimeout(() => setVoiceStep(prev => prev + 1), delay)
    return () => clearTimeout(timer)
  }, [activeDemo, voiceStep, callActive, currentScenario])

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
        <div className="max-w-5xl mx-auto text-center mb-20 lg:mb-28">
          <p className="section-label mb-6">
            See It In Action
          </p>
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] heading-display uppercase">
            Interactive AI Demos
          </h2>
          <p className="mt-8 text-2xl sm:text-3xl text-muted leading-relaxed max-w-3xl mx-auto">
            Experience the power of our AI solutions firsthand.
            Live demos of what we build for clients.
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
                  <span className="flex items-start gap-3">
                    <span className={`w-9 h-9 rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-foreground" />
                    </span>
                    <span className="block">
                      <span className="font-medium text-sm mb-0.5 block">{demo.title}</span>
                      <span className="text-xs text-muted leading-relaxed block">{demo.description}</span>
                    </span>
                  </span>
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
                    neurithm.dev / demo / {activeDemo}
                  </div>
                </div>
              </div>

              {/* Voice Agent Demo */}
              {activeDemo === 'voice' && (
                <div className="p-6 h-[520px] flex flex-col overflow-hidden">
                  {/* Scenario tabs */}
                  <div className="flex gap-2 mb-5 overflow-x-auto pb-1 flex-shrink-0">
                    {voiceScenarios.map((scenario) => {
                      const ScIcon = scenario.icon
                      return (
                        <button
                          key={scenario.id}
                          onClick={() => setActiveVoiceScenario(scenario.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                            activeVoiceScenario === scenario.id
                              ? 'bg-accent/15 text-accent-light border border-accent/30'
                              : 'bg-surface border border-border text-muted hover:text-foreground hover:border-border-hover'
                          }`}
                        >
                          <ScIcon className="w-3.5 h-3.5" />
                          {scenario.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Call header */}
                  <div className="flex items-center justify-between mb-5 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${callActive ? 'bg-green-500/20' : 'bg-surface border border-border'}`}>
                        <Phone className={`w-5 h-5 ${callActive ? 'text-green-400' : 'text-muted'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{currentScenario.caller}</p>
                        <p className="text-xs text-muted">{currentScenario.company} → {currentScenario.recipient}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {callActive && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-xs text-green-400 font-mono">{currentScenario.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Waveform visualization */}
                  {callActive && (
                    <div className={`flex items-center justify-center gap-[3px] h-8 mb-5 flex-shrink-0 ${isMuted ? 'waveform-muted' : ''}`}>
                      {Array.from({ length: 40 }).map((_, i) => {
                        // Speech-like pattern: clusters of activity with natural pauses
                        const seed = Math.sin(i * 1.7 + 3) * 0.5 + 0.5
                        const cluster = Math.sin(i * 0.4) * 0.5 + 0.5
                        const maxHeight = Math.round(Math.max(4, seed * cluster * 28 + 4))
                        const duration = Math.round((1.6 + Math.sin(i * 0.9) * 0.6) * 100) / 100
                        const delay = Math.round(i * 8) / 100
                        return (
                          <div
                            key={i}
                            className="waveform-bar rounded-full bg-accent-light/70"
                            style={{
                              width: '3px',
                              height: `${maxHeight}px`,
                              '--wave-duration': `${duration}s`,
                              '--wave-delay': `${delay}s`,
                            } as React.CSSProperties}
                          />
                        )
                      })}
                    </div>
                  )}

                  {/* Live transcript */}
                  <div
                    className="space-y-3 flex-1 overflow-y-auto mb-5 min-h-0 scroll-smooth"
                    ref={(el) => { if (el) el.scrollTop = el.scrollHeight }}
                  >
                    {currentScenario.transcript.slice(0, voiceStep + 1).map((line, i) => (
                      <div
                        key={`${currentScenario.id}-${i}`}
                        className={`flex gap-3 ${i === voiceStep ? 'animate-transcript-in' : ''}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          line.speaker === 'agent' ? 'bg-accent/20' : 'bg-surface-raised border border-border'
                        }`}>
                          {line.speaker === 'agent' ? (
                            <Bot className="w-3 h-3 text-accent-light" />
                          ) : (
                            <User className="w-3 h-3 text-muted" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] text-muted mb-0.5 uppercase tracking-wider">
                            {line.speaker === 'agent' ? currentScenario.caller : currentScenario.recipient}
                          </p>
                          <p className="text-sm leading-relaxed">{line.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Call controls + metrics */}
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto flex-shrink-0">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isMuted ? 'bg-red-500/20 text-red-400' : 'bg-surface border border-border text-muted hover:text-foreground'
                        }`}
                      >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setCallActive(!callActive)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          callActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {callActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-muted">Sentiment</p>
                        <p className="text-xs font-medium text-success">{currentScenario.metrics.sentiment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted">Outcome</p>
                        <p className="text-xs font-medium">{currentScenario.metrics.outcome}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted">Confidence</p>
                        <p className="text-xs font-medium text-accent-light">{currentScenario.metrics.confidence}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Demo */}
              {activeDemo === 'chatbot' && (
                <div className="p-6 h-[520px] flex flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto min-h-0">
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
                <div className="p-6 h-[520px] overflow-y-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-accent-light" />
                    <h3 className="font-medium text-sm">AI-Generated Insights</h3>
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
                <div className="p-6 h-[520px] overflow-y-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-5 h-5 text-accent-light" />
                    <h3 className="font-medium text-sm">Multi-Channel Content Generation</h3>
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
                <div className="p-6 h-[520px] overflow-y-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-5 h-5 text-accent-light" />
                    <h3 className="font-medium text-sm">Intelligent Document Processing</h3>
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
