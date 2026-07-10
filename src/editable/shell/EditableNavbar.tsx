'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => [{label: 'Resources', href: '/sbm'}, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }],
    []
  )

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav className="mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-3 rounded-full bg-[var(--editable-nav-bg)] py-2.5 pl-3 pr-3 text-[var(--editable-nav-text)] shadow-[0_18px_45px_rgba(18,18,18,0.28)] sm:pl-4 sm:pr-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span className="editable-display hidden max-w-[180px] truncate text-base font-semibold tracking-[-0.01em] md:block">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${active ? 'text-white' : 'text-white/60 hover:text-white'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[var(--editable-nav-bg)] transition duration-300 hover:brightness-95 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium text-white/60 transition hover:text-white sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium text-white/70 transition hover:text-white sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-4 py-2 text-[13px] font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-110 sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" /> Join free
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="mx-auto mt-2 w-full max-w-[var(--editable-container)] rounded-3xl bg-[var(--editable-nav-bg)] p-3 text-[var(--editable-nav-text)] shadow-[0_18px_45px_rgba(18,18,18,0.28)] lg:hidden">
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="mb-2 flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white/70"
          >
            <Search className="h-4 w-4" /> Search listings, bookmarks…
          </Link>
          <div className="grid gap-1">
            {[{ label: 'Home', href: '/' }, ...navItems, ...(session ? [{ label: 'Submit content', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Join free', href: '/signup' }])].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
