import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, Phone, Search, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { ScrollReveal } from '@/editable/components/ScrollReveal'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
// Plain-text lead intro, but only when it isn't just a duplicate of the body
// (some posts store the full HTML body in `summary`, which would render twice).
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

// Yelp-style red star rating row. Uses real rating/review fields when present,
// otherwise a stable derived value (wire to real data when available).
const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function DetailMeta({ post, category, center = false }: { post: SitePost; category?: string; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-[18px] w-[18px] ${i < filled ? 'fill-[var(--tk-accent)] text-[var(--tk-accent)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">{reviewsOf(post)} reviews</span>
      {category ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" />
          <span className="text-sm text-[var(--tk-muted)]">{category}</span>
        </>
      ) : null}
    </div>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-50" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

// ----- Article: a quiet, centred reading column -----
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <ScrollReveal as="article" className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
        <BackLink task="article" />
        <p className="mt-10 text-xs font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">{categoryOf(post, 'Article')}</p>
        <h1 className="editable-display mt-5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">{post.title}</h1>
        <div className="mt-6 text-sm text-[var(--tk-muted)]">
          <span>{SITE_CONFIG.name}</span>
        </div>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </ScrollReveal>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

// ----- Listing: immersive service-style business profile -----
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0] || '/placeholder.svg?height=900&width=1600'
  const showcaseImage = images[1] || images[0] || '/placeholder.svg?height=720&width=1280'
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const category = categoryOf(post, 'Services')
  const intro = leadText(post) || stripHtml(summaryText(post)) || 'A verified business profile with useful details, contact paths, and supporting information in one focused view.'
  const services = listingServices(post, category)

  return (
    <>
      <section className="bg-[#f4f4f2] px-4 pb-14 pt-4 text-[#080808] sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[620px] max-w-[1880px] overflow-hidden rounded-2xl bg-[#d9d9d6] shadow-[0_34px_95px_rgba(0,0,0,0.16)]">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,244,242,0.82)_0%,rgba(244,244,242,0.5)_45%,rgba(244,244,242,0.78)_100%)]" />
          <div className="relative flex min-h-[620px] items-end justify-center px-5 py-12 sm:px-8 lg:items-center lg:justify-start lg:px-[18vw]">
            <ScrollReveal as="article" className="w-full max-w-[650px] rounded-2xl border border-white/75 bg-white/[0.88] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="font-[family-name:var(--editable-font-mono)] text-[13px] font-medium uppercase tracking-[0.18em] text-black">+ {category}</p>
                <span className="rounded-full bg-[#f3f3f1] px-4 py-2 text-xs font-semibold text-black shadow-sm">{category}</span>
              </div>
              <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-black sm:text-5xl">{post.title}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-black/[0.78]">{intro}</p>
              <div className="mt-6">
                {website ? (
                  <Link href={website} target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#f1543d] px-6 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:brightness-105">
                    Visit Business Website
                  </Link>
                ) : phone ? (
                  <a href={`tel:${phone}`} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#f1543d] px-6 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:brightness-105">Call This Business</a>
                ) : (
                  <Link href="/contact" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#f1543d] px-6 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:brightness-105">Contact Us</Link>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ListingActionRail website={website} phone={phone} email={email} />

      <section className="bg-[#f4f4f2] px-6 py-14 text-[#080808] sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[230px_minmax(0,760px)]">
          <aside className="hidden pt-1 lg:block">
            <p className="font-[family-name:var(--editable-font-mono)] text-sm uppercase tracking-[0.18em] text-black">+ Introduction</p>
          </aside>
          <article className="min-w-0">
            <div className="mb-10 flex flex-wrap justify-center gap-x-2 gap-y-1 rounded-full bg-white/[0.35] px-4 py-2 text-center text-xs font-medium text-black shadow-[0_18px_60px_rgba(0,0,0,0.06)] sm:text-sm">
              {services.slice(0, 6).map((service, index) => (
                <span key={`${service}-${index}`}>{service}{index < Math.min(services.length, 6) - 1 ? ' +' : ''}</span>
              ))}
            </div>
            <BodyContent post={post} />
            <ListingInfoStrip address={address} phone={phone} email={email} website={website} />
            <ListingServicesPanel services={services} />
            <ListingImageGallery images={images} title={post.title} />
            <ListingProjectShowcase title={post.title} image={showcaseImage} />
          </article>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} />
    </>
  )
}

function listingServices(post: SitePost, category: string) {
  const content = getContent(post)
  const sources = [content.services, content.tools, content.specialties, post.tags]
  const values = sources
    .flatMap((source) => Array.isArray(source) ? source : [])
    .map((item) => typeof item === 'string' ? item.trim() : '')
    .filter(Boolean)
  return Array.from(new Set([category, ...values])).filter(Boolean).slice(0, 10)
}

function ListingActionRail({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  return (
    <aside className="fixed bottom-6 right-5 z-30 hidden w-[315px] space-y-3 xl:block">
      {website ? <ListingRailLink href={website} label="Open Website" icon={<Globe2 className="h-5 w-5" />} dark /> : null}
      {phone ? <ListingRailLink href={`tel:${phone}`} label="Call Business" icon={<Phone className="h-5 w-5" />} /> : null}
      {email ? <ListingRailLink href={`mailto:${email}`} label="Send Email" icon={<Mail className="h-5 w-5" />} /> : null}
      <ListingRailLink href="/listing" label="More Listings" icon={<Building2 className="h-5 w-5" />} />
    </aside>
  )
}

function ListingRailLink({ href, label, icon, dark = false }: { href: string; label: string; icon: React.ReactNode; dark?: boolean }) {
  const external = /^https?:\/\//i.test(href)
  const className = `group flex min-h-12 items-center gap-4 rounded-xl px-4 text-sm font-semibold uppercase tracking-[0.08em] shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 ${dark ? 'bg-black text-white' : 'bg-white text-[#07122e]'}`
  const content = (
    <>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-white text-black' : 'bg-[#f3f3f1] text-black'}`}>{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition group-hover:rotate-45 ${dark ? 'bg-white text-black' : 'bg-[#f3f3f1] text-black'}`}><ArrowUpRight className="h-4 w-4" /></span>
    </>
  )
  if (external) return <Link href={href} target="_blank" rel="noreferrer" className={className}>{content}</Link>
  return <a href={href} className={className}>{content}</a>
}

function ListingInfoStrip({ address, phone, email, website }: { address?: string; phone?: string; email?: string; website?: string }) {
  const items = [
    { label: 'Location', value: address, icon: MapPin },
    { label: 'Phone', value: phone, icon: Phone, href: phone ? `tel:${phone}` : '' },
    { label: 'Email', value: email, icon: Mail, href: email ? `mailto:${email}` : '' },
    { label: 'Website', value: website, icon: Globe2, href: website },
  ].filter((item) => item.value)
  if (!items.length) return null
  return (
    <div className="mt-12 grid gap-3 sm:grid-cols-2">
      {items.map(({ label, value, icon: Icon, href }) => (
        <div key={label} className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm">
          <p className="flex items-center gap-2 font-[family-name:var(--editable-font-mono)] text-xs uppercase tracking-[0.14em] text-black/55"><Icon className="h-4 w-4 text-[#f1543d]" /> {label}</p>
          {href ? (
            <Link href={href} target={/^https?:\/\//i.test(href) ? '_blank' : undefined} rel={/^https?:\/\//i.test(href) ? 'noreferrer' : undefined} className="mt-2 block break-words text-sm font-semibold leading-6 text-black underline decoration-black/20 underline-offset-4 transition hover:decoration-black">
              {value}
            </Link>
          ) : (
            <p className="mt-2 break-words text-sm font-medium leading-6 text-black">{value}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function ListingServicesPanel({ services }: { services: string[] }) {
  const colors = ['bg-[#f1543d]', 'bg-[#9b5cff]', 'bg-[#35b9ee]', 'bg-[#19c98b]', 'bg-black', 'bg-[#8b73ff]', 'bg-[#f2bd4d]']
  if (!services.length) return null
  return (
    <section className="mt-16 rounded-2xl bg-black p-6 text-white shadow-[0_34px_95px_rgba(0,0,0,0.18)] sm:p-7">
      <div className="flex items-center justify-between border-b border-white/75 pb-5">
        <h2 className="font-[family-name:var(--editable-font-mono)] text-sm uppercase tracking-[0.12em]">Services & tags</h2>
        <span className="text-2xl leading-none">+</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {services.map((service, index) => (
          <span key={`${service}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-black">
            <span className={`h-3.5 w-3.5 rounded-full ${colors[index % colors.length]}`} />
            {service}
          </span>
        ))}
      </div>
    </section>
  )
}

function ListingImageGallery({ images, title }: { images: string[]; title: string }) {
  if (images.length <= 1) return null
  return (
    <section className="mt-14">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-[family-name:var(--editable-font-mono)] text-sm uppercase tracking-[0.12em] text-black">Images</h2>
        <span className="text-sm font-medium text-black/50">{images.length} visuals</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {images.slice(0, 6).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt={`${title} image ${index + 1}`} className="aspect-[4/3] w-full rounded-2xl border-[5px] border-white bg-white object-cover shadow-sm" loading="lazy" />
        ))}
      </div>
    </section>
  )
}

function ListingProjectShowcase({ title, image }: { title: string; image: string }) {
  return (
    <section className="mt-14 overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative aspect-[16/6.5] min-h-[250px] overflow-hidden rounded-2xl border-[6px] border-white bg-black">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/[0.18]">
          <span className="rounded-full bg-black/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">{title}</span>
        </div>


      </div>
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/20 text-black"><ArrowUpRight className="h-4 w-4" /></span>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Ads slot="in-feed" showLabel eager className="mx-auto w-full" />
      </div>
    </section>
  )
}
// ----- Classified: price-forward notice with a sticky action rail -----
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-6 py-14 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-7 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 shadow-[0_22px_60px_rgba(18,18,18,0.14)]">
            <Kicker task="classified">Classified</Kicker>
            <h1 className="editable-display mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em]">{post.title}</h1>
            <DetailMeta post={post} category={getField(post, ['category'])} />
            <p className="editable-display mt-6 text-4xl font-semibold tracking-[-0.03em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:opacity-90"><Phone className="h-4 w-4" /> Call now</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

// ----- Image: a dark, gallery-led canvas -----
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-8">
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]"><Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Image story</div>
            <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

// ----- Bookmark: no-image curated resource detail -----
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const category = categoryOf(post, 'Saved resource')
  const intro = leadText(post) || stripHtml(summaryText(post)) || 'A community-saved resource with context, topic tags, and a direct path to the original link.'
  const tags = bookmarkTags(post, category)

  return (
    <>
      <section className="bg-[#f4f4f2] px-4 pb-14 pt-4 text-[#080808] sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[560px] max-w-[1880px] overflow-hidden rounded-2xl border border-black/5 bg-[#ece9e2] shadow-[0_34px_95px_rgba(0,0,0,0.12)]">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.8)_0%,rgba(244,244,242,0.92)_46%,rgba(226,221,210,0.86)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
          <div className="relative flex min-h-[560px] items-end justify-center px-5 py-12 sm:px-8 lg:items-center lg:justify-start lg:px-[18vw]">
            <ScrollReveal as="article" className="w-full max-w-[650px] rounded-2xl border border-white/80 bg-white/[0.9] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.10)] backdrop-blur-md sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="font-[family-name:var(--editable-font-mono)] text-[13px] font-medium uppercase tracking-[0.18em] text-black">+ {category}</p>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white"><Bookmark className="h-4 w-4" /></span>
              </div>
              <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-black sm:text-5xl">{post.title}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-black/[0.78]">{intro}</p>
              {website ? (
                <Link href={website} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f1543d] px-6 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:brightness-105">
                  Open saved resource <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
            </ScrollReveal>
          </div>
        </div>
      </section>

      <BookmarkActionRail website={website} />

      <section className="bg-[#f4f4f2] px-6 py-14 text-[#080808] sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[230px_minmax(0,760px)]">
          <aside className="hidden pt-1 lg:block">
            <p className="font-[family-name:var(--editable-font-mono)] text-sm uppercase tracking-[0.18em] text-black">+ Resource notes</p>
          </aside>
          <article className="min-w-0">
            <div className="mb-10 flex flex-wrap justify-center gap-x-2 gap-y-1 rounded-full bg-white/[0.35] px-4 py-2 text-center text-xs font-medium text-black shadow-[0_18px_60px_rgba(0,0,0,0.06)] sm:text-sm">
              {tags.slice(0, 6).map((tag, index) => (
                <span key={`${tag}-${index}`}>{tag}{index < Math.min(tags.length, 6) - 1 ? ' +' : ''}</span>
              ))}
            </div>
            <BodyContent post={post} />
            <BookmarkResourcePanel website={website} category={category} />
            <ListingServicesPanel services={tags} />
          </article>
        </div>
      </section>

      <BookmarkRelatedStrip related={related} />
    </>
  )
}

function bookmarkTags(post: SitePost, category: string) {
  const content = getContent(post)
  const sources = [content.category ? [content.category] : [], content.topic ? [content.topic] : [], post.tags]
  const values = sources
    .flatMap((source) => Array.isArray(source) ? source : [])
    .map((item) => typeof item === 'string' ? item.trim() : '')
    .filter(Boolean)
  return Array.from(new Set([category, ...values])).filter(Boolean).slice(0, 10)
}

function BookmarkActionRail({ website }: { website?: string }) {
  return (
    <aside className="fixed bottom-6 right-5 z-30 hidden w-[315px] space-y-3 xl:block">
      {website ? <ListingRailLink href={website} label="Open Resource" icon={<ExternalLink className="h-5 w-5" />} dark /> : null}
      <ListingRailLink href="/sbm" label="More Bookmarks" icon={<Bookmark className="h-5 w-5" />} />
      <ListingRailLink href="/search?task=sbm" label="Search Bookmarks" icon={<Search className="h-5 w-5" />} />
    </aside>
  )
}

function BookmarkResourcePanel({ website, category }: { website?: string; category: string }) {
  return (
    <section className="mt-12 rounded-2xl border border-black/10 bg-white/70 p-5 shadow-sm sm:p-6">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Ads slot="in-feed" showLabel eager className="mx-auto w-full" />
      </div>
      {website ? (
        <Link href={website} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
          <span className="min-w-0 truncate">{website}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0" />
        </Link>
      ) : null}
    </section>
  )
}

function BookmarkRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  return (
    <section className="border-t border-black/10 bg-[#f4f4f2] px-6 py-14 text-[#080808] sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-black">More saved resources</h2>
          <Link href="/sbm" className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => {
            const href = `${getTaskConfig('sbm')?.route || '/sbm'}/${item.slug}`
            return (
              <Link key={item.id || item.slug} href={href} className="group flex min-h-[190px] flex-col justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
                <div>
                  <p className="font-[family-name:var(--editable-font-mono)] text-xs uppercase tracking-[0.14em] text-black/45">Saved link</p>
                  <h3 className="mt-4 line-clamp-3 text-lg font-semibold leading-tight text-black">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">{stripHtml(summaryText(item))}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-black transition group-hover:text-[#f1543d]">Open <ArrowUpRight className="h-4 w-4" /></span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
// ----- PDF: a document workspace -----
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-8">
      <BackLink task="pdf" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[var(--tk-radius)] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><FileText className="h-9 w-9" /></div>
            <div className="min-w-0">
              <Kicker task="pdf">{categoryOf(post, 'Document')}</Kicker>
              <h1 className="editable-display mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-4xl">{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-10 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                <span className="text-sm font-semibold">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-xs font-semibold text-[var(--tk-on-accent)] transition hover:opacity-90">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-[var(--tk-raised)]" />
            </div>
          ) : null}
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {fileUrl ? (
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-sm font-semibold">Get this document</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Open or download the full file in a new tab.</p>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:opacity-90">Download <Download className="h-4 w-4" /></Link>
            </div>
          ) : null}
          <RelatedPanel task="pdf" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

// ----- Profile: identity-first with a sticky portrait -----
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-8">
        <BackLink task="profile" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center shadow-[0_22px_60px_rgba(18,18,18,0.14)]">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">{post.title}</h1>
              {role ? <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
              <DetailMeta post={post} center />
              <ContactAction website={website} email={email} bare />
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

// ----- Shared building blocks -----
function Divider() {
  return <div className="my-10 h-px bg-[var(--tk-line)]" />
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]"><Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}</div>
          <p className="mt-2 break-words text-sm font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:opacity-90">Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]"><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="font-medium uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">About this post</p>
        <div className="mt-4 grid gap-2.5 text-sm text-[var(--tk-muted)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--tk-accent)]" /> {taskConfig?.label || task}</p>
          <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name}</p>
        </div>
      </div>
      {related.length ? (
        <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="editable-display text-lg font-semibold tracking-[-0.02em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-accent)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-16 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-2xl font-semibold tracking-[-0.02em]">More {(taskConfig?.label || 'posts').toLowerCase()}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  // Build the detail URL from the task route (e.g. /listing/<slug>) — the same
  // base the archive cards use. buildPostUrl() can fall back to /posts when the
  // task isn't in the enabled taskViews map, which 404s.
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-300 hover:-translate-y-1">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
        </div>
        <div className="p-5">
          <h3 className="editable-display line-clamp-2 text-base font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-xl border border-[var(--tk-line)] p-3 transition hover:border-[var(--tk-accent)]">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--tk-raised)]"><FileText className="h-5 w-5 text-[var(--tk-muted)]" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}

