'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DashboardSettings from '@/components/DashboardSettings'

import { User, RequestItem } from '@/types'
import StatusBadge from '@/components/StatusBadge'

export default function SpecialistDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<User | null>(null)
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingAvailability, setUpdatingAvailability] = useState(false)

  const [activeTab, setActiveTab] = useState('board')

  const fetchSpecialistData = async () => {
    try {
      // Fetch session
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()
      if (!sessionData.user) {
        router.push('/auth/login')
        return
      }
      setProfile(sessionData.user)

      // Parse tab param
      const tabParam = new URLSearchParams(window.location.search).get('tab')
      if (tabParam === 'settings') {
        setActiveTab('settings')
      } else {
        setActiveTab('board')
      }

      // Fetch requests
      const reqRes = await fetch('/api/requests')
      const reqData = await reqRes.json()
      setRequests(reqData.requests || [])

    } catch (err) {
      console.error('Error loading specialist dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpecialistData()
  }, [router])

  const toggleAvailability = async () => {
    if (!profile || updatingAvailability) return
    setUpdatingAvailability(true)
    const newAvailability = !profile.is_available

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isAvailable: newAvailability
        })
      })

      if (!res.ok) throw new Error('Failed to update availability')
      
      setProfile((prev: any) => ({ ...prev, is_available: newAvailability }))
    } catch (err) {
      console.error('Error toggling availability:', err)
    } finally {
      setUpdatingAvailability(false)
    }
  }


  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', AUD: 'A$' }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-background">
          <span className="text-sm font-semibold text-text-muted">Loading specialist panel...</span>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Card */}
          <div className="bg-card border border-border p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Specialist / Employee Account
              </span>
              <h1 className="font-serif text-3xl font-bold text-foreground mt-2">
                Welcome back, {profile?.full_name}
              </h1>
              <p className="text-xs text-text-muted leading-relaxed max-w-md">
                Specialties: <span className="font-semibold text-foreground">{profile?.subject_specialties?.join(', ') || 'Generalist'}</span>
              </p>
            </div>
            
            {/* Availability Toggle */}
            <div className="flex items-center gap-3 bg-background border border-border px-5 py-3 rounded-2xl">
              <div className="text-left">
                <span className="text-[10px] font-bold text-text-muted uppercase block">Queue Routing</span>
                <span className="text-xs font-semibold text-foreground">
                  {profile?.is_available ? 'Available for auto-assign' : 'Queue Paused'}
                </span>
              </div>
              <button
                onClick={toggleAvailability}
                disabled={updatingAvailability}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profile?.is_available ? 'bg-accent-warm' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    profile?.is_available ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Dashboard Tab Toggles */}
          <div className="flex border-b border-border/80 pb-px gap-8">
            <button
              onClick={() => {
                setActiveTab('board')
                router.replace('/dashboard/specialist?tab=board')
              }}
              className={`pb-4 text-sm font-semibold relative transition-colors ${
                activeTab === 'board' ? 'text-accent-warm' : 'text-text-muted hover:text-foreground'
              }`}
            >
              My Dashboard
              {activeTab === 'board' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-accent-warm rounded-full" />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('settings')
                router.replace('/dashboard/specialist?tab=settings')
              }}
              className={`pb-4 text-sm font-semibold relative transition-colors ${
                activeTab === 'settings' ? 'text-accent-warm' : 'text-text-muted hover:text-foreground'
              }`}
            >
              Profile Settings
              {activeTab === 'settings' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-accent-warm rounded-full" />
              )}
            </button>
          </div>

          {activeTab === 'settings' ? (
            <DashboardSettings 
              profile={profile} 
              onProfileUpdate={(updated) => setProfile(updated)} 
              role="specialist" 
            />
          ) : (
            <>
              {/* Quick Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Assigned Work', value: requests.length, icon: <FileText className="h-5 w-5 text-accent-warm" /> },
                  { label: 'In Progress Tasks', value: requests.filter((r) => r.status === 'In progress').length, icon: <AlertCircle className="h-5 w-5 text-amber-500" /> },
                  { label: 'Completed Deliveries', value: requests.filter((r) => r.status === 'Delivered').length, icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-3">
                    <div className="p-2 bg-background border border-border inline-block rounded-xl">{stat.icon}</div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block">{stat.label}</span>
                      <span className="text-2xl font-serif font-bold text-foreground">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assigned Requests */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">Active Assignments</h2>

                {requests.length === 0 ? (
                  <div className="bg-card border border-border rounded-3xl p-12 text-center">
                    <p className="text-sm text-text-muted">No tutoring requests have been assigned to you yet.</p>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border/60">
                    {requests.map((req) => (
                      <div key={req.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-accent-warm-light/5 transition-colors">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-text-muted uppercase">{req.subject_code || 'General'}</span>
                            <span className="text-xs text-text-muted">•</span>
                            <span className="text-xs font-medium text-foreground">{req.service_type}</span>
                            <span className="text-xs text-text-muted">•</span>
                            <StatusBadge status={req.status} />
                          </div>
                          <h4 className="font-serif text-lg font-bold text-foreground line-clamp-1 max-w-xl">
                            {req.description}
                          </h4>
                          <p className="text-xs text-text-muted">
                            Student: <span className="font-bold text-foreground">{req.student_name}</span> ({req.student_university})
                          </p>
                        </div>

                        <div className="flex items-center gap-6 justify-between w-full md:w-auto">
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-text-muted uppercase block">Value / Price</span>
                            <span className="text-sm font-bold text-accent-warm font-mono">
                              {currencySymbols[req.currency] || '$'}{req.price}
                            </span>
                          </div>
                          <Link
                            href={`/dashboard/specialist/request/${req.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-foreground hover:text-accent-warm transition-colors"
                          >
                            Manage request <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
