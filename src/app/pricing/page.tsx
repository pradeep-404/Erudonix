'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Minus, 
  ArrowRight, 
  DollarSign, 
  Sparkles, 
  Zap, 
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PricingPage() {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD')
  const [calcService, setCalcService] = useState<'academic_support' | 'small_language_models' | 'app_studio'>('academic_support')
  const [calcPages, setCalcPages] = useState(5)
  const [calcSlmScale, setCalcSlmScale] = useState<'tune' | 'complex' | 'custom'>('tune')
  const [calcAppScale, setCalcAppScale] = useState<'dash' | 'full' | 'enterprise'>('dash')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchSession()
  }, [])

  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' }

  const pricingRates = {
    USD: { base: 40, multiplier: { academic_support: 1.0, small_language_models: 10.0, app_studio: 15.0 }, page: 0, slm: { tune: 150, complex: 600, custom: 2000 }, app: { dash: 250, full: 800, enterprise: 3000 } },
    EUR: { base: 32, multiplier: { academic_support: 1.0, small_language_models: 10.0, app_studio: 15.0 }, page: 0, slm: { tune: 130, complex: 550, custom: 1800 }, app: { dash: 220, full: 700, enterprise: 2600 } },
    GBP: { base: 30, multiplier: { academic_support: 1.0, small_language_models: 10.0, app_studio: 15.0 }, page: 0, slm: { tune: 110, complex: 450, custom: 1500 }, app: { dash: 180, full: 600, enterprise: 2200 } }
  }

  const calculateEstimate = () => {
    const rate = pricingRates[currency]
    
    if (calcService === 'academic_support') {
      if (currency === 'GBP') return 30
      if (currency === 'EUR') return 32
      if (currency === 'USD') return 40
      return 30
    } else if (calcService === 'small_language_models') {
      return rate.slm[calcSlmScale]
    } else {
      return rate.app[calcAppScale]
    }
  }

  const handleIntakeAction = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('open-auth-drawer'))
    }
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 relative z-10">
        {/* Glow rings */}
        <div className="absolute top-[25%] left-[-15%] w-[45rem] h-[45rem] rounded-full bg-gemini-blue/5 blur-[125px] pointer-events-none" />
        <div className="absolute bottom-[15%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-gemini-purple/5 blur-[125px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gemini-blue/20 bg-accent-warm-light/60 text-gemini-indigo text-xs font-semibold uppercase tracking-wider shadow-sm">
              <DollarSign className="h-3.5 w-3.5 text-gemini-purple animate-pulse" /> Estimator Console
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Transparent <span className="bg-gradient-to-r from-gemini-blue via-gemini-purple to-gemini-amber bg-clip-text text-transparent italic">Pricing</span> Matrix
            </h1>
            <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Estimate your academic modules guidance or custom developer projects. Start with our baseline currencies immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start mb-20">
            
            {/* Left inputs */}
            <div className="lg:col-span-7 bg-card border border-border p-6 md:p-8 rounded-[2.5rem] shadow-xs space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-3">Currency</label>
                <div className="flex gap-2">
                  {(['USD', 'EUR', 'GBP'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`flex-1 py-2 text-sm font-semibold rounded-full border transition-all ${
                        currency === curr
                          ? 'bg-gradient-to-r from-gemini-blue to-gemini-indigo border-transparent text-white shadow-sm'
                          : 'border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-3">Choose Service Line</label>
                <div className="flex flex-col gap-2.5">
                  {[
                    { id: 'academic_support', label: 'Academic Support & Syllabus Tutoring', desc: '1:1 Guided sessions starting at £30 / €32 / $40' },
                    { id: 'small_language_models', label: 'Small Language Models Tuning', desc: 'Secure offline instruct-tuning starting at £110 / €130 / $150' },
                    { id: 'app_studio', label: 'App Studio Development', desc: 'Fintech ledger worksheets starting at £180 / €220 / $250' }
                  ].map((serv) => (
                    <button
                      key={serv.id}
                      onClick={() => setCalcService(serv.id as any)}
                      className={`p-4 text-xs font-semibold text-left rounded-2xl border transition-all flex flex-col gap-1 ${
                        calcService === serv.id
                          ? 'bg-accent-warm-light/40 border-gemini-blue/40 text-gemini-indigo dark:text-gemini-blue'
                          : 'border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground'
                      }`}
                    >
                      <span className="font-bold text-sm">{serv.label}</span>
                      <span className="text-[10px] text-text-muted/80 leading-normal">{serv.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {calcService === 'small_language_models' && (
                <div className="space-y-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">Model Tuning Scale</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'tune', label: 'Supervised Fine-Tuning (SFT)', desc: 'Tuning 1.5B/3B parameters on narrow datasets' },
                      { id: 'complex', label: 'Preference Alignment (DPO)', desc: 'RLHF alignment layers on 7B/8B params' },
                      { id: 'custom', label: 'Custom Model Architecture', desc: 'Bespoke corporate knowledge weights compiling' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCalcSlmScale(item.id as any)}
                        className={`py-3 px-4 text-xs text-left rounded-xl border transition-all flex justify-between items-center ${
                          calcSlmScale === item.id
                            ? 'bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400'
                            : 'border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground'
                        }`}
                      >
                        <span className="font-bold">{item.label}</span>
                        <span className="text-[10px] opacity-75">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {calcService === 'app_studio' && (
                <div className="space-y-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">Software Project Scope</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'dash', label: 'Basic Tool / Rent Worksheet', desc: 'Sheet calculations and employee dashboards' },
                      { id: 'full', label: 'App Database & Billing Engine', desc: 'Relational databases and custom invoices builders' },
                      { id: 'enterprise', label: 'Fintech Suite Platform', desc: 'High-speed ledger accounting integrations' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCalcAppScale(item.id as any)}
                        className={`py-3 px-4 text-xs text-left rounded-xl border transition-all flex justify-between items-center ${
                          calcAppScale === item.id
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                            : 'border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground'
                        }`}
                      >
                        <span className="font-bold">{item.label}</span>
                        <span className="text-[10px] opacity-75">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right quote panel */}
            <div className="lg:col-span-5 bg-card border border-border p-6 md:p-8 rounded-[2.5rem] shadow-xs flex flex-col justify-between text-center sticky top-28 min-h-[350px]">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-warm-light border border-accent-warm/15 text-accent-warm text-[10px] uppercase font-bold tracking-wider">
                  Estimate generated
                </span>
                <div className="text-6xl font-serif font-black text-gemini-indigo">
                  {currencySymbols[currency]}{calculateEstimate()}
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed max-w-sm mx-auto">
                  Calculated based on starting baseline rates. This serves as an initial quote. Final billing coordinates directly after matched specialist review.
                </p>
              </div>

              <div className="space-y-4 pt-8 border-t border-border/80">
                <Link
                  href={user ? "/dashboard/student/new" : "#"}
                  onClick={handleIntakeAction}
                  className="w-full inline-flex items-center justify-center font-bold px-6 py-3.5 rounded-full bg-gradient-to-r from-gemini-blue to-gemini-purple text-white shadow-md text-xs hover:opacity-95 transition-all"
                >
                  Submit Intake details
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
                
                <div className="flex justify-center items-center gap-1.5 text-[10px] text-text-muted">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Secure billing pool configuration</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
