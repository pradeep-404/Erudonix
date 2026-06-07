'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Settings, ChevronRight, Save } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DashboardSettings from '@/components/DashboardSettings'

export default function AdminDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  
  // Lists
  const [requests, setRequests] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  
  // Pricing configuration
  const [pricing, setPricing] = useState<any>(null)
  const [savingPrice, setSavingPrice] = useState(false)
  const [priceSuccess, setPriceSuccess] = useState(false)

  // Loading states
  const [loading, setLoading] = useState(true)
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState('board')

  // Credentials management states
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editEmail, setEditEmail] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [updatingCredentials, setUpdatingCredentials] = useState(false)
  const [deletingUser, setDeletingUser] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [crudError, setCrudError] = useState<string | null>(null)

  const fetchAdminData = async () => {
    try {
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()
      if (!sessionData.user || sessionData.user.role !== 'admin') {
        router.push('/dashboard')
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

      // Fetch pricing config
      const priceRes = await fetch('/api/pricing')
      const priceData = await priceRes.json()
      setPricing(priceData.pricing)

      // Fetch requests
      const reqRes = await fetch('/api/requests')
      const reqData = await reqRes.json()
      setRequests(reqData.requests || [])

      // Fetch users list
      const userRes = await fetch('/api/users')
      const userData = await userRes.json()
      setProfiles(userData.users || [])

    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [router])

  const handlePriceUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPrice(true)
    setPriceSuccess(false)

    try {
      const res = await fetch('/api/pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pricing)
      })

      if (!res.ok) throw new Error('Failed to update pricing')
      setPriceSuccess(true)
    } catch (err) {
      console.error('Error saving prices:', err)
    } finally {
      setSavingPrice(false)
    }
  }

  const handleRoleChange = async (targetUserId: string, newRole: string) => {
    setUpdatingRole(targetUserId)

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetUserId,
          role: newRole
        })
      })

      if (!res.ok) throw new Error('Role update failed')
      
      setProfiles((prev) =>
        prev.map((p) => (p.id === targetUserId ? { ...p, role: newRole } : p))
      )
    } catch (err) {
      console.error('Error updating user role:', err)
    } finally {
      setUpdatingRole(null)
    }
  }

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setUpdatingCredentials(true)
    setCrudError(null)

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: editingUser.id,
          email: editEmail,
          password: editPassword || undefined
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials')
      
      setProfiles((prev) =>
        prev.map((p) => (p.id === editingUser.id ? { ...p, email: data.user.email } : p))
      )
      
      setEditingUser(null)
      setEditEmail('')
      setEditPassword('')
    } catch (err: any) {
      setCrudError(err.message || 'Credentials update failed')
    } finally {
      setUpdatingCredentials(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!deletingUser) return
    setDeleting(true)
    setCrudError(null)

    try {
      const res = await fetch(`/api/users?id=${deletingUser.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete user')
      
      setProfiles((prev) => prev.filter((p) => p.id !== deletingUser.id))
      setDeletingUser(null)
    } catch (err: any) {
      setCrudError(err.message || 'Deletion failed')
    } finally {
      setDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-300 border-neutral-400/30'
      case 'Matched':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-400/30'
      case 'In progress':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-400/30'
      case 'Ready':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-400/30'
      case 'Delivered':
        return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-400/30'
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-300 border-neutral-400/30'
    }
  }

  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$' }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-background">
          <span className="text-sm font-semibold text-text-muted">Loading Admin Panel...</span>
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
          
          {/* Header */}
          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-400/30">
              Admin Master Account
            </span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-2">
              System Control Dashboard
            </h1>
            <p className="text-xs text-text-muted">Manage global service pricing, promote user accounts, and audit live requests.</p>
          </div>

          {/* Dashboard Tab Toggles */}
          <div className="flex border-b border-border/80 pb-px gap-8">
            <button
              onClick={() => {
                setActiveTab('board')
                router.replace('/dashboard/admin?tab=board')
              }}
              className={`pb-4 text-sm font-semibold relative transition-colors ${
                activeTab === 'board' ? 'text-accent-warm' : 'text-text-muted hover:text-foreground'
              }`}
            >
              Control Panel
              {activeTab === 'board' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-accent-warm rounded-full" />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('settings')
                router.replace('/dashboard/admin?tab=settings')
              }}
              className={`pb-4 text-sm font-semibold relative transition-colors ${
                activeTab === 'settings' ? 'text-accent-warm' : 'text-text-muted hover:text-foreground'
              }`}
            >
              Master Settings
              {activeTab === 'settings' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-accent-warm rounded-full" />
              )}
            </button>
          </div>

          {activeTab === 'settings' ? (
            <DashboardSettings 
              profile={profile} 
              onProfileUpdate={(updated) => setProfile(updated)} 
              role="admin" 
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Col: Requests Audits */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">Global Requests Registry</h2>
                
                {requests.length === 0 ? (
                  <div className="bg-card border border-border p-8 rounded-3xl text-center">
                    <p className="text-sm text-text-muted">No request submissions found in the database.</p>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border/60">
                    {requests.map((req) => (
                      <div key={req.id} className="p-5 flex justify-between items-center hover:bg-accent-warm-light/5 transition-colors flex-wrap gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-text-muted uppercase">{req.subject_code || 'General'}</span>
                            <span className="text-xs text-text-muted">•</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${getStatusColor(req.status)}`}>
                              {req.status}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-foreground line-clamp-1 max-w-lg">
                            {req.description}
                          </h4>
                          <div className="flex gap-4 text-[10px] text-text-muted">
                            <span>Student: <span className="font-bold text-foreground">{req.student_name}</span></span>
                            <span>Specialist: <span className="font-bold text-foreground">{req.specialist_name || 'Unassigned'}</span></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono font-bold text-accent-warm">
                            {currencySymbols[req.currency] || '$'}{req.price}
                          </span>
                          <Link
                            href={`/dashboard/admin/request/${req.id}`}
                            className="p-1.5 hover:bg-accent-warm-light text-foreground hover:text-accent-warm rounded-lg transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* User management list */}
                <div className="space-y-4 pt-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground">User Directory & Roles</h2>
                  <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border/60">
                    {profiles.map((p) => (
                      <div key={p.id} className="p-4 flex justify-between items-center flex-wrap gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-foreground">{p.full_name || 'New Member'}</h4>
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md border border-border bg-card text-text-muted">
                              {p.role}
                            </span>
                          </div>
                          <div className="text-xs text-text-muted mt-0.5">
                            {p.email} • {p.university || 'No university'}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {updatingRole === p.id ? (
                            <span className="text-xs text-text-muted">Updating...</span>
                          ) : (
                            <select
                              value={p.role}
                              onChange={(e) => handleRoleChange(p.id, e.target.value)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none"
                            >
                              <option value="student">Student</option>
                              <option value="specialist">Specialist</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                          
                          <button
                            onClick={() => {
                              setEditingUser(p)
                              setEditEmail(p.email || '')
                              setEditPassword('')
                              setCrudError(null)
                            }}
                            className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-border hover:bg-accent-warm-light/40 transition-colors text-foreground"
                          >
                            Edit Credentials
                          </button>
                          
                          <button
                            onClick={() => {
                              setDeletingUser(p)
                              setCrudError(null)
                            }}
                            className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-transparent hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-400/30 transition-colors text-text-muted"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: Global Pricing Engine Overrides */}
              <div className="lg:col-span-1">
                <div className="sticky top-[100px] bg-card border border-border p-6 rounded-3xl shadow-sm space-y-6">
                  <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                    <Settings className="h-5 w-5 text-accent-warm" /> Pricing Config Override
                  </h3>

                  {pricing && (
                    <form onSubmit={handlePriceUpdate} className="space-y-4 text-xs">
                      {priceSuccess && (
                        <div className="bg-green-500/10 border border-green-400/30 text-green-700 dark:text-green-400 p-2.5 rounded-xl">
                          Pricing updated successfully!
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <h4 className="font-bold text-text-muted uppercase tracking-wider">Base Rates</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-text-muted mb-1">USD</label>
                            <input
                              type="number"
                              value={pricing.base_rate_usd}
                              onChange={(e) => setPricing({ ...pricing, base_rate_usd: parseFloat(e.target.value) })}
                              className="w-full p-2 border border-border bg-background rounded-lg text-foreground font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-text-muted mb-1">EUR</label>
                            <input
                              type="number"
                              value={pricing.base_rate_eur}
                              onChange={(e) => setPricing({ ...pricing, base_rate_eur: parseFloat(e.target.value) })}
                              className="w-full p-2 border border-border bg-background rounded-lg text-foreground font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-text-muted mb-1">AUD</label>
                            <input
                              type="number"
                              value={pricing.base_rate_aud}
                              onChange={(e) => setPricing({ ...pricing, base_rate_aud: parseFloat(e.target.value) })}
                              className="w-full p-2 border border-border bg-background rounded-lg text-foreground font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-border/50">
                        <h4 className="font-bold text-text-muted uppercase tracking-wider">Page Rates</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-text-muted mb-1">USD/pg</label>
                            <input
                              type="number"
                              value={pricing.price_per_page_usd}
                              onChange={(e) => setPricing({ ...pricing, price_per_page_usd: parseFloat(e.target.value) })}
                              className="w-full p-2 border border-border bg-background rounded-lg text-foreground font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-text-muted mb-1">EUR/pg</label>
                            <input
                              type="number"
                              value={pricing.price_per_page_eur}
                              onChange={(e) => setPricing({ ...pricing, price_per_page_eur: parseFloat(e.target.value) })}
                              className="w-full p-2 border border-border bg-background rounded-lg text-foreground font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-text-muted mb-1">AUD/pg</label>
                            <input
                              type="number"
                              value={pricing.price_per_page_aud}
                              onChange={(e) => setPricing({ ...pricing, price_per_page_aud: parseFloat(e.target.value) })}
                              className="w-full p-2 border border-border bg-background rounded-lg text-foreground font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-border/50">
                        <h4 className="font-bold text-text-muted uppercase tracking-wider">Service Multipliers</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-text-muted">Academic Support</label>
                            <input
                              type="number"
                              step="0.1"
                              value={pricing.academic_support_multiplier}
                              onChange={(e) => setPricing({ ...pricing, academic_support_multiplier: parseFloat(e.target.value) })}
                              className="w-20 p-1.5 border border-border bg-background rounded-lg text-right text-foreground font-mono"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <label className="text-text-muted">SLM Tuning</label>
                            <input
                              type="number"
                              step="0.1"
                              value={pricing.slm_multiplier}
                              onChange={(e) => setPricing({ ...pricing, ...pricing, slm_multiplier: parseFloat(e.target.value) })}
                              className="w-20 p-1.5 border border-border bg-background rounded-lg text-right text-foreground font-mono"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <label className="text-text-muted">App Studio</label>
                            <input
                              type="number"
                              step="0.1"
                              value={pricing.app_studio_multiplier}
                              onChange={(e) => setPricing({ ...pricing, app_studio_multiplier: parseFloat(e.target.value) })}
                              className="w-20 p-1.5 border border-border bg-background rounded-lg text-right text-foreground font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={savingPrice}
                        className="w-full flex justify-center items-center gap-1.5 font-bold py-2.5 rounded-full bg-accent-warm text-white hover:bg-accent-warm-hover transition-colors disabled:opacity-50 mt-4 shadow-sm"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {savingPrice ? 'Saving Changes...' : 'Save Configuration'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Edit User Credentials Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-55">
          <div className="bg-card border border-border p-6 rounded-3xl w-full max-w-md shadow-2xl space-y-4 text-foreground">
            <h3 className="font-serif text-lg font-bold">Edit Credentials for {editingUser.full_name}</h3>
            
            {crudError && (
              <div className="bg-rose-500/10 border border-rose-400/30 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl">
                {crudError}
              </div>
            )}

            <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  Email Address / Username
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  Reset Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setEditingUser(null); setCrudError(null); }}
                  className="px-4 py-2 border border-border hover:bg-neutral-100 rounded-full font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingCredentials}
                  className="px-5 py-2 bg-accent-warm hover:bg-accent-warm-hover text-white rounded-full font-bold disabled:opacity-50"
                >
                  {updatingCredentials ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-55">
          <div className="bg-card border border-border p-6 rounded-3xl w-full max-w-sm shadow-2xl space-y-4 text-foreground text-center">
            <h3 className="font-serif text-lg font-bold text-rose-600">Delete User Account?</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to permanently delete <strong>{deletingUser.full_name}</strong> ({deletingUser.email})? This action cannot be undone and will delete all their requests/assignments.
            </p>
            
            {crudError && (
              <div className="bg-rose-500/10 border border-rose-400/30 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl">
                {crudError}
              </div>
            )}

            <div className="flex justify-center gap-3 pt-2 text-xs">
              <button
                type="button"
                onClick={() => { setDeletingUser(null); setCrudError(null); }}
                className="px-4 py-2 border border-border hover:bg-neutral-100 rounded-full font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
