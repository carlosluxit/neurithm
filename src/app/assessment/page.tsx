'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Download, BarChart3 } from 'lucide-react'
import { ASSESSMENT_QUESTIONS } from '@/lib/constants'

type Answers = Record<string, number>

function getScoreLabel(score: number) {
  if (score >= 80) return { label: 'AI-Ready Leader', color: 'text-success', description: 'Your organization is well-positioned for advanced AI implementation. Let\'s accelerate your transformation.' }
  if (score >= 60) return { label: 'AI-Prepared', color: 'text-accent-light', description: 'Strong foundation in place. Strategic AI initiatives can deliver significant ROI within months.' }
  if (score >= 40) return { label: 'AI-Emerging', color: 'text-warning', description: 'Good starting point with clear opportunities. A structured approach will maximize your AI investment.' }
  return { label: 'AI-Exploring', color: 'text-muted', description: 'You\'re at the beginning of your AI journey. Our Discovery phase is designed exactly for organizations like yours.' }
}

function getDimensionScores(answers: Answers) {
  return ASSESSMENT_QUESTIONS.map((q) => ({
    category: q.category,
    score: ((answers[q.id] || 1) / 5) * 100,
    value: answers[q.id] || 1,
  }))
}

export default function AssessmentPage() {
  const [step, setStep] = useState(0) // 0 = intro, 1-6 = questions, 7 = contact, 8 = results
  const [answers, setAnswers] = useState<Answers>({})
  const [contact, setContact] = useState({ name: '', email: '', company: '', role: '', industry: '', company_size: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const totalQuestions = ASSESSMENT_QUESTIONS.length
  const currentQuestion = step > 0 && step <= totalQuestions ? ASSESSMENT_QUESTIONS[step - 1] : null

  const totalScore = Math.round(
    (Object.values(answers).reduce((a, b) => a + b, 0) / (totalQuestions * 5)) * 100
  )

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          source: 'assessment',
          score: totalScore,
          assessment_data: answers,
        }),
      })
      setSubmitted(true)
      setStep(totalQuestions + 2)
    } catch {
      // Still show results even if API fails
      setStep(totalQuestions + 2)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Intro screen
  if (step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-8">
            <BarChart3 className="w-3.5 h-3.5 text-accent-light" />
            <span className="text-xs font-medium text-accent-light tracking-wide uppercase">
              Free Assessment
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            AI Transformation{' '}
            <span className="gradient-text">Readiness Score</span>
          </h1>

          <p className="text-lg text-muted leading-relaxed mb-8 max-w-xl mx-auto">
            Answer 6 quick questions to discover how ready your organization is for
            AI transformation. Get a personalized score and actionable recommendations.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-accent-light">2 min</p>
              <p className="text-xs text-muted mt-1">To complete</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-accent-light">6</p>
              <p className="text-xs text-muted mt-1">Questions</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-accent-light">Free</p>
              <p className="text-xs text-muted mt-1">Always</p>
            </div>
          </div>

          <button
            onClick={() => setStep(1)}
            className="btn-primary text-base py-4 px-10 inline-flex items-center gap-3 group"
          >
            Start Assessment
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    )
  }

  // Question screens
  if (currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-2xl mx-auto px-6 w-full">
          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between text-xs text-muted mb-3">
              <span>{currentQuestion.category}</span>
              <span>{step} of {totalQuestions}</span>
            </div>
            <div className="h-1 rounded-full bg-border">
              <div
                className="h-1 rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-500"
                style={{ width: `${(step / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-10">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-accent bg-accent/10'
                      : 'border-border bg-card hover:bg-card-hover hover:border-border-hover'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? 'border-accent bg-accent' : 'border-border'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm leading-relaxed">{option.label}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary py-3 px-6 inline-flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setStep(step + 1)}
              disabled={!answers[currentQuestion.id]}
              className="btn-primary py-3 px-6 inline-flex items-center gap-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {step === totalQuestions ? 'See Results' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Contact form (step = totalQuestions + 1)
  if (step === totalQuestions + 1) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-lg mx-auto px-6 w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-accent-light" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3">
              Your Score is Ready!
            </h2>
            <p className="text-muted">
              Enter your details to receive your personalized AI readiness report.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-2">Full Name</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-2">Work Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  placeholder="jane@company.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-2">Company</label>
                <input
                  type="text"
                  value={contact.company}
                  onChange={(e) => setContact({ ...contact, company: e.target.value })}
                  placeholder="Acme Inc"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-2">Role</label>
                <input
                  type="text"
                  value={contact.role}
                  onChange={(e) => setContact({ ...contact, role: e.target.value })}
                  placeholder="VP Operations"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-2">Industry</label>
                <select
                  value={contact.industry}
                  onChange={(e) => setContact({ ...contact, industry: e.target.value })}
                >
                  <option value="">Select industry</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Financial Services</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="legal">Legal</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="professional-services">Professional Services</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-2">Company Size</label>
                <select
                  value={contact.company_size}
                  onChange={(e) => setContact({ ...contact, company_size: e.target.value })}
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1,000 employees</option>
                  <option value="1001+">1,001+ employees</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(totalQuestions)}
              className="btn-secondary py-3 px-6 inline-flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!contact.name || !contact.email || isSubmitting}
              className="btn-primary py-3 px-8 inline-flex items-center gap-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Get My Score'}
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Results screen
  const scoreInfo = getScoreLabel(totalScore)
  const dimensions = getDimensionScores(answers)

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Score Header */}
        <div className="text-center mb-12">
          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
              <circle
                cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGradient)" strokeWidth="8"
                strokeDasharray={`${(totalScore / 100) * 327} 327`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c5cfc" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{totalScore}</span>
              <span className="text-xs text-muted">/100</span>
            </div>
          </div>

          <h2 className={`text-2xl font-bold ${scoreInfo.color} mb-3`}>{scoreInfo.label}</h2>
          <p className="text-muted max-w-md mx-auto">{scoreInfo.description}</p>
        </div>

        {/* Dimension Breakdown */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h3 className="font-semibold mb-6">Dimension Breakdown</h3>
          <div className="space-y-5">
            {dimensions.map((dim) => (
              <div key={dim.category}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>{dim.category}</span>
                  <span className="text-accent-light font-medium">{Math.round(dim.score)}%</span>
                </div>
                <div className="h-2 rounded-full bg-border">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-1000"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h3 className="font-semibold mb-6">Recommended Next Steps</h3>
          <div className="space-y-4">
            {[
              { title: 'Schedule a Discovery Call', description: 'Discuss your specific challenges with our AI strategists.' },
              { title: 'Review Your AI Roadmap', description: 'We\'ll create a custom implementation plan based on your score.' },
              { title: 'Start with Quick Wins', description: 'Identify 2-3 high-impact, low-effort AI automations to build momentum.' },
            ].map((rec, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent-light">{i + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-muted">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="btn-primary py-4 px-8 inline-flex items-center gap-3 group text-base">
            <Download className="w-4 h-4" />
            Download Full Report (PDF)
          </button>
          <p className="text-xs text-muted mt-4">
            A detailed report has been sent to {contact.email || 'your email'}
          </p>
        </div>
      </div>
    </div>
  )
}
