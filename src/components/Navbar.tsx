'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  ArrowRight, 
  User, 
  Edit3, 
  Loader2, 
  ChevronDown, 
  BookOpen, 
  Activity,
  AlertCircle,
  Sun,
  Moon,
  ShieldCheck,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'


export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Theme states
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    const nextTheme = isDark ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.theme = nextTheme
  }

  // Auth Drawer States (Left Sidebar)
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [authResendCooldown, setAuthResendCooldown] = useState(0)

  useEffect(() => {
    if (authResendCooldown <= 0) return
    const timer = setInterval(() => {
      setAuthResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [authResendCooldown])

  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authFullName, setAuthFullName] = useState('')
  const [authRequirementType, setAuthRequirementType] = useState<'academic' | 'slm' | 'app_studio'>('academic')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authOtpStep, setAuthOtpStep] = useState(false)
  const [authOtpCode, setAuthOtpCode] = useState('')
  const [authDevOtp, setAuthDevOtp] = useState<string | null>(null)

  // Profile HUD States
  const hudRef = React.useRef<HTMLDivElement>(null)
  const [isProfileHudOpen, setIsProfileHudOpen] = useState(false)
  const [userRequests, setUserRequests] = useState<any[]>([])

  // Profile Editor States
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false)
  const [editFullName, setEditFullName] = useState('')
  const [editUniversity, setEditUniversity] = useState('')
  const [editOtherUniversity, setEditOtherUniversity] = useState('')
  const [editCourse, setEditCourse] = useState('')
  const [editAvatarUrl, setEditAvatarUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [editorSaving, setEditorSaving] = useState(false)
  const [editorError, setEditorError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setEditFullName(user.full_name || '')
      setEditCourse(user.course || '')
      setEditAvatarUrl(user.avatar_url || '')
      
      const predefinedUnis = [
        'Stanford University',
        'Harvard University',
        'Massachusetts Institute of Technology',
        'University of Oxford',
        'University of Cambridge',
        'California Institute of Technology'
      ]
      
      if (user.university) {
        if (predefinedUnis.includes(user.university)) {
          setEditUniversity(user.university)
          setEditOtherUniversity('')
        } else {
          setEditUniversity('Other')
          setEditOtherUniversity(user.university)
        }
      } else {
        setEditUniversity('')
        setEditOtherUniversity('')
      }
    }
  }, [user, isProfileEditorOpen])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingAvatar(true)
    setEditorError(null)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload avatar')
      }
      setEditAvatarUrl(data.avatarUrl)
      await checkUser()
    } catch (err: any) {
      setEditorError(err.message || 'Avatar upload failed')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditorSaving(true)
    setEditorError(null)
    
    const universityValue = editUniversity === 'Other' ? editOtherUniversity : editUniversity
    
    try {
      const res = await fetch('/api/auth/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editFullName,
          avatarUrl: editAvatarUrl,
          university: universityValue,
          course: editCourse
        })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile settings')
      }
      
      await checkUser()
      setIsProfileEditorOpen(false)
    } catch (err: any) {
      setEditorError(err.message || 'Failed to save profile')
    } finally {
      setEditorSaving(false)
    }
  }
  


  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }

  const fetchUserRequests = async () => {
    try {
      const res = await fetch('/api/requests')
      const data = await res.json()
      if (data.requests) {
        // Sort requests or just keep top 3
        setUserRequests(data.requests.slice(0, 3))
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    checkUser()

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Listen for custom dispatch to trigger auth drawer
    const handleOpenAuthDrawer = () => {
      setAuthMode('login')
      setIsAuthDrawerOpen(true)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('open-auth-drawer', handleOpenAuthDrawer)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('open-auth-drawer', handleOpenAuthDrawer)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (hudRef.current && !hudRef.current.contains(event.target as Node)) {
        setIsProfileHudOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserRequests()
    } else {
      setUserRequests([])
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setIsProfileHudOpen(false)
      router.refresh()
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }



  const handleDrawerResendOtp = async () => {
    if (authResendCooldown > 0) return
    setAuthError(null)
    setAuthLoading(true)

    const url = authMode === 'signup' ? '/api/auth/send-otp' : '/api/auth/forgot-password'

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code')
      }

      if (data.devOtp) {
        setAuthDevOtp(data.devOtp)
        setAuthOtpCode(data.devOtp)
      } else {
        setAuthDevOtp(null)
      }

      setAuthResendCooldown(60) // 60s for subsequent resends
    } catch (err: any) {
      setAuthError(err.message || 'Failed to resend verification code')
    } finally {
      setAuthLoading(false)
    }
  }

  // Handle drawer auth submission
  const handleDrawerAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)

    try {
      // If signing up and we haven't asked for OTP yet, we must request the OTP first
      if (authMode === 'signup' && !authOtpStep) {
        const otpRes = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authEmail }),
        })
        const otpData = await otpRes.json()
        if (!otpRes.ok) throw new Error(otpData.error || 'Failed to send OTP')
        
        setAuthOtpStep(true)
        if (otpData.devOtp) {
          setAuthDevOtp(otpData.devOtp)
          setAuthOtpCode(otpData.devOtp)
        }
        setAuthResendCooldown(30)
        setAuthLoading(false)
        return
      }

      // If in forgot mode and we haven't asked for OTP yet, request the reset OTP first
      if (authMode === 'forgot' && !authOtpStep) {
        const resetRes = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authEmail }),
        })
        const resetData = await resetRes.json()
        if (!resetRes.ok) throw new Error(resetData.error || 'Failed to request reset code')

        setAuthOtpStep(true)
        if (resetData.devOtp) {
          setAuthDevOtp(resetData.devOtp)
          setAuthOtpCode(resetData.devOtp)
        }
        setAuthResendCooldown(30)
        setAuthLoading(false)
        return
      }

      // Proceed with Login, final Signup, or Reset Password
      let url = ''
      let body = {}

      if (authMode === 'login') {
        url = '/api/auth/login'
        body = { email: authEmail, password: authPassword }
      } else if (authMode === 'signup') {
        url = '/api/auth/signup'
        body = { email: authEmail, password: authPassword, fullName: authFullName, role: 'student', requirementType: authRequirementType, otpCode: authOtpCode }
      } else if (authMode === 'forgot') {
        url = '/api/auth/reset-password'
        body = { email: authEmail, otpCode: authOtpCode, newPassword: authPassword }
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      setIsAuthDrawerOpen(false)
      setAuthOtpStep(false)
      setAuthEmail('')
      setAuthPassword('')
      setAuthFullName('')
      setAuthOtpCode('')
      setAuthDevOtp(null)
      setAuthResendCooldown(0)
      
      await checkUser()
      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }


  const getDashboardUrl = () => {
    if (!user) return '/dashboard'
    return `/dashboard/${user.role}`
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#19222d] text-[#eaeded] border-b border-[#232f3e] py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-2xl font-black tracking-tighter text-white">
              ERUDOGIX<span className="text-[#ff9900]">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {(!user || user.role === 'student') && (
              <>
                <Link href="/services" className="text-sm font-semibold text-[#eaeded] hover:text-[#ff9900] hover:scale-105 transform transition-all">
                  Services
                </Link>
                <Link href="/process" className="text-sm font-semibold text-[#eaeded] hover:text-[#ff9900] hover:scale-105 transform transition-all">
                  Process
                </Link>
                <Link href="/pricing" className="text-sm font-semibold text-[#eaeded] hover:text-[#ff9900] hover:scale-105 transform transition-all">
                  Pricing
                </Link>
                <Link href="/library" className="text-sm font-semibold text-[#eaeded] hover:text-[#ff9900] hover:scale-105 transform transition-all">
                  Resources
                </Link>
                <Link href="/about" className="text-sm font-semibold text-[#eaeded] hover:text-[#ff9900] hover:scale-105 transform transition-all">
                  About Us
                </Link>
                <Link href="/latest" className="text-sm font-semibold text-[#eaeded] hover:text-[#ff9900] hover:scale-105 transform transition-all">
                  Latest
                </Link>
              </>
            )}
            {user && (
              <Link href={getDashboardUrl()} className="text-sm font-bold text-[#ff9900] hover:text-[#ec7211] hover:scale-105 transform transition-all">
                Console Dashboard
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded text-[#eaeded] hover:text-[#ff9900] hover:bg-[#232f3e] transition-all cursor-pointer"
              title="Toggle system color mode"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-[#ff9900]" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <div 
                ref={hudRef}
                className="relative"
              >
                <button
                  onClick={() => setIsProfileHudOpen(!isProfileHudOpen)}
                  className="flex items-center gap-2.5 py-1 px-3 rounded-full hover:bg-[#232f3e] transition-all text-left"
                >
                  <div className="h-8.5 w-8.5 rounded-full overflow-hidden bg-gradient-to-tr from-gemini-blue to-gemini-purple text-white flex items-center justify-center font-bold text-sm shadow-md border border-white/20 select-none">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                    ) : (
                      user.full_name ? user.full_name[0].toUpperCase() : 'C'
                    )}
                  </div>
                  <div className="max-w-[100px] truncate">
                    <div className="text-xs font-bold text-white leading-none">{user.full_name}</div>
                    <div className="text-[9px] text-neutral-300 mt-0.5 uppercase tracking-wider font-semibold">{user.role}</div>
                  </div>
                  <ChevronDown className="h-3 w-3 text-neutral-300" />
                </button>

                {/* HUD Dropdown Menu */}
                {isProfileHudOpen && (
                  <div className="absolute right-0 mt-1.5 w-80 bg-card border border-border rounded-3xl p-5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50 text-foreground">
                    <div className="space-y-4">
                      {/* User Header */}
                      <div className="border-b border-border/60 pb-3 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-accent-warm text-white flex items-center justify-center font-bold text-sm">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                          ) : (
                            user.full_name ? user.full_name[0].toUpperCase() : 'C'
                          )}
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-foreground">{user.full_name}</h4>
                          <p className="text-[10px] text-text-muted mt-0.5 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Profile Overview (Non-editable summary, linking to dashboard tab) */}
                      <div className="bg-background border border-border/80 p-3.5 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-accent-warm uppercase tracking-wider">Profile Info</span>
                          <button 
                            type="button"
                            onClick={() => {
                              setIsProfileHudOpen(false)
                              setIsProfileEditorOpen(true)
                            }}
                            className="text-[9px] font-semibold text-gemini-indigo hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-none"
                          >
                            <Edit3 className="h-3 w-3" /> Edit Profile
                          </button>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-[9px] font-bold uppercase text-text-muted block">Account Type</span>
                            <span className="capitalize">{user.role}</span>
                          </div>
                          {user.role === 'student' && (
                            <>
                              <div>
                                <span className="text-[9px] font-bold uppercase text-text-muted block">University</span>
                                <span>{user.university || 'Not set'}</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-bold uppercase text-text-muted block">Course</span>
                                <span>{user.course || 'Not set'}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Project Status Section */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-accent-warm uppercase tracking-wider block">Active Project Status</span>
                        {userRequests.length === 0 ? (
                          <div className="text-[10px] text-text-muted py-2 text-center bg-background rounded-xl border border-dashed border-border">
                            No active project modules.
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {userRequests.map((req) => (
                              <Link 
                                key={req.id} 
                                href={`/dashboard/${user.role}/request/${req.id}`}
                                onClick={() => setIsProfileHudOpen(false)}
                                className="flex justify-between items-center p-2 rounded-xl bg-background border border-border/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                              >
                                <div className="truncate pr-2">
                                  <span className="text-[9px] font-mono text-text-muted block">{req.subject_code || req.service_line.replace('_', ' ')}</span>
                                  <span className="text-[10px] font-bold truncate block">{req.description}</span>
                                </div>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 uppercase tracking-wide ${
                                  req.status === 'Delivered' ? 'bg-purple-500/10 border-purple-400/30 text-purple-600 dark:text-purple-400' :
                                  req.status === 'Matched' ? 'bg-green-500/10 border-green-400/30 text-green-700 dark:text-green-400' :
                                  req.status === 'Submitted' ? 'bg-amber-500/10 border-amber-400/30 text-amber-700 dark:text-amber-400 animate-pulse' :
                                  'bg-blue-500/10 border-blue-400/30 text-blue-700 dark:text-blue-400'
                                }`}>
                                  {req.status}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Navigation buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                        <Link
                          href={getDashboardUrl()}
                          onClick={() => setIsProfileHudOpen(false)}
                          className="text-center font-bold py-2 rounded-xl bg-accent-warm-light text-accent-warm text-[10px] hover:bg-accent-warm-light/75 transition-colors"
                        >
                          Go to Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="text-center font-bold py-2 rounded-xl border border-border hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 text-text-muted text-[10px] transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[#232f3e] rounded-full px-1 py-1 border border-[#2e3d4f]">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthDrawerOpen(true);
                  }}
                  className="text-sm font-semibold text-[#eaeded] hover:text-[#ff9900] transition-colors cursor-pointer px-4 py-1.5 rounded-full hover:bg-[#19222d]"
                >
                  Sign In
                </button>
                <div className="h-4 w-px bg-[#3d4f61]" />
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthDrawerOpen(true);
                  }}
                  className="group inline-flex items-center justify-center text-sm font-bold px-5 py-2 rounded-full bg-[#ff9900] text-[#19222d] hover:bg-[#ec7211] transition-all duration-200 shadow-md shadow-[#ff9900]/20 cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            className="md:hidden p-1 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#19222d] border-b border-[#232f3e] px-6 py-8 flex flex-col gap-6 shadow-lg animate-in fade-in slide-in-from-top-5 duration-200 z-50 text-[#eaeded]">
            {(!user || user.role === 'student') && (
              <>
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#eaeded] hover:text-[#ff9900] transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/process"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#eaeded] hover:text-[#ff9900] transition-colors"
                >
                  Process
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#eaeded] hover:text-[#ff9900] transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/library"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#eaeded] hover:text-[#ff9900] transition-colors"
                >
                  Resources
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#eaeded] hover:text-[#ff9900] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/latest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#eaeded] hover:text-[#ff9900] transition-colors"
                >
                  Latest
                </Link>
              </>
            )}
            {user && (
              <Link
                href={getDashboardUrl()}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-[#ff9900] hover:text-[#ec7211] transition-colors"
              >
                Console Dashboard
              </Link>
            )}
            
            <hr className="border-[#232f3e]" />
            
            {/* Mobile Theme Toggle */}
            <div className="flex items-center justify-between py-1 text-xs font-mono text-text-muted">
              <span>CONSOLE THEME</span>
              <button
                onClick={toggleTheme}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#232f3e] bg-[#232f3e] text-[#eaeded] font-bold text-[10px]"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-[#ff9900]" /> LIGHT MODE
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5" /> DARK MODE
                  </>
                )}
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  <Link
                    href={getDashboardUrl()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center font-bold py-3 rounded bg-[#ff9900] text-[#19222d]"
                  >
                    Go to Console
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleSignOut()
                    }}
                    className="text-center font-bold py-3 rounded border border-[#232f3e] bg-[#232f3e] text-[#eaeded] hover:bg-[#19222d]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode('login');
                      setIsAuthDrawerOpen(true);
                    }}
                    className="text-center font-bold py-3 rounded border border-[#232f3e] bg-[#232f3e] text-[#eaeded]"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode('signup');
                      setIsAuthDrawerOpen(true);
                    }}
                    className="text-center font-bold py-3 rounded bg-[#ff9900] text-[#19222d] hover:bg-[#ec7211] cursor-pointer"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Drawer Backdrop */}
      {isAuthDrawerOpen && (
        <div 
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs z-50 transition-opacity duration-300"
          onClick={() => setIsAuthDrawerOpen(false)}
        />
      )}

      {/* Left Sidebar Auth Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-full sm:max-w-md bg-[#19222d] border-r border-[#232f3e] shadow-2xl z-55 transform transition-transform duration-300 ease-out ${
          isAuthDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col text-[#eaeded]`}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#232f3e]">
          <span className="font-mono text-xl font-bold text-white">
            ERUDOGIX<span className="text-[#ff9900]">.</span>
          </span>
          <button 
            onClick={() => setIsAuthDrawerOpen(false)}
            className="p-1 rounded-lg text-text-muted hover:bg-[#232f3e] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-2 pb-0">
          <div className="flex bg-[#232f3e] rounded-xl p-1 gap-1">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(null); setAuthOtpStep(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authMode === 'login' ? 'bg-[#ff9900] text-[#19222d] shadow' : 'text-[#8b949e] hover:text-[#eaeded]'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setAuthError(null); setAuthOtpStep(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authMode === 'signup' ? 'bg-[#ff9900] text-[#19222d] shadow' : 'text-[#8b949e] hover:text-[#eaeded]'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              {authMode === 'login' 
                ? 'Welcome back' 
                : authMode === 'signup' 
                ? 'Create your account' 
                : 'Reset Password'}
            </h3>
            <p className="text-xs text-[#8b949e] mt-1 leading-relaxed">
              {authMode === 'login'
                ? 'Access your cloud coaching modules, DPO logs, and secure invoice portals.'
                : authMode === 'signup'
                ? 'Join Erudogix Console and start your learning journey today.'
                : 'Verify email and update password to access Erudogix console.'}
            </p>
          </div>

          <form onSubmit={handleDrawerAuthSubmit} className="space-y-4">
            {authError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] p-2.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{authError}</span>
              </div>
            )}

            {authOtpStep ? (
              <div className="space-y-4">
                {authDevOtp && (
                  <div className="bg-gemini-blue/10 border border-gemini-blue/30 text-gemini-blue text-[10px] p-3 rounded-lg flex flex-col gap-1 font-mono">
                    <span className="font-bold flex items-center gap-1">🛠️ Developer Helper</span>
                    <p className="text-[9px] leading-normal opacity-80">
                      Code: <code className="bg-gemini-blue/20 px-1 py-0.5 rounded font-black text-white">{authDevOtp}</code>
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5 text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={authOtpCode}
                    onChange={(e) => setAuthOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center px-4 py-3 rounded-md border border-[#232f3e] bg-[#232f3e] text-white text-2xl font-mono tracking-[0.5em] pl-[0.5em] focus:outline-none focus:border-[#ff9900] transition-colors"
                    placeholder="000000"
                    autoFocus
                  />
                  <p className="text-[10px] text-[#8b949e] mt-2 text-center">
                    Enter the code sent to your email.
                  </p>
                </div>

                {authMode === 'forgot' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-[#232f3e] bg-[#232f3e] text-white text-xs focus:outline-none focus:border-[#ff9900] transition-colors placeholder:text-[#5a6876]"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading || authOtpCode.length !== 6}
                  className="w-full flex items-center justify-center font-bold px-6 py-3 rounded-lg bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-colors text-sm disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {authLoading ? 'Verifying...' : authMode === 'forgot' ? 'Reset & Auto Login' : 'Verify & Continue'}
                  {!authLoading && <ShieldCheck className="ml-1.5 h-4 w-4" />}
                </button>
                
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setAuthOtpStep(false)}
                    className="text-[#8b949e] hover:text-[#eaeded] inline-flex items-center gap-0.5 font-semibold transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleDrawerResendOtp}
                    disabled={authResendCooldown > 0 || authLoading}
                    className="text-[#ff9900] hover:text-[#ec7211] disabled:text-[#8b949e] font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer bg-transparent border-none"
                  >
                    <RefreshCw className={`h-3 w-3 ${authLoading ? 'animate-spin' : ''}`} />
                    {authResendCooldown > 0 ? `Resend (${authResendCooldown}s)` : 'Resend Code'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-[#232f3e] bg-[#232f3e] text-white text-xs focus:outline-none focus:border-[#ff9900] transition-colors placeholder:text-[#5a6876]"
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md border border-[#232f3e] bg-[#232f3e] text-white text-xs focus:outline-none focus:border-[#ff9900] transition-colors placeholder:text-[#5a6876]"
                    placeholder="you@example.com"
                  />
                </div>

                {authMode === 'forgot' ? (
                  <>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full flex items-center justify-center font-bold px-6 py-3 rounded-lg bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-colors text-sm disabled:opacity-50 cursor-pointer shadow-lg"
                    >
                      {authLoading ? 'Sending...' : 'Send Reset Code'}
                      {!authLoading && <ArrowRight className="ml-1.5 h-4 w-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login')
                        setAuthError(null)
                      }}
                      className="w-full text-center text-xs text-[#8b949e] hover:text-[#eaeded] font-mono mt-2 cursor-pointer bg-transparent border-none"
                    >
                      Back to Sign In
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
                          Password
                        </label>
                        {authMode === 'login' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode('forgot')
                              setAuthOtpStep(false)
                              setAuthError(null)
                            }}
                            className="text-[10px] text-[#ff9900] hover:underline cursor-pointer bg-transparent border-none font-semibold"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-md border border-[#232f3e] bg-[#232f3e] text-white text-xs focus:outline-none focus:border-[#ff9900] transition-colors placeholder:text-[#5a6876]"
                        placeholder="••••••••"
                      />
                    </div>

                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5">
                          Service Interest
                        </label>
                        <div className="flex flex-col gap-1.5">
                          {([
                            { id: 'academic', label: '📚 Academic Support' },
                            { id: 'slm', label: '🤖 SLM Model Tuning' },
                            { id: 'app_studio', label: '💻 App Studio Build' }
                          ] as const).map((opt) => (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => setAuthRequirementType(opt.id)}
                              className={`py-2 px-3 rounded-lg text-[11px] font-semibold text-left border transition-all ${
                                authRequirementType === opt.id
                                  ? 'bg-[#ff9900]/10 border-[#ff9900]/50 text-[#ff9900]'
                                  : 'border-[#232f3e] bg-[#232f3e] text-[#8b949e] hover:border-[#3d4f61]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full flex items-center justify-center font-bold px-6 py-3 rounded-lg bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-colors text-sm disabled:opacity-50 cursor-pointer shadow-lg"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          {authMode === 'login' ? 'Signing in...' : 'Creating account...'}
                        </>
                      ) : (
                        <>
                          {authMode === 'login' ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </>
            )}
          </form>

          {authMode === 'login' && !authOtpStep && (
            <p className="text-center text-xs text-[#8b949e]">
              No account?{' '}
              <button
                onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                className="text-[#ff9900] hover:underline font-semibold cursor-pointer bg-transparent border-none"
              >
                Sign up free
              </button>
            </p>
          )}
          {authMode === 'signup' && (
            <p className="text-center text-xs text-[#8b949e]">
              Already have an account?{' '}
              <button
                onClick={() => { setAuthMode('login'); setAuthError(null); }}
                className="text-[#ff9900] hover:underline font-semibold cursor-pointer bg-transparent border-none"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isProfileEditorOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#19222d] border border-[#232f3e] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-[#eaeded] relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsProfileEditorOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8b949e] hover:bg-[#232f3e] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <User className="h-5 w-5 text-[#ff9900]" /> Edit Profile
              </h3>
              <p className="text-xs text-[#8b949e]">
                Modify your identity, photo, and academic affiliation settings.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {editorError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] p-2.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{editorError}</span>
                </div>
              )}

              {/* Avatar Upload Container */}
              <div className="flex items-center gap-4 bg-[#232f3e] p-3 rounded-2xl border border-white/5">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-neutral-800 text-white flex items-center justify-center font-bold text-lg border-2 border-white/10 shrink-0 relative group">
                  {editAvatarUrl ? (
                    <img src={editAvatarUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    editFullName ? editFullName[0].toUpperCase() : 'U'
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] font-mono">
                    Profile Photo
                  </span>
                  <label className="inline-block px-3 py-1.5 rounded-lg border border-[#3d4f61] hover:border-[#ff9900] bg-transparent text-[11px] font-bold font-mono text-[#eaeded] cursor-pointer hover:bg-white/5 transition-all">
                    {uploadingAvatar ? 'Uploading...' : 'Choose Image'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarUpload} 
                      className="hidden" 
                      disabled={uploadingAvatar}
                    />
                  </label>
                  <p className="text-[9px] text-[#8b949e]">Max size 5MB (JPG, PNG, WebP)</p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-[#232f3e] bg-[#232f3e] text-white text-xs focus:outline-none focus:border-[#ff9900] transition-colors"
                  placeholder="Full Name"
                />
              </div>

              {/* University Select */}
              {user?.role === 'student' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5 font-mono">
                      University
                    </label>
                    <select
                      value={editUniversity}
                      onChange={(e) => setEditUniversity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-[#232f3e] bg-[#232f3e] text-white text-xs focus:outline-none focus:border-[#ff9900] transition-colors font-mono font-semibold"
                    >
                      <option value="">Select University</option>
                      <option value="Stanford University">Stanford University</option>
                      <option value="Harvard University">Harvard University</option>
                      <option value="Massachusetts Institute of Technology">Massachusetts Institute of Technology</option>
                      <option value="University of Oxford">University of Oxford</option>
                      <option value="University of Cambridge">University of Cambridge</option>
                      <option value="California Institute of Technology">California Institute of Technology</option>
                      <option value="Other">Other (Type name below)</option>
                    </select>
                  </div>

                  {editUniversity === 'Other' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5 font-mono">
                        University Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editOtherUniversity}
                        onChange={(e) => setEditOtherUniversity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-md border border-[#232f3e] bg-[#232f3e] text-white text-xs focus:outline-none focus:border-[#ff9900] transition-colors"
                        placeholder="Enter University name"
                      />
                    </div>
                  )}

                  {/* Course / Major */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5 font-mono">
                      Course / Major
                    </label>
                    <input
                      type="text"
                      value={editCourse}
                      onChange={(e) => setEditCourse(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-[#232f3e] bg-[#232f3e] text-white text-xs focus:outline-none focus:border-[#ff9900] transition-colors"
                      placeholder="e.g. Computer Science, Physics"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#232f3e]">
                <button
                  type="button"
                  onClick={() => setIsProfileEditorOpen(false)}
                  className="font-bold py-2.5 rounded-lg border border-[#232f3e] hover:bg-[#232f3e] text-[11px] text-[#8b949e] hover:text-white transition-all text-center font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editorSaving || uploadingAvatar}
                  className="font-bold py-2.5 rounded-lg bg-[#ff9900] text-[#19222d] hover:bg-[#ec7211] text-[11px] transition-all text-center flex items-center justify-center gap-1 font-mono disabled:opacity-55 cursor-pointer"
                >
                  {editorSaving ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
