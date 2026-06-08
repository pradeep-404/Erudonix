'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ShieldCheck, Mail, KeyRound, Edit2, ArrowLeft, RefreshCw, AlertCircle, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [requirementType, setRequirementType] = useState<'academic' | 'slm' | 'app_studio'>('academic')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // OTP flow states
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [otpCode, setOtpCode] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [devOtp, setDevOtp] = useState<string | null>(null)

  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [warningProvider, setWarningProvider] = useState<'google' | 'github'>('google')

  const handleSocialLogin = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/oauth?provider=${provider}`
  }

  // Handle countdown for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Step 1: Send OTP to Gmail
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Early client-side email verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address format (e.g., name@domain.com).')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }
      
      if (data.devOtp) {
        setDevOtp(data.devOtp)
        setOtpCode(data.devOtp) // Auto-fill for developer convenience
      } else {
        setDevOtp(null)
      }
      
      setStep('otp')
      setResendCooldown(30)
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend verification code')
      }
      
      if (data.devOtp) {
        setDevOtp(data.devOtp)
        setOtpCode(data.devOtp) // Auto-fill
      } else {
        setDevOtp(null)
      }
      
      setResendCooldown(60)
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP and perform actual signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          fullName, 
          role: 'student', 
          requirementType,
          otpCode
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse bg-background text-foreground transition-colors duration-300">
      
      {/* Right Column: Product guidelines (AWS style info block) */}
      <div className="lg:w-7/12 flex flex-col justify-between p-8 md:p-16 bg-gradient-to-br from-card to-background border-r border-border relative transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(255,153,0,0.03),transparent_70%)] pointer-events-none" />
        
        <div className="space-y-12 relative z-10">
          <Link href="/" className="inline-block font-mono text-3xl font-black text-foreground tracking-tighter">
            ERUDOGIX<span className="text-accent">.</span>
          </Link>
          
          <div className="space-y-6 max-w-xl">
            <h1 className="font-mono text-3xl md:text-5xl font-black text-foreground leading-tight">
              Create your <br />
              Erudogix Console Account.
            </h1>
            <p className="text-sm text-text-muted leading-relaxed">
              Verify your Gmail to launch a private console profile. Set up custom learning objectives or prepare models with parameter quantization under corporate safety alignment.
            </p>
          </div>

          <div className="space-y-4 max-w-lg text-xs text-text-muted font-mono">
            <div className="flex gap-3 items-start p-4 bg-card rounded border border-border">
              <Sparkles className="h-4.5 w-4.5 text-accent shrink-0" />
              <div>
                <strong className="text-foreground block mb-1">Centralized Worksheets</strong>
                <span>Direct coordination with tutors, developers, and model designers in real-time.</span>
              </div>
            </div>
            <div className="flex gap-3 items-start p-4 bg-card rounded border border-border">
              <ShieldCheck className="h-4.5 w-4.5 text-accent shrink-0" />
              <div>
                <strong className="text-foreground block mb-1">Compliance & Privacy SLAs</strong>
                <span>Offline, local hosting options guarantee 100% data residency standards.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 text-[10px] text-text-muted relative z-10 flex gap-6 font-mono">
          <span>&copy; {new Date().getFullYear()} Erudogix Console</span>
          <Link href="/legal" className="hover:underline">Legal & Privacy Statement</Link>
        </div>
      </div>

      {/* Right Column: Console Sign Up / Verification Container */}
      <div className="lg:w-5/12 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-[400px] bg-card border border-border p-8 rounded-3xl shadow-xl space-y-6 transition-colors duration-300">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground font-mono">
              {step === 'details' ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="text-[11px] text-text-muted leading-relaxed">
              {step === 'details' ? (
                <>
                  Already registered?{' '}
                  <Link href="/auth/login" className="text-accent hover:underline font-semibold font-mono">
                    Sign in to console
                  </Link>
                </>
              ) : (
                <span className="inline-flex flex-wrap items-center gap-1.5">
                  Code sent to <strong className="text-foreground font-mono">{email}</strong>
                  <button 
                    onClick={() => setStep('details')} 
                    className="text-accent hover:underline inline-flex items-center gap-0.5 font-bold font-mono text-[10px]"
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                </span>
              )}
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4 pt-2">
              <div className="h-12 w-12 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-md font-bold text-foreground font-mono">Verification Successful!</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Your console account credentials have been verified.
              </p>
              <div className="pt-2">
                <Link
                  href="/auth/onboarding"
                  className="w-full inline-flex justify-center items-center font-bold px-6 py-2.5 rounded bg-accent text-white dark:text-[#19222d] hover:opacity-95 transition-all text-xs font-mono shadow"
                >
                  Continue to Onboarding
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : step === 'details' ? (
            <form className="space-y-4" onSubmit={handleSendOtp}>
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] p-2.5 rounded flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 font-mono">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="requirementType" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 font-mono">
                  Requirement Profile
                </label>
                <select
                  id="requirementType"
                  value={requirementType}
                  onChange={(e) => setRequirementType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent transition-colors font-semibold font-mono"
                >
                  <option value="academic">Academic Coaching Support</option>
                  <option value="slm">SLM Model Tuning client</option>
                  <option value="app_studio">App Developer client</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 font-mono">
                  Email Address
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
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent transition-colors"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center font-bold px-6 py-3 rounded bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-all shadow-md text-xs font-mono cursor-pointer disabled:opacity-55"
              >
                {loading ? 'Sending verification code...' : 'Sign Up'}
                {!loading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
              </button>

            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignup}>
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] p-2.5 rounded flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {devOtp && (
                <div className="bg-accent/10 border border-accent/30 text-accent text-[10px] p-3 rounded flex flex-col gap-1 shadow-inner font-mono">
                  <span className="font-bold flex items-center gap-1">🛠️ Developer Sandbox Helper</span>
                  <p className="text-[9px] text-accent/80 leading-normal">
                    No SMTP mailer configured. Generated code: <code className="bg-accent/25 px-1 py-0.5 rounded font-black font-mono text-xs text-white">{devOtp}</code>. Auto-filled below.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="otpCode" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted text-center mb-1.5 font-mono">
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
                <p className="text-[10px] text-text-muted text-center leading-normal">
                  Enter the confirmation code sent to your Gmail.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full flex justify-center items-center font-bold px-6 py-3 rounded bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-all shadow-md text-xs font-mono cursor-pointer disabled:opacity-55"
                >
                  {loading ? 'Verifying...' : 'Verify & Create Signup'}
                  {!loading && <ShieldCheck className="ml-1.5 h-3.5 w-3.5" />}
                </button>

                <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-text-muted hover:text-foreground inline-flex items-center gap-0.5 font-semibold transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className="text-accent hover:text-accent-hover disabled:text-text-muted font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
