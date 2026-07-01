import { Building2, Bookmark, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { ScrollReveal } from '@/editable/components/ScrollReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const VALUE_ICONS = [Building2, Bookmark, Sparkles]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <section className="mx-auto max-w-[var(--editable-container)]">
          <ScrollReveal as="div" className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">
              About {SITE_CONFIG.name}
            </p>
            <p className={`${dc.type.eyebrow} mt-3`}>{pagesContent.about.badge}</p>
            <h1 className="editable-display mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">
              {pagesContent.about.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
          </ScrollReveal>

          <ScrollReveal
            as="div"
            delayMs={80}
            className="mt-12 grid gap-6 border-t border-[var(--editable-border)] pt-10 lg:grid-cols-3"
          >
            {pagesContent.about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-[15px] leading-8 text-[var(--slot4-muted-text)]">
                {paragraph}
              </p>
            ))}
          </ScrollReveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {pagesContent.about.values.map((value, index) => {
              const Icon = VALUE_ICONS[index % VALUE_ICONS.length]
              return (
                <ScrollReveal
                  key={value.title}
                  as="div"
                  delayMs={index * 90}
                  className={`${dc.surface.card} p-7 ${dc.motion.lift}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)]">
                    <Icon className="h-5 w-5 text-[var(--slot4-accent)]" />
                  </span>
                  <h2 className="editable-display mt-5 text-xl font-semibold">{value.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                </ScrollReveal>
              )
            })}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
