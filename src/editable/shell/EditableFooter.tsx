'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function FooterNewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = new FormData(form).get('email')
    setStatus('submitting')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Newsletter subscriber', email, subject: 'Newsletter signup', message: `New updates signup request from ${email}` }),
      })
      if (!response.ok) throw new Error('failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex max-w-xs items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-1.5">
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-4 py-2 text-xs font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-110 disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        Send
      </button>
      {status === 'success' ? <p className="sr-only">Thanks — your request has been sent.</p> : null}
    </form>
  )
}

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-dark-bg)] ring-1 ring-black/10">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
              </span>
              <span className="editable-display text-lg font-semibold tracking-[-0.01em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--slot4-muted-text)]">{globalContent.footer?.description || SITE_CONFIG.description}</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">Explore</h3>
            <div className="mt-4 grid gap-2.5">
              {taskLinks.map((task) => (
                <Link key={task.key} href={task.route} className="text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">
                  {task.label}
                </Link>
              ))}
              <Link href="/search" className="text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Search</Link>
            </div>
          </div>

          <div>
            <h3 className="font-[family-name:var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">Company</h3>
            <div className="mt-4 grid gap-2.5">
              <Link href="/about" className="text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">About</Link>
              <Link href="/contact" className="text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Contact</Link>
              {session ? (
                <>
                  <Link href="/create" className="text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Submit content</Link>
                  <button type="button" onClick={logout} className="text-left text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Login</Link>
                  <Link href="/signup" className="text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Join free</Link>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-[family-name:var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">Get updates</h3>
            <p className="mt-4 text-sm leading-6 text-[var(--slot4-muted-text)]">New listings and top bookmarks, occasionally in your inbox.</p>
            <FooterNewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-[var(--editable-border)] pt-6 text-xs font-medium text-[var(--slot4-muted-text)] sm:flex-row sm:items-center">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <Link href="/create" className="inline-flex items-center gap-1.5 text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">
            {globalContent.footer?.bottomNote || 'A trusted place to list, discover and save what matters.'} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="overflow-hidden border-t border-[var(--editable-border)] px-4 py-6 sm:px-6 lg:px-8">
        <p className="editable-display -mb-3 truncate text-[18vw] font-bold leading-none tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-[12vw] lg:-mb-6">
          {SITE_CONFIG.name}
        </p>
      </div>
    </footer>
  )
}
