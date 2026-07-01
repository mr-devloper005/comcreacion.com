import type { Metadata } from 'next'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { ScrollReveal } from '@/editable/components/ScrollReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-28">
          <ScrollReveal variant="up">
            <p className="editable-display text-xs font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent)]">{pagesContent.auth.login.badge}</p>
            <h1 className="editable-display mt-5 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-5xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
          </ScrollReveal>
          <ScrollReveal variant="up" delayMs={120}>
            <div className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_20px_60px_rgba(18,18,18,0.14)] sm:p-10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--slot4-accent)]/25 bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <LogIn className="h-5 w-5" />
              </span>
              <h2 className="editable-display mt-5 text-2xl font-bold tracking-[-0.01em]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                New here?{' '}
                <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                  {pagesContent.auth.login.createCta}
                </Link>
              </p>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
