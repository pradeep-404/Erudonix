'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, ShieldAlert, FileText, Download, CheckCircle, Upload, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatBox from '@/components/ChatBox'

interface RequestDetailProps {
  params: Promise<{ id: string }>
}

export default function SpecialistRequestDetailPage({ params }: RequestDetailProps) {
  const router = useRouter()
  const { id: requestId } = use(params)

  const [request, setRequest] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [uploading, setUploading] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingPermission, setUpdatingPermission] = useState(false)
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

  const updateStatus = async (newStatus: string) => {
    if (!request || updatingStatus) return
    setUpdatingStatus(true)

    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update status')

      setRequest((prev: any) => ({ ...prev, status: newStatus }))
    } catch (err: any) {
      setError(err.message || 'Status update failed.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const toggleUploadPermission = async () => {
    if (!request || updatingPermission) return
    setUpdatingPermission(true)
    setError(null)

    try {
      const newApprovedState = !request.extra_uploads_approved
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          extraUploadsApproved: newApprovedState
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update upload permission')

      setRequest((prev: any) => ({ ...prev, extra_uploads_approved: newApprovedState }))
    } catch (err: any) {
      setError(err.message || 'Permission update failed.')
    } finally {
      setUpdatingPermission(false)
    }
  }

  const handleDeliveryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    setError(null)

    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('request_id', requestId)
      formData.append('is_delivery', 'true') // Marked as delivery result

      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      await fetchRequestDetails() // Refresh files list
    } catch (err: any) {
      setError(err.message || 'File delivery upload failed.')
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
          <span className="text-sm font-semibold text-text-muted">Loading assignment...</span>
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
          <h2 className="text-lg font-bold text-foreground">Access Denied</h2>
          <p className="text-sm text-text-muted max-w-sm">{error || 'Request is not assigned to you.'}</p>
          <Link href="/dashboard/specialist" className="text-xs font-semibold text-accent-warm hover:underline mt-4">
            Back to Dashboard
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const statusIndex = getStatusIndex(request.status)
  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$' }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <Link href="/dashboard/specialist" className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-accent-warm transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <span className="text-xs text-text-muted">ID: {request.id}</span>
          </div>

          {/* Controls & Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Status Pipeline Visualizer */}
            <div className="lg:col-span-2 bg-card border border-border p-6 rounded-3xl shadow-sm flex items-center">
              <div className="w-full flex justify-between items-center gap-4">
                {['Submitted', 'Matched', 'In progress', 'Ready', 'Delivered'].map((step, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center relative w-full">
                    <div className="flex items-center justify-center">
                      <div
                        className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                          idx <= statusIndex
                            ? 'border-accent-warm bg-accent-warm text-white'
                            : 'border-border bg-background text-text-muted'
                        }`}
                      >
                        {idx < statusIndex ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold mt-2 uppercase tracking-wider ${
                        idx <= statusIndex ? 'text-accent-warm font-semibold' : 'text-text-muted'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Control Actions & Upload Permission */}
            <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold text-text-muted uppercase block mb-2">Update Status</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Start Work', value: 'In progress', active: request.status === 'Matched' },
                    { label: 'Mark Ready', value: 'Ready', active: request.status === 'In progress' },
                    { label: 'Deliver Complete', value: 'Delivered', active: request.status === 'Ready' }
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      disabled={updatingStatus || !action.active}
                      onClick={() => updateStatus(action.value)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                        action.active
                          ? 'bg-accent-warm border-accent-warm text-white hover:bg-accent-warm-hover'
                          : 'border-border bg-background text-text-muted cursor-not-allowed opacity-50'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-2">
                <span className="text-xs font-bold text-text-muted uppercase block">Upload Permission</span>
                <div className="flex justify-between items-center bg-background/50 border border-border p-3 rounded-2xl">
                  <div className="text-left">
                    <span className="text-xs font-bold text-foreground block">Allow extra uploads</span>
                    <span className="text-[9px] text-text-muted block">Overrides the 5-document limit</span>
                  </div>
                  <button
                    onClick={toggleUploadPermission}
                    disabled={updatingPermission}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      request.extra_uploads_approved
                        ? 'bg-green-500/10 border-green-400/30 text-green-700 dark:text-green-300 hover:bg-green-500/20'
                        : 'bg-background border-border text-text-muted hover:border-accent-warm hover:text-accent-warm'
                    }`}
                  >
                    {updatingPermission ? 'Saving...' : request.extra_uploads_approved ? 'Allowed' : 'Not Allowed'}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Client & Request details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Client & Description details */}
              <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex justify-between items-start flex-wrap gap-4 border-b border-border/60 pb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-accent-warm-light text-accent-warm px-2.5 py-0.5 rounded-full mb-2 inline-block">
                      {request.service_line.replace('_', ' ')}
                    </span>
                    <h2 className="text-xl font-bold font-serif text-foreground">{request.service_type}</h2>
                    <p className="text-xs text-text-muted mt-1">
                      Subject: <span className="font-semibold text-foreground">{request.subject_code || 'General'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-text-muted uppercase block">Agreed Price</span>
                    <span className="text-xl font-bold text-accent-warm font-mono">
                      {currencySymbols[request.currency] || '$'}{request.price}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm border-b border-border/60 pb-6">
                  <div>
                    <span className="text-xs font-bold text-text-muted uppercase block mb-1">Student Details</span>
                    <span className="font-semibold text-foreground block">
                      {request.student_name}
                    </span>
                    <span className="text-xs text-text-muted">{request.student_university}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text-muted uppercase block mb-1">Target Deadline</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-accent-warm" /> {new Date(request.deadline).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-text-muted uppercase block">Student Instructions</span>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{request.description}</p>
                </div>
              </div>

              {/* Delivery Files Vault */}
              <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-foreground">File Deliverables Vault</h3>
                  <label className={`inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full border border-border bg-background hover:bg-accent-warm-light/20 text-foreground cursor-pointer transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? 'Uploading...' : 'Upload Work File'}
                    <input type="file" onChange={handleDeliveryUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>

                {/* Delivered Files (Work results) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-accent-warm uppercase tracking-wider">Your Uploaded Deliverables</h4>
                  {files.filter(f => f.is_delivery).length === 0 ? (
                    <div className="bg-background border border-border/50 rounded-2xl p-4 text-center">
                      <p className="text-xs text-text-muted">You have not uploaded any work guides or feedbacks for this request yet.</p>
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
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Student Uploaded Context Files</h4>
                  {files.filter(f => !f.is_delivery).length === 0 ? (
                    <p className="text-xs text-text-muted italic">No files uploaded by the student.</p>
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

            {/* Right: Live Chat */}
            <div className="lg:col-span-1">
              <div className="sticky top-[100px]">
                <ChatBox
                  requestId={requestId}
                  currentUserId={userId || ''}
                  currentUserRole="Specialist"
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
