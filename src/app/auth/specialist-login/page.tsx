'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Code } from 'lucide-react'

function SpecialistLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
        body: JSON.stringify({ email, password, role: 'specialist' }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials')
      }
      router.refresh()
      router.push('/dashboard/specialist')
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  const fillCredentials = () => {
    setEmail('tutor@erudogix.com')
    setPassword('tutorpass123')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-block font-serif text-3xl font-bold text-foreground tracking-tight">
          ERUDOGIX<span className="text-accent-warm">.</span>
        </Link>
        <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs font-semibold">
          <Code className="h-3.5 w-3.5" /> Specialist Portal
        </div>
        <h2 className="text-2xl font-bold font-serif text-foreground">Tutor & Developer Sign in</h2>
        <p className="text-sm text-text-muted">
          Access your expert dashboard to review queue requests.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Click-to-Fill Demo Accounts Selector */}
        <div className="bg-card border border-border p-4 rounded-3xl mb-6 shadow-sm space-y-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block text-center">
            Specialist Quick Fill Access
          </span>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={fillCredentials}
              className="w-full py-2 px-3 text-[10px] font-bold rounded-xl border border-border bg-background hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors text-foreground"
            >
              Fill Specialist Credentials
            </button>
          </div>
        </div>

        <div className="bg-card py-8 px-6 border border-border shadow-sm rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Specialist Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="tutor@erudogix.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center font-bold px-6 py-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 shadow-md shadow-emerald-600/10 disabled:opacity-55"
              >
                {loading ? 'Signing in...' : 'Specialist Sign in'}
                {!loading && <ArrowRight className="ml-1.5 h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SpecialistLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-center items-center bg-background">
        <span className="text-sm font-semibold text-text-muted">Loading specialist portal...</span>
      </div>
    }>
      <SpecialistLoginForm />
    </Suspense>
  )
}
