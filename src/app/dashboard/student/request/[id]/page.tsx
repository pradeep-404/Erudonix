'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, ShieldAlert, FileText, Download, CheckCircle, Upload, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatBox from '@/components/ChatBox'

interface FeedbackWidgetProps {
  request: any
  requestId: string
  onRequestUpdate: () => Promise<void>
}

function FeedbackWidget({ request, requestId, onRequestUpdate }: FeedbackWidgetProps) {
  const [rating, setRating] = useState<number | null>(request.rating || null)
  const [marks, setMarks] = useState<number | string>(request.marks !== null && request.marks !== undefined ? request.marks : '')
  const [screenshot, setScreenshot] = useState<string | null>(request.result_screenshot || null)
  const [feedbackText, setFeedbackText] = useState(request.feedback || '')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Decide whether to show the form or collapsed summary
  const hasSubmittedBefore = request.rating !== null || request.marks !== null
  const [isEditing, setIsEditing] = useState<boolean>(!hasSubmittedBefore)

  // Sync state if request updates in background
  useEffect(() => {
    if (request) {
      if (request.rating !== undefined) setRating(request.rating)
      if (request.marks !== undefined && request.marks !== null) setMarks(request.marks)
      if (request.result_screenshot !== undefined) setScreenshot(request.result_screenshot)
      if (request.feedback !== undefined) setFeedbackText(request.feedback || '')
      
      const hasFeedback = request.rating !== null || request.marks !== null
      // Only set editing mode if the user hasn't explicitly toggled it
      if (hasFeedback && !isEditing && !success) {
        setIsEditing(false)
      }
    }
  }, [request])

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    setError(null)

    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('request_id', requestId)
      formData.append('is_delivery', 'false')

      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setScreenshot(data.file.file_path)
    } catch (err: any) {
      setError(err.message || 'Screenshot upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const numericMarks = marks === '' ? null : parseInt(marks as string, 10)
      if (numericMarks !== null && (isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100)) {
        throw new Error('Marks must be a number between 0 and 100')
      }

      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          marks: numericMarks,
          resultScreenshot: screenshot,
          feedback: feedbackText
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback')

      setSuccess(true)
      await onRequestUpdate()
      setIsEditing(false) // Collapse the window after successful submission
      setTimeout(() => setSuccess(false), 4000)
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  // Collapsed Summary Mode
  if (!isEditing) {
    return (
      <div className="bg-card border border-green-500/20 p-6 rounded-3xl shadow-md space-y-4 relative overflow-hidden text-left mb-6">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4.5 w-4.5 text-green-500" />
            <h3 className="font-serif text-sm font-bold text-foreground">Project Completed & Feedback Shared</h3>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-[10px] font-bold text-accent-warm hover:underline border border-accent-warm/20 hover:border-accent-warm/40 px-3 py-1 rounded-full bg-background transition-colors"
          >
            Edit Feedback & Results
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-background border border-border p-4 rounded-2xl text-xs">
          <div>
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Rating</span>
            <div className="flex items-center gap-1 mt-1 text-amber-400">
              {rating ? (
                [...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400' : 'text-neutral-200'}`} 
                  />
                ))
              ) : (
                <span className="text-text-muted font-normal italic">No rating given</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Achieved Score</span>
            <span className="font-bold text-foreground text-sm font-mono block mt-0.5">
              {marks !== '' ? `${marks} / 100` : 'Not filled yet'}
            </span>
          </div>
        </div>

        {screenshot && (
          <div className="flex justify-between items-center p-3 bg-background border border-border/80 rounded-xl text-xs">
            <span className="font-medium text-text-muted truncate max-w-[200px]">
              📎 {screenshot.split('/').pop()}
            </span>
            <a
              href={screenshot}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold text-accent-warm hover:underline"
            >
              View Result Screenshot
            </a>
          </div>
        )}

        {feedbackText.trim() && (
          <div className="text-xs text-text-muted border-t border-border/60 pt-3">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">Your Comments</span>
            <p className="italic leading-relaxed">"{feedbackText}"</p>
          </div>
        )}
      </div>
    )
  }

  // Expanded Form Mode
  return (
    <div className="bg-card border border-accent-warm/30 p-6 rounded-3xl shadow-lg shadow-accent-warm/5 space-y-6 relative overflow-hidden text-left mb-6">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent-warm/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent-warm animate-pulse" />
          <h3 className="font-serif text-base font-bold text-foreground">Share Your Results & Feedback</h3>
        </div>
        {hasSubmittedBefore && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-[9px] font-bold text-text-muted hover:underline"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-rose-500/10 border border-rose-400/30 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-400/30 text-green-700 dark:text-green-400 text-xs p-3 rounded-xl">
            ✓ Feedback & Results updated successfully!
          </div>
        )}

        {/* Star Rating */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Rate Your Tutor / Specialist
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoverRating !== null ? hoverRating : (rating || 0))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-300'
                  }`}
                />
              </button>
            ))}
            {rating && (
              <span className="text-xs text-text-muted ml-2 font-bold uppercase tracking-wider">
                ({rating} / 5)
              </span>
            )}
          </div>
        </div>

        {/* Marks Obtained */}
        <div>
          <label htmlFor="marks" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Marks Section (Achieved Score Out of 100)
          </label>
          <input
            id="marks"
            type="number"
            min="0"
            max="100"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="e.g. 85"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:border-accent-warm font-mono text-foreground"
          />
        </div>

        {/* Screenshot Upload */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Upload Result Screenshot (Optional)
          </label>
          {screenshot ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-background border border-border/80 rounded-xl">
                <span className="text-xs text-foreground font-medium truncate max-w-[200px]">
                  {screenshot.split('/').pop()}
                </span>
                <a
                  href={screenshot}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-accent-warm hover:underline"
                >
                  View Screenshot
                </a>
              </div>
              <label className="inline-flex items-center gap-1 text-[10px] font-bold text-text-muted hover:text-accent-warm cursor-pointer">
                <span>Change Screenshot</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <label className={`w-full flex flex-col items-center justify-center border border-dashed border-border p-4 rounded-xl bg-background hover:bg-accent-warm-light/10 transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="h-5 w-5 text-text-muted mb-1.5" />
              <span className="text-[10px] text-text-muted font-semibold">
                {uploading ? 'Uploading...' : 'Click to Upload Screenshot'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Comments/Feedback */}
        <div>
          <label htmlFor="comments" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Additional Feedback / Comments
          </label>
          <textarea
            id="comments"
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Describe your learning experience..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:border-accent-warm resize-none text-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center font-bold px-6 py-2.5 rounded-full bg-accent-warm text-white hover:bg-accent-warm-hover transition-colors shadow-md shadow-accent-warm/10 text-xs disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback & Results'}
        </button>
      </form>
    </div>
  )
}

interface RequestDetailProps {
  params: Promise<{ id: string }>
}

export default function StudentRequestDetailPage({ params }: RequestDetailProps) {
  const router = useRouter()
  const { id: requestId } = use(params)

  const [request, setRequest] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRequestDetails = async () => {
    try {
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()
      if (!sessionData.user) {
        router.push('/auth/login')
        return
      }
      setUserId(sessionData.user.id)

      // Fetch request details
      const reqRes = await fetch(`/api/requests/${requestId}`)
      const reqData = await reqRes.json()
      if (!reqRes.ok) throw new Error(reqData.error || 'Failed to load request details')
      setRequest(reqData.request)

      // Fetch files list
      const fileRes = await fetch(`/api/files?request_id=${requestId}`)
      const fileData = await fileRes.json()
      if (fileRes.ok) {
        setFiles(fileData.files || [])
      }

    } catch (err: any) {
      console.error('Error fetching request details:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequestDetails()

    const interval = setInterval(() => {
      fetchRequestDetails()
    }, 3000)

    return () => clearInterval(interval)
  }, [requestId, router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    setError(null)

    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('request_id', requestId)
      formData.append('is_delivery', 'false')

      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      await fetchRequestDetails() // Refresh files list
    } catch (err: any) {
      setError(err.message || 'File upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const getStatusIndex = (status: string) => {
    const statuses = ['Submitted', 'Matched', 'In progress', 'Ready', 'Delivered']
    return statuses.indexOf(status)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <span className="text-sm font-semibold text-text-muted">Loading request...</span>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="h-10 w-10 text-rose-500 mb-2" />
          <h2 className="text-lg font-bold text-foreground">Access Denied / Error</h2>
          <p className="text-sm text-text-muted max-w-sm">{error || 'Request could not be found.'}</p>
          <Link href="/dashboard/student" className="text-xs font-semibold text-accent-warm hover:underline mt-4">
            Back to Dashboard
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const statusIndex = getStatusIndex(request.status)
  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$' }
  
  const contextFilesCount = files.filter(f => !f.is_delivery).length
  const limitReached = contextFilesCount >= 5 && !request.extra_uploads_approved

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <Link href="/dashboard/student" className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-accent-warm transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <span className="text-xs text-text-muted">ID: {request.id}</span>
          </div>

          {/* Status pipeline */}
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {['Submitted', 'Matched', 'In progress', 'Ready', 'Delivered'].map((step, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center relative w-full">
                  <div className="flex items-center w-full justify-center">
                    <div
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                        idx <= statusIndex
                          ? 'border-accent-warm bg-accent-warm text-white'
                          : 'border-border bg-background text-text-muted'
                      }`}
                    >
                      {idx < statusIndex ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${
                      idx <= statusIndex ? 'text-accent-warm font-semibold' : 'text-text-muted'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Request Details & Files */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Core details */}
              <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex justify-between items-start flex-wrap gap-4 border-b border-border/60 pb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-accent-warm-light text-accent-warm px-2.5 py-0.5 rounded-full mb-2 inline-block">
                      {request.service_line.replace('_', ' ')}
                    </span>
                    <h2 className="text-xl font-bold font-serif text-foreground">{request.service_type}</h2>
                    <p className="text-xs text-text-muted mt-1">
                      {request.service_line === 'small_language_models' ? 'Target Domain: ' : 
                       request.service_line === 'app_studio' ? 'Project Category: ' : 
                       'Course: '}
                      <span className="font-semibold text-foreground">{request.subject_code || 'General'}</span>
                    </p>
                  </div>
                  {request.service_line !== 'small_language_models' && request.service_line !== 'app_studio' && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-text-muted uppercase block">Agreed Price</span>
                      <span className="text-xl font-bold text-accent-warm font-mono">
                        {currencySymbols[request.currency] || '$'}{request.price}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-xs font-bold text-text-muted uppercase block mb-1">Matched Specialist</span>
                    <span className="font-semibold text-foreground">
                      {request.specialist_name || 'Selecting best specialist...'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text-muted uppercase block mb-1">Target Deadline</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-accent-warm" /> {new Date(request.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border/60 pt-6">
                  <span className="text-xs font-bold text-text-muted uppercase block">Task Description</span>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{request.description}</p>
                </div>
              </div>

              {/* Files / Attachments */}
              <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <h3 className="font-serif text-lg font-bold text-foreground">Secure File Vault</h3>
                  {limitReached ? (
                    <div className="text-xs font-bold px-4 py-2 rounded-full border border-rose-400/30 bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      Upload Limit Reached
                    </div>
                  ) : (
                    <label className={`inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full border border-border bg-background hover:bg-accent-warm-light/20 text-foreground cursor-pointer transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload className="h-3.5 w-3.5" />
                      {uploading ? 'Uploading...' : 'Upload File'}
                      <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                    </label>
                  )}
                </div>

                {limitReached && (
                  <div className="bg-rose-500/10 border border-rose-400/30 text-rose-600 dark:text-rose-400 text-xs p-4 rounded-2xl leading-relaxed">
                    You have uploaded <strong>{contextFilesCount}</strong> files. You have reached the intake document limit of 5 files. If you need to attach more materials, please ask your specialist in chat to enable extra uploads.
                  </div>
                )}

                {/* Scrollable File Area to balance ChatBox height */}
                <div className="max-h-[350px] overflow-y-auto pr-1.5 space-y-6">
                  {/* Delivered Files (Work results) */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-accent-warm uppercase tracking-wider">Expert Deliverables (Tutoring Reviews)</h4>
                    {files.filter(f => f.is_delivery).length === 0 ? (
                      <div className="bg-background border border-border/50 rounded-2xl p-4 text-center">
                        <p className="text-xs text-text-muted">Feedback and guides will appear here when ready.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {files.filter(f => f.is_delivery).map(f => (
                          <div key={f.id} className="p-4 bg-accent-warm-light/20 border border-accent-warm/25 rounded-2xl flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-accent-warm" />
                              <div className="text-left">
                                <span className="text-xs font-semibold text-foreground block">{f.file_name}</span>
                                <span className="text-[10px] text-text-muted">{(f.file_size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                            </div>
                            {f.download_url && (
                              <a
                                href={f.download_url}
                                download
                                className="p-2 bg-background border border-border rounded-xl hover:bg-accent-warm-light text-accent-warm transition-colors"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Original Attachments */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Original Context Attachments</h4>
                    {files.filter(f => !f.is_delivery).length === 0 ? (
                      <p className="text-xs text-text-muted italic">No context files uploaded.</p>
                    ) : (
                      <div className="space-y-2">
                        {files.filter(f => !f.is_delivery).map(f => (
                          <div key={f.id} className="p-3 bg-background border border-border/60 rounded-xl flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-text-muted" />
                              <div className="text-left">
                                <span className="text-xs text-foreground block">{f.file_name}</span>
                                <span className="text-[9px] text-text-muted">{(f.file_size / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>
                            {f.download_url && (
                              <a
                                href={f.download_url}
                                download
                                className="text-xs font-semibold text-accent-warm hover:underline"
                              >
                                Download
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Live Chat & Feedback Widget */}
            <div className="lg:col-span-1 space-y-6">
              {request.status === 'Delivered' && (
                <FeedbackWidget
                  request={request}
                  requestId={requestId}
                  onRequestUpdate={fetchRequestDetails}
                />
              )}
              <div className="sticky top-[100px]">
                <ChatBox
                  requestId={requestId}
                  currentUserId={userId || ''}
                  currentUserRole="Student"
                  uploadLimitReached={limitReached}
                  isClosed={request.status === 'Delivered'}
                />
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
