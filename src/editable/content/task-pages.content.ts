import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  listing: {
    eyebrow: 'Business directory',
    headline: 'Find a business worth trusting, right in your area.',
    description: 'Every listing includes verified contact details, location, and reviews — built for comparison, not just browsing.',
    filterLabel: 'Filter by business category',
    secondaryNote: 'Compare location, ratings, and contact details before you reach out.',
    chips: ['Verified details', 'Local first', 'Compare & connect'],
  },
  sbm: {
    eyebrow: 'Social bookmarks',
    headline: 'The best links, saved and shared by the community.',
    description: 'Browse hand-picked bookmarks across every topic — tagged, categorized, and searchable so good resources never get lost again.',
    filterLabel: 'Filter by collection',
    secondaryNote: 'Every bookmark is saved by a real member, not a bot feed.',
    chips: ['Community curated', 'Tagged & searchable', 'Always fresh'],
  },
  article: {
    eyebrow: 'Reading desk',
    headline: 'Long-form articles with a calmer editorial rhythm.',
    description: 'Guides, explainers, and story-led posts connected to the wider directory and bookmarking community.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Reading surfaces need space, hierarchy, and fewer distractions.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving classifieds, offers, and time-sensitive posts.',
    description: 'Classified content should feel quick to scan, practical, and action-oriented with less editorial decoration.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Prioritize urgency, short summaries, and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'Profiles with identity, trust, and reputation cues.',
    description: 'Profile pages make people and businesses discoverable rather than buried in a generic feed.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Make identity and credibility visible before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Creator/business cards'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Guides and documents presented as a useful library.',
    description: 'PDF pages feel like downloadable guides, reports, files, and reference material instead of ordinary posts.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Document surfaces need archive cues, file context, and clear browsing.',
    chips: ['Documents', 'Guides', 'Archive ready'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Image posts with a gallery-first browsing experience.',
    description: 'Image pages lead with visual impact, stronger cards, and a portfolio-like rhythm.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
