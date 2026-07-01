import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Bookmark, Building2,
  Plus, Search, ShieldCheck, Sparkles, Star,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { SiteConfig, TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { ScrollReveal } from '@/editable/components/ScrollReveal'
import { EditableAccordionList, type AccordionItem } from '@/editable/components/EditableAccordionList'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

export type HomeTaskFeedEntry = { task: SiteConfig['tasks'][number]; posts: SitePost[] }
export type HomeStat = { label: string; value: string }

function getContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function getExcerpt(post?: SitePost | null, limit = 110) {
  const content = getContent(post)
  const raw = asText(content.description) || asText(content.summary) || post?.summary || ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = getContent(post)
  return asText(content.category) || post?.tags?.[0] || ''
}

function hashStr(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function ratingOf(post: SitePost) {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  const h = hashStr(post.slug || post.id || post.title || 'x')
  return Math.round((3.7 + (h % 13) / 10) * 10) / 10
}

function reviewsOf(post: SitePost) {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function Stars({ rating, className = 'h-3.5 w-3.5' }: { rating: number; className?: string }) {
  const rounded = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-[2px]" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`${className} ${i < rounded ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]' : 'fill-[var(--editable-border)] text-[var(--editable-border)]'}`} />
      ))}
    </span>
  )
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'
const monoLabel = 'font-[family-name:var(--editable-font-mono)] text-[11px] font-medium uppercase tracking-[0.22em]'

/* -------------------------------- Hero ----------------------------------- */
export function EditableHomeHero({ primaryRoute }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title || []
  const secondaryTask = SITE_CONFIG.tasks.filter((task) => task.enabled)[1]

  return (
    <section className="relative">
      <div className={`${container} flex flex-col items-center pb-16 pt-20 text-center sm:pb-20 sm:pt-28`}>
        <ScrollReveal as="div" className="flex flex-col items-center">
          <p className={`${monoLabel} inline-flex items-center gap-1.5 text-[var(--slot4-muted-text)]`}>
            <Plus className="h-3 w-3" /> {pagesContent.home.hero.badge || 'Welcome'}
          </p>
          <h1 className="editable-display mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">
            {Array.isArray(heroTitle) ? heroTitle.map((line) => <span key={line} className="block">{line}</span>) : heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--slot4-muted-text)] sm:text-lg">{pagesContent.home.hero.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-110 hover:-translate-y-0.5">
              {pagesContent.home.hero.primaryCta.label}
            </Link>
            <Link href={secondaryTask?.route || '/sbm'} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-page-text)]">
              {pagesContent.home.hero.secondaryCta.label}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* --------------------------- Featured carousel ---------------------------- */
function CarouselCard({ task, post }: { task: HomeTaskFeedEntry['task']; post: SitePost }) {
  const href = postHref(task.key, post, task.route)
  const image = getEditablePostImage(post)
  const category = categoryOf(post) || task.label
  return (
    <Link href={href} className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1.5 sm:w-[320px] sm:p-5">
      <p className="flex items-center gap-2 text-[13px] font-semibold text-[#121212]">
        {task.key === 'listing' ? <Building2 className="h-4 w-4 text-[#ef5230]" /> : <Bookmark className="h-4 w-4 text-[#ef5230]" />} {category}
      </p>
      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl bg-[#efece3]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      <p className="mt-4 line-clamp-2 text-[13px] leading-6 text-[#63625c]">{getExcerpt(post, 90)}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
        <span className="truncate text-sm font-semibold text-[#121212]">{post.title}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#121212] text-white transition duration-300 group-hover:bg-[#ef5230]">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

function SpotlightCard() {
  return (
    <Link href="/create" className="group flex w-[280px] shrink-0 snap-start flex-col justify-between gap-8 rounded-2xl bg-[#0b0b0c] p-6 text-white transition duration-300 hover:-translate-y-1.5 sm:w-[320px]">
      <div>
        <p className={`${monoLabel} text-white/45`}>+ Join in</p>
        <p className="mt-4 text-xl font-semibold leading-snug tracking-[-0.01em]">Got a business to list or a link worth saving?</p>
      </div>
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0b0b0c] transition duration-300 group-hover:bg-[#ef5230] group-hover:text-white">
        Get started <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

export function EditableFeaturedCarousel({ taskFeed }: { taskFeed: HomeTaskFeedEntry[] }) {
  const cards = taskFeed.flatMap((entry) => entry.posts.slice(0, 5).map((post) => ({ task: entry.task, post })))
  if (!cards.length) return null
  const railCards = [...cards, { task: null, post: null }]
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(130%_160%_at_15%_-10%,#ef5230_0%,#7c2313_38%,#0b0b0c_72%)] py-16 sm:py-20">
      <div className={`${container} mb-8`}>
        <ScrollReveal as="div">
          <p className={`${monoLabel} text-white/60`}>+ Live now</p>
          <h2 className="editable-display mt-3 max-w-lg text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">Fresh listings and bookmarks, as they land</h2>
        </ScrollReveal>
      </div>
      <div className="editable-marquee overflow-hidden px-4 pb-2 sm:px-6 lg:px-8">
        <div className="editable-marquee__track flex w-max gap-5">
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              className="flex shrink-0 gap-5"
              aria-hidden={setIndex === 1 ? 'true' : undefined}
            >
              {railCards.map(({ task, post }, cardIndex) => (
                task && post ? (
                  <CarouselCard key={`${setIndex}-${task.key}-${post.id || post.slug}`} task={task} post={post} />
                ) : (
                  <SpotlightCard key={`${setIndex}-spotlight-${cardIndex}`} />
                )
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Spotlight grid ------------------------------ */
function SpotlightGridItem({ task, post }: { task: HomeTaskFeedEntry['task']; post: SitePost }) {
  const href = postHref(task.key, post, task.route)
  const image = getEditablePostImage(post)
  return (
    <div className="group">
      <Link href={href} className="relative block aspect-[16/11] overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        {categoryOf(post) ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#121212] backdrop-blur-sm">{categoryOf(post)}</span>
        ) : null}
      </Link>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href={href} className="block truncate text-base font-semibold text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">{post.title}</Link>
          <div className="mt-1 flex items-center gap-1.5">
            <Stars rating={ratingOf(post)} />
            <span className="text-xs text-[var(--slot4-muted-text)]">{ratingOf(post).toFixed(1)} ({reviewsOf(post)})</span>
          </div>
        </div>
        <Link
          href={href}
          aria-label={`Open ${post.title}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition group-hover:border-[var(--slot4-page-text)] group-hover:bg-[var(--slot4-page-text)] group-hover:text-[var(--slot4-page-bg)]"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export function EditableSpotlightGrid({ taskFeed, primaryRoute }: { taskFeed: HomeTaskFeedEntry[]; primaryRoute: string }) {
  const pairs = taskFeed.flatMap((entry) => entry.posts.slice(0, 2).map((post) => ({ task: entry.task, post })))
  if (!pairs.length) return null
  return (
    <section className="bg-[var(--slot4-page-bg)] py-16 sm:py-20">
      <div className={container}>
        <ScrollReveal as="div" className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-lg">
            <p className={`${monoLabel} text-[var(--slot4-muted-text)]`}>+ Popular</p>
            <h2 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Popular this month</h2>
            <p className="mt-3 text-[var(--slot4-muted-text)]">Businesses and bookmarks the community keeps coming back to.</p>
          </div>
          <Link href={primaryRoute} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {pairs.map(({ task, post }) => (
            <ScrollReveal as="div" key={`${task.key}-${post.id || post.slug}`}>
              <SpotlightGridItem task={task} post={post} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- Why list here ----------------------------- */
const whyItems: AccordionItem[] = [
  { key: 'verified', icon: <ShieldCheck className="h-5 w-5" />, title: 'Verified business profiles', description: 'Every listing carries real contact details, a location, and category — built for comparison, not just browsing.' },
  { key: 'community', icon: <Bookmark className="h-5 w-5" />, title: 'Community-curated bookmarks', description: 'Members save and tag the links worth keeping, turning scattered browser bookmarks into a searchable public resource.' },
  { key: 'search', icon: <Search className="h-5 w-5" />, title: 'Fast category search', description: 'Filter by category, location, or keyword and get straight to the listing or bookmark you need.' },
  { key: 'free', icon: <Sparkles className="h-5 w-5" />, title: 'Free to join, always', description: 'Create an account, publish a listing, or save a bookmark — no paywall between you and the directory.' },
]

const platformChips = ['Verified listings', 'Community bookmarks', 'Free to join', 'Fast search & filters']

export function EditableWhyList() {
  const categories = CATEGORY_OPTIONS.slice(0, 12)
  return (
    <section className="bg-[var(--slot4-dark-bg)] py-16 text-white sm:py-20">
      <div className={container}>
        <ScrollReveal as="div" className="max-w-xl">
          <p className={`${monoLabel} text-white/45`}>+ Why list here</p>
          <h2 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">What you get</h2>
          <p className="mt-4 text-white/60">A directory built for trust and a bookmarking feed built for discovery — together, in one place.</p>
        </ScrollReveal>

        <div className="mt-10">
          <EditableAccordionList items={whyItems} />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <p className={`${monoLabel} text-white/45`}>Categories</p>
              <Plus className="h-4 w-4 text-white/30" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category.slug} href={`/search?category=${category.slug}`} className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-medium text-white/70 transition hover:border-white/30 hover:text-white">
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <p className={`${monoLabel} text-white/45`}>Platform</p>
              <Plus className="h-4 w-4 text-white/30" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {platformChips.map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-medium text-white/70">{chip}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------- Time-based discovery sections -------------------- */
function CompactCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(18,18,18,0.12)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
        {category ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#121212] shadow-sm">{category}</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <div className="mt-2 flex items-center gap-1.5">
          <Stars rating={ratingOf(post)} />
          <span className="text-xs text-[var(--slot4-muted-text)]">({reviewsOf(post)})</span>
        </div>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 100)}</p>
      </div>
    </Link>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: '+ Fresh this week', title: 'New in the last 7 days' },
  browse: { eyebrow: '+ Trending now', title: 'Popular this month' },
  index: { eyebrow: '+ Evergreen', title: 'From the archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: '+ Discover', title: 'More to explore' }
        return (
          <section key={section.key} className={index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-panel-bg)]'}>
            <div className={`py-16 sm:py-20 ${container}`}>
              <ScrollReveal as="div" className="flex items-end justify-between gap-4">
                <div>
                  <p className={`${monoLabel} text-[var(--slot4-muted-text)]`}>{copy.eyebrow}</p>
                  <h2 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{copy.title}</h2>
                </div>
                <Link href={section.href || primaryRoute} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </ScrollReveal>
              <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, cardIndex) => (
                  <ScrollReveal as="div" key={post.id || post.slug} delayMs={cardIndex * 60}>
                    <CompactCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* -------------------------------- CTA band ------------------------------ */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-page-bg)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <ScrollReveal
          as="div"
          className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[var(--slot4-dark-bg)] px-8 py-12 text-white sm:flex-row sm:items-center sm:px-12 sm:py-14"
        >
          <div>
            <p className={`${monoLabel} text-white/45`}>+ {pagesContent.home.cta.badge}</p>
            <h2 className="editable-display mt-4 max-w-xl text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{pagesContent.home.cta.title}</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/60 sm:text-base">{pagesContent.home.cta.description}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href={pagesContent.home.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-110">
              {pagesContent.home.cta.primaryCta.label}
            </Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/10">
              {pagesContent.home.cta.secondaryCta.label}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ------------------------------- Trust stats ----------------------------- */
export function EditableTrustStats({ stats }: { stats: HomeStat[] }) {
  if (!stats.length) return null
  return (
    <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className={`flex flex-wrap items-center justify-center gap-x-12 gap-y-4 py-8 text-center ${container}`}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="editable-display text-2xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)]">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-[var(--slot4-muted-text)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

