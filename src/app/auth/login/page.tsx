'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, ShieldCheck, HelpCircle, Key, UserCheck, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Tabs: 'student' (Client), 'specialist' (Specialist), 'admin' (Root Admin)
  const [activeTab, setActiveTab] = useState<'student' | 'specialist' | 'admin'>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Forgot password flow states
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordCode, setForgotPasswordCode] = useState('')
  const [forgotPasswordNewPassword, setForgotPasswordNewPassword] = useState('')
  const [resetStage, setResetStage] = useState<'email' | 'otp'>('email')
  const [forgotPasswordResendCooldown, setForgotPasswordResendCooldown] = useState(0)
  const [forgotPasswordDevOtp, setForgotPasswordDevOtp] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
    }
    const forgotParam = searchParams.get('forgot')
    if (forgotParam === 'true') {
      setIsForgotPassword(true)
      setResetStage('email')
      const emailParam = searchParams.get('email')
      if (emailParam) {
        setForgotPasswordEmail(emailParam)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (forgotPasswordResendCooldown <= 0) return
    const timer = setInterval(() => {
      setForgotPasswordResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [forgotPasswordResendCooldown])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: activeTab }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials')
      }

      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to request reset')
      }

      if (data.devOtp) {
        setForgotPasswordDevOtp(data.devOtp)
        setForgotPasswordCode(data.devOtp)
      } else {
        setForgotPasswordDevOtp(null)
      }

      setResetStage('otp')
      setForgotPasswordResendCooldown(30) // 30s cooldown on first send
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset')
    } finally {
      setLoading(false)
    }
  }

  const handleResendResetCode = async () => {
    if (forgotPasswordResendCooldown > 0) return
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code')
      }

      if (data.devOtp) {
        setForgotPasswordDevOtp(data.devOtp)
        setForgotPasswordCode(data.devOtp)
      } else {
        setForgotPasswordDevOtp(null)
      }

      setForgotPasswordResendCooldown(60) // 60s cooldown for subsequent resends
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotPasswordEmail,
          otpCode: forgotPasswordCode,
          newPassword: forgotPasswordNewPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed')
      }

      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Password reset failed')
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
          {isForgotPassword ? (
            <form className="space-y-4 pt-1" onSubmit={resetStage === 'email' ? handleRequestReset : handleExecuteReset}>
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] p-3 rounded flex items-start gap-1.5 shadow">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {resetStage === 'email' ? (
                <>
                  <div>
                    <label htmlFor="resetEmail" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 font-mono">
                      Account Email
                    </label>
                    <input
                      id="resetEmail"
                      name="resetEmail"
                      type="email"
                      required
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center font-bold px-6 py-3 rounded bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-all shadow-md text-xs font-mono cursor-pointer disabled:opacity-55"
                  >
                    {loading ? 'Sending code...' : 'Send Reset Code'}
                    {!loading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
                  </button>
                </>
              ) : (
                <>
                  {forgotPasswordDevOtp && (
                    <div className="bg-accent/10 border border-accent/30 text-accent text-[10px] p-3 rounded flex flex-col gap-1 shadow-inner font-mono">
                      <span className="font-bold flex items-center gap-1">🛠️ Developer Sandbox Helper</span>
                      <p className="text-[9px] text-accent/80 leading-normal">
                        No SMTP mailer configured. Generated code: <code className="bg-accent/25 px-1 py-0.5 rounded font-black font-mono text-xs text-white">{forgotPasswordDevOtp}</code>. Auto-filled below.
                      </p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="resetCode" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 font-mono text-center">
                      6-Digit Verification Code
                    </label>
                    <input
                      id="resetCode"
                      name="resetCode"
                      type="text"
                      maxLength={6}
                      required
                      value={forgotPasswordCode}
                      onChange={(e) => setForgotPasswordCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center px-4 py-3 rounded border border-border bg-background text-2xl font-mono tracking-[0.5em] pl-[0.5em] focus:outline-none focus:border-accent text-foreground transition-all shadow-inner"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 font-mono">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      value={forgotPasswordNewPassword}
                      onChange={(e) => setForgotPasswordNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent transition-colors"
                      placeholder="Minimum 6 characters"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || forgotPasswordCode.length !== 6}
                    className="w-full flex justify-center items-center font-bold px-6 py-3 rounded bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-all shadow-md text-xs font-mono cursor-pointer disabled:opacity-55"
                  >
                    {loading ? 'Resetting...' : 'Reset & Auto Login'}
                    {!loading && <ShieldCheck className="ml-1.5 h-3.5 w-3.5" />}
                  </button>

                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setResetStage('email')}
                      className="text-text-muted hover:text-foreground inline-flex items-center gap-0.5 font-semibold transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3" /> Back
                    </button>

                    <button
                      type="button"
                      onClick={handleResendResetCode}
                      disabled={forgotPasswordResendCooldown > 0 || loading}
                      className="text-accent hover:text-accent-hover disabled:text-text-muted font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                      {forgotPasswordResendCooldown > 0 ? `Resend (${forgotPasswordResendCooldown}s)` : 'Resend Code'}
                    </button>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false)
                  setError(null)
                }}
                className="w-full text-center text-xs text-text-muted hover:text-foreground font-mono mt-2"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form className="space-y-4 pt-1" onSubmit={handleLogin}>
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] p-3 rounded flex items-start gap-1.5 shadow">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

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
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono">
                    Console Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true)
                      setForgotPasswordEmail(email)
                      setResetStage('email')
                      setError(null)
                    }}
                    className="text-[10px] text-accent hover:underline font-mono"
                  >
                    Forgot Password?
                  </button>
                </div>
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
            </form>
          )}

          {activeTab === 'student' && !isForgotPassword && (
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
