'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ShieldCheck, Upload, BookOpen, Cpu, Layers } from 'lucide-react'

export default function NewRequestPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  // Form State
  const [serviceLine, setServiceLine] = useState<'academic_support' | 'small_language_models' | 'app_studio'>('academic_support')
  const [serviceType, setServiceType] = useState('1:1 Tutoring')
  const [subjectCode, setSubjectCode] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('12:00')
  const [estimatedLength, setEstimatedLength] = useState('10')
  const [description, setDescription] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('GBP')
  const [files, setFiles] = useState<File[]>([])
  const [priceApproved, setPriceApproved] = useState(false)
  
  // Pricing config loaded from API
  const [pricingConfig, setPricingConfig] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      // Fetch session
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()
      if (sessionData.user) {
        setUserId(sessionData.user.id)
        setProfile(sessionData.user)
        const reqType = sessionData.user.requirement_type
        if (reqType === 'slm') {
          setServiceLine('small_language_models')
        } else if (reqType === 'app_studio') {
          setServiceLine('app_studio')
        } else {
          setServiceLine('academic_support')
        }
      } else {
        router.push('/auth/login')
        return
      }
      
      // Fetch pricing config
      const configRes = await fetch('/api/pricing')
      const configData = await configRes.json()
      if (configData.pricing) {
        setPricingConfig(configData.pricing)
      }
    }
    init()
  }, [router])

  // Set default service types when service line changes
  useEffect(() => {
    if (serviceLine === 'academic_support') {
      setServiceType('1:1 Tutoring')
    } else if (serviceLine === 'small_language_models') {
      setServiceType('SFT Fine-Tuning')
    } else {
      setServiceType('Custom Invoicing App')
    }
  }, [serviceLine])

  const calculatePrice = () => {
    if (currency === 'GBP') {
      return 30
    } else if (currency === 'USD') {
      return 40
    } else if (currency === 'EUR') {
      return 32
    }
    return 30
  }

  const isStepValid = () => {
    if (step === 1) {
      return !!serviceLine && !!serviceType
    }
    if (step === 2) {
      return !!subjectCode.trim() && !!deadlineDate
    }
    if (step === 3) {
      return !!description.trim()
    }
    return true
  }

  const getServiceLineOptions = () => {
    const reqType = profile?.requirement_type || 'academic'
    if (reqType === 'slm') {
      return [
        { id: 'small_language_models', title: 'Small Language Models', icon: <Cpu className="h-5 w-5" />, desc: 'Instruction tuning, DPO alignment, quantisation.' }
      ]
    }
    if (reqType === 'app_studio') {
      return [
        { id: 'app_studio', title: 'App Studio Development', icon: <Layers className="h-5 w-5" />, desc: 'Web apps, ledger sheets, enterprise dashboards.' }
      ]
    }
    return [
      { id: 'academic_support', title: 'Academic Support', icon: <BookOpen className="h-5 w-5" />, desc: 'Concept coaching & draft feedback.' }
    ]
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    const isAcademic = profile?.requirement_type !== 'slm' && profile?.requirement_type !== 'app_studio'
    if (isAcademic && !priceApproved) {
      setError('You must approve the estimated quote before submitting.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const deadline = new Date(`${deadlineDate}T${deadlineTime || '12:00'}`)
      const calculatedPrice = isAcademic ? calculatePrice() : 0

      // 1. Create request
      const reqRes = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceLine,
          serviceType,
          subjectCode: subjectCode || null,
          deadline: deadline.toISOString(),
          estimatedLength: serviceLine === 'academic_support' ? estimatedLength : serviceType,
          description,
          couponCode: couponCode || null,
          currency,
          price: calculatedPrice
        })
      })

      const reqData = await reqRes.json()
      if (!reqRes.ok) throw new Error(reqData.error || 'Failed to submit request')
      const createdRequest = reqData.request

      // 2. Upload files if any
      if (files.length > 0 && createdRequest) {
        for (const file of files) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('request_id', createdRequest.id)
          formData.append('is_delivery', 'false')

          const uploadRes = await fetch('/api/files', {
            method: 'POST',
            body: formData
          })

          const uploadData = await uploadRes.json()
          if (!uploadRes.ok) throw new Error(uploadData.error || 'File upload failed')
        }
      }

      router.push(`/dashboard/student/request/${createdRequest.id}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.')
      setLoading(false)
    }
  }

  const maxSteps = (profile?.requirement_type === 'slm' || profile?.requirement_type === 'app_studio') ? 3 : 4

  return (
    <div className="min-h-screen bg-background py-10 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link href="/dashboard/student" className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-accent-warm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* Progress bar */}
        <div className="bg-card border border-border p-4 rounded-full flex justify-between items-center px-8">
          <span className="text-xs font-bold text-text-muted">Step {step} of {maxSteps}</span>
          <div className="flex gap-1.5">
            {Array.from({ length: maxSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`h-2 w-10 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-accent-warm' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-400/30 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* STEP 1: Service Lines */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-foreground">Select a Service Line</h2>
                <p className="text-sm text-text-muted">Choose which of our services your request fits into.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-md">
                {getServiceLineOptions().map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setServiceLine(item.id as any)}
                    className={`p-6 rounded-2xl border text-left flex flex-col justify-between h-40 transition-all ${
                      serviceLine === item.id
                        ? 'border-accent-warm bg-accent-warm-light/20 text-accent-warm'
                        : 'border-border bg-background hover:bg-accent-warm-light/10 text-foreground'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-card border border-border inline-block">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-text-muted mt-1 leading-normal">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Service Type</label>
                {serviceLine === 'academic_support' && (
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  >
                    <option value="1:1 Tutoring">1:1 Concepts Tutoring</option>
                    <option value="Draft Feedback">Draft Review & Mentoring</option>
                    <option value="Skills Coaching">Study Skills Coaching</option>
                    <option value="Exam Prep">Exam Preparation Guides</option>
                  </select>
                )}
                {serviceLine === 'small_language_models' && (
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  >
                    <option value="SFT Fine-Tuning">Instruction Fine-Tuning (SFT)</option>
                    <option value="Preference Alignment (DPO)">Preference Alignment (DPO/RLHF)</option>
                    <option value="Custom Architecture">Custom Offline Architecture</option>
                  </select>
                )}
                {serviceLine === 'app_studio' && (
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  >
                    <option value="Custom Invoicing App">Custom Invoicing & Fintech App</option>
                    <option value="Fintech Dashboard">Rent & Employee Dashboard</option>
                    <option value="Web Platform">Enterprise Operational Tool</option>
                  </select>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Subject & Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-foreground">Project Scope & Schedule</h2>
                <p className="text-sm text-text-muted">Define your deadline and course parameters.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    {profile?.requirement_type === 'slm' ? 'Target Domain / Model' : 
                     profile?.requirement_type === 'app_studio' ? 'Project Category / Subsystem' : 
                     'Subject / Course Code'}
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                    placeholder={
                      profile?.requirement_type === 'slm' ? 'e.g. Legal NLP, Bio-Med SLM' : 
                      profile?.requirement_type === 'app_studio' ? 'e.g. Payment Ledger, Staff Dashboard' : 
                      'e.g. COMP-301, MATH-102'
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Description & Files */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-foreground">Details & Supporting Assets</h2>
                <p className="text-sm text-text-muted">Describe the concepts/deliverables and attach guidelines.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Detailed Description</label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  placeholder="Describe what you want help with. Be specific about drafts, concepts, or system architecture goals."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Attach Files</label>
                <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center bg-background hover:border-accent-warm/40 transition-colors">
                  <Upload className="h-8 w-8 text-text-muted mb-2" />
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer text-xs font-bold text-accent-warm hover:underline">
                    Upload documents, images, zip files
                  </label>
                  <p className="text-[10px] text-text-muted mt-1">.pdf, .docx, .zip, .xlsx, .png, .jpg (Max 15MB total)</p>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {files.map((f, i) => (
                      <div key={i} className="text-xs text-text-muted flex justify-between bg-background border border-border/50 px-3 py-1.5 rounded-lg">
                        <span>{f.name}</span>
                        <span>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Promo Code (Optional)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  placeholder="COUPON-CODE"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Pricing Approval */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-foreground">Transparent Price Approval</h2>
                <p className="text-sm text-text-muted">Review your estimated quote. The quote must be approved by the student before work begins.</p>
              </div>

              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Currency</label>
                <div className="flex gap-2">
                  {(['USD', 'EUR', 'GBP'] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setCurrency(curr)}
                      className={`flex-1 py-2 text-sm font-semibold rounded-full border transition-all ${
                        currency === curr
                          ? 'bg-accent-warm border-accent-warm text-white'
                          : 'border-border bg-background hover:bg-accent-warm-light/20 text-foreground'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="bg-background border border-border p-6 rounded-2xl text-center space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Price Quote</span>
                <div className="text-5xl font-serif font-black text-accent-warm">
                  {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}{calculatePrice()}
                </div>
                <p className="text-xs text-text-muted">
                  Includes base setup rates plus scope volume multipliers. No hidden charges.
                </p>
              </div>

              {/* Academic Integrity Consent */}
              <div className="bg-accent-warm-light/35 border border-accent-warm/25 p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-accent-warm uppercase tracking-wider mb-1">Academic Integrity Warning</h4>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  Erudogix provides conceptual advice, learning guides, and feedback on drafts. We do not write files for submission or complete coursework for you. You agree that any study aids delivered will be used for learning and reference only.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="approve"
                  checked={priceApproved}
                  onChange={(e) => setPriceApproved(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-accent-warm focus:ring-accent-warm cursor-pointer"
                />
                <label htmlFor="approve" className="text-xs font-semibold text-foreground cursor-pointer">
                  I explicitly approve this price quote and agree to the Academic Integrity Code.
                </label>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 border-t border-border/50">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-full border border-border bg-background hover:bg-accent-warm-light/20 text-foreground transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < maxSteps ? (
              <button
                type="button"
                onClick={() => {
                  if (isStepValid()) {
                    setStep(step + 1)
                    setError(null)
                  } else {
                    setError('Please fill in all required fields before proceeding.')
                  }
                }}
                disabled={!isStepValid()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-full bg-accent-warm text-white hover:bg-accent-warm-hover transition-all duration-200 shadow-md shadow-accent-warm/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || (profile?.requirement_type !== 'slm' && profile?.requirement_type !== 'app_studio' && !priceApproved)}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-6 py-2.5 rounded-full bg-accent-warm text-white hover:bg-accent-warm-hover transition-all duration-200 shadow-md shadow-accent-warm/10 disabled:opacity-55"
              >
                {loading ? 'Submitting request...' : 'Confirm & Submit'}
                {!loading && <ShieldCheck className="h-4 w-4" />}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
