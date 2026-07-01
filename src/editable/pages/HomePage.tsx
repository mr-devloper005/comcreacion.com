import type { Metadata } from 'next'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchHomeTaskFeed, fetchHomeTimeSections, fetchPaginatedTaskPosts, type HomeTimeSection } from '@/lib/task-data'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { pagesContent } from '@/editable/content/pages.content'
import type { SitePost } from '@/lib/site-connector'
import {
  EditableFeaturedCarousel, EditableHomeCta, EditableHomeHero, EditableSpotlightGrid,
  EditableTimeCollections, EditableTrustStats, EditableWhyList, type HomeStat, type HomeTaskFeedEntry,
} from '@/editable/sections/HomeSections'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { Ads } from '@/lib/ads'
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: pagesContent.home.metadata.title,
    description: pagesContent.home.metadata.description,
    openGraphTitle: pagesContent.home.metadata.openGraphTitle,
    openGraphDescription: pagesContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...pagesContent.home.metadata.keywords],
  })
}

function uniquePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

export default async function HomePage() {
  const primaryTask = (SITE_CONFIG.tasks.find((task) => task.enabled)?.key || 'article') as TaskKey
  const primaryRoute = SITE_CONFIG.taskViews[primaryTask] || `/${primaryTask}`
  const taskFeed: HomeTaskFeedEntry[] = await fetchHomeTaskFeed(12, { timeoutMs: 2500 })
  const primaryPosts = uniquePosts(taskFeed.find(({ task }) => task.key === primaryTask)?.posts || taskFeed.flatMap(({ posts }) => posts)).slice(0, 24)
  const timeSections: HomeTimeSection[] = await fetchHomeTimeSections(primaryTask, { limit: 8, timeoutMs: 2500 })
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')

  // Real live counts per enabled task, used for the trust-stats band — no mock numbers.
  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const totals = await Promise.all(
    enabledTasks.map((task) => fetchPaginatedTaskPosts(task.key, { page: 1, limit: 1, category: 'all' }).catch(() => null))
  )
  const stats: HomeStat[] = enabledTasks
    .map((task, index) => ({ label: task.label, total: totals[index]?.pagination?.total || 0 }))
    .filter((entry) => entry.total > 0)
    .map((entry) => ({ label: entry.label, value: `${entry.total}+` }))
  if (CATEGORY_OPTIONS.length) stats.push({ label: 'Categories covered', value: `${CATEGORY_OPTIONS.length}+` })

  return (
    <EditableSiteShell>
      <main>
      <SchemaJsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_CONFIG.name,
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <EditableHomeHero primaryTask={primaryTask} primaryRoute={primaryRoute} posts={primaryPosts} timeSections={timeSections} />
      <EditableTrustStats stats={stats} />
      <div className="mx-auto max-w-6xl px-4 py-6">
  <Ads slot="header" showLabel eager className="mx-auto w-full" />
</div>

      <EditableFeaturedCarousel taskFeed={taskFeed} />
      <EditableSpotlightGrid taskFeed={taskFeed} primaryRoute={primaryRoute} />
      <EditableWhyList />

      <EditableTimeCollections primaryTask={primaryTask} primaryRoute={primaryRoute} posts={primaryPosts} timeSections={timeSections} />
      <div className="mx-auto max-w-6xl px-4 py-6">
  <Ads slot="" showLabel eager className="mx-auto w-full" />
</div>
      <EditableHomeCta />
      </main>
    </EditableSiteShell>
  )
}
