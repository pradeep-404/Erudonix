'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Cpu, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Zap, 
  LineChart, 
  Lock 
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ServicesPage() {
  const services = [
    {
      id: 'academic',
      title: 'Academic Support & Mentorship',
      icon: <BookOpen className="h-6 w-6 text-gemini-blue" />,
      tagline: 'Achieve 80+ Marks on Your Own Merit',
      image: '/images/academic_support.png',
      description: 'Erudogix provides elite 1:1 mentorship, syllabus coaching, and constructive feedback on drafts. We teach you how to analyze, reference, and build academic assignments independently.',
      integrityWarn: 'Strictly guided educational mentoring. We strictly do not ghostwrite or complete tests.',
      bullets: [
        '1:1 Concept Mentoring on difficult modules',
        'Detailed analytical feedback on project drafts',
        'Academic writing style and referencing workshops',
        'Exam preparation and syllabus breakdown sessions'
      ],
      metric: '86% average grade achieved by mentored students',
      color: 'border-gemini-blue/30 bg-blue-50/10 hover:shadow-[0_0_35px_rgba(59,130,246,0.15)] transition-all duration-300'
    },
    {
      id: 'slm',
      title: 'Small Language Models (SLMs)',
      icon: <Cpu className="h-6 w-6 text-gemini-purple" />,
      tagline: 'Private, Secure Offline AI Architectures',
      image: '/images/slm_concept_visual.png',
      description: 'We instruct-tune compact models (1.5B to 8B params) using SFT and preference alignment (DPO) to execute niche business processes locally on commodity hardware.',
      integrityWarn: 'Data privacy-first: zero external API calls or third-party leakage vector exposures.',
      bullets: [
        'Supervised Fine-Tuning (SFT) for high precision tasks',
        'Direct Preference Optimization (DPO) safety alignment',
        'Quantized compilation for local execution on edge nodes',
        'Clause auditing and document search indexing pipelines'
      ],
      metric: '50% latency drop & 100% offline data residency security',
      color: 'border-gemini-purple/30 bg-purple-50/10 hover:shadow-[0_0_35px_rgba(139,92,246,0.2)] transition-all duration-300'
    },
    {
      id: 'studio',
      title: 'App Studio & Software Engineering',
      icon: <Layers className="h-6 w-6 text-gemini-amber" />,
      tagline: 'Automated Fintech Ledgers & Worksheets',
      image: '/images/app_studio_devs.png',
      description: 'We engineer secure web and mobile applications with automated invoice ledgers, employee timecards, and real-time workspaces designed to streamline agency accounting.',
      integrityWarn: 'Multi-currency invoicing engines configured for GBP, EUR, and USD.',
      bullets: [
        'Freelance timecard and rent ledger worksheets',
        'Dynamic invoicing builders with tax rate engines',
        'PostgreSQL-backed relational databases with connection pools',
        'Admin dashboards with role-based dashboard access'
      ],
      metric: '$1.2M+ invoicing volume processed securely',
      color: 'border-gemini-amber/30 bg-amber-50/10 hover:shadow-[0_0_35px_rgba(240,179,35,0.15)] transition-all duration-300'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 relative z-10">
        {/* Glow rings */}
        <div className="absolute top-[20%] left-[-20%] w-[50rem] h-[50rem] rounded-full bg-gemini-blue/5 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-gemini-purple/5 blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center space-y-4 mb-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gemini-blue/20 bg-accent-warm-light/60 text-gemini-indigo text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Zap className="h-3.5 w-3.5 text-gemini-purple animate-pulse" /> Core Capabilities
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Pillars of <span className="bg-gradient-to-r from-gemini-blue via-gemini-purple to-gemini-amber bg-clip-text text-transparent italic">Erudogix</span> Operations
            </h1>
            <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Explore how we deliver academic integrity compliance mentoring, secure private AI tuning, and customized web billing architectures.
            </p>
          </div>

          {/* Services Stack */}
          <div className="space-y-24">
            {services.map((serv, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div 
                  key={serv.id}
                  initial={{ opacity: 0, y: 100, rotateX: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                  style={{ transformPerspective: 1200 }}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border border-border p-8 md:p-12 rounded-[2.5rem] bg-card/60 backdrop-blur-sm ${serv.color}`}
                >
                  {/* Text panel */}
                  <div className={`lg:col-span-7 space-y-6 ${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-background rounded-2xl border border-border/80 shadow-inner">
                        {serv.icon}
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">{serv.title}</h2>
                        <span className="text-[10px] font-bold text-accent-warm uppercase tracking-wider block mt-1">{serv.tagline}</span>
                      </div>
                    </div>

                    <p className="text-sm text-text-muted leading-relaxed">
                      {serv.description}
                    </p>

                    {/* Bullets */}
                    <ul className="space-y-3.5">
                      {serv.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2.5 text-xs text-text-muted">
                          <CheckCircle2 className="h-4.5 w-4.5 text-gemini-purple shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Data Indicator */}
                    <div className="bg-background border border-border p-4 rounded-2xl flex items-start gap-3">
                      <LineChart className="h-5 w-5 text-gemini-blue shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Performance Data Metric</span>
                        <p className="text-xs font-bold text-foreground mt-0.5">{serv.metric}</p>
                      </div>
                    </div>

                    {/* Integrity Code */}
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800/40 rounded-xl flex items-start gap-2 border border-border/60">
                      <Lock className="h-4 w-4 text-accent-warm shrink-0 mt-0.5" />
                      <span className="text-[10px] text-text-muted leading-relaxed font-semibold">
                        Compliance Code: {serv.integrityWarn}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                      <Link 
                        href="/pricing"
                        className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full bg-gradient-to-r from-gemini-blue to-gemini-purple text-white shadow-md text-xs hover:opacity-95 transition-all"
                      >
                        Request Quote for this Service
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Image container */}
                  <div className={`lg:col-span-5 relative rounded-[2rem] overflow-hidden border border-border shadow-md ${!isEven ? 'lg:order-1' : ''}`}>
                    <img 
                      src={serv.image} 
                      alt={serv.title}
                      className="w-full h-auto object-cover aspect-square hover:scale-[1.03] transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              )
            })}
          </div>
          {/* Corporate / Enterprise Deployment Marquee */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            className="pt-20 border-t border-border/40 text-center space-y-8"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-accent-warm uppercase tracking-wider block">Enterprise Deployments</span>
              <h3 className="font-serif text-2xl font-bold text-foreground">Deployed in Global Enterprise Operations</h3>
              <p className="text-xs text-text-muted max-w-xl mx-auto leading-relaxed">
                Erudogix customized models and engineering tools are deployed and audited across corporate organizations and research groups.
              </p>
            </div>

            <style>{`
              @keyframes company-scroll {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
              .animate-company-scroll {
                animation: company-scroll 25s linear infinite;
              }
            `}</style>

            <div className="flex w-[200%] overflow-hidden relative select-none border-t border-b border-border/30 py-6 bg-card/20">
              <div className="flex gap-16 whitespace-nowrap animate-company-scroll items-center">
                {/* Loop 1 */}
                {[
                  { name: "Google AI Labs", desc: "SLM evaluation" },
                  { name: "AeroLabs Research", desc: "Tax automation" },
                  { name: "Fintech Capital", desc: "Ledgers sync" },
                  { name: "ByteScale Corp", desc: "Llama alignment" },
                  { name: "Helix Systems", desc: "Contract audit" },
                  { name: "Nova Analytics", desc: "Timecard tool" },
                  { name: "Mandelbulb Tech", desc: "Healthcare FHIR Maps" },
                  { name: "Oxford Ventures", desc: "Due Diligence DB" },
                  { name: "Sydney Health", desc: "GenAI Automation" },
                  { name: "DataSys Corp", desc: "Azure SQL pipelines" }
                ].map((comp, idx) => (
                  <div key={idx} className="inline-flex items-center gap-2.5 bg-background border border-border/80 px-4 py-2.5 rounded-2xl shadow-xs transition-transform hover:scale-[1.03] cursor-pointer">
                    <div className="h-6 w-6 rounded-lg bg-accent-warm-light/40 flex items-center justify-center font-bold text-xs text-accent-warm">
                      {comp.name[0]}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-foreground block leading-none">{comp.name}</span>
                      <span className="text-[9px] text-text-muted mt-1 block leading-none">{comp.desc}</span>
                    </div>
                  </div>
                ))}
                {/* Loop 2 */}
                {[
                  { name: "Google AI Labs", desc: "SLM evaluation" },
                  { name: "AeroLabs Research", desc: "Tax automation" },
                  { name: "Fintech Capital", desc: "Ledgers sync" },
                  { name: "ByteScale Corp", desc: "Llama alignment" },
                  { name: "Helix Systems", desc: "Contract audit" },
                  { name: "Nova Analytics", desc: "Timecard tool" },
                  { name: "Mandelbulb Tech", desc: "Healthcare FHIR Maps" },
                  { name: "Oxford Ventures", desc: "Due Diligence DB" },
                  { name: "Sydney Health", desc: "GenAI Automation" },
                  { name: "DataSys Corp", desc: "Azure SQL pipelines" }
                ].map((comp, idx) => (
                  <div key={idx + 100} className="inline-flex items-center gap-2.5 bg-background border border-border/80 px-4 py-2.5 rounded-2xl shadow-xs transition-transform hover:scale-[1.03] cursor-pointer">
                    <div className="h-6 w-6 rounded-lg bg-accent-warm-light/40 flex items-center justify-center font-bold text-xs text-accent-warm">
                      {comp.name[0]}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-foreground block leading-none">{comp.name}</span>
                      <span className="text-[9px] text-text-muted mt-1 block leading-none">{comp.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
