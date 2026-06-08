'use client'

import React from 'react'
import { DollarSign } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PricingEstimator from '@/components/PricingEstimator'

export default function PricingPage() {
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

          <PricingEstimator />

        </div>
      </main>

      <Footer />
    </div>
  )
}
