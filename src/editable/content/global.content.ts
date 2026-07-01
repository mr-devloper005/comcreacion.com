import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Business directory & social bookmarking',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Directory & bookmarking',
    primaryLinks: [
      { label: 'Listings', href: '/listing' },
      { label: 'Bookmarks', href: '/sbm' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Join free', href: '/signup' },
      secondary: { label: 'Submit', href: '/create' },
    },
  },
  footer: {
    tagline: 'Business listings and saved bookmarks, in one place',
    description: 'A trusted directory for local businesses paired with a community-curated bookmarking feed — search, compare, and save without the noise.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Business directory', href: '/listing' },
          { label: 'Social bookmarks', href: '/sbm' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'A trusted place to list, discover and save what matters.',
  },
  commonLabels: {
    readMore: 'View details',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
