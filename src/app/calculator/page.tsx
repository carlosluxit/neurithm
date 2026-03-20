'use client'

import { useState } from 'react'
import { Calculator, ArrowRight, TrendingUp, Clock, DollarSign, Users, Sparkles, BarChart3, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type CalcInputs = {
  employees: number
  avgSalary: number
  hoursOnRepetitive: number
  industry: string
  name: string
  email: string
  company: string
}

function calculateROI(inputs: CalcInputs) {
  const hourlyRate = inputs.avgSalary / 2080
  const totalRepetitiveHours = inputs.employees * inputs.hoursOnRepetitive * 52
  const automationRate = 0.65
  const hoursAutomated = totalRepetitiveHours * automationRate
  const annualSavings = hoursAutomated * hourlyRate
  const implementationCost = inputs.employees <= 50 ? 75000 : inputs.employees <= 200 ? 150000 : 300000
  const monthlyAgentCost = inputs.employees <= 50 ? 3000 : inputs.employees <= 200 ? 8000 : 15000
  const annualAgentCost = monthlyAgentCost * 12
  const netSavings = annualSavings - annualAgentCost
  const roi = ((netSavings - implementationCost) / implementationCost) * 100
  const paybackMonths = Math.ceil(implementationCost / (netSavings / 12))
  const fteEquivalent = Math.round(hoursAutomated / 2080 * 10) / 10

  // Multi-year projections (15% improvement year over year)
  const year1 = netSavings - implementationCost
  const year2 = netSavings
  const year3 = Math.round(netSavings * 1.15)
  const year4 = Math.round(netSavings * 1.3)
  const year5 = Math.round(netSavings * 1.45)

  return {
    annualSavings: Math.round(annualSavings),
    implementationCost,
    monthlyAgentCost,
    annualAgentCost,
    netSavings: Math.round(netSavings),
    roi: Math.round(roi),
    paybackMonths,
    hoursAutomated: Math.round(hoursAutomated),
    fteEquivalent,
    totalRepetitiveHours: Math.round(totalRepetitiveHours),
    projections: {
      year1: Math.round(year1),
      year2: Math.round(year2),
      year3,
      year4,
      year5,
      cumulative3yr: Math.round(year1 + year2 + year3),
      cumulative5yr: Math.round(year1 + year2 + year3 + year4 + year5),
    },
  }
}

export default function CalculatorPage() {
  const [inputs, setInputs] = useState<CalcInputs>({
    employees: 50,
    avgSalary: 65000,
    hoursOnRepetitive: 15,
    industry: '',
    name: '',
    email: '',
    company: '',
  })
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const results = calculateROI(inputs)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inputs.name,
          email: inputs.email,
          company: inputs.company,
          industry: inputs.industry,
          source: 'calculator',
          calculator_data: {
            employees: inputs.employees,
            avgSalary: inputs.avgSalary,
            hoursOnRepetitive: inputs.hoursOnRepetitive,
            results,
          },
        }),
      })
    } catch {
      // Continue even if API fails
    } finally {
      setIsSubmitting(false)
      setShowResults(true)
    }
  }

  if (showResults) {
    const maxProjection = Math.max(
      results.projections.year1,
      results.projections.year2,
      results.projections.year3,
      results.projections.year4,
      results.projections.year5,
    )

    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-6">
              <TrendingUp className="w-3.5 h-3.5 text-accent-light" />
              <span className="text-xs font-medium text-accent-light tracking-wide uppercase">Your ROI Projection</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 heading-display">
              ${Math.round(results.netSavings / 1000)}K Annual Net Savings
            </h1>
            <p className="text-lg text-muted">
              Based on {inputs.employees} employees with AI automation potential
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: DollarSign, label: 'Annual Savings', value: `$${Math.round(results.annualSavings / 1000)}K` },
              { icon: TrendingUp, label: 'ROI', value: `${results.roi}%` },
              { icon: Clock, label: 'Payback Period', value: `${results.paybackMonths} mo` },
              { icon: Users, label: 'FTE Equivalent', value: `${results.fteEquivalent}` },
            ].map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="glass-card rounded-xl p-6 text-center">
                  <Icon className="w-5 h-5 text-accent-light mx-auto mb-3" />
                  <p className="text-2xl font-bold mb-1">{metric.value}</p>
                  <p className="text-xs text-muted">{metric.label}</p>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 5-Year Projection Chart */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-accent-light" />
                <h3 className="font-semibold">5-Year Savings Projection</h3>
              </div>
              <div className="flex items-end gap-3 h-48 mb-4">
                {[
                  { year: 'Y1', value: results.projections.year1 },
                  { year: 'Y2', value: results.projections.year2 },
                  { year: 'Y3', value: results.projections.year3 },
                  { year: 'Y4', value: results.projections.year4 },
                  { year: 'Y5', value: results.projections.year5 },
                ].map((bar) => {
                  const height = maxProjection > 0 ? Math.max((bar.value / maxProjection) * 100, 5) : 5
                  return (
                    <div key={bar.year} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-mono text-muted">
                        ${Math.round(bar.value / 1000)}K
                      </span>
                      <div className="w-full relative" style={{ height: `${height}%` }}>
                        <div className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-accent to-accent-light opacity-80" />
                      </div>
                      <span className="text-xs text-muted">{bar.year}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted">5-Year Cumulative</span>
                <span className="text-lg font-bold text-success">${Math.round(results.projections.cumulative5yr / 1000)}K</span>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="font-semibold mb-6">Financial Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: 'Hours automated annually', value: `${results.hoursAutomated.toLocaleString()} hrs` },
                  { label: 'Gross savings from automation', value: `$${results.annualSavings.toLocaleString()}`, positive: true },
                  { label: 'Implementation (one-time)', value: `-$${results.implementationCost.toLocaleString()}` },
                  { label: 'AI operations (annual)', value: `-$${results.annualAgentCost.toLocaleString()}` },
                  { label: 'Net Year 1', value: `$${results.projections.year1.toLocaleString()}`, bold: true },
                  { label: 'Net Year 2+', value: `$${results.netSavings.toLocaleString()}`, positive: true, bold: true },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between py-2 ${row.bold ? 'border-t border-border pt-3' : ''}`}>
                    <span className={`text-sm ${row.bold ? 'font-medium' : 'text-muted'}`}>{row.label}</span>
                    <span className={`text-sm font-mono ${row.positive ? 'text-success' : ''} ${row.bold ? 'font-bold' : ''}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h3 className="font-semibold mb-4">Methodology & Assumptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted">
              <div className="space-y-2">
                <p>&#x2022; 65% of repetitive tasks are automatable with current AI</p>
                <p>&#x2022; Implementation costs based on company size tier</p>
                <p>&#x2022; 15% year-over-year improvement from AI learning</p>
              </div>
              <div className="space-y-2">
                <p>&#x2022; Agent costs include hosting, maintenance, and monitoring</p>
                <p>&#x2022; Savings exclude indirect benefits (quality, speed, satisfaction)</p>
                <p>&#x2022; Based on Neurithm&apos;s 50+ enterprise engagements</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card rounded-2xl p-8 text-center gradient-border">
            <h3 className="text-xl font-bold mb-3">Ready to Capture These Savings?</h3>
            <p className="text-muted text-sm mb-6 max-w-md mx-auto">
              Book a free discovery call to discuss your specific use cases and get a
              detailed implementation plan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="btn-primary py-4 px-8 inline-flex items-center gap-3 group text-base">
                Book Discovery Call
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => setShowResults(false)}
                className="btn-secondary py-4 px-8 inline-flex items-center gap-3 text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                Recalculate
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-6">
            <Calculator className="w-3.5 h-3.5 text-accent-light" />
            <span className="text-xs font-medium text-accent-light tracking-wide uppercase">
              Free Tool
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 heading-display">
            AI ROI Calculator
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto">
            See exactly how much AI automation can save your business.
            Get a personalized projection in 60 seconds.
          </p>
        </div>

        {/* Calculator Form */}
        <div className="glass-card rounded-2xl p-8">
          <div className="space-y-6">
            {/* Employees slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Number of Employees</label>
                <span className="text-sm text-accent-light font-mono">{inputs.employees}</span>
              </div>
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={inputs.employees}
                onChange={(e) => setInputs({ ...inputs, employees: Number(e.target.value) })}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>5</span><span>1,000</span>
              </div>
            </div>

            {/* Salary slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Average Annual Salary</label>
                <span className="text-sm text-accent-light font-mono">${inputs.avgSalary.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="30000"
                max="200000"
                step="5000"
                value={inputs.avgSalary}
                onChange={(e) => setInputs({ ...inputs, avgSalary: Number(e.target.value) })}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>$30K</span><span>$200K</span>
              </div>
            </div>

            {/* Hours slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Hours/week on Repetitive Tasks (per person)</label>
                <span className="text-sm text-accent-light font-mono">{inputs.hoursOnRepetitive}h</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={inputs.hoursOnRepetitive}
                onChange={(e) => setInputs({ ...inputs, hoursOnRepetitive: Number(e.target.value) })}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>2h</span><span>30h</span>
              </div>
            </div>

            {/* Live preview */}
            <div className="p-4 rounded-xl border border-accent/20 bg-accent/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent-light" />
                <span className="text-sm font-medium">Live Projection</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted mb-1">Annual Savings</p>
                  <p className="text-lg font-bold text-success">${Math.round(results.annualSavings / 1000)}K</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">ROI</p>
                  <p className="text-lg font-bold text-white">{results.roi}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">FTE Saved</p>
                  <p className="text-lg font-bold">{results.fteEquivalent}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-accent/10">
                <p className="text-xs text-muted mb-1">5-Year Cumulative Savings</p>
                <p className="text-lg font-bold text-success">${Math.round(results.projections.cumulative5yr / 1000)}K</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-6">
              <p className="text-sm font-medium mb-4">Get your detailed report</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-2">Full Name</label>
                  <input
                    type="text"
                    value={inputs.name}
                    onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-2">Work Email</label>
                  <input
                    type="email"
                    value={inputs.email}
                    onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                    placeholder="jane@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs text-muted mb-2">Company</label>
                  <input
                    type="text"
                    value={inputs.company}
                    onChange={(e) => setInputs({ ...inputs, company: e.target.value })}
                    placeholder="Acme Inc"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-2">Industry</label>
                  <select
                    value={inputs.industry}
                    onChange={(e) => setInputs({ ...inputs, industry: e.target.value })}
                  >
                    <option value="">Select industry</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Financial Services</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="legal">Legal</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!inputs.name || !inputs.email || isSubmitting}
              className="w-full btn-primary py-4 inline-flex items-center justify-center gap-3 group text-base disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Calculating...' : 'Get Full ROI Report'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
