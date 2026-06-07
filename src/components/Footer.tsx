import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              ERUDOGIX<span className="text-accent-warm">.</span>
            </span>
            <p className="text-sm text-text-muted max-w-sm">
              Premium tailored support for academics, small language model tuning, and responsive application studio deliverables.
            </p>
            {/* Academic Integrity Statement */}
            <div className="bg-background border border-border p-4 rounded-2xl max-w-md">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-accent-warm mb-1">
                Academic Integrity Statement
              </h5>
              <p className="text-xs text-text-muted leading-relaxed">
                Erudogix strictly provides 1:1 tutoring, tutoring guides, study reviews, and mentor feedback on students' own work. We **do not** engage in ghostwriting, essay-writing, or any academic evasion services. All materials in our library are for learning and reference only.
              </p>
            </div>
          </div>

          {/* Service Lines */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Service Lines
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#services" className="text-sm text-text-muted hover:text-accent-warm transition-colors">
                  Academic Support
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-sm text-text-muted hover:text-accent-warm transition-colors">
                  Small Language Models
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-sm text-text-muted hover:text-accent-warm transition-colors">
                  App Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Resources & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/library" className="text-sm text-text-muted hover:text-accent-warm transition-colors">
                  Study Resources
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-text-muted hover:text-accent-warm transition-colors">
                  Pricing Quote
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-sm text-text-muted hover:text-accent-warm transition-colors">
                  Academic Integrity Code
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-sm text-text-muted hover:text-accent-warm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-border my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Erudogix. All rights reserved. Servicing students and organizations in the UK, IE, AU, and US.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-text-muted">Multi-currency supported (USD, EUR, GBP)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
