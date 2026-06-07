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
      setResendCooldown(60)
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
                  onClick={() => alert("Social auth provider setup required in AWS Cognito / NextAuth")}
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
                  onClick={() => alert("Social auth provider setup required in AWS Cognito / NextAuth")}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </button>
              </div>
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
