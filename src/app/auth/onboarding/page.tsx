'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [university, setUniversity] = useState('')
  const [customUniversity, setCustomUniversity] = useState('')
  const [isOtherUniversity, setIsOtherUniversity] = useState(false)
  const [course, setCourse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (data.user) {
          setUserId(data.user.id)
          if (data.user.role !== 'student') {
            router.push(`/dashboard/${data.user.role}`)
            return
          }
          if (data.user.full_name && data.user.full_name !== 'New Member') {
            setFullName(data.user.full_name)
          }
          if (data.user.university) {
            const predefined = [
              "University of Oxford (UK)",
              "University of Cambridge (UK)",
              "University College London (UK)",
              "University of Sydney (Australia)",
              "University of Melbourne (Australia)",
              "Harvard University (US)",
              "Stanford University (US)",
              "Trinity College Dublin (Ireland)",
              "University College Dublin (Ireland)"
            ]
            if (predefined.includes(data.user.university)) {
              setUniversity(data.user.university)
              setIsOtherUniversity(false)
            } else {
              setUniversity("Other / Independent Organisation")
              setCustomUniversity(data.user.university)
              setIsOtherUniversity(true)
            }
          }
          if (data.user.course) {
            setCourse(data.user.course)
          }
        } else {
          router.push('/auth/login')
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [router])

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setUniversity(val)
    if (val === 'Other / Independent Organisation') {
      setIsOtherUniversity(true)
    } else {
      setIsOtherUniversity(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const finalUniversity = isOtherUniversity ? customUniversity : university
    if (!fullName.trim() || !finalUniversity.trim() || !course.trim()) {
      setError('All fields are required.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, university: finalUniversity, course }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }
      router.refresh()
      router.push('/dashboard/student')
    } catch (err: any) {
      setError(err.message || 'Onboarding update failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="inline-flex h-12 w-12 bg-accent-warm-light text-accent-warm rounded-2xl items-center justify-center">
          <BookOpen className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-foreground">Welcome to Erudogix</h2>
        <p className="text-sm text-text-muted">
          Please complete your academic profile to activate your dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-6 border border-border shadow-sm rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-400/30 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="university" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                University / Institution
              </label>
              <select
                id="university"
                name="university"
                required
                value={university}
                onChange={handleUniversityChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm transition-all"
              >
                <option value="">Select your institution...</option>
                <option value="University of Oxford (UK)">University of Oxford (UK)</option>
                <option value="University of Cambridge (UK)">University of Cambridge (UK)</option>
                <option value="University College London (UK)">University College London (UK)</option>
                <option value="University of Sydney (Australia)">University of Sydney (Australia)</option>
                <option value="University of Melbourne (Australia)">University of Melbourne (Australia)</option>
                <option value="Harvard University (US)">Harvard University (US)</option>
                <option value="Stanford University (US)">Stanford University (US)</option>
                <option value="Trinity College Dublin (Ireland)">Trinity College Dublin (Ireland)</option>
                <option value="University College Dublin (Ireland)">University College Dublin (Ireland)</option>
                <option value="Other / Independent Organisation">Other / Independent Organisation</option>
              </select>

              {isOtherUniversity && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label htmlFor="customUniversity" className="block text-[10px] font-bold uppercase tracking-wider text-accent-warm mb-1.5">
                    Specify Institution Name
                  </label>
                  <input
                    id="customUniversity"
                    name="customUniversity"
                    type="text"
                    required
                    value={customUniversity}
                    onChange={(e) => setCustomUniversity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm transition-all"
                    placeholder="Enter university name"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="course" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Course / Major Code
              </label>
              <input
                id="course"
                name="course"
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm transition-all"
                placeholder="BSc Computer Science, ENG-101, etc."
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center font-bold px-6 py-3 rounded-full bg-accent-warm text-white hover:bg-accent-warm-hover transition-all duration-200 shadow-md shadow-accent-warm/10 disabled:opacity-55"
              >
                {loading ? 'Completing profile...' : 'Complete Setup'}
                {!loading && <ArrowRight className="ml-1.5 h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
