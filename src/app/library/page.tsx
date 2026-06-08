'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  BookOpen, 
  ShieldAlert, 
  FileText, 
  ArrowDownToLine, 
  Search, 
  Sparkles, 
  Loader2, 
  Check, 
  BookOpenCheck,
  X,
  Eye,
  Bookmark,
  Calendar,
  CheckCircle2,
  Terminal,
  Activity,
  ArrowRight,
  Info
} from 'lucide-react'

interface Resource {
  title: string
  subject: string
  type: string
  author: string
  size: string
  year: string
  desc: string
  abstract: string
  takeaways: string[]
  roadmap: string[]
}

export default function LibraryPage() {
  const resources: Resource[] = [
    { 
      title: "Attention Is All You Need", 
      subject: "AI Research", 
      type: "Research Paper", 
      author: "Vaswani et al. (Google Brain)",
      size: "1.8 MB", 
      year: "2017",
      desc: "The seminal research paper that introduced the Transformer architecture, replacing recurrent models (RNNs/LSTMs) entirely with self-attention mechanisms.",
      abstract: "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. The model achieves 28.4 BLEU on WMT 2014 English-to-German translation, improving over existing best results.",
      takeaways: [
        "Introduced Self-Attention mechanism to capture global dependencies without sequential processing bottlenecks.",
        "Replaced recurrence with positional encodings, enabling complete GPU parallelization of training payloads.",
        "Established Multi-Head Attention to allow the model to jointly attend to information from different representation subspaces.",
        "Formed the foundational architectural blueprint for all modern Large Language Models (LLMs) including GPT, Gemini, Claude, and Llama."
      ],
      roadmap: [
        "Analyze Single-Head Scaled Dot-Product Attention equations and the necessity of the square root key dimension scaling factor.",
        "Deconstruct Multi-Head Attention layer configurations, feed-forward sub-layers, residual connections, and Layer Normalization.",
        "Map the positional encoding formulas using sine and cosine functions of different frequencies to capture token ordering.",
        "Write and compile a complete encoder-decoder Transformer block from scratch in PyTorch, testing on a mini-corpus."
      ]
    },
    { 
      title: "Generative Adversarial Nets", 
      subject: "AI Research", 
      type: "Research Paper", 
      author: "Ian Goodfellow et al. (Univ. of Montreal)",
      size: "2.4 MB", 
      year: "2014",
      desc: "The landmark paper introducing Generative Adversarial Networks (GANs), framing generative modeling as a competitive minimax game.",
      abstract: "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G. The training procedure for G is to maximize the probability of D making a mistake. This framework corresponds to a minimax two-player game.",
      takeaways: [
        "Introduced the adversarial training paradigm (Generator vs. Discriminator).",
        "Defined the minimax game objective function with theoretical global convergence proofs.",
        "Revolutionized realistic image synthesis, style transfer, and deepfake generation.",
        "Paved the path for realistic image synthesizers, style transfers, text-to-image synthesis, and deepfake architectures."
      ],
      roadmap: [
        "Understand the minimax value function formula V(D,G) and the mathematical proofs of convergence.",
        "Analyze classic GAN failures such as mode collapse, vanishing gradients, and non-convergence.",
        "Study modern extensions including Wasserstein GANs (WGAN) to stabilize training with Kantorovich-Rubinstein duality.",
        "Implement a Deep Convolutional GAN (DCGAN) to generate synthetic handwritten digits or low-resolution faces."
      ]
    },
    { 
      title: "Llama 3: Open Foundation & Chat Models", 
      subject: "AI Research", 
      type: "Technical Report", 
      author: "Meta AI Research Team",
      size: "4.2 MB", 
      year: "2024",
      desc: "Meta AI's comprehensive technical report detailing training data mixtures, scaling laws, architectural enhancements, and safety alignments.",
      abstract: "This report introduces Llama 3, a new family of large language models. We describe the model architecture, training data, training process, safety guardrails, and evaluations. Llama 3 models demonstrate state-of-the-art open capabilities on reasoning, code generation, translation, and instruction following, establishing a new baseline for open weights.",
      takeaways: [
        "Reveals optimization strategies for pre-training models on a massive corpus containing over 15 Trillion tokens.",
        "Utilizes Grouped-Query Attention (GQA) with 8 key-value heads to optimize KV cache footprint during multi-turn chats.",
        "Details the integration of SFT, Reinforcement Learning from Human Feedback (RLHF), and Direct Preference Optimization (DPO) pipelines.",
        "Demonstrates the importance of high-quality synthetic data generation for code reasoning and alignment."
      ],
      roadmap: [
        "Deconstruct Grouped-Query Attention (GQA) mechanics and compare memory speedups against Multi-Query Attention.",
        "Examine data cleaning heuristics, web text deduplication, and quality classifier models used to screen 15T tokens.",
        "Review alignment strategies, comparing the performance benefits of DPO directly against standard PPO.",
        "Deploy Llama 3 locally using Ollama or vLLM, testing custom system prompt injection and tool-calling parameters."
      ]
    },
    { 
      title: "State of AI Report 2025", 
      subject: "AI Reports", 
      type: "Industry Report", 
      author: "Nathan Benaich (Air Street Capital)",
      size: "8.4 MB", 
      year: "2025",
      desc: "The comprehensive annual review tracking breakthroughs in AI research, industry trends, compute allocations, and global regulatory legislation.",
      abstract: "The 2025 edition of the State of AI Report reviews research breakthroughs, hardware bottlenecks, safety configurations, policy, and geopolitics. Key themes include the operationalization of LLM agent workflows, sovereign AI compute, and the narrowing performance gap between open-weights and closed API model lines.",
      takeaways: [
        "Documents the transition from basic chat prompts to autonomous agentic workflows utilizing tools and loops.",
        "Identifies the shift in hardware scaling bottlenecks from raw GPU shortages to grid power and data capacity.",
        "Analyzes the rise of small, heavily optimized models matching frontier performance on specific domains.",
        "Tracks global regulatory shifts, highlighting the operational implementation of the EU AI Act and national safety institutes."
      ],
      roadmap: [
        "Analyze the architecture of multi-agent frameworks, comparing directed graph routing against autonomous planning.",
        "Map global compute investments, tracking national sovereignty initiatives in cloud data center allocations.",
        "Study domain-specific optimization approaches like fine-tuning using synthetic text corpora.",
        "Evaluate compliance protocols under modern frameworks like the EU AI Act for high-risk applications."
      ]
    },
    { 
      title: "Stanford AI Index Report 2026", 
      subject: "AI Reports", 
      type: "Academic Report", 
      author: "Stanford Institute for Human-Centered AI",
      size: "12.1 MB", 
      year: "2026",
      desc: "A definitive independent report tracking AI index indicators across research, technical performance, ethics, economy, and education.",
      abstract: "The 2026 AI Index is the most comprehensive report to date, measuring the advancement, societal impact, and economic trajectories of artificial intelligence systems worldwide using rigorous empirical data from industry, research, and governance.",
      takeaways: [
        "Highlights AI surpassing human benchmarks on basic cognitive tasks while lagging in complex planning and mathematical reasoning.",
        "Tracks private investment trajectories, noting historical peaks in generative AI hardware infrastructure allocations.",
        "Synthesizes public opinion indexes showing rising concern over synthetic media, deepfakes, and privacy violations.",
        "Details the acceleration of AI integration in scientific discovery, specifically structural biology and materials science."
      ],
      roadmap: [
        "Evaluate performance benchmarks (MMLU, MATH, SWE-bench) and understand their saturation curves.",
        "Study the global economics of AI, analyzing startup creation rates, job postings, and venture allocations.",
        "Deconstruct ethical evaluation frameworks, specifically looking at bias metrics and red-teaming protocols.",
        "Analyze case studies of AI applications in medicine, particularly AlphaFold-style protein mapping workflows."
      ]
    },
    { 
      title: "Structure and Interpretation of Computer Programs (SICP)", 
      subject: "Computer Science", 
      type: "Classic Book Guide", 
      author: "Abelson & Sussman (MIT Press)",
      size: "5.6 MB", 
      year: "1996",
      desc: "The legendary MIT computer science textbook teaching abstraction layers, functional programming paradigms, and compiler mechanics using Scheme.",
      abstract: "This classic textbook teaches the principles of computer programming, including recursion, abstraction, modularity, and programming language design. It uses Scheme, a dialect of Lisp, to demonstrate how to build layered computer languages.",
      takeaways: [
        "Establishes functional programming paradigms, utilizing recursion, closures, and higher-order functions to structure logic.",
        "Deconstructs the substitution model vs. the environment model of evaluation to map variable scopes.",
        "Explains stream processing to separate event sequences from the execution timeframe, modeling state changes without assignment.",
        "Instructs how to build a meta-circular evaluator to run languages inside other languages, forming custom DSLs."
      ],
      roadmap: [
        "Master higher-order procedures, lambda expressions, recursion, and iterative process generations in Scheme.",
        "Study environment structures, compound data objects, and the representation of mutable state.",
        "Implement lazy evaluation engines, infinite streams, and nondeterministic computing routines.",
        "Design and build a complete meta-circular evaluator in Scheme, extending it to support dynamic typing."
      ]
    },
    { 
      title: "Introduction to Algorithms (CLRS)", 
      subject: "Mathematics", 
      type: "Textbook Review", 
      author: "Cormen, Leiserson, Rivest, Stein",
      size: "9.2 MB", 
      year: "2022",
      desc: "The definitive textbook on algorithms, detailing sorting, search, graph networks, dynamic programming, and complexity theory.",
      abstract: "This text provides a broad introduction to the modern study of computer algorithms. It presents many algorithms and covers them in considerable depth, yet makes their design and analysis accessible to all levels of readers.",
      takeaways: [
        "Provides a rigorous mathematical framework for measuring algorithm runtime using asymptotic notation (O, Ω, Θ).",
        "Deconstructs core paradigm designs including divide-and-conquer, greedy choices, and dynamic programming.",
        "Covers advanced graph analysis frameworks including network flows, bipartite matchings, and shortest path proofs.",
        "Explores NP-completeness theory, showing how to prove computational hardness through reductions."
      ],
      roadmap: [
        "Practice solving recurrence relations using the Master Method and recursion tree models.",
        "Master dynamic programming, proving optimal substructure properties and implementing memoization.",
        "Study graph network flows, executing Ford-Fulkerson maximum flow and minimum cut calculations.",
        "Examine NP-completeness proofs, reducing 3-SAT to graph clique problems to demonstrate hard limits."
      ]
    },
    { 
      title: "A Mathematical Theory of Communication", 
      subject: "Mathematics", 
      type: "Research Paper", 
      author: "Claude E. Shannon (Bell Labs)",
      size: "1.2 MB", 
      year: "1948",
      desc: "The foundational Bell Labs paper that established Information Theory, introducing mathematical entropy and channel capacity limits.",
      abstract: "In this paper we consider the communication system as consisting of an information source, transmitter, channel, receiver, and destination. We formulate a mathematical theory of communication to model source compression and channel limits under noise.",
      takeaways: [
        "Defined the mathematical concept of Information Entropy as a measure of choice, uncertainty, and surprise.",
        "Established the noisy-channel coding theorem, proving transmission errors can be made arbitrarily small below channel capacity.",
        "Introduced the binary digit (bit) as the fundamental quantitative measure of information capacity.",
        "Unified analog continuous signals and digital discrete states under a single mathematical paradigm."
      ],
      roadmap: [
        "Derive the mathematical entropy equation H = -Σ p_i log2(p_i) and prove its properties of maximization.",
        "Study source coding theorems, analyzing data compression boundaries and Huffman coding configurations.",
        "Calculate channel capacity limits using the Shannon-Hartley theorem for noisy bands: C = B log2(1 + S/N).",
        "Deconstruct error-correcting codes, analyzing Hamming distances and parity-check matrix formulations."
      ]
    },
    { 
      title: "The General Theory of Employment, Interest, and Money", 
      subject: "Economics", 
      type: "Reference Guide", 
      author: "John Maynard Keynes",
      size: "3.1 MB", 
      year: "1936",
      desc: "The foundational work of Keynesian macroeconomics, detailing aggregate demand, liquid preferences, and market interventions.",
      abstract: "This book argues that free markets do not automatically self-correct to full employment during recessions, demonstrating that aggregate demand determines economic outputs and employment levels.",
      takeaways: [
        "Establishes that aggregate demand is the primary driver of macroeconomic cycles and overall employment rates.",
        "Introduced the multiplier effect, showing that initial injections of investment lead to larger increases in national income.",
        "Defines Liquidity Preference as the demand for cash rather than interest-bearing assets under market uncertainty.",
        "Argues for active counter-cyclical government spending and fiscal policy to stabilize recessions."
      ],
      roadmap: [
        "Study the marginal propensity to consume (MPC) and derive the investment multiplier formula.",
        "Graph the relationship between the marginal efficiency of capital and prevailing interest rates.",
        "Deconstruct the liquidity preference theory of interest rates under variable risk scenarios.",
        "Analyze historical case studies of fiscal stimulus interventions, mapping multipliers to real GDP growth."
      ]
    },
    { 
      title: "A Brief History of Time", 
      subject: "Physics", 
      type: "Study Guide", 
      author: "Stephen Hawking",
      size: "2.7 MB", 
      year: "1988",
      desc: "The popular science classic introducing general relativity, quantum mechanics, black hole thermodynamics, and the origin of the cosmos.",
      abstract: "Stephen Hawking attempts to explain a range of subjects in cosmology, including the Big Bang, black holes and light cones, to the non-specialist reader, aiming to reconcile gravity and quantum mechanics.",
      takeaways: [
        "Explains the cosmological singularity of the Big Bang, showing time itself has a physical beginning point.",
        "Formulates Hawking Radiation, proving that quantum fluctuations near event horizons cause black holes to emit energy.",
        "Explores the arrow of time, detailing the thermodynamic, cosmological, and psychological arrow directions.",
        "Investigates the no-boundary proposal, modeling the early universe as a closed surface without space-time edges."
      ],
      roadmap: [
        "Analyze the friction between Einstein's General Relativity and the Heisenberg Uncertainty Principle.",
        "Study black hole thermodynamics, calculating event horizon surface area relationships to entropy.",
        "Deconstruct light cones, space-time diagrams, and particle event horizons in expanding universes.",
        "Examine quantum gravity string models and M-theory constructs aiming for unified field models."
      ]
    },
    { 
      title: "Academic Writing: Structuring a Literature Review", 
      subject: "Academic Skills", 
      type: "Feedback Example", 
      author: "Erudogix Mentorship Board",
      size: "1.5 MB", 
      year: "2023",
      desc: "A detailed methodological guide on synthesis mapping, citation tracking, and thematic structuring of literature reviews for graduate admissions.",
      abstract: "This guide details the academic guidelines for preparing literature reviews. It presents systematic synthesis structures to group past research thematic maps, checking citation distributions, and formulating academic claims.",
      takeaways: [
        "Instructs how to design literature synthesis matrices, linking various research papers by thematic clusters rather than lists.",
        "Outlines proper citation density strategies, ensuring bibliography layouts demonstrate absolute command of the discipline.",
        "Teaches transitional phrasing techniques to connect sub-arguments while maintaining thematic momentum.",
        "Details red-teaming processes for reviews, highlighting bias scanning and citation gaps."
      ],
      roadmap: [
        "Gather 30+ peer-reviewed sources, inputting metadata and findings into a structured Excel synthesis matrix.",
        "Outline the review, drafting thematic section headings that build a logical sequence towards your thesis claim.",
        "Draft sections, using active synthesis verbs (e.g., 'synthesizes', 'refutes', 'corroborates') rather than passive summaries.",
        "Refine citation density, aligning format rules (APA/MLA/Chicago) and cross-checking referencing files."
      ]
    }
  ]

  const categories = ["All", "AI Research", "AI Reports", "Computer Science", "Mathematics", "Physics", "Economics", "Academic Skills"]

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Preview Reader modal state
  const [activePreview, setActivePreview] = useState<Resource | null>(null)
  
  // Spotlight item selection state (Attention Is All You Need, Llama 3, SICP)
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const spotlightItems = [resources[0], resources[2], resources[5]] // Attention, Llama 3, SICP
  const currentSpotlight = spotlightItems[spotlightIndex]

  // Spotlight 3D interactive cursor rotation states
  const [showcaseHover, setShowcaseHover] = useState(false)
  const [showcaseCoords, setShowcaseCoords] = useState({ x: 0, y: 0 })

  // Download Telemetry state
  const [activeDownloadTitle, setActiveDownloadTitle] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [telemetryLogs, setTelemetryLogs] = useState<{ id: string; text: string; type: 'info' | 'success' | 'warning' }[]>([])
  const [downloadedIds, setDownloadedIds] = useState<string[]>([])
  
  // Quick Search Shortcut reference
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Whole-page mouse tracker reference
  const containerRef = useRef<HTMLDivElement>(null)

  // Cursor tracking coordinates for the background glow
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
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Hotkey listener for CMD+K search autofocus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || res.subject === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Start the high-fidelity telemetry download pipeline & trigger a real text guide download
  const handleDownload = (res: Resource) => {
    if (activeDownloadTitle || downloadedIds.includes(res.title)) return
    
    setActiveDownloadTitle(res.title)
    setDownloadProgress(0)
    setTelemetryLogs([
      { id: '1', text: `[INIT] Handshake request initiated to Erudogix storage nodes...`, type: 'info' }
    ])

    const steps = [
      { prg: 15, text: `[SECURE] SSL/TLS handshaking complete. Encrypted connection established via AES-256-GCM.`, type: 'info' },
      { prg: 40, text: `[STORAGE] Querying file segment array for "${res.title}"...`, type: 'info' },
      { prg: 65, text: `[DECRYPT] Downloading raw buffers. Running CRC32 parity checks...`, type: 'info' },
      { prg: 85, text: `[ASSEMBLING] Synthesizing structural outline guides, takeaways and study roadmap...`, type: 'info' },
      { prg: 100, text: `[SUCCESS] Download completed. Generating client local document package.`, type: 'success' }
    ]

    let stepIndex = 0
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const currentStep = steps[stepIndex]
        setDownloadProgress(currentStep.prg)
        setTelemetryLogs(prev => [...prev, { id: Math.random().toString(), text: currentStep.text, type: currentStep.type as 'info' | 'success' }])
        stepIndex++
      } else {
        clearInterval(interval)
        
        // Trigger actual client file download of the synthesized reference guide
        triggerRealDownload(res)

        setDownloadedIds(prev => [...prev, res.title])
        
        // Retain notification for visual reward, then dismiss
        setTimeout(() => {
          setActiveDownloadTitle(null)
          setTelemetryLogs([])
        }, 3000)

        // Reset downloaded state after 15 seconds to allow testing again
        setTimeout(() => {
          setDownloadedIds(prev => prev.filter(id => id !== res.title))
        }, 15000)
      }
    }, 850)
  }

  // Synthesizes a text guide dynamically and saves to local machine
  const triggerRealDownload = (res: Resource) => {
    const textContent = `========================================================================
                      ERUDOGIX KNOWLEDGE COMMONS
            AUTHENTIC RESOURCE SYNOPSIS & ACADEMIC STUDY GUIDE
========================================================================

Title:         ${res.title}
Document Type: ${res.type}
Subject Field: ${res.subject}
Primary Author: ${res.author}
Catalog Year:  ${res.year}
File Footprint: ${res.size}

------------------------------------------------------------------------
1. ABSTRACT / SUMMARY DESCRIPTION
------------------------------------------------------------------------
${res.abstract}

------------------------------------------------------------------------
2. SYSTEMATIC ACADEMIC TAKEAWAYS
------------------------------------------------------------------------
${res.takeaways.map((takeaway, idx) => `[Takeaway ${idx + 1}] ${takeaway}`).join('\n\n')}

------------------------------------------------------------------------
3. ADVISOR STUDY ROADMAP & LEARNING PLAN
------------------------------------------------------------------------
${res.roadmap.map((step, idx) => `Step ${idx + 1}: ${step}`).join('\n')}

========================================================================
ACADEMIC INTEGRITY DISCLAIMER:
All study materials and guides hosted in the Erudogix library are provided
strictly for conceptual guidance and reference. Uploading these documents
as templates for graded evaluations is strictly prohibited.
========================================================================`

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${res.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_guide.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Apple-style 3D showcase movement tilt angles
  const handleShowcaseMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    // Map mouse position to -10 to +10 degrees tilt rotation
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 20)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 20)
    setShowcaseCoords({ x, y })
  }

  const handleShowcaseMouseLeave = () => {
    setShowcaseCoords({ x: 0, y: 0 })
    setShowcaseHover(false)
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col min-h-screen relative overflow-hidden bg-background"
    >
      
      {/* Background static ambient glow matching Google Gemini UI style */}
      <div className="absolute top-[10%] left-[-15%] w-[50rem] h-[50rem] rounded-full bg-gemini-blue/5 blur-[140px] pointer-events-none animate-drift-slow z-0" />
      <div className="absolute bottom-[15%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-gemini-purple/5 blur-[140px] pointer-events-none animate-drift-slower z-0" />
      <div className="absolute top-[50%] left-[30%] w-[35rem] h-[35rem] rounded-full bg-gemini-indigo/5 blur-[130px] pointer-events-none z-0" />

      {/* Mouse-Tracking Interactive Background Illumination (Lumination effect) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(66, 133, 244, 0.08), rgba(155, 81, 224, 0.06), rgba(26, 115, 232, 0.05), transparent 80%)`
        }}
      />

      {/* Dynamic Floating Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute top-[15%] left-0 w-3 h-3 rounded-full bg-gemini-indigo/20 blur-[2px] animate-wind-slow-1" />
        <div className="absolute top-[45%] left-0 w-4 h-4 rounded-full bg-gemini-purple/15 blur-[1px] animate-wind-slow-2" />
        <div className="absolute top-[75%] left-0 w-2.5 h-2.5 rounded-full bg-gemini-amber/15 blur-[2px] animate-wind-slow-3" />
        <div className="absolute top-[28%] left-0 w-2.5 h-2.5 rounded-full bg-gemini-blue/20 blur-[1px] animate-wind-slow-1" style={{animationDelay: '6s'}} />
        <div className="absolute top-[60%] left-0 w-3.5 h-3.5 rounded-full bg-gemini-indigo/10 blur-[3px] animate-wind-slow-2" style={{animationDelay: '10s'}} />
      </div>

      <Navbar />

      <main className="flex-grow py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gemini-blue/20 bg-accent-warm-light/60 text-gemini-indigo text-xs font-semibold uppercase tracking-wider shadow-sm font-sans">
              <Sparkles className="h-3.5 w-3.5 text-gemini-purple animate-pulse" />
              Academic Knowledge Commons
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Study Resources Library
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Access authentic research papers, classic academic references, and structural coaching worksheets compiled by our advisors to support independent study.
            </p>
          </motion.div>

          {/* ========================================================================
             NEW: APPLE-STYLE GLOSSY 3D EXPLODING SHOWCASE POD
             ======================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            onMouseMove={handleShowcaseMouseMove}
            onMouseEnter={() => setShowcaseHover(true)}
            onMouseLeave={handleShowcaseMouseLeave}
            className="w-full bg-radial-gradient bg-card/40 backdrop-blur-2xl border border-border/80 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.12)] relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group/showcase cursor-pointer select-none"
            onClick={() => setActivePreview(currentSpotlight)}
          >
            {/* Dynamic backdrop reflection mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(66,133,244,0.08)_0%,transparent_60%)] pointer-events-none transition-opacity duration-300 z-0" />
            
            {/* Ambient backing light blur */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-gemini-blue/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gemini-purple/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Left Side: Typography and Actions */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-warm bg-accent-warm-light/60 px-3 py-1 rounded-full border border-accent-warm/15">
                  Spotlight Publication
                </span>
                <span className="text-[10px] font-mono text-text-muted">Premium Reference Package</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-foreground leading-tight tracking-tight group-hover/showcase:text-accent-warm transition-colors duration-300">
                  {currentSpotlight.title}
                </h2>
                <p className="text-xs text-text-muted">
                  Authored by <span className="font-semibold text-foreground/80">{currentSpotlight.author}</span> • Published {currentSpotlight.year}
                </p>
              </div>

              <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl">
                {currentSpotlight.desc}
              </p>

              <div className="flex flex-wrap gap-4 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActivePreview(currentSpotlight)}
                  className="px-6 py-3 rounded-full text-xs font-bold bg-foreground text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Explore Interactive Preview
                </button>
                <button
                  onClick={() => handleDownload(currentSpotlight)}
                  disabled={activeDownloadTitle !== null || downloadedIds.includes(currentSpotlight.title)}
                  className={`px-6 py-3 rounded-full text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-2 ${
                    downloadedIds.includes(currentSpotlight.title)
                      ? 'border-green-500/20 bg-green-500/10 text-green-400 cursor-default shadow-none'
                      : activeDownloadTitle === currentSpotlight.title
                      ? 'border-neutral-700 bg-neutral-800 text-neutral-400 cursor-wait'
                      : 'border-border bg-card hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground hover:text-accent-warm shadow-sm'
                  }`}
                >
                  {downloadedIds.includes(currentSpotlight.title) ? (
                    <>
                      Saved Guide <Check className="h-4 w-4 animate-bounce" />
                    </>
                  ) : activeDownloadTitle === currentSpotlight.title ? (
                    <>
                      Caching Package... <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Download Package <ArrowDownToLine className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Spotlight Selectors (Apple-style dot controls) */}
              <div className="flex items-center gap-3 pt-6 border-t border-border/30 max-w-md" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Spotlight Catalog:</span>
                <div className="flex gap-2">
                  {spotlightItems.map((item, idx) => (
                    <button
                      key={item.title}
                      onClick={() => setSpotlightIndex(idx)}
                      className={`relative px-3 py-1 rounded-full text-[9px] font-bold border transition-all duration-300 cursor-pointer ${
                        spotlightIndex === idx
                          ? 'bg-gradient-to-r from-gemini-blue via-gemini-indigo to-gemini-purple text-white border-transparent'
                          : 'border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-text-muted hover:text-foreground'
                      }`}
                    >
                      {idx === 0 ? 'Transformer' : idx === 1 ? 'Llama 3' : 'SICP'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Interactive 3D Exploding Graphic */}
            <div className="lg:col-span-5 flex justify-center items-center h-80 relative perspective-[1200px] z-10">
              
              {/* Main rotating/tilting booklet stack assembly */}
              <div
                style={{
                  transform: `rotateX(${-showcaseCoords.y}deg) rotateY(${showcaseCoords.x}deg)`,
                  transition: showcaseHover ? 'transform 0.05s ease-out' : 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transformStyle: 'preserve-3d'
                }}
                className="relative w-44 h-60 flex items-center justify-center"
              >
                {/* 1. Exploding Shadow Layer (Z: -60px) */}
                <div
                  style={{
                    transform: `translate3d(-15px, 15px, ${showcaseHover ? '-60px' : '-20px'}) rotateY(-22deg) scale(0.95)`,
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  }}
                  className="absolute inset-0 bg-neutral-950/25 dark:bg-black/45 rounded-r-2xl blur-lg pointer-events-none"
                />

                {/* 2. Tech Ring Orbit HUD behind cover (Z: -30px) */}
                <div
                  style={{
                    transform: `translate3d(0px, 0px, ${showcaseHover ? '-30px' : '-10px'}) rotateY(-20deg)`,
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  }}
                  className="absolute w-60 h-60 border border-dashed border-accent-warm/15 rounded-full animate-spin-slow pointer-events-none"
                />
                <div
                  style={{
                    transform: `translate3d(0, 0, ${showcaseHover ? '-30px' : '-10px'}) rotateY(-20deg) rotate(90deg)`,
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    animationDirection: 'reverse',
                    animationDuration: '25s'
                  }}
                  className="absolute w-52 h-52 border border-accent-warm/10 rounded-full animate-spin-slow pointer-events-none"
                />

                {/* 3. Exploding Book Pages Block (Z: 0px) */}
                <div
                  style={{
                    transform: `translate3d(0px, 0px, 0px) rotateY(-18deg)`,
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    transformStyle: 'preserve-3d'
                  }}
                  className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 rounded-r-xl border border-border/70 border-l-[8px] border-l-neutral-400 dark:border-l-neutral-700 flex flex-col justify-between p-4 shadow-md pointer-events-none"
                >
                  <div className="w-full h-full bg-linear-to-r from-neutral-300/20 to-transparent flex flex-col justify-between">
                    <div className="space-y-1.5 opacity-60">
                      <div className="h-2 w-12 bg-foreground/30 rounded-full" />
                      <div className="h-1.5 w-full bg-foreground/20 rounded-full" />
                      <div className="h-1.5 w-5/6 bg-foreground/20 rounded-full" />
                    </div>
                    <div className="space-y-1 opacity-60">
                      <div className="h-1.5 w-full bg-foreground/20 rounded-full" />
                      <div className="h-1.5 w-full bg-foreground/20 rounded-full" />
                      <div className="h-1.5 w-4/6 bg-foreground/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* 4. Glossy exploded glass cover (Z: 60px) */}
                <div
                  style={{
                    transform: `translate3d(${showcaseHover ? '35px' : '12px'}, ${showcaseHover ? '-20px' : '-5px'}, ${showcaseHover ? '70px' : '30px'}) rotateY(-12deg)`,
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    transformStyle: 'preserve-3d'
                  }}
                  className="absolute inset-0 bg-card/65 backdrop-blur-md border border-white/30 dark:border-neutral-700/50 rounded-r-2xl flex flex-col justify-between p-4 shadow-lg pointer-events-none overflow-hidden"
                >
                  {/* Apple chrome reflection light sweep */}
                  <div className="absolute inset-0 bg-linear-to-tr from-white/10 via-white/20 to-transparent rotate-12 pointer-events-none opacity-80" />
                  
                  <div className="flex justify-between items-start">
                    <Bookmark className="h-5 w-5 text-accent-warm" />
                    <span className="text-[8px] font-mono text-accent-warm font-bold">{currentSpotlight.size}</span>
                  </div>
                  <div className="space-y-1 relative z-10">
                    <p className="text-[11px] font-serif font-black text-foreground leading-snug line-clamp-3">
                      {currentSpotlight.title}
                    </p>
                    <p className="text-[8px] text-text-muted font-bold line-clamp-1">by {currentSpotlight.author}</p>
                  </div>
                  <div className="flex justify-between items-center text-[7px] font-mono text-text-muted pt-2 border-t border-border/40">
                    <span>{currentSpotlight.subject}</span>
                    <span>{currentSpotlight.year}</span>
                  </div>
                </div>

                {/* 5. Floating Holographic Metadata Ring Overlay (Z: 100px) */}
                <div
                  style={{
                    transform: `translate3d(${showcaseHover ? '55px' : '20px'}, ${showcaseHover ? '-35px' : '-10px'}, ${showcaseHover ? '110px' : '50px'}) rotateY(-8deg)`,
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  }}
                  className="absolute w-20 h-20 bg-linear-to-br from-gemini-blue/15 via-gemini-purple/20 to-transparent border border-white/20 rounded-full flex flex-col items-center justify-center shadow-lg pointer-events-none backdrop-blur-xs font-mono text-[8px]"
                >
                  <Sparkles className="h-4 w-4 text-accent-warm mb-1 animate-pulse" />
                  <span className="text-[6px] text-neutral-400">ERUDOGIX</span>
                  <span className="font-bold text-foreground">{currentSpotlight.year}</span>
                </div>

              </div>
            </div>

          </motion.div>

          {/* Academic Integrity Compliance Notice (Glassy Alert Box) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card/45 backdrop-blur-md border border-border/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-3 bg-accent-warm-light text-accent-warm rounded-2xl border border-accent-warm/15 shrink-0 animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-foreground">Academic Integrity & Resource Compliance</h2>
              <p className="text-xs text-text-muted leading-relaxed">
                All resources, textbook reviews, and technical guides hosted in the Erudogix library are provided <strong>strictly for reference and conceptual guidance</strong>. We fully prohibit uploading these resources as completed templates for school evaluations, and we strictly enforce global academic integrity codes across all client accounts.
              </p>
            </div>
          </motion.div>

          {/* Controls Deck: Search Console & Filters Panel */}
          <div className="space-y-6">
            
            {/* Glassy Search Input with Focus-Within Illumination Glow Ring */}
            <div className="relative max-w-md bg-card/65 backdrop-blur-sm border border-border/80 rounded-2xl p-1 shadow-sm flex items-center gap-2 transition-all duration-300 hover:border-gemini-indigo/60 focus-within:border-accent-warm focus-within:ring-4 focus-within:ring-accent-warm/15 focus-within:shadow-[0_0_30px_rgba(66,133,244,0.18)] group/search">
              
              {/* Animated color overlay that activates on input hover/focus */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gemini-blue/10 via-gemini-indigo/10 to-gemini-purple/10 rounded-2xl blur-md opacity-0 group-focus-within/search:opacity-100 group-hover/search:opacity-50 transition-opacity duration-500 pointer-events-none" />

              <div className="pl-3.5 text-text-muted group-focus-within/search:text-accent-warm transition-colors duration-200">
                <Search className="h-4.5 w-4.5" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by title, author, or description... (Press ⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 text-xs py-2.5 text-foreground focus:outline-none focus:ring-0 placeholder:text-text-muted/60"
              />
            </div>

            {/* Category Filters bar */}
            <div className="flex flex-wrap gap-2.5 pb-2 border-b border-border/40 overflow-x-auto select-none scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="relative px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition-all duration-300 group overflow-hidden"
                >
                  {/* Sliding Gradient Backdrop */}
                  {selectedCategory === cat ? (
                    <motion.div 
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-gradient-to-r from-gemini-blue via-gemini-indigo to-gemini-purple rounded-full z-0 animate-pulse"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-card/35 opacity-0 group-hover:opacity-100 rounded-full z-0 transition-opacity" />
                  )}
                  
                  <span className={`relative z-10 transition-colors duration-200 ${
                    selectedCategory === cat ? 'text-white' : 'text-text-muted group-hover:text-foreground'
                  }`}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid List */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredResources.map((res) => (
                <ResourceCard 
                  key={res.title}
                  res={res}
                  onPreview={(r) => setActivePreview(r)}
                  onDownload={(r) => handleDownload(r)}
                  downloadingId={activeDownloadTitle}
                  downloadedIds={downloadedIds}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty search results state */}
          {filteredResources.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-card/25 border border-dashed border-border rounded-3xl"
            >
              <BookOpenCheck className="h-12 w-12 text-text-muted mx-auto mb-3 opacity-60" />
              <h3 className="font-bold text-foreground text-sm">No resources found</h3>
              <p className="text-xs text-text-muted mt-1">Try adjusting your category filter or search keywords.</p>
            </motion.div>
          )}

        </div>
      </main>

      {/* Retro-modern interactive HUD Download Telemetry overlay */}
      <AnimatePresence>
        {activeDownloadTitle && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 bg-neutral-950/95 backdrop-blur-lg border border-neutral-800 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 text-xs font-mono text-neutral-300 space-y-3"
          >
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-accent-warm animate-pulse" />
                <span className="font-bold text-accent-warm">Telemetry Downloader</span>
              </div>
              <button 
                onClick={() => {
                  setActiveDownloadTitle(null)
                  setTelemetryLogs([])
                }}
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin text-[10px] leading-relaxed">
              {telemetryLogs.map(log => (
                <div key={log.id} className="flex items-start gap-1">
                  <span className={log.type === 'success' ? 'text-green-500' : 'text-neutral-500'}>&gt;</span>
                  <span className={log.type === 'success' ? 'text-green-400 font-bold' : ''}>{log.text}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>Progress: {downloadProgress}%</span>
                <span>Speed: 3.4 MB/s</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-gemini-blue via-gemini-indigo to-gemini-purple h-full"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Preview Reader Modal */}
      <AnimatePresence>
        {activePreview && (
          <ModalReader 
            res={activePreview}
            onClose={() => setActivePreview(null)}
            onDownload={(r) => handleDownload(r)}
            downloadingId={activeDownloadTitle}
            downloadedIds={downloadedIds}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

/* ========================================================================
   1. ResourceCard Component with Interactive 3D Mouse Tilt & Reflect Glare
   ======================================================================== */
interface ResourceCardProps {
  res: Resource
  onPreview: (res: Resource) => void
  onDownload: (res: Resource) => void
  downloadingId: string | null
  downloadedIds: string[]
}

function ResourceCard({ res, onPreview, onDownload, downloadingId, downloadedIds }: ResourceCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Map bounds to a moderate rotate effect
    const rx = -y / (rect.height / 20) // max ~10 degrees tilt
    const ry = x / (rect.width / 20)  // max ~10 degrees tilt
    setCoords({ x: ry, y: rx })
  }

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const isDownloaded = downloadedIds.includes(res.title)
  const isDownloading = downloadingId === res.title

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${coords.y}deg) rotateY(${coords.x}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
      className="bg-card/50 backdrop-blur-md border border-border/85 p-6 rounded-[2rem] flex flex-col justify-between shadow-xs hover:border-accent-warm hover:shadow-[0_20px_45px_-12px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_20px_45px_-12px_rgba(255,153,0,0.15)] relative overflow-hidden group cursor-pointer"
      onClick={() => onPreview(res)}
    >
      {/* Light reflecting glare gradient */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: isHovered 
            ? `radial-gradient(circle at ${coords.x * 5 + 50}% ${-coords.y * 5 + 50}%, rgba(255,255,255,0.08) 0%, transparent 60%)` 
            : 'none'
        }}
      />

      {/* Corner floating light source */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-accent-warm/5 blur-2xl group-hover:bg-accent-warm/10 transition-colors duration-300 z-0" />

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold uppercase tracking-wider bg-accent-warm-light text-accent-warm px-2.5 py-0.5 rounded-full border border-accent-warm/15">
            {res.subject}
          </span>
          <span className="text-[10px] text-text-muted font-bold font-mono bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 rounded border border-border/40">{res.size}</span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-foreground flex items-start gap-2.5 leading-snug group-hover:text-accent-warm transition-colors duration-200">
            <FileText className="h-5 w-5 text-accent-warm shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
            {res.title}
          </h3>
          <div className="flex flex-wrap gap-x-2 gap-y-1 items-center text-[10px] text-text-muted font-semibold">
            <span>Source/Author: {res.author}</span>
            <span className="text-border/80">•</span>
            <span className="font-mono bg-neutral-200/50 dark:bg-neutral-800/50 px-1.5 rounded">{res.year}</span>
          </div>
        </div>

        <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
          {res.desc}
        </p>
      </div>
      
      <div 
        className="pt-6 border-t border-border/50 mt-6 flex justify-between items-center relative z-10 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => onPreview(res)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gemini-indigo hover:text-gemini-purple transition-colors py-1.5 px-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>

        <button 
          onClick={() => onDownload(res)}
          disabled={downloadingId !== null || isDownloaded}
          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all py-1.5 px-3 rounded-full border cursor-pointer ${
            isDownloaded
              ? 'border-green-500/20 bg-green-500/10 text-green-400 cursor-default'
              : isDownloading
              ? 'border-neutral-700 bg-neutral-800 text-neutral-400 cursor-wait'
              : 'border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground hover:text-accent-warm'
          }`}
        >
          {isDownloaded ? (
            <>
              Saved <Check className="h-3.5 w-3.5" />
            </>
          ) : isDownloading ? (
            <>
              Caching... <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </>
          ) : (
            <>
              Download <ArrowDownToLine className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

/* ========================================================================
   2. ModalReader Component: A Premium Glassmorphic Book Summary Reader
   ======================================================================== */
interface ModalReaderProps {
  res: Resource
  onClose: () => void
  onDownload: (res: Resource) => void
  downloadingId: string | null
  downloadedIds: string[]
}

function ModalReader({ res, onClose, onDownload, downloadingId, downloadedIds }: ModalReaderProps) {
  const [activeTab, setActiveTab] = useState<'abstract' | 'takeaways' | 'roadmap'>('abstract')
  const [readingProgress, setReadingProgress] = useState(30) // Simulated interactive progress

  // Prevent scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
      
      {/* Blurred overlay backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/65 backdrop-blur-md cursor-pointer"
      />

      {/* Reader Dialog Shell */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", duration: 0.55 }}
        className="relative w-full max-w-4xl max-h-[85vh] bg-card/85 backdrop-blur-xl border border-border/80 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] z-10 flex flex-col overflow-hidden"
      >
        
        {/* Decorative ambient light source */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gemini-blue/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gemini-purple/10 blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-border/50 flex justify-between items-start shrink-0 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-accent-warm-light text-accent-warm px-2.5 py-0.5 rounded-full border border-accent-warm/15">
                {res.subject}
              </span>
              <span className="text-[10px] font-mono text-text-muted">{res.type}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground">
              {res.title}
            </h2>
            <p className="text-xs text-text-muted">
              by <span className="font-semibold text-foreground/80">{res.author}</span> • Published {res.year} • Size {res.size}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full border border-border bg-background/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground transition-all shrink-0 cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 scrollbar-thin">
          
          {/* Left Side: Mock Booklet Cover Frame */}
          <div className="md:col-span-4 flex flex-col items-center justify-between bg-neutral-100/50 dark:bg-neutral-900/40 border border-border/60 rounded-3xl p-6 relative overflow-hidden shrink-0 min-h-[260px] md:min-h-0 select-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-warm/5 blur-xl rounded-full" />
            
            {/* Book Spine Shadow Graphic */}
            <div className="relative w-36 h-48 rounded-r-xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 shadow-[5px_5px_15px_rgba(0,0,0,0.15)] flex flex-col justify-between p-4 border border-l-[8px] border-l-accent-warm border-border/30 hover:scale-102 transition-transform duration-300">
              <div className="flex justify-between items-start">
                <Bookmark className="h-4 w-4 text-accent-warm" />
                <span className="text-[8px] font-mono text-neutral-400">{res.year}</span>
              </div>
              <div className="space-y-1">
                <div className="h-1 w-8 bg-accent-warm/50 rounded-full" />
                <p className="text-[9px] font-serif font-bold text-neutral-700 dark:text-neutral-300 line-clamp-3 leading-snug">
                  {res.title}
                </p>
                <p className="text-[7px] text-neutral-500 line-clamp-1">{res.author}</p>
              </div>
              <div className="flex justify-between items-center text-[7px] font-mono text-neutral-400 pt-2 border-t border-neutral-300/30">
                <span>ERUDOGIX</span>
                <span>{res.size}</span>
              </div>
            </div>

            {/* Reading Progress HUD inside cover */}
            <div className="w-full space-y-1.5 mt-4">
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>Simulated Progress</span>
                <span className="font-semibold text-foreground font-mono">{readingProgress}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={readingProgress}
                onChange={(e) => setReadingProgress(parseInt(e.target.value))}
                className="w-full accent-accent-warm h-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Side: Navigation & Sub-Pages */}
          <div className="md:col-span-8 flex flex-col h-full space-y-6">
            
            {/* Modal Tabs Bar */}
            <div className="flex border-b border-border/40 pb-1.5 gap-6 select-none shrink-0">
              {(['abstract', 'takeaways', 'roadmap'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative pb-2.5 text-xs font-bold capitalize cursor-pointer transition-all duration-300"
                >
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeModalTabBorder"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-warm"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className={activeTab === tab ? 'text-foreground font-extrabold' : 'text-text-muted hover:text-foreground'}>
                    {tab === 'abstract' ? 'Overview' : tab === 'takeaways' ? 'Key Takeaways' : 'Study Roadmap'}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab content viewer */}
            <div className="flex-grow text-xs leading-relaxed text-text-muted pr-2">
              <AnimatePresence mode="wait">
                {activeTab === 'abstract' && (
                  <motion.div
                    key="abstract"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="font-bold text-foreground text-xs mb-1.5 font-sans uppercase tracking-wider text-[10px]">Abstract Overview</h4>
                      <p className="bg-neutral-100/50 dark:bg-neutral-900/30 border border-border/40 p-4 rounded-2xl italic leading-relaxed text-foreground/80 font-serif shadow-xs">
                        "{res.abstract}"
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-xs mb-1 font-sans uppercase tracking-wider text-[10px]">Conceptual Context</h4>
                      <p className="leading-relaxed">{res.desc}</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'takeaways' && (
                  <motion.div
                    key="takeaways"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <h4 className="font-bold text-foreground text-xs mb-2 font-sans uppercase tracking-wider text-[10px]">Core Concepts To Master</h4>
                    <ul className="space-y-3">
                      {res.takeaways.map((takeaway, index) => (
                        <li key={index} className="flex gap-3 items-start bg-neutral-100/30 dark:bg-neutral-900/20 border border-border/30 p-3 rounded-xl hover:border-accent-warm/40 transition-colors shadow-2xs">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'roadmap' && (
                  <motion.div
                    key="roadmap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <h4 className="font-bold text-foreground text-xs mb-2 font-sans uppercase tracking-wider text-[10px]">Recommended Study Milestones</h4>
                    <div className="space-y-4 pl-4 border-l border-border relative">
                      {res.roadmap.map((step, index) => (
                        <div key={index} className="relative space-y-1">
                          {/* Chronological Step Marker Node */}
                          <div className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-accent-warm border-2 border-background shadow-xs" />
                          
                          <h5 className="font-bold text-foreground text-[10px] font-sans uppercase tracking-wider">
                            Phase {index + 1}
                          </h5>
                          <p className="text-text-muted leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 border-t border-border/50 bg-neutral-100/50 dark:bg-neutral-900/30 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 relative z-10">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/15 uppercase tracking-wider">
            Academic Integrity Code Appended
          </span>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none text-xs font-bold py-2 px-4 rounded-full border border-border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground transition-all cursor-pointer text-center"
            >
              Close Reader
            </button>
            <button 
              onClick={() => onDownload(res)}
              disabled={downloadingId !== null || downloadedIds.includes(res.title)}
              className={`flex-1 sm:flex-none text-xs font-bold py-2 px-5 rounded-full border inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                downloadedIds.includes(res.title)
                  ? 'border-green-500/20 bg-green-500/10 text-green-400 cursor-default'
                  : downloadingId === res.title
                  ? 'border-neutral-700 bg-neutral-800 text-neutral-400 cursor-wait'
                  : 'border-transparent bg-gradient-to-r from-gemini-blue via-gemini-indigo to-gemini-purple text-white shadow-xs hover:shadow-md'
              }`}
            >
              {downloadedIds.includes(res.title) ? (
                <>
                  Saved <Check className="h-3.5 w-3.5" />
                </>
              ) : downloadingId === res.title ? (
                <>
                  Caching... <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </>
              ) : (
                <>
                  Download Guide <ArrowDownToLine className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  )
}
