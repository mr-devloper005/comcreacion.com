import type { Metadata } from 'next'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { ScrollReveal } from '@/editable/components/ScrollReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1fr] lg:gap-16 lg:px-8 lg:py-28">
          <ScrollReveal variant="up" className="lg:order-1">
            <div className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_20px_60px_rgba(18,18,18,0.14)] sm:p-10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--slot4-accent)]/25 bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <UserPlus className="h-5 w-5" />
              </span>
              <h1 className="editable-display mt-5 text-2xl font-bold tracking-[-0.01em]">{pagesContent.auth.signup.formTitle}</h1>
              <EditableLocalSignupForm />
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                  {pagesContent.auth.signup.loginCta}
                </Link>
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="up" delayMs={120} className="lg:order-2">
            <p className="editable-display text-xs font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent)]">{pagesContent.auth.signup.badge}</p>
            <h2 className="editable-display mt-5 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-5xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>
          </ScrollReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
