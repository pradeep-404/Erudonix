'use client'

import React, { useState, useRef, useEffect } from 'react'
import { User, ShieldCheck, Key, UploadCloud, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

interface DashboardSettingsProps {
  profile: any
  onProfileUpdate: (updatedProfile: any) => void
  role: 'student' | 'specialist' | 'admin'
}

export default function DashboardSettings({ profile, onProfileUpdate, role }: DashboardSettingsProps) {
  // Input fields
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [university, setUniversity] = useState(profile?.university || '')
  const [hudIsOtherUniversity, setHudIsOtherUniversity] = useState(false)
  const [hudCustomUniversity, setHudCustomUniversity] = useState('')
  const [course, setCourse] = useState(profile?.course || '')
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // State management
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const predefinedUniversities = [
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

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setEmail(profile.email || '')
      setCourse(profile.course || '')
      
      if (profile.university) {
        if (predefinedUniversities.includes(profile.university)) {
          setUniversity(profile.university)
          setHudIsOtherUniversity(false)
          setHudCustomUniversity('')
        } else {
          setUniversity("Other / Independent Organisation")
          setHudIsOtherUniversity(true)
          setHudCustomUniversity(profile.university)
        }
      }
    }
  }, [profile])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload photo')
      }

      setSuccess('Profile picture updated successfully!')
      
      // Update local profile state
      const updated = { ...profile, avatar_url: data.avatarUrl }
      onProfileUpdate(updated)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    // Form validations
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      setSaving(false)
      return
    }

    const finalUniversity = hudIsOtherUniversity ? hudCustomUniversity : university

    try {
      const res = await fetch('/api/auth/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          university: role === 'student' ? finalUniversity : undefined,
          course: role === 'student' ? course : undefined,
          currentPassword: (newPassword || email !== profile.email) ? currentPassword : undefined,
          newPassword: newPassword || undefined
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings')
      }

      setSuccess('Settings saved successfully!')
      
      // Clear password inputs
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Callback
      onProfileUpdate(data.user)
    } catch (err: any) {
      setError(err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Avatar Management */}
      <div className="lg:col-span-1 bg-card border border-border p-6 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center space-y-6">
        <h3 className="font-serif text-lg font-bold text-foreground">Profile Image</h3>
        
        <div className="relative group">
          <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-border shadow-inner bg-gradient-to-tr from-gemini-blue/10 to-gemini-purple/10 flex items-center justify-center font-bold text-4xl text-text-muted">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
            ) : (
              profile?.full_name ? profile.full_name[0].toUpperCase() : 'C'
            )}
          </div>
          
          {uploading && (
            <div className="absolute inset-0 bg-neutral-900/60 rounded-full flex items-center justify-center text-white">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-text-muted">Supports JPG, PNG, GIF. Max size 5MB.</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-border bg-background hover:bg-accent-warm-light/40 transition-colors text-foreground"
          >
            <UploadCloud className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Change Photo'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Right Column: Settings Form */}
      <div className="lg:col-span-2 bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
        <h3 className="font-serif text-xl font-bold text-foreground">Update Personal Details</h3>

        {error && (
          <div className="bg-rose-500/10 border border-rose-400/30 text-rose-600 dark:text-rose-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-400/30 text-green-700 dark:text-green-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleUpdateSettings} className="space-y-6 text-xs">
          
          {/* Identity Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                Email Address (Username)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Student Fields */}
          {role === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  University Name
                </label>
                <select
                  value={university}
                  onChange={(e) => {
                    const val = e.target.value
                    setUniversity(val)
                    setHudIsOtherUniversity(val === 'Other / Independent Organisation')
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  required
                >
                  <option value="">Select University...</option>
                  {predefinedUniversities.map((uni, idx) => (
                    <option key={idx} value={uni}>{uni}</option>
                  ))}
                  <option value="Other / Independent Organisation">Other / Independent Organisation</option>
                </select>

                {hudIsOtherUniversity && (
                  <input
                    type="text"
                    required
                    value={hudCustomUniversity}
                    onChange={(e) => setHudCustomUniversity(e.target.value)}
                    className="w-full mt-3 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                    placeholder="Specify University Name"
                  />
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  Course / Major Code
                </label>
                <input
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  placeholder="e.g. CS101, BA Economics"
                />
              </div>
            </div>
          )}

          {/* Password Reset Section */}
          <div className="pt-6 border-t border-border/50 space-y-4">
            <h4 className="font-serif text-sm font-bold text-foreground flex items-center gap-1.5">
              <Key className="h-4 w-4 text-accent-warm" /> Change Account Password
            </h4>
            <p className="text-[10px] text-text-muted">Leave new password fields blank if you do not wish to change your password.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-accent-warm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Verification (Sensitive details change verification) */}
          {(newPassword || email !== profile.email) && (
            <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl space-y-3">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">Security Action Required</span>
              <p className="text-[10px] text-amber-600 dark:text-amber-400">Please provide your current password to authorize changes to your email or password.</p>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full max-w-md px-4 py-3 rounded-xl border border-amber-400/30 bg-background text-sm focus:outline-none focus:border-amber-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 font-bold px-6 py-3 rounded-full bg-accent-warm text-white hover:bg-accent-warm-hover transition-colors shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>

        </form>
      </div>

    </div>
  )
}
