'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Award, 
  Code2, 
  Rocket, 
  BookOpen, 
  Cpu, 
  Layers, 
  ArrowRight 
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 relative">
        {/* Background ambient glow matching Google Gemini UI style */}
        <div className="absolute top-[10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-gemini-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-gemini-purple/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gemini-blue/20 bg-accent-warm-light/60 text-gemini-indigo text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-gemini-purple animate-pulse" />
              Our Story & Team
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              About <span className="bg-gradient-to-r from-gemini-blue via-gemini-purple to-gemini-amber bg-clip-text text-transparent italic">Erudogix</span>
            </h1>
            <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Founded in Jaipur with a vision to redefine academic integrity coaching and bring secure, private AI applications directly to enterprise workflows.
            </p>
          </motion.div>

          {/* Company Story section */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24"
          >
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-bold text-gemini-blue uppercase tracking-widest block">Est. June 2025</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-snug">
                The Fastest Growing Tech Company in Jaipur, Rajasthan
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Erudogix was established in June 2025 by Pradeep with a singular, high-integrity mission: bridging the gap between educational support and enterprise innovation. In a short period, Erudogix has scaled rapidly to support over 500+ students and corporate partners across the UK, Ireland, Australia, and the US.
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                By offering strictly compliant 1:1 conceptual tutoring, developer studio frameworks, and custom privacy-first Small Language Models, we help students excel on their own merit and assist companies in automating invoicing processes offline.
              </p>
              
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/80">
                <div>
                  <div className="text-3xl font-serif font-black text-gemini-indigo">500+</div>
                  <div className="text-[10px] uppercase font-bold text-text-muted mt-1">Active Members</div>
                </div>
                <div>
                  <div className="text-3xl font-serif font-black text-gemini-purple">June '25</div>
                  <div className="text-[10px] uppercase font-bold text-text-muted mt-1">Launch Date</div>
                </div>
                <div>
                  <div className="text-3xl font-serif font-black text-gemini-amber">80+</div>
                  <div className="text-[10px] uppercase font-bold text-text-muted mt-1">Average Target Marks</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative bg-card border border-border p-8 rounded-3xl overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gemini-purple/10 blur-xl pointer-events-none" />
              <h3 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent-warm" /> Core Pillars
              </h3>
              
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-gemini-blue flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Academic Support Guidance</h4>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">Strictly 1:1 educational feedback and syllabus coaching. No ghostwriting.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-gemini-purple flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/20">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Small Language Models (SLMs)</h4>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">Instruction-tuned parameters for enterprise security and offline compliance.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-gemini-amber flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">App Studio Solutions</h4>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">Automated ledgers, real-time worksheets, timecards, and invoicing engines.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Team Section */}
          <div className="space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-serif text-3xl font-bold">Leadership & Specialists</h2>
              <p className="text-sm text-text-muted">Meet the minds directing the growth and technological capability of Erudogix.</p>
            </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              
              {/* Founder Profile */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } }
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.25)"
                }}
                className="bg-card/40 backdrop-blur-sm border border-border/60 hover:border-gemini-blue/60 p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gemini-blue/5 blur-2xl pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 shrink-0 rounded-full overflow-hidden border-2 border-gemini-blue/30 shadow-md">
                        <img src="/images/team/pradeep.png" alt="Pradeep" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-foreground">Pradeep</h3>
                        <p className="text-xs font-bold text-gemini-indigo uppercase tracking-wider mt-1">Founder & CEO</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-accent-warm bg-accent-warm-light px-2 py-0.5 rounded-full uppercase">
                      Jaipur HQ
                    </span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed">
                    Visionary entrepreneur who started Erudogix in June 2025. With a focus on client relationships, premium product architecture, and operational integrity, Pradeep established Erudogix as Jaipur's fastest growing tech organization, bridging global student requirements with top-tier technical mentoring.
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-border/80">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <MapPin className="h-3.5 w-3.5 text-accent-warm" />
                      <span>Jaipur, Rajasthan, India</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Rocket className="h-3.5 w-3.5 text-gemini-blue" />
                      <span>Specializes in: Business Operations & Product Management</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link 
                    href="/auth/signup"
                    className="inline-flex items-center text-xs font-bold text-gemini-indigo hover:underline gap-1.5"
                  >
                    Collaborate with Pradeep <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>

              {/* Developer Profile - Pradeep Ranwa */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } }
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: "0 20px 40px -10px rgba(139, 92, 246, 0.25)"
                }}
                className="bg-card/40 backdrop-blur-sm border border-border/60 hover:border-gemini-purple/60 p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gemini-purple/5 blur-2xl pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 shrink-0 rounded-full overflow-hidden border-2 border-gemini-purple/30 shadow-md">
                        <img src="/images/team/preeti.png" alt="Preeti" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-foreground">Preeti</h3>
                        <p className="text-xs font-bold text-gemini-purple uppercase tracking-wider mt-1">Data Scientist & AI/ML Engineer</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-accent-warm bg-accent-warm-light px-2 py-0.5 rounded-full uppercase">
                      DU & Curaj Alumnus
                    </span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed">
                    Results-driven Data Scientist and AI/ML Engineer with hands-on experience building production-grade AI solutions, cloud-based data pipelines, and generative AI applications. Skilled in Python, machine learning, deep learning, NLP, and GenAI.
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-border/80 text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      <span>M.Sc. CS (Curaj) & B.Sc. CS (Delhi University)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code2 className="h-3.5 w-3.5 text-gemini-purple" />
                      <span>Python, TensorFlow, LangChain, Azure ML, Fabric</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-accent-warm" />
                      <span>Jaipur, Rajasthan, India</span>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a href="mailto:preetishams204@gmail.com" className="p-2 rounded-lg bg-background border border-border hover:bg-accent-warm-light hover:text-accent-warm transition-colors" title="Email Preeti">
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                    <a href="tel:8168801384" className="p-2 rounded-lg bg-background border border-border hover:bg-accent-warm-light hover:text-accent-warm transition-colors" title="Call Preeti">
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-background border border-border hover:bg-accent-warm-light hover:text-accent-warm transition-colors" title="LinkedIn Profile">
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Key Achievements & Projects</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-background border border-border/60 rounded-xl">
                      <div className="font-bold text-[10px] text-foreground">RAG Document Chatbot</div>
                      <p className="text-[9px] text-text-muted">LangChain & Azure AI</p>
                    </div>
                    <div className="p-2 bg-background border border-border/60 rounded-xl">
                      <div className="font-bold text-[10px] text-foreground">Voice Cloning Model</div>
                      <p className="text-[9px] text-text-muted">Production GenAI Solution</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Developer Profile - Shubham Kumar */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } }
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.25)"
                }}
                className="bg-card/40 backdrop-blur-sm border border-border/60 hover:border-gemini-amber/60 p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gemini-amber/5 blur-2xl pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 shrink-0 rounded-full overflow-hidden border-2 border-gemini-amber/30 shadow-md">
                        <img src="/images/team/shubham.png" alt="Shubham Kumar" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-foreground">Shubham Kumar</h3>
                        <p className="text-xs font-bold text-gemini-amber uppercase tracking-wider mt-1">Zoho Developer</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-accent-warm bg-accent-warm-light px-2 py-0.5 rounded-full uppercase hidden xl:block">
                      Curaj Alumnus
                    </span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed">
                    Zoho Developer and Functional Consultant with hands-on experience implementing Zoho applications (Books, People, Payroll, CRM). Skilled in Deluge-based automation and API integrations to streamline business operations.
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-border/80 text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      <span>M.Sc. CS & B.Sc. CS (Central University of Rajasthan)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code2 className="h-3.5 w-3.5 text-gemini-amber" />
                      <span>Zoho Ecosystem, Deluge Script, Python, API Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-accent-warm" />
                      <span>Jaipur, Rajasthan, India</span>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a href="mailto:shubhamkur25@gmail.com" className="p-2 rounded-lg bg-background border border-border hover:bg-accent-warm-light hover:text-accent-warm transition-colors" title="Email Shubham">
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                    <a href="tel:7717780275" className="p-2 rounded-lg bg-background border border-border hover:bg-accent-warm-light hover:text-accent-warm transition-colors" title="Call Shubham">
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-background border border-border hover:bg-accent-warm-light hover:text-accent-warm transition-colors" title="LinkedIn Profile">
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Key Achievements & Projects</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-background border border-border/60 rounded-xl">
                      <div className="font-bold text-[10px] text-foreground">Z-CREW TECH</div>
                      <p className="text-[9px] text-text-muted">Zoho Suite Implementation</p>
                    </div>
                    <div className="p-2 bg-background border border-border/60 rounded-xl">
                      <div className="font-bold text-[10px] text-foreground">DoIT&C System</div>
                      <p className="text-[9px] text-text-muted">Seating Allotment System</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Expanded Sections: Vision/Mission, Roadmap, Compliance, & Tech Specs */}
          <div className="mt-32 space-y-28">
            
            {/* Vision & Mission */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <span className="text-[10px] font-bold text-gemini-purple uppercase tracking-widest block">Our Core Philosophy</span>
                <h2 className="font-serif text-3xl font-bold text-foreground">Mission & Vision</h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  Our mission is to democratize high-fidelity personalized academic coaching while simultaneously securing private enterprise compute workflows. We believe that learning is an active, human-driven process, and technology should guide rather than replace individual capability.
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Our vision is establishing Erudogix as the global benchmark for academic integrity coaching and private small language model deployments, proving that offline secure computing can outperform public clouds in specialized business tasks.
                </p>
              </div>
              <div className="bg-gradient-to-tr from-gemini-blue/5 via-gemini-purple/5 to-gemini-amber/5 border border-border p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gemini-purple/10 blur-xl pointer-events-none" />
                <h4 className="font-serif text-lg font-bold text-foreground mb-4">Integrity Pledge</h4>
                <p className="text-xs italic leading-relaxed text-text-muted">
                  "At Erudogix, we do not author grades; we author understanding. By equipping students with syllabus diagnostics and guiding their drafts, we preserve academic honesty while empowering our members to cross threshold barriers to earn 80+ marks."
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent-warm" />
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Erudogix Compliance Board</span>
                </div>
              </div>
            </motion.div>

            {/* Growth Roadmap Timeline */}
            <div className="space-y-12">
              <div className="text-center max-w-xl mx-auto space-y-3">
                <h2 className="font-serif text-3xl font-bold">Timeline & Growth Roadmap</h2>
                <p className="text-sm text-text-muted">A chronicle of our rapid expansion from Jaipur to global academic markets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { date: 'June 2025', title: 'Jaipur Launch', desc: 'Founded Erudogix HQ in Jaipur. Began local Python web engineering services and tutoring support.' },
                  { date: 'Oct 2025', title: '500+ Active Members', desc: 'Scaled academic support services to UK, Ireland, Australia, and US student networks.' },
                  { date: 'Feb 2026', title: 'Private SLM Launch', desc: 'Rolled out custom offline 1.5B/8B model tuning matrices using SFT weight alignment.' },
                  { date: 'June 2026', title: 'Global App Studio', desc: 'Launched multi-currency ledger billing engines for corporate consulting agencies.' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="p-6 bg-card border border-border rounded-3xl relative space-y-3"
                  >
                    <span className="text-xs font-bold text-gemini-indigo bg-blue-500/10 px-2 py-0.5 rounded-full">
                      {item.date}
                    </span>
                    <h4 className="font-bold text-sm text-foreground pt-1">{item.title}</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Academic Compliance Standards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gemini-blue/5 blur-3xl pointer-events-none" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-foreground">Academic Integrity & Compliance Code</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Erudogix operates under a strict, non-negotiable Quality Assurance Framework aligned with international higher education guidance, including the Quality Assurance Agency for Higher Education (QAA) Quality Code in the UK, the Teaching Excellence Framework (TEF), and US regional honor codes.
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    We strictly monitor all message traffic. Files uploaded by students are utilized exclusively for diagnostic mentorship, referencing training, and syllabus feedback. We prohibit and reject requests requesting direct test completions or ghostwriting.
                  </p>
                </div>
                <div className="lg:col-span-4 bg-background border border-border p-5 rounded-2xl text-center space-y-3">
                  <div className="h-10 w-10 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-xs text-foreground">Certified Compliant</h4>
                  <p className="text-[9px] text-text-muted leading-relaxed">Regularly audited for institutional academic integrity standards.</p>
                </div>
              </div>
            </motion.div>

            {/* Technical Operations Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-card border border-border p-6 md:p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full bg-gemini-purple/5 blur-2xl pointer-events-none" />
                <h3 className="font-serif text-lg font-bold text-foreground">Technical Operations Stack</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Erudogix systems are designed to operate securely and locally. We utilize a PostgreSQL database connection pool configured with the `pg` client, running with high-performance query caching to manage user sessions and chat logs.
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-text-muted">
                  <div className="p-2 bg-background rounded-lg border border-border/80">
                    <span className="font-bold block text-foreground">Database Layer</span>
                    Postgres Replication
                  </div>
                  <div className="p-2 bg-background rounded-lg border border-border/80">
                    <span className="font-bold block text-foreground">API Services</span>
                    Flask / Python Microservices
                  </div>
                  <div className="p-2 bg-background rounded-lg border border-border/80">
                    <span className="font-bold block text-foreground">Tuning Backend</span>
                    PyTorch / SFT Matrices
                  </div>
                  <div className="p-2 bg-background rounded-lg border border-border/80">
                    <span className="font-bold block text-foreground">Session Auth</span>
                    Web Crypto HMAC-256
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] font-bold text-gemini-amber uppercase tracking-widest block">Jaipur Tech Hub</span>
                <h2 className="font-serif text-3xl font-bold text-foreground">Local Server Infrastructure</h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  Our development hub in Jaipur, Rajasthan, houses the secure, offline server nodes utilized for Small Language Model training. Rather than leaking business intelligence over external public clouds, our custom-built clusters fine-tune parameters in-house, keeping client data 100% private.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/pricing"
                    className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full bg-card border border-border hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground text-xs transition-all shadow-sm"
                  >
                    View Pricing Estimates
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Alumni & Specialist Credentials Wall */}
            <div className="pt-20 border-t border-border/40 text-center space-y-10">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gemini-indigo uppercase tracking-wider block">Specialists Credentials</span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Where Our Team Has Worked</h3>
                <p className="text-xs text-text-muted max-w-xl mx-auto leading-relaxed">
                  Our core advisors, developers, and tutoring mentors hold credentials from global academic institutions and leading AI technology groups.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { name: "Google AI Research", type: "Industry Core" },
                  { name: "IIT Delhi Labs", type: "Academic Alumnus" },
                  { name: "Curaj AI Group", type: "Development Core" },
                  { name: "Amazon Robotics", type: "Enterprise Alumnus" }
                ].map((cred, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 bg-card border border-border rounded-2xl flex flex-col justify-center items-center shadow-xs transition-all hover:scale-105 hover:border-accent-warm/40 hover:shadow-[0_0_20px_rgba(240,179,35,0.08)] cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-xl bg-accent-warm-light/45 flex items-center justify-center font-bold text-sm text-accent-warm mb-3">
                      {cred.name[0]}
                    </div>
                    <span className="text-xs font-bold text-foreground block">{cred.name}</span>
                    <span className="text-[9px] text-text-muted mt-1 uppercase tracking-wider font-semibold">{cred.type}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
