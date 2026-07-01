'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { ScrollReveal } from '@/editable/components/ScrollReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const tone = {
  shell: 'bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]',
  panel: dc.surface.card,
  soft: dc.surface.soft,
  muted: 'text-[var(--slot4-muted-text)]',
  action: 'bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)] hover:opacity-90',
}

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
      { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
      { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place in the library.' },
    { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
    { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or profile-connected boards?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell className={tone.shell}>
      <main className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <ScrollReveal as="div">
            <p className={dc.type.eyebrow}>{pagesContent.contact.eyebrow}</p>
            <h1 className="editable-display mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.25rem]">
              {pagesContent.contact.title}
            </h1>
            <p className={`mt-5 max-w-2xl text-base leading-8 ${tone.muted}`}>{pagesContent.contact.description}</p>

            <div className="mt-10 space-y-4">
              {lanes.map((lane, index) => (
                <ScrollReveal
                  key={lane.title}
                  as="div"
                  delayMs={index * 80}
                  className={`rounded-2xl p-6 ${tone.soft} ${dc.motion.lift}`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)]">
                    <lane.icon className="h-5 w-5 text-[var(--slot4-accent)]" />
                  </span>
                  <h2 className="editable-display mt-4 text-lg font-semibold">{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{lane.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal as="div" delayMs={120} className={`rounded-3xl p-7 md:p-9 ${tone.panel}`}>
            <p className={dc.type.eyebrow}>Get in touch</p>
            <h2 className="editable-display mt-3 text-2xl font-bold tracking-[-0.01em]">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </ScrollReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
