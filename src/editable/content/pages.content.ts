import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Trusted business listings and hand-picked bookmarks',
      description: 'Discover local businesses worth knowing and save the best links worth sharing — one connected directory and bookmarking community.',
      openGraphTitle: 'Trusted business listings and hand-picked bookmarks',
      openGraphDescription: 'Browse verified business listings and curated social bookmarks in one place, built for discovery.',
      keywords: ['business directory', 'listing platform', 'social bookmarking', 'local businesses', 'saved links'],
    },
    hero: {
      badge: 'Directory + bookmarking, one platform',
      title: ['List your business.', 'Save what matters.'],
      description: 'A trusted directory for local businesses and a community-curated home for the links worth saving — search, compare, and save without the noise.',
      primaryCta: { label: 'Browse listings', href: '/listing' },
      secondaryCta: { label: 'Explore bookmarks', href: '/sbm' },
      searchPlaceholder: 'Search businesses, categories, or saved links…',
      focusLabel: 'Focus',
      featureCardBadge: 'live from the community',
      featureCardTitle: 'Every new listing and bookmark shapes what shows up here first.',
      featureCardDescription: 'The homepage always reflects the freshest submissions from real businesses and real savers — no static placeholders.',
    },
    intro: {
      badge: 'How it works',
      title: 'One home for finding a business and saving a resource.',
      paragraphs: [
        `${slot4BrandConfig.siteName} pairs a business directory with a social bookmarking feed, so you can find a plumber down the street and save a great article in the same visit.`,
        'Businesses get a listing page with contact details, location, and reviews. Community members get a place to submit, tag, and rediscover the links they care about.',
        'Everything is searchable and filterable by category, so whether you start from a listing or a bookmark, the next useful thing is always one click away.',
      ],
      sideBadge: 'Built for both sides',
      sidePoints: [
        'Business owners get a clean, trustworthy listing profile.',
        'Members get a fast way to save, tag, and revisit good links.',
        'Category filters keep browsing focused instead of overwhelming.',
        'Every submission is searchable across the whole platform instantly.',
      ],
      primaryLink: { label: 'View the directory', href: '/listing' },
      secondaryLink: { label: 'See saved bookmarks', href: '/sbm' },
    },
    cta: {
      badge: 'Join the community',
      title: 'List your business or start saving the links worth keeping.',
      description: 'Create a free account to publish a listing, submit a bookmark, and keep everything you find in one organized place.',
      primaryCta: { label: 'List your business', href: '/create' },
      secondaryCta: { label: 'Talk to our team', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Fresh submissions from the community, updated continuously.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'Built to make local discovery and link-saving effortless.',
    description: `${slot4BrandConfig.siteName} started as a simple idea: businesses deserve a trustworthy home online, and the best links on the internet deserve a better home than a browser bookmarks folder.`,
    paragraphs: [
      'We bring together a verified business directory and a community bookmarking feed so people can find what they need and save what they love, without switching between five different apps.',
      'Every listing is built for trust — clear contact details, real location data, and space for reviews. Every bookmark is built for discovery — tagged, categorized, and searchable by anyone.',
      'Whether you are a business owner claiming your first listing or a member curating your fiftieth bookmark, the goal is the same: make good things easier to find.',
    ],
    values: [
      {
        title: 'Trust-first listings',
        description: 'Every business profile is structured for clarity — verified details, honest reviews, and no clutter between a visitor and the information they need.',
      },
      {
        title: 'Community-curated bookmarks',
        description: 'Real people save and share the links worth keeping, turning scattered browser bookmarks into a searchable, public resource.',
      },
      {
        title: 'Fast, focused discovery',
        description: 'Category filters, search, and clean card layouts mean you find the right listing or link in seconds, not scrolling for minutes.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Questions about a listing, a bookmark, or your account? We are here.',
    description: 'Tell us what you need help with — claiming a business listing, reporting a bookmark, or something else entirely — and we will route it to the right person.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search listings and bookmarks',
      description: 'Search verified business listings and community-saved bookmarks by keyword, category, or content type.',
    },
    hero: {
      badge: 'Search the platform',
      title: 'Find the listing or bookmark you are looking for.',
      description: 'Search by business name, category, keyword, or topic across every listing and saved link on the platform.',
      placeholder: 'Search by business name, keyword, or category',
    },
    resultsTitle: 'Recently added listings and bookmarks',
  },
  create: {
    metadata: {
      title: 'Add a listing or bookmark',
      description: 'Submit a new business listing or save a bookmark to the community directory.',
    },
    locked: {
      badge: 'Member access',
      title: 'Sign in to add your listing or bookmark.',
      description: 'Create a free account to publish a business listing or submit a bookmark that the whole community can discover.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Add a business listing or save a bookmark.',
      description: 'Pick a content type, add the details, and publish — your submission goes live and becomes searchable right away.',
    },
    formTitle: 'Submission details',
    submitLabel: 'Publish submission',
    successTitle: 'Your submission is live.',
  },
  auth: {
    login: {
      metadataDescription: `Sign in to your ${slot4BrandConfig.siteName} account to manage listings and bookmarks.`,
      badge: 'Welcome back',
      title: 'Sign in to manage your listings and bookmarks.',
      description: 'Access your account to publish new listings, save bookmarks, and keep track of everything you have submitted.',
      formTitle: 'Sign in',
      submitLabel: 'Sign in',
      noAccount: 'We could not match those details. Create an account first, then sign in.',
      success: 'Signed in. Redirecting...',
      createCta: 'Create a free account',
    },
    signup: {
      metadataDescription: `Create a free ${slot4BrandConfig.siteName} account to list a business or save bookmarks.`,
      badge: 'Join the community',
      title: 'Create your account and start publishing.',
      description: 'Sign up free to list your business, save bookmarks, and build a profile the community can discover.',
      formTitle: 'Create your account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for your password.',
      success: 'Account created. Redirecting...',
      loginCta: 'Sign in instead',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Similar listings nearby',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
