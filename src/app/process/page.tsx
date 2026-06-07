'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileText, 
  UserCheck, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  HelpCircle 
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ProcessPage() {
  const steps = [
    {
      number: '01',
      title: 'Submit Project Intake',
      icon: <FileText className="h-6 w-6 text-gemini-blue" />,
      tagline: 'Instant estimate & details compilation',
      description: 'Use our pricing calculator to configure currency preferences (GBP, EUR, USD) and select your service lines. Submit your assignment parameters, guidelines, files, and deadlines to start the workflow.',
      dataLabel: 'Intake Process Speed',
      dataValue: 'Under 3 minutes to submit'
    },
    {
      number: '02',
      title: 'Automated Specialist Matching',
      icon: <UserCheck className="h-6 w-6 text-gemini-purple" />,
      tagline: 'Load-balanced coordinator routing',
      description: 'Our Postgres database triggers instantly evaluate availability and active workloads of specialized developers (like Lead Python Specialist Pradeep Ranwa). We route your task to the best expert matching your university course code.',
      dataLabel: 'Match Turnaround',
      dataValue: 'Average match in 15 minutes'
    },
    {
      number: '03',
      title: 'Live Chat Coordination',
      icon: <MessageSquare className="h-6 w-6 text-gemini-indigo" />,
      tagline: '1:1 messaging & file exchange portal',
      description: 'Log into your dashboard to coordinate directly. Upload draft updates, receive conceptual tutoring reviews, discuss SLM instruction parameters, or check app worksheets. Direct database polling logs chat instantly.',
      dataLabel: 'Communication Rate',
      dataValue: '3-second live chat polling sync'
    },
    {
      number: '04',
      title: 'Academic Review & Delivery',
      icon: <CheckCircle className="h-6 w-6 text-gemini-amber" />,
      tagline: 'Compliance checking & asset download',
      description: 'Your specialist compiles the final tutorial references, syllabus guides, or app binaries. The system logs file uploads in the chat log. Download assets directly from your panel for learning/reference.',
      dataLabel: 'Quality Rate',
      dataValue: '100% compliant with QAA Code of Conduct'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 relative z-10">
        {/* Glow points */}
        <div className="absolute top-[15%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-gemini-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-15%] w-[45rem] h-[45rem] rounded-full bg-gemini-purple/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gemini-blue/20 bg-accent-warm-light/60 text-gemini-indigo text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Clock className="h-3.5 w-3.5 text-gemini-purple animate-pulse" /> Step-by-Step Guide
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Our <span className="bg-gradient-to-r from-gemini-blue via-gemini-purple to-gemini-amber bg-clip-text text-transparent italic">Operational</span> Process
            </h1>
            <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              How Erudogix connects students and developers in real-time, executing tasks efficiently under strict academic guidelines.
            </p>
          </div>

          {/* Timeline Stack */}
          <div className="relative border-l border-border/80 ml-6 md:ml-12 pl-8 md:pl-16 space-y-16 py-4">
            
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Number node marker */}
                <div className="absolute -left-[54px] md:-left-[90px] top-0 h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-card border border-border flex items-center justify-center font-serif font-black text-xs md:text-sm text-gemini-indigo shadow-md">
                  {step.number}
                </div>

                <div className="bg-card border border-border p-6 md:p-8 rounded-[2rem] space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background border border-border/80 rounded-xl">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-foreground">{step.title}</h3>
                        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide block">{step.tagline}</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-background border border-border/60 rounded-xl text-left sm:text-right shrink-0">
                      <span className="text-[9px] font-bold uppercase text-accent-warm block">{step.dataLabel}</span>
                      <span className="text-xs font-bold text-foreground mt-0.5 block">{step.dataValue}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed max-w-3xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>

          {/* Help Code */}
          <div className="mt-16 bg-card border border-border p-6 rounded-3xl flex items-start gap-4 max-w-2xl mx-auto">
            <HelpCircle className="h-6 w-6 text-gemini-blue shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-foreground">Need support with a custom app or tutoring module?</h4>
              <p className="text-[11px] text-text-muted leading-relaxed">
                If your course or app dashboard requires bespoke integrations, our team of developers can schedule a direct diagnostic call. 
              </p>
              <div className="pt-2">
                <Link 
                  href="/pricing"
                  className="text-[10px] font-bold text-gemini-indigo hover:underline inline-flex items-center gap-0.5"
                >
                  Configure custom quote <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
