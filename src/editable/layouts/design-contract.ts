import type { CSSProperties } from 'react'

export const editableRootStyle = {
  // Reference-matched system: warm cream/off-white surfaces, near-black text,
  // a single confident orange-red accent, and dedicated near-black "dark
  // band" sections for contrast (services, footer wordmark backdrop, nav
  // pill). Flat, no page-wide gradients — the only gradient is a scoped
  // accent band used for the featured-work carousel.
  '--slot4-page-bg': '#f3f1ea',
  '--slot4-page-text': '#121212',
  '--slot4-panel-bg': '#ece8de',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#63625c',
  '--slot4-soft-muted-text': '#8a887f',
  '--slot4-accent': '#ef5230',
  '--slot4-accent-fill': '#ef5230',
  '--slot4-accent-soft': '#fce2d8',
  '--slot4-on-accent': '#ffffff',
  '--slot4-dark-bg': '#0b0b0c',
  '--slot4-dark-text': '#f5f4f1',
  '--slot4-media-bg': '#e7e3d8',
  '--slot4-cream': '#f3f1ea',
  '--slot4-warm': '#ece8de',
  '--slot4-lavender': '#ffffff',
  '--slot4-gray': '#ece8de',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f3f1ea',
  '--editable-page-text': '#121212',
  '--editable-container': '1360px',
  '--editable-border': 'rgba(18,18,18,0.1)',
  '--editable-nav-bg': '#0b0b0c',
  '--editable-nav-text': '#f5f4f1',
  '--editable-nav-active': '#ef5230',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#ef5230',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#f3f1ea',
  '--editable-footer-text': '#121212',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_10px_30px_rgba(18,18,18,0.08)]',
  shadowStrong: 'shadow-[0_24px_70px_rgba(18,18,18,0.14)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-28',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[140px] shrink-0 snap-start sm:w-[160px]',
  },
  type: {
    eyebrow: 'inline-flex items-center gap-1.5 font-[family-name:var(--editable-font-mono)] text-xs font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]',
    heroTitle: 'text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]',
    sectionTitle: 'text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]',
    body: 'text-[17px] leading-8',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-2xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-2xl ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-semibold tracking-[0.01em] text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-semibold tracking-[0.01em] text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] hover:-translate-y-0.5 active:scale-[0.98]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full ${editablePalette.accentBg} px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]`,
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    ratio: 'aspect-[2/3]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(18,18,18,0.16)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing, like a premium creative-agency reference layout.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
