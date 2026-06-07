import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck } from 'lucide-react'

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-background">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Legal Agreements & Policies
            </h1>
            <p className="text-text-muted">
              Effective Date: June 4, 2026. Please review our compliance standards and service rules.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 1: Academic Integrity */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-accent-warm">
              <ShieldCheck className="h-6 w-6" />
              <h2 className="text-2xl font-bold font-serif text-foreground">Academic Integrity Code</h2>
            </div>
            <div className="text-sm text-text-muted leading-relaxed space-y-4">
              <p>
                Erudogix exists to improve educational outcomes through personalized instruction, mentoring, and rigorous feedback. We believe students learn best when they engage deeply with their coursework and produce their own ideas.
              </p>
              <p className="font-semibold text-foreground">
                We strictly prohibit the following actions and services:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Ghostwriting or Essay-writing:</strong> Specialists will not write assignments, reports, or chapters for you. They will only comment on drafts, explain concepts, suggest structures, and help you edit.</li>
                <li><strong>Online Class Evasion:</strong> Specialists will not log in as a student to complete quizzes, exams, or homework sheets.</li>
                <li><strong>Grade Guarantees:</strong> Erudogix does not guarantee specific marks. We guarantee high-quality pedagogical assistance.</li>
                <li><strong>Detector Evasion:</strong> We do not offer tools or advice on how to bypass plagiarism or AI detection algorithms.</li>
              </ul>
              <p>
                Violating this code will result in immediate termination of the service without refunds.
              </p>
            </div>
          </section>

          <hr className="border-border" />

          {/* Section 2: Terms of Service */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-foreground">Terms of Service</h2>
            <div className="text-sm text-text-muted leading-relaxed space-y-4">
              <p>
                By accessing Erudogix services, you agree to comply with our billing policies, multi-currency approval gates, and specialist communication guidelines.
              </p>
              <p>
                Payments are made in the selected currency (USD, EUR, or GBP) and must be approved on the student dashboard before any matched specialist begins work on your request.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
