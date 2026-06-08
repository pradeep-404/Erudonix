'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Terminal, 
  FileText, 
  Database, 
  RefreshCw, 
  Play, 
  Trash2, 
  ShieldCheck, 
  TrendingUp, 
  Server,
  Zap
} from 'lucide-react'

interface LogMessage {
  id: string
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'model' | 'billing'
  message: string
}

export default function LiveOperationsMonitor() {
  const [activeSim, setActiveSim] = useState<'audit' | 'quantize' | 'payflow'>('audit')
  const [simRunning, setSimRunning] = useState(true)
  const [auditProgress, setAuditProgress] = useState(0)
  const [matrixWeights, setMatrixWeights] = useState<number[][]>([])
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([])
  const [logs, setLogs] = useState<LogMessage[]>([])
  const [dbConnections, setDbConnections] = useState(4)
  const [apiLatency, setApiLatency] = useState(28)
  const [autoscroll, setAutoscroll] = useState(true)
  
  const logContainerRef = useRef<HTMLDivElement>(null)

  // Initialize data
  useEffect(() => {
    // Generate static matrix weights
    const matrix: number[][] = []
    for (let i = 0; i < 6; i++) {
      const row: number[] = []
      for (let j = 0; j < 6; j++) {
        row.push(Number((Math.random() * 2 - 1).toFixed(3)))
      }
      matrix.push(row)
    }
    setMatrixWeights(matrix)

    // Generate static initial ledger
    setLedgerEntries([
      { id: 'TX-1049', user: 'Eleanor V. (LSE)', type: 'Academic Review', amount: '£30.00', status: 'Settled', flag: 'GBP_POOL' },
      { id: 'TX-1050', user: 'Aarav S. (IITD)', type: '1:1 Coaching', amount: '$40.00', status: 'Settled', flag: 'USD_POOL' },
      { id: 'TX-1051', user: 'AeroLabs CTO', type: 'SLM 7B Tune', amount: '$150.00', status: 'Settled', flag: 'USD_POOL' },
    ])

    // Generate initial logs
    const now = new Date()
    const getFormattedTime = (offsetSec: number) => {
      const d = new Date(now.getTime() - offsetSec * 1000)
      return d.toTimeString().split(' ')[0]
    }

    setLogs([
      { id: '1', timestamp: getFormattedTime(12), type: 'info', message: 'Database session initialized. Pool capacity status: OK.' },
      { id: '2', timestamp: getFormattedTime(10), type: 'success', message: 'AWS Amplify deployment pipeline connection matched: active.' },
      { id: '3', timestamp: getFormattedTime(8), type: 'model', message: 'SLM 1.5B param tokenizer mapped successfully.' },
      { id: '4', timestamp: getFormattedTime(6), type: 'billing', message: 'PayFlow PostgreSQL transaction ledger sync index verified.' },
      { id: '5', timestamp: getFormattedTime(4), type: 'success', message: 'Global academic integrity compliance matrix sweep complete.' },
      { id: '6', timestamp: getFormattedTime(2), type: 'info', message: 'Client WebSockets established on console session.' },
    ])
  }, [])

  // Auto-scroll logs inside the container only (prevents viewport/page-jumps)
  useEffect(() => {
    if (autoscroll && logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [logs, autoscroll])

  // Live simulation looping
  useEffect(() => {
    if (!simRunning) return

    const timer = setInterval(() => {
      // 1. Randomize weights if active
      if (activeSim === 'quantize') {
        setMatrixWeights(prev => 
          prev.map(row => row.map(val => {
            const delta = (Math.random() * 0.2 - 0.1)
            return Number(Math.min(Math.max(val + delta, -1), 1).toFixed(3))
          }))
        )
      }

      // 2. Increment audit progress
      if (activeSim === 'audit') {
        setAuditProgress(prev => {
          if (prev >= 100) {
            addLog('success', 'Academic draft integrity audit completed. Similarity index: 2.4% (safe guidance).')
            return 0
          }
          return prev + 8
        })
      }

      // 3. Occasionally add new logs simulating live usage
      const roll = Math.random()
      if (roll > 0.6) {
        generateLiveEvent()
      }

      // Randomize telemetry slightly
      setApiLatency(prev => Math.max(12, Math.min(65, prev + Math.floor(Math.random() * 11) - 5)))
      setDbConnections(prev => Math.max(2, Math.min(10, prev + (Math.random() > 0.5 ? 1 : -1))))

    }, 1200)

    return () => clearInterval(timer)
  }, [simRunning, activeSim, auditProgress])

  const addLog = (type: LogMessage['type'], message: string) => {
    const timeStr = new Date().toTimeString().split(' ')[0]
    setLogs(prev => [
      ...prev,
      { id: Math.random().toString(), timestamp: timeStr, type, message }
    ].slice(-25)) // limit logs buffer
  }

  const generateLiveEvent = () => {
    const events: { type: LogMessage['type']; msg: string }[] = [
      { type: 'info', msg: 'System check: API Route /api/requests returned 200 OK (22ms latency).' },
      { type: 'success', msg: 'Student portal profile update verified for Eleanor V. (LSE).' },
      { type: 'model', msg: 'Neural cache hit: Quantized weights INT4 conversion optimized on LocalNode-2.' },
      { type: 'billing', msg: 'PayFlow synchronizer processed: invoice status verified for Aarav S.' },
      { type: 'warning', msg: 'Sandbox environment active. Storage buffer utilization: 34%.' },
      { type: 'success', msg: '1:1 Coaching session room allocated: matched specialist online.' },
    ]
    const chosen = events[Math.floor(Math.random() * events.length)]
    addLog(chosen.type, chosen.msg)
  }

  const handleManualAction = () => {
    if (activeSim === 'audit') {
      setAuditProgress(0)
      addLog('info', 'Manual integrity scan override triggered. Sweeping reference nodes...')
    } else if (activeSim === 'quantize') {
      addLog('model', 'Compiling weight quantization matrices. INT4 casting layer-by-layer...')
      // randomize all weights instantly
      setMatrixWeights(prev => prev.map(row => row.map(() => Number((Math.random() * 2 - 1).toFixed(3)))))
    } else {
      addLog('billing', 'Refreshing PostgreSQL ledger balance pools. Re-checking GBP/EUR/USD values...')
      // append a new mock transaction
      const newTx = {
        id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
        user: ['James W. (ICL)', 'Lachlan G. (USYD)', 'Dr. Marcus V.', 'Priya T.'][Math.floor(Math.random() * 4)],
        type: ['Concept Prep', 'Tax Invoicing', 'SLM DPO Sync', 'RAG Setup'][Math.floor(Math.random() * 4)],
        amount: `$${(Math.random() * 120 + 30).toFixed(2)}`,
        status: 'Settled',
        flag: 'USD_POOL'
      }
      setLedgerEntries(prev => [newTx, ...prev].slice(0, 4))
    }
  }

  const clearConsole = () => {
    setLogs([])
  }

  return (
    <div className="relative max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden border border-border/80 bg-card/30 backdrop-blur-xl p-8 shadow-2xl transition-all duration-300">
      {/* Background aurora glows inside the container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-15">
        <div className="absolute -top-[10%] -left-[10%] w-[35rem] h-[35rem] rounded-full bg-gemini-blue/30 blur-[90px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-gemini-purple/30 blur-[90px]" />
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* Header telemetry deck */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border/60">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-warm-light/60 border border-accent-warm/15 text-accent-warm text-[10px] uppercase font-bold tracking-wider font-sans mb-1.5 animate-pulse">
              <Activity className="h-3.5 w-3.5" /> Live Sandbox Monitor
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Console Telemetry Hub</h3>
            <p className="text-xs text-text-muted mt-1 leading-normal max-w-lg">
              Observe real-time database transactions, private language model quantization telemetry, and academic compliance scanner sweeps.
            </p>
          </div>

          {/* Quick telemetry statistics */}
          <div className="flex flex-wrap gap-4 text-xs font-sans">
            <div className="flex items-center gap-2 bg-background border border-border p-2.5 px-3 rounded-2xl">
              <Server className="h-4 w-4 text-gemini-blue shrink-0" />
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted block leading-none">DB POOL</span>
                <span className="font-bold text-foreground block mt-1">{dbConnections}/10 active</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-background border border-border p-2.5 px-3 rounded-2xl">
              <Zap className="h-4 w-4 text-gemini-purple shrink-0" />
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted block leading-none">LATENCY</span>
                <span className="font-bold text-foreground block mt-1">{apiLatency} ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Panel: Simulator Screen & Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Control Deck Tab Switcher */}
            <div className="flex bg-background border border-border rounded-2xl p-1 gap-1">
              {[
                { id: 'audit', label: 'Draft Audit', icon: FileText },
                { id: 'quantize', label: 'SLM Quantizer', icon: Cpu },
                { id: 'payflow', label: 'Ledger Sync', icon: Database },
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveSim(tab.id as any)
                      addLog('info', `Switched active monitor panel to: ${tab.label}.`)
                    }}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeSim === tab.id
                        ? 'bg-gradient-to-r from-gemini-blue to-gemini-purple text-white shadow-md'
                        : 'text-text-muted hover:text-foreground hover:bg-card/40'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Visualizer Display Screen */}
            <div className="relative bg-[#101216] border border-[#21262d] rounded-3xl p-6 min-h-[300px] flex flex-col justify-between overflow-hidden shadow-inner text-white font-mono text-xs">
              
              {/* Subtle CRT screen scan lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-20" />

              <div className="flex justify-between items-center pb-3 border-b border-[#21262d] text-[10px] text-text-muted">
                <span>SIMULATOR_NODE://HOST_VIRTUAL</span>
                <span className="flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${simRunning ? 'bg-green-500 animate-ping' : 'bg-rose-500'}`} />
                  {simRunning ? 'ONLINE' : 'HALTED'}
                </span>
              </div>

              {/* Dynamic visualizers per active tab */}
              <div className="flex-grow py-6 flex flex-col justify-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                  
                  {activeSim === 'audit' && (
                    <motion.div
                      key="audit-sim"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-4 w-full"
                    >
                      {/* Document Scanning effect */}
                      <div className="relative bg-black/40 border border-white/5 p-4 rounded-xl space-y-2.5 overflow-hidden">
                        
                        {/* Scanning scanner beam */}
                        <motion.div 
                          className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_12px_#4ade80]"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                        />

                        <div className="text-[10px] text-neutral-400 select-none">
                          DOCUMENT_INTAKE_DRAFT_TEXT.TXT
                        </div>
                        <div className="space-y-1.5 text-[10px] text-neutral-300">
                          <p className={`transition-opacity duration-300 ${auditProgress > 20 ? 'text-green-400' : ''}`}>
                            [0.0s] INTRODUCTION: Academic integrity guide matching framework outlines 1:1 conceptual support...
                          </p>
                          <p className={`transition-opacity duration-300 ${auditProgress > 50 ? 'text-green-400' : ''}`}>
                            [1.2s] METHODOLOGY: Secure quantizations mapped on local clusters ensure absolute data containment...
                          </p>
                          <p className={`transition-opacity duration-300 ${auditProgress > 80 ? 'text-green-400' : ''}`}>
                            [2.5s] CONCLUSION: Safe deployment protocols synchronized using validated PostgreSQL API routes...
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-text-muted">
                          <span>COMPLIANCE SCANNING PROGRESS</span>
                          <span>{auditProgress}%</span>
                        </div>
                        <div className="w-full bg-[#21262d] h-2.5 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-green-500 h-full"
                            animate={{ width: `${auditProgress}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSim === 'quantize' && (
                    <motion.div
                      key="quantize-sim"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-6 gap-2 w-full max-w-sm mx-auto select-none"
                    >
                      {/* Weights Matrix Grid */}
                      {matrixWeights.map((row, rIdx) => 
                        row.map((val, cIdx) => (
                          <div 
                            key={`${rIdx}-${cIdx}`}
                            className={`p-1 py-2 text-[9px] rounded text-center transition-all duration-300 border ${
                              val > 0.4 
                                ? 'bg-gemini-blue/10 border-gemini-blue/30 text-gemini-blue' 
                                : val < -0.4 
                                ? 'bg-gemini-purple/10 border-gemini-purple/30 text-gemini-purple'
                                : 'bg-[#161b22] border-neutral-800 text-neutral-400'
                            }`}
                          >
                            {val}
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {activeSim === 'payflow' && (
                    <motion.div
                      key="payflow-sim"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-4 w-full"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[10px] text-neutral-400">
                          <thead>
                            <tr className="border-b border-[#21262d] text-[9px] text-text-muted">
                              <th className="pb-2">TXID</th>
                              <th className="pb-2">CLIENT</th>
                              <th className="pb-2">SERVICE TYPE</th>
                              <th className="pb-2">AMOUNT</th>
                              <th className="pb-2 text-right">STATUS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#21262d]/55">
                            {ledgerEntries.map((tx, idx) => (
                              <tr key={tx.id + idx} className="hover:bg-[#161b22]/40 transition-colors">
                                <td className="py-2.5 font-bold text-white">{tx.id}</td>
                                <td className="py-2.5">{tx.user}</td>
                                <td className="py-2.5">
                                  <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200">
                                    {tx.type}
                                  </span>
                                </td>
                                <td className="py-2.5 font-bold text-green-400">{tx.amount}</td>
                                <td className="py-2.5 text-right">
                                  <span className="px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10 text-green-400">
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Instructions footer of simulator */}
              <div className="pt-3 border-t border-[#21262d] text-[9px] text-text-muted flex justify-between items-center">
                <span>ACTIVE_PROMPT: {activeSim === 'audit' ? 'Sweeping plagiarism/citation indices.' : activeSim === 'quantize' ? 'Casting weights to 4-bit INT4 representation.' : 'Consolidating database ledger transaction nodes.'}</span>
                <span className="font-bold text-accent-warm hover:underline cursor-pointer flex items-center gap-1 select-none" onClick={handleManualAction}>
                  <RefreshCw className="h-3 w-3 animate-spin-slow" /> TRIGGER MANUAL
                </span>
              </div>
            </div>

            {/* Run state controls */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSimRunning(!simRunning)
                  addLog('info', `${simRunning ? 'Paused' : 'Resumed'} sandbox loop activity.`)
                }}
                className={`flex-1 py-3 text-xs font-bold rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  simRunning 
                    ? 'border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500' 
                    : 'border-green-500/20 bg-green-500/10 hover:bg-green-500/20 text-green-400'
                }`}
              >
                <Play className={`h-4 w-4 ${simRunning ? 'rotate-90 fill-current' : ''}`} />
                {simRunning ? 'Pause Engine' : 'Resume Engine'}
              </button>

              <button
                onClick={handleManualAction}
                className="px-6 py-3 text-xs font-bold rounded-2xl bg-foreground text-background hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Run Action Sweep
              </button>
            </div>
          </div>

          {/* Right Panel: Streaming Live Console Logs */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-border/80 bg-[#0c0d0f] rounded-3xl p-6 min-h-[350px] shadow-lg relative">
            <div className="flex justify-between items-center pb-3 border-b border-border/20 text-[10px] text-text-muted font-mono">
              <div className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-gemini-purple" />
                <span>STREAMING_LOGS_STREAM</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoscroll(!autoscroll)}
                  className={`text-[9px] p-1 px-2 rounded-lg border transition-all flex items-center gap-1 select-none cursor-pointer ${
                    autoscroll 
                      ? 'border-green-500/20 bg-green-500/10 text-green-400' 
                      : 'border-border/10 bg-neutral-800/40 text-neutral-400 hover:text-foreground'
                  }`}
                  title="Toggle autoscroll"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${autoscroll ? 'bg-green-500 animate-pulse' : 'bg-neutral-500'}`} />
                  Scroll: {autoscroll ? 'Auto' : 'Hold'}
                </button>
                <button 
                  onClick={clearConsole}
                  className="text-[9px] hover:text-foreground hover:bg-neutral-800 p-1 px-2 rounded-lg border border-border/10 flex items-center gap-1 transition-all cursor-pointer"
                  title="Clear console logs"
                >
                  <Trash2 className="h-3 w-3 text-rose-500" /> Clear
                </button>
              </div>
            </div>

            {/* Scrolling Logs Body */}
            <div 
              ref={logContainerRef}
              className="flex-grow overflow-y-auto max-h-[320px] py-4 space-y-2.5 font-mono text-[9px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-800"
            >
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="leading-relaxed flex items-start gap-1.5"
                  >
                    <span className="text-text-muted shrink-0">[{log.timestamp}]</span>
                    <span className={`font-bold uppercase shrink-0 ${
                      log.type === 'success' ? 'text-green-500' :
                      log.type === 'warning' ? 'text-amber-500' :
                      log.type === 'model' ? 'text-gemini-blue' :
                      log.type === 'billing' ? 'text-gemini-purple' :
                      'text-neutral-400'
                    }`}>
                      {log.type === 'success' ? '✔ OK' :
                       log.type === 'warning' ? '⚠ WARN' :
                       log.type === 'model' ? '⚛ SLM' :
                       log.type === 'billing' ? '⚙ SYNC' :
                       'ℹ INFO'}
                    </span>
                    <span className="text-neutral-300 break-words">{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom active status ticker */}
            <div className="pt-3 border-t border-border/20 text-[9px] text-text-muted font-mono flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> WebSockets Active
              </span>
              <span>Buffer: {logs.length}/25 msgs</span>
            </div>
          </div>

        </div>

        {/* Bottom Security / Trust indicator inside glassy container */}
        <div className="p-4 bg-background/50 border border-border/60 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-text-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-green-500" />
            <span>Telemetry verified using strictly sandbox environments. <strong>0% external leaks.</strong></span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <TrendingUp className="h-4 w-4 text-gemini-blue" />
            <span>Integrity Score: 100% compliant</span>
          </div>
        </div>

      </div>
    </div>
  )
}
