'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  BookOpen,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Star,
  Plus,
  Minus,
  Sparkles,
  Server,
  Play,
  RotateCcw,
  Code,
  Terminal,
  HelpCircle,
  Database
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function HomePage() {
  // Currency and Intake Estimator States
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD')
  const [calcService, setCalcService] = useState<'academic_support' | 'small_language_models' | 'app_studio'>('academic_support')
  const [calcPages, setCalcPages] = useState(5)
  const [calcSlmScale, setCalcSlmScale] = useState<'tune' | 'complex' | 'custom'>('tune')
  const [calcAppScale, setCalcAppScale] = useState<'dash' | 'full' | 'enterprise'>('dash')
  const [user, setUser] = useState<any>(null)

  // Product Showcase active tab
  const [activeTab, setActiveTab] = useState<'academic' | 'slm' | 'app_studio'>('academic')

  // Scroll animations
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, 200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -150])
  const opacityFade = useTransform(scrollY, [0, 300], [1, 0])

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

  // Rolling LLM Box States
  const [tuningStatus, setTuningStatus] = useState<'base' | 'tuning' | 'optimized'>('base')
  const [tuningProgress, setTuningProgress] = useState(0)

  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' }

  const pricingRates = {
    USD: { base: 35, multiplier: { academic_support: 1.0, small_language_models: 10.0, app_studio: 15.0 }, page: 15, slm: { tune: 150, complex: 600, custom: 2000 }, app: { dash: 250, full: 800, enterprise: 3000 } },
    EUR: { base: 30, multiplier: { academic_support: 1.0, small_language_models: 10.0, app_studio: 15.0 }, page: 12, slm: { tune: 130, complex: 550, custom: 1800 }, app: { dash: 220, full: 700, enterprise: 2600 } },
    GBP: { base: 25, multiplier: { academic_support: 1.0, small_language_models: 10.0, app_studio: 15.0 }, page: 10, slm: { tune: 110, complex: 450, custom: 1500 }, app: { dash: 180, full: 600, enterprise: 2200 } }
  }

  const calculateEstimate = () => {
    const rate = pricingRates[currency]
    
    if (calcService === 'academic_support') {
      const basePrice = rate.base
      const additionalPages = Math.max(0, calcPages - 1)
      return basePrice + (additionalPages * rate.page)
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

  const handleSimulatorHover = () => {
    if (tuningStatus === 'base') {
      setTuningStatus('tuning')
      setTuningProgress(0)
    }
  }

  const handleSimulatorLeave = () => {
    setTuningStatus('base')
    setTuningProgress(0)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (tuningStatus === 'tuning') {
      interval = setInterval(() => {
        setTuningProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTuningStatus('optimized')
            return 100
          }
          return prev + 5
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [tuningStatus])

  const testimonials = [
    { 
      quote: "The 1:1 calculus & engineering concepts mentoring was completely game-changing. I was able to clarify complex mathematical formulations on my own and score a 92/100, securing an Excellence Archive in my Deep Learning Thesis.", 
      author: "Aarav Sharma, IIT Delhi (India)",
      achievement: "Score: 92/100 • Thesis Archive"
    },
    { 
      quote: "The detailed, rigorous draft reviews for Econometrics gave me the exact analytical roadmap I needed. Scored an 88/100 and graduated with First Class Honours.", 
      author: "Eleanor Vance, London School of Economics (UK)",
      achievement: "Score: 88/100 • First Class Honours"
    },
    { 
      quote: "Our team needed a secure, locally-deployed clause auditing model. Erudogix fine-tuned a 7B parameter SLM that operates completely offline on local nodes. Incredibly high accuracy (96.5%) and absolute data privacy.", 
      author: "Dr. Marcus Vance, AeroLabs Research CTO (US)",
      achievement: "96.5% Model Accuracy"
    },
    { 
      quote: "I received exceptional concept tutoring for Advanced Accounting. The methodologies were broken down so thoroughly that I scored a 91/100 (High Distinction). Highly recommend their private learning frameworks.", 
      author: "Lachlan G., University of Sydney (Australia)",
      achievement: "Score: 91/100 • High Distinction"
    },
    { 
      quote: "The custom RAG-based document intelligence chatbot they built for us reduced our data handling challenges dramatically. Incredible understanding of GenAI integration.", 
      author: "Priya T., Healthcare Data Lead (India)",
      achievement: "AI Pipeline Optimization"
    },
    { 
      quote: "Their guidance on my Master's thesis on cloud computing architecture was invaluable. I learned to structure my arguments logically and achieved a 95/100.", 
      author: "James W., Imperial College London (UK)",
      achievement: "Score: 95/100 • Distinction"
    }
  ]
  const faqs = [
    { q: "What is your stance on Academic Integrity?", a: "Erudogix provides educational guidance, study guides, draft feedback, and concept tutoring. We strictly do not write assignments or complete tests for students. All works delivered must be utilized as study references only." },
    { q: "How is the pricing estimate calculated?", a: "Estimates combine a base setup rate with volume/complexity multipliers. Final prices must be reviewed and approved by you before any work starts." },
    { q: "What makes your small language models different?", a: "We customize compact models (1.5B to 8B params) using SFT and DPO alignment. They perform similarly to giant models in narrow domains while running fast, securely, and offline on consumer-grade servers." }
  ]

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Enhanced Wind Flowing Sparkles Overlay with Parallax */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute top-[15%] left-0 w-3 h-3 rounded-full bg-gemini-indigo/30 blur-[2px] animate-wind-slow-1" />
        <div className="absolute top-[40%] left-0 w-4 h-4 rounded-full bg-gemini-purple/20 blur-[1px] animate-wind-slow-2" />
        <div className="absolute top-[70%] left-0 w-2.5 h-2.5 rounded-full bg-accent/25 blur-[2px] animate-wind-slow-3" />
        <div className="absolute top-[30%] left-0 w-2 h-2 rounded-full bg-gemini-blue/20 blur-[1px] animate-wind-slow-1" style={{animationDelay: '5s'}} />
        <div className="absolute top-[60%] left-0 w-3.5 h-3.5 rounded-full bg-accent/15 blur-[3px] animate-wind-slow-2" style={{animationDelay: '9s'}} />
      </motion.div>

      <Navbar />

      <main className="flex-grow">
        
        {/* Two-Column AWS Console style Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border bg-gradient-to-b from-card to-background text-foreground transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,153,0,0.01),transparent_70%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-accent/30 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider font-mono">
                <Sparkles className="h-3.5 w-3.5" />
                Erudogix Console v1.2.0 Active
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-mono text-4xl md:text-6xl font-black tracking-tight text-foreground leading-none"
              >
                Build Intelligent <br />
                <span className="text-accent">Coaching Systems</span> & <br />
                SLM App Studios
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed"
              >
                Empower your academic journey with conceptual 1:1 tutoring to secure 80+ marks, or build secure, local-compliance Small Language Models & custom invoicing software. Complete operations managed under a single, unified developer console.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/services"
                    className="group inline-flex items-center justify-center font-bold px-6 py-3 rounded bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] text-xs font-mono"
                  >
                    Create an Account
                    <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#services"
                    className="inline-flex items-center justify-center font-bold px-6 py-3 rounded border-2 border-border bg-transparent hover:bg-card dark:hover:bg-neutral-800 text-foreground transition-all text-xs font-mono"
                  >
                    Explore Console
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Hero Column: Interactive SLM Simulator Box as AWS Cloudshell */}
            <div className="lg:col-span-5 w-full">
              <div 
                onMouseEnter={handleSimulatorHover}
                onMouseLeave={handleSimulatorLeave}
                className="relative p-6 rounded-lg bg-[#161b22] border border-[#21262d] flex flex-col justify-between min-h-[360px] shadow-2xl overflow-hidden cursor-crosshair text-xs"
              >
                {/* Header of terminal */}
                <div className="flex justify-between items-center pb-4 border-b border-[#21262d] font-mono text-[10px] text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-accent" />
                    <span>erudogix-cloudshell:/slm-quantizer/</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded border ${
                    tuningStatus === 'base' ? 'bg-[#21262d] border-[#30363d] text-[#8b949e]' :
                    tuningStatus === 'tuning' ? 'bg-accent/10 border-accent/30 text-accent animate-pulse' :
                    'bg-green-500/10 border-green-500/30 text-green-400'
                  }`}>
                    {tuningStatus === 'base' ? 'BASE_LOCKED' : tuningStatus === 'tuning' ? 'WEIGHT_SFT_ACTIVE' : 'DPO_OPTIMIZED'}
                  </span>
                </div>

                <div className="flex-grow py-6 flex flex-col justify-center relative">
                  {/* Console prompt emulation */}
                  <div className="font-mono space-y-3">
                    <div className="text-text-muted">
                      $ python quantize.py --model llama-3-8b --target erudogix-optimized
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {tuningStatus === 'base' && (
                        <motion.div
                          key="base"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-2"
                        >
                          <div className="text-white font-bold">{">>> [SYSTEM STATUS] Idle base model loaded."}</div>
                          <div className="text-text-muted pl-4">Weights: FP16 defaults</div>
                          <div className="text-text-muted pl-4">Host Device: Local Safe Node</div>
                          <div className="flex gap-4 pl-4 font-mono text-[10px] text-text-muted pt-1">
                            <span>Latency: 18ms</span>
                            <span>Throughput: 42 tokens/s</span>
                          </div>
                        </motion.div>
                      )}

                      {tuningStatus === 'tuning' && (
                        <motion.div
                          key="tuning"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3"
                        >
                          <div className="text-accent">{">>> [TRAINING] Running Supervised Fine-Tuning..."}</div>
                          <div className="text-text-muted pl-4 font-mono">Quantizing weights to 4-bit (INT4)...</div>
                          <div className="w-full bg-[#21262d] h-2 rounded overflow-hidden">
                            <div className="bg-accent h-full transition-all duration-100" style={{ width: `${tuningProgress}%` }} />
                          </div>
                          <div className="text-text-muted pl-4 text-[10px]">Quantization Loss: 0.042 (acceptable range)</div>
                        </motion.div>
                      )}

                      {tuningStatus === 'optimized' && (
                        <motion.div
                          key="optimized"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-2"
                        >
                          <div className="text-green-400 font-bold">{">>> [OPTIMIZED] Quantization and DPO Alignment complete!"}</div>
                          <div className="text-white pl-4">Active Model: Erudogix-8B-Optimized (INT4)</div>
                          <div className="flex gap-4 pl-4 font-mono text-[10px] text-green-400 pt-1">
                            <span>Latency: 9ms (-50%)</span>
                            <span>Throughput: 88 tokens/s (+110%)</span>
                          </div>
                          <div className="text-text-muted pl-4 text-[9px] pt-1">Deploying weights to offline secure sandbox. Ready.</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#21262d] font-mono text-[9px] text-text-muted leading-relaxed">
                  <span className="text-accent font-bold">LAB HELPER:</span> Hover your mouse cursor over this console to trigger quantization and supervised fine-tuning. Move cursor away to reset weights.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Hero Photo Banner Section */}
        <section className="relative overflow-hidden border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left text column */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider font-mono">
                <Star className="h-3.5 w-3.5" />
                Trusted by 500+ students worldwide
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight">
                Study smarter,{' '}
                <span className="bg-gradient-to-r from-gemini-blue to-gemini-purple bg-clip-text text-transparent">
                  score higher
                </span>
              </h2>
              <p className="text-sm text-text-muted leading-relaxed max-w-lg">
                Join thousands of students from Oxford, Cambridge, MIT, and top universities worldwide who use Erudogix to achieve distinction-level results with personalised 1:1 coaching.
              </p>
              <div className="flex flex-wrap gap-8 pt-2">
                {[
                  { value: '500+', label: 'Students Helped' },
                  { value: '92/100', label: 'Avg Score Achieved' },
                  { value: '15+', label: 'Countries Served' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-mono text-2xl font-black text-accent">{stat.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link 
                  href="/auth/signup" 
                  className="inline-flex items-center justify-center font-bold px-6 py-3 rounded-full bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-all shadow-lg text-xs font-mono"
                >
                  Sign Up Free
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-drawer'))}
                  className="inline-flex items-center justify-center font-bold px-6 py-3 rounded-full border border-border bg-background hover:bg-card dark:hover:bg-neutral-800 transition-all text-xs font-mono text-foreground"
                >
                  Sign In
                </button>
              </div>
            </div>
            {/* Right image column */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border group">
              <img
                src="/images/hero_students.png"
                alt="Students collaborating with Erudogix coaching platform"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md border border-border rounded-2xl p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gemini-blue to-gemini-purple flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">100% Academic Integrity</p>
                  <p className="text-[10px] text-text-muted">All coaching fully compliant with global academic integrity standards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Animated floating feature cards */}
          <div className="py-12 px-6 bg-gradient-to-b from-card to-background">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: BookOpen,
                  title: '1:1 Academic Coaching',
                  description: 'Personalised tutoring to help you hit distinction marks.',
                  color: 'from-blue-500 to-indigo-500',
                  delay: '0s'
                },
                {
                  icon: Cpu,
                  title: 'SLM Model Tuning',
                  description: 'Fine-tune compact AI models for your industry use-case.',
                  color: 'from-purple-500 to-pink-500',
                  delay: '0.1s'
                },
                {
                  icon: Layers,
                  title: 'App Studio Build',
                  description: 'Custom Next.js apps, fintech ledgers, and invoice systems.',
                  color: 'from-amber-500 to-orange-500',
                  delay: '0.2s'
                },
                {
                  icon: ShieldCheck,
                  title: 'Secure & Compliant',
                  description: 'All projects are integrity-checked and privacy-safe.',
                  color: 'from-green-500 to-emerald-500',
                  delay: '0.3s'
                }
              ].map((card, idx) => {
                const Icon = card.icon
                return (
                  <div
                    key={idx}
                    className="group relative bg-card border border-border rounded-2xl p-5 hover:border-accent hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden"
                    style={{animationDelay: card.delay}}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-mono text-sm font-bold text-foreground mb-1">{card.title}</h4>
                    <p className="text-xs text-text-muted leading-relaxed">{card.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Infinite University Ticker Carousel */}
        <section className="py-8 bg-background border-b border-border overflow-hidden relative transition-colors">
          <style>{`
            @keyframes infinite-scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .animate-infinite-scroll {
              animation: infinite-scroll 35s linear infinite;
            }
          `}</style>
          <div className="max-w-7xl mx-auto px-6 mb-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block text-center font-mono">
              Mentored students and specialists across global institutions
            </span>
          </div>
          <div className="flex w-[200%] overflow-hidden relative select-none">
            <div className="flex gap-12 py-3 whitespace-nowrap animate-infinite-scroll items-center">
              {/* Loop 1 */}
              {[
                { name: "Oxford University (UK)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Cambridge (UK)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 6v12l9 4 9-4V6L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Stanford University (US)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "MIT (US)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Harvard University (US)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 6v11l9 5 9-5V6L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "University of Sydney (AU)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Yale University (US)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 6v12l9 4 9-4V6L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Imperial College (UK)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "ETH Zurich (CH)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="var(--accent, #ff9900)" />
                  </svg>
                )}
              ].map((uni, idx) => (
                <div key={idx} className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2 rounded shadow-sm text-xs transition-colors hover:border-accent">
                  {uni.icon}
                  <span className="font-mono font-bold text-foreground">
                    {uni.name}
                  </span>
                </div>
              ))}
              {/* Loop 2 */}
              {[
                { name: "Oxford University (UK)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Cambridge (UK)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 6v12l9 4 9-4V6L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Stanford University (US)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "MIT (US)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Harvard University (US)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 6v11l9 5 9-5V6L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "University of Sydney (AU)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Yale University (US)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 6v12l9 4 9-4V6L12 2z" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "Imperial College (UK)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="var(--accent, #ff9900)" />
                  </svg>
                )},
                { name: "ETH Zurich (CH)", icon: (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="var(--accent, #ff9900)" />
                  </svg>
                )}
              ].map((uni, idx) => (
                <div key={idx + 100} className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2 rounded shadow-sm text-xs transition-colors hover:border-accent">
                  {uni.icon}
                  <span className="font-mono font-bold text-foreground">
                    {uni.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AWS style tabbed capabilities showcases */}
        <section id="services" className="py-20 bg-background border-b border-border relative transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Explore Erudogix Console Products</h2>
              <p className="text-sm text-text-muted">Select a product module below to review console dashboard metrics, SLA features, and active client cases.</p>
            </div>

            {/* Tab navigation bar */}
            <div className="flex border-b border-border mb-10 overflow-x-auto">
              {[
                { id: 'academic', label: 'Academic Support Core', icon: BookOpen },
                { id: 'slm', label: 'SLM Model Tuning Lab', icon: Cpu },
                { id: 'app_studio', label: 'App Studio & Invoicing', icon: Layers }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-mono text-xs font-bold whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'border-accent text-accent bg-card/50'
                        : 'border-transparent text-text-muted hover:text-foreground hover:bg-card/20'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab content display */}
            <div>
              <AnimatePresence mode="wait">
                {activeTab === 'academic' && (
                  <motion.div
                    key="academic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    <div className="space-y-6">
                      <h3 className="font-mono text-2xl font-bold text-foreground">Advanced Academic Coaching & Review</h3>
                      <p className="text-sm text-text-muted leading-relaxed">
                        Guided 1:1 educational feedback, study reviews, and syllabus coaching designed to support independent achievement and top target grades (80+ average). Tutors trace progress and assign metrics out of 100 on students' dashboards.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-card border border-border rounded-2xl">
                          <span className="block font-mono text-accent font-black text-xl">92/100</span>
                          <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wide">Avg Target Achieved</span>
                        </div>
                        <div className="p-4 bg-card border border-border rounded-2xl">
                          <span className="block font-mono text-accent font-black text-xl">1:1 Private</span>
                          <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wide">Concept Coaching</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>Detailed Econometrics and Thesis analytical reviews.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>100% compliant with global academic integrity guidelines.</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative group rounded-2xl overflow-hidden border border-border shadow-2xl bg-card p-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
                      <img 
                        src="/images/cortex_academic_results.png" 
                        alt="Erudogix Student Academic Dashboard" 
                        className="w-full h-auto object-cover rounded-xl border border-border" 
                      />
                      <div className="absolute bottom-6 left-6 z-20">
                        <span className="text-[9px] font-mono text-accent uppercase tracking-wider block font-bold">Dashboard Preview</span>
                        <span className="text-sm font-bold text-white block">Student Operations & Results Hub</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'slm' && (
                  <motion.div
                    key="slm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    <div className="space-y-6">
                      <h3 className="font-mono text-2xl font-bold text-foreground">Small Language Model Quantization</h3>
                      <p className="text-sm text-text-muted leading-relaxed">
                        Erudogix tunes and quantizes compact models (1.5B to 8B params) for corporate auditing and document classification. Models run locally offline, securing private data without external API calls.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-card border border-border rounded-2xl">
                          <span className="block font-mono text-accent font-black text-xl">-50%</span>
                          <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wide">Latency Reduction</span>
                        </div>
                        <div className="p-4 bg-card border border-border rounded-2xl">
                          <span className="block font-mono text-accent font-black text-xl">DPO / SFT</span>
                          <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wide">Quantized parameters</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>Quantized model hosting ready on consumer-grade hardware.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>DPO alignment ensures compliance with corporate regulations.</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative group rounded-2xl overflow-hidden border border-border shadow-2xl bg-card p-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
                      <img 
                        src="/images/slm_concept_visual.png" 
                        alt="Erudogix Small Language Model Parameter Optimization Panel" 
                        className="w-full h-auto object-cover rounded-xl border border-border" 
                      />
                      <div className="absolute bottom-6 left-6 z-20">
                        <span className="text-[9px] font-mono text-accent uppercase tracking-wider block font-bold">Telemetry Preview</span>
                        <span className="text-sm font-bold text-white block">SLM Weights Tuning Interface</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'app_studio' && (
                  <motion.div
                    key="app_studio"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    <div className="space-y-6">
                      <h3 className="font-mono text-2xl font-bold text-foreground">Custom App Studio & PayFlow Ledger</h3>
                      <p className="text-sm text-text-muted leading-relaxed">
                        High-performance application engineering specializing in custom fintech, timesheet coordination, and ledger auditing engines. Ideal for teams needing secure, clean administrative consoles.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-card border border-border rounded-2xl">
                          <span className="block font-mono text-accent font-black text-xl">PayFlow API</span>
                          <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wide">Fintech Integration</span>
                        </div>
                        <div className="p-4 bg-card border border-border rounded-2xl">
                          <span className="block font-mono text-accent font-black text-xl">Next.js / PG</span>
                          <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wide">Modern Tech Stack</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>Timesheet trackers and secure automatic invoices.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>Audited and secure database connections with Postgres.</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative group rounded-2xl overflow-hidden border border-border shadow-2xl bg-card p-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
                      <div className="h-[250px] bg-gradient-to-tr from-[#1f2937] to-[#111827] rounded-xl border border-border flex flex-col justify-center items-center p-6 text-center">
                        <Database className="h-12 w-12 text-accent mb-3 animate-pulse" />
                        <h4 className="font-mono text-sm font-bold text-white">App Studio Database Console</h4>
                        <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                          PayFlow features automated ledgers, currency translations, and PDF invoice compilations for student client accounts.
                        </p>
                      </div>
                      <div className="absolute bottom-6 left-6 z-20">
                        <span className="text-[9px] font-mono text-accent uppercase tracking-wider block font-bold">Product Showcase</span>
                        <span className="text-sm font-bold text-white block">PayFlow Administrative Ledger</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Console Case Studies */}
        <section className="py-20 bg-background border-b border-border transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Featured Case Studies</h2>
              <p className="text-sm text-text-muted">Explore actual systems built and optimized by our specialists.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* SLM Project Case */}
              <div className="group bg-card border border-border p-8 rounded-2xl space-y-6 hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wider bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                    Model Tuning
                  </span>
                  <span className="text-xs text-text-muted font-mono">Project: Legal-Llama-7B</span>
                </div>
                <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-accent transition-colors">Local Clause Audit Model</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Fine-tuned a 7B Parameter model for a major Australian corporate legal group. The model operates entirely offline on local server nodes, auditing contract templates for liability compliance while ensuring 100% data residency.
                </p>
                <div className="flex gap-6 text-[10px] font-mono text-text-muted bg-background p-3 rounded-xl border border-border">
                  <span>Accuracy: 96.5% (+12%)</span>
                  <span>Avg Latency: 12ms</span>
                </div>
              </div>

              {/* App Studio Case */}
              <div className="group bg-card border border-border p-8 rounded-2xl space-y-6 hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wider bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                    App Studio
                  </span>
                  <span className="text-xs text-text-muted font-mono">Project: PayFlow Invoicing</span>
                </div>
                <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-accent transition-colors">PayFlow Invoicing Engine</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  A high-velocity fintech tool built for international agencies. PayFlow automates ledger compilation, currency adjustments (USD/EUR/AUD), and tax-compliant invoicing templates for freelance and student tutors.
                </p>
                <div className="flex gap-6 text-[10px] font-mono text-text-muted bg-background p-3 rounded-xl border border-border">
                  <span>Transactions: $1.2M+</span>
                  <span>Tech: Next.js / PostgreSQL</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-card border-b border-border transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider font-mono">
                <Star className="h-3.5 w-3.5" />
                Real Student Results
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">What Our Students Say</h2>
              <p className="text-sm text-text-muted">Genuine results from students across top global institutions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {testimonials.map((t, idx) => (
                <div key={idx} className="group bg-background border border-border rounded-2xl p-6 space-y-4 hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="h-3.5 w-3.5 text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="border-t border-border pt-3 flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-foreground">{t.author}</p>
                      <p className="text-[10px] text-accent font-mono font-bold mt-0.5">{t.achievement}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gemini-blue to-gemini-purple flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {t.author[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section id="pricing" className="py-20 bg-background border-b border-border transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Estimate Project Cost</h2>
              <p className="text-sm text-text-muted">Estimate your project costs instantly. Academic Support starts as low as £25 GBP, €30 EUR, and $35 USD.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto bg-card border border-border p-8 rounded-2xl shadow-xl transition-colors duration-300">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2 font-mono">Currency</label>
                  <div className="flex gap-2">
                    {(['USD', 'EUR', 'GBP'] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`flex-1 py-2 text-xs font-bold rounded font-mono border transition-all ${
                          currency === curr
                            ? 'bg-accent border-transparent text-white dark:text-[#19222d]'
                            : 'border-border bg-background hover:bg-card text-foreground'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2 font-mono">Service Line</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'academic_support', label: 'Academic Support' },
                      { id: 'small_language_models', label: 'Small Language Models' },
                      { id: 'app_studio', label: 'App Studio' }
                    ].map((serv) => (
                      <button
                        key={serv.id}
                        onClick={() => setCalcService(serv.id as any)}
                        className={`py-3 px-5 text-xs font-mono font-bold text-left rounded border transition-all ${
                          calcService === serv.id
                            ? 'bg-accent/10 border-accent text-accent'
                            : 'border-border bg-background hover:bg-card text-foreground'
                        }`}
                      >
                        {serv.label}
                      </button>
                    ))}
                  </div>
                </div>

                {calcService === 'academic_support' && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2 font-mono">Volume (Pages)</label>
                    <div className="flex items-center justify-between bg-background border border-border p-2 rounded">
                      <button
                        onClick={() => setCalcPages(Math.max(1, calcPages - 1))}
                        className="p-2 rounded border border-border bg-card text-foreground"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-mono font-bold text-xs">{calcPages} Pages</span>
                      <button
                        onClick={() => setCalcPages(calcPages + 1)}
                        className="p-2 rounded border border-border bg-card text-foreground"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {calcService === 'small_language_models' && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2 font-mono">Tuning Scale</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'tune', label: 'Supervised Fine-Tuning' },
                        { id: 'complex', label: 'DPO Preference Alignment' },
                        { id: 'custom', label: 'Custom Architecture Design' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setCalcSlmScale(item.id as any)}
                          className={`py-2.5 px-4 text-[11px] font-bold rounded border text-left transition-all ${
                            calcSlmScale === item.id
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'border-border bg-background hover:bg-card text-foreground'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {calcService === 'app_studio' && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2 font-mono">Scope Size</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'dash', label: 'Basic Tool / Sheet Ledger' },
                        { id: 'full', label: 'Full Web App & Ledger database' },
                        { id: 'enterprise', label: 'Enterprise Fintech Suite' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setCalcAppScale(item.id as any)}
                          className={`py-2.5 px-4 text-[11px] font-bold rounded border text-left transition-all ${
                            calcAppScale === item.id
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'border-border bg-background hover:bg-card text-foreground'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price output */}
              <div className="bg-background border border-border p-6 rounded-2xl flex flex-col justify-between text-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block font-mono">Estimated Console Cost</span>
                  <div className="text-5xl font-mono font-black text-foreground">
                    {currencySymbols[currency]}{calculateEstimate()}
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    This is an initial estimate. Final costs depend on deadlines and complexity. Quotes must be approved by the client before work begins.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href={user ? "/dashboard/student/new" : "/auth/signup"}
                    onClick={handleIntakeAction}
                    className="w-full inline-flex items-center justify-center font-bold px-6 py-3 rounded bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 shadow text-xs transition-colors"
                  >
                    Submit Intake Brief
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate / Enterprise Deployment Marquee */}
        <section className="py-20 border-t border-border bg-background overflow-hidden">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gemini-purple uppercase tracking-wider block">Enterprise Deployments</span>
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

            <div className="flex w-[200%] overflow-hidden relative select-none border-t border-b border-border py-6 bg-card">
              <div className="flex gap-16 whitespace-nowrap animate-company-scroll items-center">
                {/* Loop 1 */}
                {[
                  { name: "Google AI Labs", desc: "SLM evaluation" },
                  { name: "AeroLabs Research", desc: "Tax automation" },
                  { name: "Fintech Capital", desc: "Ledgers sync" },
                  { name: "ByteScale Corp", desc: "Llama alignment" },
                  { name: "Helix Systems", desc: "Contract audit" },
                  { name: "Nova Analytics", desc: "Timecard tool" }
                ].map((comp, idx) => (
                  <div key={idx} className="inline-flex items-center gap-2.5 bg-background border border-border px-4 py-2.5 rounded-2xl shadow-sm transition-transform hover:scale-[1.03] cursor-pointer">
                    <div className="h-6 w-6 rounded-lg bg-gemini-blue/10 flex items-center justify-center font-bold text-xs text-gemini-blue">
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
                  { name: "Nova Analytics", desc: "Timecard tool" }
                ].map((comp, idx) => (
                  <div key={idx + 100} className="inline-flex items-center gap-2.5 bg-background border border-border px-4 py-2.5 rounded-2xl shadow-sm transition-transform hover:scale-[1.03] cursor-pointer">
                    <div className="h-6 w-6 rounded-lg bg-gemini-blue/10 flex items-center justify-center font-bold text-xs text-gemini-blue">
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
          </div>
        </section>

        {/* FAQs */}
        <section id="faq" className="py-20 bg-card transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
              <p className="text-sm text-text-muted">Common questions about Erudogix Console services and compliance standards.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-6 bg-background border border-border rounded-2xl">
                  <h4 className="font-mono text-sm font-bold text-foreground mb-2 flex items-start gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                    {faq.q}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed pl-6.5">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
