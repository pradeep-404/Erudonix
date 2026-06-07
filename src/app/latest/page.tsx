'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Calendar, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LatestUpdatesPage() {
  const updates = [
    {
      date: "June 2025",
      version: "v1.4.0",
      title: "Interactive Feedback Widget & Results Telemetry",
      badge: "Feature Release",
      badgeColor: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
      description: "We released the interactive student feedback workflow for completed requests.",
      details: [
        "Interactive Star Ratings (1-5) and detailed text feedback logs.",
        "Marks section supporting score entries out of 100.",
        "Optional grades certificate/screenshot upload with view thumbnail links.",
        "Auto-collapsible widget on submit with full edit capabilities at any time."
      ]
    },
    {
      date: "June 2025",
      version: "v1.3.0",
      title: "Integer-Flooring GBP Conversion Engine",
      badge: "System Update",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
      description: "Support for dynamic local pricing calculations in GBP, USD, and EUR.",
      details: [
        "Academic Support standard base quote set at £6 GBP per page (10 pages default = £60 base).",
        "Real-time currency exchange conversions using integer flooring (Math.floor) with zero decimals.",
        "GBP (£) symbol support correctly integrated across all user dashboards."
      ]
    },
    {
      date: "June 2025",
      version: "v1.2.0",
      title: "Small Language Model Weights Tuning Diagnostics",
      badge: "AI Optimization",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800",
      description: "Full casing and user interfaces tracking model fine-tuning progress.",
      details: [
        "SFT (Supervised Fine-Tuning) and DPO (Direct Preference Optimization) parameters telemetry.",
        " quantizations monitoring tracking offline data residency compliance.",
        "Embedded interactive network node diagram visuals showing optimizer weights metrics."
      ]
    },
    {
      date: "June 2025",
      version: "v1.1.0",
      title: "Document Upload Restraints & Chat Integration",
      badge: "Security Upgrade",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
      description: "Refining security policies for course support document intakes.",
      details: [
        "Restricting initial context uploads to 5 documents per student request.",
        "Integrated chat-based uploads allowing specialists to deliver tutoring reports directly in thread.",
        "Tutor override control allowing extra uploads on a per-request basis."
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 relative">
        {/* Background glow highlights */}
        <div className="absolute top-[15%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-gemini-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-gemini-purple/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gemini-blue/20 bg-accent-warm-light/60 text-gemini-indigo text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-gemini-purple animate-pulse" /> Platform Changelog
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              What's New in <span className="bg-gradient-to-r from-gemini-blue via-gemini-purple to-gemini-amber bg-clip-text text-transparent italic">Erudogix</span>
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
              Track the latest features, architectural upgrades, and algorithmic developments deployed across the Erudogix platform.
            </p>
          </div>

          {/* Timeline Updates Stack */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative border-l border-border/80 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12"
          >
            {updates.map((upd, idx) => (
              <motion.div 
                key={idx}
                variants={cardVariants}
                className="relative space-y-4"
              >
                {/* Timeline node */}
                <div className="absolute left-[-35px] md:left-[-51px] top-1 h-5 w-5 rounded-full border-4 border-background bg-accent-warm shadow-sm flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                {/* Card item */}
                <div className="group bg-card border border-border/80 hover:border-accent-warm/40 p-6 md:p-8 rounded-[2rem] shadow-xs hover:shadow-[0_0_25px_rgba(240,179,35,0.06)] transition-all duration-300 space-y-4">
                  
                  {/* Header meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-muted font-mono">{upd.version}</span>
                      <span className="text-xs text-text-muted/65">•</span>
                      <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                        <Calendar className="h-3.5 w-3.5 text-accent-warm" /> {upd.date}
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${upd.badgeColor}`}>
                      {upd.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1.5 text-left">
                    <h3 className="font-serif text-lg md:text-xl font-bold text-foreground group-hover:text-accent-warm transition-colors">
                      {upd.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {upd.description}
                    </p>
                  </div>

                  {/* Bullet details */}
                  <ul className="space-y-3.5 pt-2 text-left">
                    {upd.details.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex gap-2.5 text-xs text-text-muted leading-relaxed">
                        <CheckCircle2 className="h-4.5 w-4.5 text-gemini-purple shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Footer */}
          <div className="bg-card border border-border p-8 rounded-[2.5rem] text-center space-y-6 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gemini-blue/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-foreground">Ready to Get Started?</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                Log in to access your custom student worksheets or coordinate fine-tuning alignment tasks.
              </p>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link 
                href="/auth/signup"
                className="group inline-flex items-center justify-center font-bold px-6 py-3 rounded-full bg-gradient-to-r from-gemini-blue to-gemini-purple text-white shadow-md text-xs hover:opacity-95 transition-all"
              >
                Create Free Account
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link 
                href="/services"
                className="inline-flex items-center justify-center font-bold px-6 py-3 rounded-full border border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground text-xs transition-all shadow-xs"
              >
                View Services
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
