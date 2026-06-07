'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, ShieldCheck, HelpCircle, Key, UserCheck, AlertCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Tabs: 'student' (Client), 'specialist' (Specialist), 'admin' (Root Admin)
  const [activeTab, setActiveTab] = useState<'student' | 'specialist' | 'admin'>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [otpStep, setOtpStep] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [devOtp, setDevOtp] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: activeTab, ...(otpStep ? { otpCode } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials')
      }

      if (data.requiresOtp) {
        setOtpStep(true)
        if (data.devOtp) {
          setDevOtp(data.devOtp)
          setOtpCode(data.devOtp)
        }
        setLoading(false)
        return
      }

      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse bg-background text-foreground transition-colors duration-300">
      
      {/* Left Column: AWS style info marketing block */}
      <div className="lg:w-7/12 flex flex-col justify-between p-8 md:p-16 bg-gradient-to-br from-card to-background border-r border-border relative transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(255,153,0,0.03),transparent_70%)] pointer-events-none" />
        
        <div className="space-y-12 relative z-10">
          <Link href="/" className="inline-block font-mono text-3xl font-black text-foreground tracking-tighter">
            ERUDOGIX<span className="text-[#ff9900]">.</span>
          </Link>
          
          <div className="space-y-6 max-w-xl">
            <h1 className="font-mono text-3xl md:text-5xl font-black text-foreground leading-tight">
              One Console. <br />
              All Services.
            </h1>
            <p className="text-sm text-text-muted leading-relaxed">
              Log in to the Erudogix Intelligent Operations console. Manage academic syllabus review worksheets, fine-tune small model parameters, or manage client invoices from a centralized, secure interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-4 rounded-2xl border border-border bg-card">
              <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wider block mb-1">Security</span>
              <p className="text-[11px] text-text-muted">Enterprise-grade data encryption, SSL connections, and offline model execution modules.</p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card">
              <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wider block mb-1">Coaching</span>
              <p className="text-[11px] text-text-muted">Concept tutoring modules, custom grades tracking analytics, and document delivery archives.</p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card">
              <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wider block mb-1">Invoicing</span>
              <p className="text-[11px] text-text-muted">Centralized agency worksheets, currency conversion systems, and automated billing ledgers.</p>
            </div>
          </div>
        </div>

        <div className="pt-12 text-[10px] text-text-muted relative z-10 flex gap-6 font-mono">
          <span>&copy; {new Date().getFullYear()} Erudogix Console</span>
          <Link href="/legal" className="hover:underline">Legal & Privacy Statement</Link>
        </div>
      </div>

      {/* Right Column: AWS Console sign-in box */}
      <div className="lg:w-5/12 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-[400px] bg-card border border-border p-8 rounded-3xl shadow-xl space-y-6 transition-colors duration-300">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground font-mono">Sign In</h2>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Choose your authentication class below.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="flex border-b border-border bg-background rounded-xl p-0.5">
            {[
              { id: 'student', label: 'IAM Client' },
              { id: 'specialist', label: 'Specialist' },
              { id: 'admin', label: 'Root Admin' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any)
                  setError(null)
                }}
                className={`flex-1 text-center py-2 font-mono text-[10px] font-bold rounded transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-white dark:text-[#19222d]'
                    : 'text-text-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form className="space-y-4 pt-1" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] p-3 rounded flex items-start gap-1.5 shadow">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {otpStep ? (
              <div className="space-y-4">
                {devOtp && (
                  <div className="bg-accent/10 border border-accent/30 text-accent text-[10px] p-3 rounded flex flex-col gap-1 shadow-inner font-mono">
                    <span className="font-bold flex items-center gap-1">🛠️ Developer Sandbox Helper</span>
                    <p className="text-[9px] text-accent/80 leading-normal">
                      No SMTP mailer configured. Generated code: <code className="bg-accent/25 px-1 py-0.5 rounded font-black font-mono text-xs text-white">{devOtp}</code>. Auto-filled below.
                    </p>
                  </div>
                )}
                <div>
                  <label htmlFor="otpCode" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 font-mono text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    id="otpCode"
                    name="otpCode"
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center px-4 py-3 rounded border border-border bg-background text-2xl font-mono tracking-[0.5em] pl-[0.5em] focus:outline-none focus:border-accent text-foreground transition-all shadow-inner"
                    placeholder="000000"
                    autoFocus
                  />
                  <p className="text-[10px] text-text-muted mt-2 text-center leading-normal">
                    Enter the confirmation code sent to your email.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full flex justify-center items-center font-bold px-6 py-3 rounded bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-all shadow-md text-xs font-mono cursor-pointer disabled:opacity-55"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                  {!loading && <ShieldCheck className="ml-1.5 h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="w-full text-center text-xs text-text-muted hover:text-foreground font-mono mt-2"
                >
                  Back to Password
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 font-mono">
                    {activeTab === 'admin' ? 'Root Account Email' : activeTab === 'specialist' ? 'Partner Email' : 'Client Email'}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 font-mono">
                    Console Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center font-bold px-6 py-3 rounded bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-all shadow-md text-xs font-mono cursor-pointer disabled:opacity-55"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                  {!loading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
                </button>
              </>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-card px-2 text-text-muted font-mono uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded text-xs font-bold font-mono hover:bg-background transition-colors text-foreground"
                onClick={() => alert("Social auth provider setup required")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded text-xs font-bold font-mono hover:bg-background transition-colors text-foreground"
                onClick={() => alert("Social auth provider setup required")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </button>
            </div>
          </form>

          {activeTab === 'student' && (
            <div className="pt-2 text-center text-xs">
              <span className="text-text-muted">New Client? </span>
              <Link href="/auth/signup" className="text-accent hover:underline font-semibold font-mono">
                Create account
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-border flex gap-2 items-start">
            <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p className="text-[9px] text-text-muted leading-relaxed">
              Erudogix Console requires TLS communication. All credential hashes are computed via SHA-256 with unique salts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b0f19] text-[#eaeded]">
        <span className="text-xs font-bold font-mono text-text-muted animate-pulse">Loading console settings...</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
