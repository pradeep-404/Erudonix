'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, ShieldAlert, FileText, Download } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatBox from '@/components/ChatBox'

interface RequestDetailProps {
  params: Promise<{ id: string }>
}

export default function AdminRequestDetailPage({ params }: RequestDetailProps) {
  const router = useRouter()
  const { id: requestId } = use(params)

  const [request, setRequest] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Specialists assignment states
  const [specialists, setSpecialists] = useState<any[]>([])
  const [selectedSpecialistId, setSelectedSpecialistId] = useState('')
  const [assigning, setAssigning] = useState(false)

  // Price override states
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [editedPrice, setEditedPrice] = useState('')
  const [savingPrice, setSavingPrice] = useState(false)

  const fetchRequestDetails = async () => {
    try {
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()
      if (!sessionData.user || sessionData.user.role !== 'admin') {
        router.push('/auth/login')
        return
      }
      setUserId(sessionData.user.id)

      // Fetch request details
      const reqRes = await fetch(`/api/requests/${requestId}`)
      const reqData = await reqRes.json()
      if (!reqRes.ok) throw new Error(reqData.error || 'Failed to load request details')
      setRequest(reqData.request)
      setSelectedSpecialistId(reqData.request.specialist_id || '')
      setEditedPrice(reqData.request.price.toString())

      // Fetch files list
      const fileRes = await fetch(`/api/files?request_id=${requestId}`)
      const fileData = await fileRes.json()
      if (fileRes.ok) {
        setFiles(fileData.files || [])
      }

      // Fetch users list to extract specialists
      const usersRes = await fetch('/api/users')
      const usersData = await usersRes.json()
      if (usersRes.ok) {
        const specs = (usersData.users || []).filter((u: any) => u.role === 'specialist')
        setSpecialists(specs)
      }

    } catch (err: any) {
      console.error('Error fetching request details for admin:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignSpecialist = async () => {
    setAssigning(true)
    setError(null)
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialistId: selectedSpecialistId || null
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update assignment')
      
      await fetchRequestDetails()
    } catch (err: any) {
      setError(err.message || 'Failed to assign specialist')
    } finally {
      setAssigning(false)
    }
  }

  const handleSavePrice = async () => {
    if (!editedPrice || savingPrice) return
    setSavingPrice(true)
    setError(null)
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: parseFloat(editedPrice)
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update price')
      
      setIsEditingPrice(false)
      await fetchRequestDetails()
    } catch (err: any) {
      setError(err.message || 'Failed to update price')
    } finally {
      setSavingPrice(false)
    }
  }

  useEffect(() => {
    fetchRequestDetails()

    const interval = setInterval(() => {
      fetchRequestDetails()
    }, 3000)

    return () => clearInterval(interval)
  }, [requestId, router])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <span className="text-sm font-semibold text-text-muted">Loading audit dashboard...</span>
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
          <h2 className="text-lg font-bold text-foreground">Error Loading Audit</h2>
          <p className="text-sm text-text-muted max-w-sm">{error || 'Request not found.'}</p>
          <Link href="/dashboard/admin" className="text-xs font-semibold text-accent-warm hover:underline mt-4">
            Back to Dashboard
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$' }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <Link href="/dashboard/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-accent-warm transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <span className="text-xs text-text-muted bg-rose-500/10 border border-rose-400/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-bold">Admin Audit Mode</span>
          </div>

          {/* Main Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Request & Participant Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Core Details */}
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
                  <div className="text-right space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase block">Agreed Price</span>
                    {isEditingPrice ? (
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs font-mono font-bold text-accent-warm">
                          {currencySymbols[request.currency] || '$'}
                        </span>
                        <input
                          type="number"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          className="w-20 p-1 text-xs border border-border bg-background rounded-lg text-right font-mono focus:outline-none"
                        />
                        <button
                          onClick={handleSavePrice}
                          disabled={savingPrice}
                          className="px-2 py-1 text-[9px] font-bold rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingPrice(false)
                            setEditedPrice(request.price.toString())
                          }}
                          className="px-2 py-1 text-[9px] font-bold rounded-lg border border-border hover:bg-neutral-100 text-text-muted transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xl font-bold text-accent-warm font-mono">
                          {currencySymbols[request.currency] || '$'}{request.price}
                        </span>
                        <button
                          onClick={() => setIsEditingPrice(true)}
                          className="text-[9px] font-bold px-2 py-1 rounded-lg border border-border hover:bg-accent-warm-light/20 text-foreground transition-all"
                        >
                          Edit Price
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm border-b border-border/60 pb-6">
                  <div>
                    <span className="text-xs font-bold text-text-muted uppercase block mb-1">Student</span>
                    <span className="font-semibold text-foreground block">{request.student_name}</span>
                    <span className="text-xs text-text-muted">{request.student_university}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-text-muted uppercase block">Assigned Specialist</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={selectedSpecialistId}
                        onChange={(e) => setSelectedSpecialistId(e.target.value)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-background text-foreground focus:outline-none"
                      >
                        <option value="">Unassigned (Queue)</option>
                        {specialists.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.full_name} ({s.email})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAssignSpecialist}
                        disabled={assigning}
                        className="px-3.5 py-1.5 text-[10px] font-bold rounded-xl bg-accent-warm hover:bg-accent-warm-hover text-white transition-colors disabled:opacity-50"
                      >
                        {assigning ? 'Assigning...' : 'Assign'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text-muted uppercase block mb-1">Target Deadline</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-accent-warm" /> {new Date(request.deadline).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-text-muted uppercase block">Instructions</span>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{request.description}</p>
                </div>
              </div>

              {/* Files */}
              <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
                <h3 className="font-serif text-lg font-bold text-foreground">File Audit Registry</h3>
                
                {/* Deliverable Files */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-accent-warm uppercase tracking-wider">Expert Deliverables</h4>
                  {files.filter(f => f.is_delivery).length === 0 ? (
                    <p className="text-xs text-text-muted italic">No delivery files uploaded by the specialist yet.</p>
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

                {/* Context Files */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Original Context Attachments</h4>
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

            {/* Right Column: Chat Monitor */}
            <div className="lg:col-span-1">
              <div className="sticky top-[100px]">
                <ChatBox
                  requestId={requestId}
                  currentUserId={userId || ''}
                  currentUserRole="Admin"
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
