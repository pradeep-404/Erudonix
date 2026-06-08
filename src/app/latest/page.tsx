'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Terminal, 
  Activity, 
  BookOpen, 
  Layers, 
  MousePointerClick 
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface UpdateItem {
  date: string
  version: string
  title: string
  badge: string
  badgeColor: string
  description: string
  details: string[]
}

interface ToolItem {
  id: string
  title: string
  desc: string
  features: string[]
  gradient: string
  accentColor: string
  icon: React.ComponentType<{ className?: string }>
}

export default function LatestUpdatesPage() {
  const updates: UpdateItem[] = [
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
        "Quantizations monitoring tracking offline data residency compliance.",
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

  // Shuffling Developer Tools Dataset
  const tools: ToolItem[] = [
    {
      id: "tool-1",
      title: "Integrity Compliance Scanner",
      icon: ShieldCheck,
      desc: "Simulate scanning academic documents for structural alignment, source citations density, and integrity check verification.",
      features: ["Auto citation validation checks", "Compliance density rating mapping", "Integrity validation output streams"],
      gradient: "from-blue-500/10 via-indigo-500/10 to-transparent",
      accentColor: "text-blue-500"
    },
    {
      id: "tool-2",
      title: "SLM Parameter Quantizer",
      icon: Terminal,
      desc: "Simulate training and caching small model weights with supervised fine-tuning configurations and direct preferences.",
      features: ["Model quantization matrix arrays", "SFT loss telemetry tracing logs", "DPO safety alignment parameters"],
      gradient: "from-purple-500/10 via-pink-500/10 to-transparent",
      accentColor: "text-purple-500"
    },
    {
      id: "tool-3",
      title: "Integer GBP Cost Calculator",
      icon: Activity,
      desc: "Compute standard tutoring packages dynamically using integer flooring algorithms for rounded rates.",
      features: ["£6 Base GBP page quote indexing", "Dynamic Euro/Dollar conversions", "Zero decimal flooring formulas"],
      gradient: "from-amber-500/10 via-orange-500/10 to-transparent",
      accentColor: "text-amber-500"
    },
    {
      id: "tool-4",
      title: "Study Roadmap Compiler",
      icon: BookOpen,
      desc: "Synthesize complete academic guidelines, key checkpoints, and study timeline progress grids automatically.",
      features: ["Automated syllabus decomposition", "Phase milestone schedules compiler", "Reference mapping indices"],
      gradient: "from-emerald-500/10 via-teal-500/10 to-transparent",
      accentColor: "text-emerald-500"
    }
  ]

  const [shuffledIndex, setShuffledIndex] = useState(0)
  const [isShuffling, setIsShuffling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cursor tracking for background glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      containerRef.current.style.setProperty('--mouse-x', `${x}px`)
      containerRef.current.style.setProperty('--mouse-y', `${y}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleShuffle = () => {
    if (isShuffling) return
    setIsShuffling(true)
    setTimeout(() => {
      setShuffledIndex(prev => (prev + 1) % tools.length)
      setIsShuffling(false)
    }, 400)
  }

  const activeTool = tools[shuffledIndex]

  // Math helper for shuffling indexes
  const getCardStyle = (index: number) => {
    const relativeIndex = (index - shuffledIndex + tools.length) % tools.length
    const isTopCardShuffling = relativeIndex === 0 && isShuffling
    
    return {
      zIndex: tools.length - relativeIndex,
      scale: isTopCardShuffling ? 0.92 : 1 - relativeIndex * 0.04,
      y: isTopCardShuffling ? -10 : -relativeIndex * 15,
      x: isTopCardShuffling ? 340 : 0,
      rotate: isTopCardShuffling ? 18 : (relativeIndex % 2 === 0 ? relativeIndex * 1.5 : -relativeIndex * 1.5),
      opacity: isTopCardShuffling ? 0 : 1,
    }
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col min-h-screen relative overflow-hidden bg-background"
    >
      <Navbar />

      <main className="flex-grow pt-28 pb-20 relative z-10">
        
        {/* Background glow highlights */}
        <div className="absolute top-[15%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-gemini-blue/5 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-gemini-purple/5 blur-[130px] pointer-events-none" />

        {/* Cursor tracking ambient light layer */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-60"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(155, 81, 224, 0.05), rgba(66, 133, 244, 0.04), transparent 80%)`
          }}
        />

        <div className="max-w-4xl mx-auto px-6 space-y-20">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gemini-blue/20 bg-accent-warm-light/60 text-gemini-indigo text-xs font-semibold uppercase tracking-wider shadow-sm font-sans animate-pulse">
              <Sparkles className="h-3.5 w-3.5 text-gemini-purple" /> Platform Changelog
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              What's New in <span className="bg-gradient-to-r from-gemini-blue via-gemini-purple to-gemini-amber bg-clip-text text-transparent italic">Erudogix</span>
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-xl mx-auto leading-relaxed font-sans">
              Track the latest features, architectural upgrades, and algorithmic developments deployed across the Erudogix platform.
            </p>
          </div>

          {/* Timeline Updates Stack */}
          <div className="relative border-l border-border/80 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12 z-10">
            {updates.map((upd, idx) => (
              <div key={idx} className="relative space-y-4">
                {/* Timeline node icon container */}
                <div className="absolute left-[-35px] md:left-[-51px] top-1.5 h-5 w-5 rounded-full border-4 border-background bg-accent-warm shadow-xs flex items-center justify-center animate-pulse">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                <TimelineCard upd={upd} />
              </div>
            ))}
          </div>

          {/* ========================================================================
             NEW: INTERACTIVE DEVELOPER SUITE SHUFFLING DECK SECTION
             ======================================================================== */}
          <div className="pt-12 border-t border-border/40 space-y-8 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-warm bg-accent-warm-light/60 px-3 py-1 rounded-full border border-accent-warm/15 inline-flex items-center gap-1 font-sans">
                <Layers className="h-3 w-3" /> Core Utility Deck
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                Interactive Developer Toolkits
              </h2>
              <p className="text-xs text-text-muted max-w-lg leading-relaxed font-sans">
                Explore the underlying software packages, scanning pipelines, and computational calculators executing behind the Erudogix dashboard API framework.
              </p>
            </div>

            {/* Showcase Board: Split Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-card/30 backdrop-blur-md border border-border/85 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-36 h-36 bg-accent-warm/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Left Column: Current Active Card Info */}
              <div className="md:col-span-6 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTool.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1.5 ${activeTool.accentColor}`}>
                        {React.createElement(activeTool.icon, { className: "h-4.5 w-4.5" })}
                        {activeTool.title}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed font-sans">
                      {activeTool.desc}
                    </p>
                    <div className="space-y-2 pt-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground font-sans">Sub-Engine Modules:</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeTool.features.map(f => (
                          <span key={f} className="text-[9px] font-mono font-bold bg-neutral-200/50 dark:bg-neutral-800/80 px-2 py-0.5 rounded-md border border-border/40 text-text-muted uppercase">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={handleShuffle}
                    disabled={isShuffling}
                    className="px-6 py-3 rounded-full text-xs font-bold bg-foreground text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer shadow-sm inline-flex items-center gap-2 font-sans"
                  >
                    <Layers className="h-3.5 w-3.5 animate-pulse" />
                    Shuffle Utility Deck
                  </button>
                  <span className="text-[10px] text-text-muted font-bold font-mono">
                    Card {shuffledIndex + 1} of {tools.length}
                  </span>
                </div>
              </div>

              {/* Right Column: 3D Shuffling Stack Panel */}
              <div className="md:col-span-6 flex justify-center items-center h-80 relative select-none">
                <div className="relative w-72 h-64 flex items-center justify-center">
                  {tools.map((tool, index) => {
                    const isTop = (index - shuffledIndex + tools.length) % tools.length === 0
                    
                    return (
                      <motion.div
                        key={tool.id}
                        animate={getCardStyle(index)}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        onClick={() => isTop && handleShuffle()}
                        className={`absolute w-full h-full bg-card border border-border/90 rounded-[2.5rem] p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between overflow-hidden ${
                          isTop ? 'pointer-events-auto cursor-pointer border-accent-warm/40' : 'pointer-events-none'
                        }`}
                      >
                        {/* Apple-style glossy reflection */}
                        <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/10 opacity-70 pointer-events-none" />

                        {/* Top: Icon Title */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="p-2.5 bg-neutral-200/50 dark:bg-neutral-800/80 rounded-2xl border border-border/40">
                              {React.createElement(tool.icon, { className: `h-5 w-5 ${tool.accentColor}` })}
                            </div>
                            {isTop && (
                              <span className="inline-flex items-center gap-1 text-[8px] font-bold text-accent-warm uppercase tracking-wider bg-accent-warm-light/50 px-2 py-0.5 rounded-full animate-bounce">
                                <MousePointerClick className="h-2.5 w-2.5" /> Tap Card to Swipe
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-foreground font-sans">
                              {tool.title}
                            </h3>
                            <p className="text-[10px] text-text-muted leading-relaxed line-clamp-3 font-sans">
                              {tool.desc}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="pt-4 border-t border-border/40 flex justify-between items-center text-[8px] font-mono text-text-muted">
                          <span>CORE ENGINE LAYER</span>
                          <span className="font-bold uppercase tracking-wider">{tool.id}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="bg-card border border-border p-8 rounded-[2.5rem] text-center space-y-6 max-w-2xl mx-auto relative overflow-hidden z-10 shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gemini-blue/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-foreground">Ready to Get Started?</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed font-sans">
                Log in to access your custom student worksheets or coordinate fine-tuning alignment tasks.
              </p>
            </div>
            <div className="flex justify-center gap-4 flex-wrap font-sans">
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

/* ========================================================================
   ChangelogCard Component: Mouse Coordinate 3D Tilt & Reflective Glare
   ======================================================================== */
interface TimelineCardProps {
  upd: UpdateItem
}

function TimelineCard({ upd }: TimelineCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Map bounding offsets to small tilt degrees (max 6 deg tilt for timeline boxes)
    const rx = -y / (rect.height / 12)
    const ry = x / (rect.width / 12)
    setCoords({ x: ry, y: rx })
  }

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${coords.y}deg) rotateY(${coords.x}deg) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
      className="group bg-card/50 backdrop-blur-md border border-border/80 hover:border-accent-warm/40 p-6 md:p-8 rounded-[2rem] shadow-xs hover:shadow-[0_15px_30px_-12px_rgba(240,179,35,0.08)] transition-all duration-300 space-y-4 relative overflow-hidden cursor-pointer"
    >
      {/* Light sweep reflecting glare */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: isHovered 
            ? `radial-gradient(circle at ${coords.x * 5 + 50}% ${-coords.y * 5 + 50}%, rgba(255,255,255,0.06) 0%, transparent 60%)` 
            : 'none'
        }}
      />

      {/* Top right ambient corner glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-accent-warm/5 blur-2xl group-hover:bg-accent-warm/10 transition-colors pointer-events-none" />

      {/* Header meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-text-muted font-mono bg-neutral-200/40 dark:bg-neutral-800/80 px-1.5 py-0.5 rounded border border-border/40">{upd.version}</span>
          <span className="text-xs text-text-muted/65">•</span>
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-bold font-sans">
            <Calendar className="h-3.5 w-3.5 text-accent-warm" /> {upd.date}
          </div>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-sans ${upd.badgeColor}`}>
          {upd.badge}
        </span>
      </div>

      {/* Title & Desc */}
      <div className="space-y-1.5 text-left relative z-10">
        <h3 className="font-serif text-lg md:text-xl font-bold text-foreground group-hover:text-accent-warm transition-colors">
          {upd.title}
        </h3>
        <p className="text-xs text-text-muted leading-relaxed font-sans">
          {upd.description}
        </p>
      </div>

      {/* Bullet details */}
      <ul className="space-y-3 pt-2 text-left relative z-10 font-sans">
        {upd.details.map((bullet, bIdx) => (
          <li key={bIdx} className="flex gap-2.5 text-xs text-text-muted leading-relaxed">
            <CheckCircle2 className="h-4.5 w-4.5 text-gemini-purple shrink-0 mt-0.5 animate-pulse" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
