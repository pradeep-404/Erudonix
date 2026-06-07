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
  Save, 
  Loader2, 
  ChevronDown, 
  BookOpen, 
  Activity,
  AlertCircle,
  Sun,
  Moon,
  ShieldCheck
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
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
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
  
  // Profile edit states inside HUD
  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState('')
  const [editUniversity, setEditUniversity] = useState('')
  const [hudIsOtherUniversity, setHudIsOtherUniversity] = useState(false)
  const [hudCustomUniversity, setHudCustomUniversity] = useState('')
  const [editCourse, setEditCourse] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

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
      setEditName(user.full_name || '')
      setEditCourse(user.course || '')
      
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
      
      if (user.university) {
        if (predefined.includes(user.university)) {
          setEditUniversity(user.university)
          setHudIsOtherUniversity(false)
          setHudCustomUniversity('')
        } else {
          setEditUniversity("Other / Independent Organisation")
          setHudIsOtherUniversity(true)
          setHudCustomUniversity(user.university)
        }
      }
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
        setAuthLoading(false)
        return
      }

      // Proceed with Login (which handles its own OTP sending) or final Signup (which expects OTP)
      const url = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const body = authMode === 'login' 
        ? { email: authEmail, password: authPassword, ...(authOtpStep ? { otpCode: authOtpCode } : {}) }
        : { email: authEmail, password: authPassword, fullName: authFullName, role: 'student', requirementType: authRequirementType, ...(authOtpStep ? { otpCode: authOtpCode } : {}) }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      
      // If login requires OTP, it returns 200 with requiresOtp: true
      if (res.ok && data.requiresOtp) {
        setAuthOtpStep(true)
        if (data.devOtp) {
          setAuthDevOtp(data.devOtp)
          setAuthOtpCode(data.devOtp)
        }
        setAuthLoading(false)
        return
      }

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
      
      await checkUser()
      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }



  // Handle updates from Navbar Profile HUD
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError(null)
    setEditLoading(true)

    const finalUniversity = hudIsOtherUniversity ? hudCustomUniversity : editUniversity

    if (!editName.trim() || !finalUniversity.trim() || !editCourse.trim()) {
      setEditError('All fields are required.')
      setEditLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editName,
          university: finalUniversity,
          course: editCourse
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setEditMode(false)
      await checkUser() // reload details
    } catch (err: any) {
      setEditError(err.message || 'Update failed')
    } finally {
      setEditLoading(false)
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
                          <Link 
                            href={`${getDashboardUrl()}?tab=settings`}
                            onClick={() => setIsProfileHudOpen(false)}
                            className="text-[9px] font-semibold text-gemini-indigo hover:underline flex items-center gap-0.5"
                          >
                            <Edit3 className="h-3 w-3" /> Edit Settings
                          </Link>
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
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center justify-center text-sm font-bold px-5 py-2 rounded-full bg-[#ff9900] text-[#19222d] hover:bg-[#ec7211] transition-all duration-200 shadow-md shadow-[#ff9900]/20"
                >
                  Sign Up
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
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
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center font-bold py-3 rounded bg-[#ff9900] text-[#19222d] hover:bg-[#ec7211]"
                  >
                    Get Started
                  </Link>
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
              {authMode === 'login' ? 'Welcome back' : 'Create your account'}
            </h3>
            <p className="text-xs text-[#8b949e] mt-1 leading-relaxed">
              {authMode === 'login'
                ? 'Access your cloud coaching modules, DPO logs, and secure invoice portals.'
                : 'Join Erudogix Console and start your learning journey today.'}
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

                <button
                  type="submit"
                  disabled={authLoading || authOtpCode.length !== 6}
                  className="w-full flex items-center justify-center font-bold px-6 py-3 rounded-lg bg-gradient-to-r from-gemini-blue to-gemini-purple text-white hover:opacity-95 transition-colors text-sm disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {authLoading ? 'Verifying...' : 'Verify & Continue'}
                  {!authLoading && <ShieldCheck className="ml-1.5 h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthOtpStep(false)}
                  className="w-full text-center text-xs text-[#8b949e] hover:text-[#eaeded] font-mono mt-2"
                >
                  Back
                </button>
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

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-1.5">
                    Password
                  </label>
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

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#3d4f61]"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="bg-[#19222d] px-2 text-[#8b949e] font-mono uppercase tracking-wider">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-[#3d4f61] rounded-lg text-xs font-bold font-mono hover:bg-[#232f3e] transition-colors text-[#eaeded]"
                    onClick={() => alert("Social auth provider setup required")}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-[#3d4f61] rounded-lg text-xs font-bold font-mono hover:bg-[#232f3e] transition-colors text-[#eaeded]"
                    onClick={() => alert("Social auth provider setup required")}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    GitHub
                  </button>
                </div>
              </>
            )}
          </form>

          {authMode === 'login' && !authOtpStep && (
            <p className="text-center text-xs text-[#8b949e]">
              No account?{' '}
              <button
                onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                className="text-[#ff9900] hover:underline font-semibold"
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
                className="text-[#ff9900] hover:underline font-semibold"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </>
  )
}
