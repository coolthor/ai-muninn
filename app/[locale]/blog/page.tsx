import { getAllPosts, getAllTags } from '@/lib/blog'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import type { BlogPost } from '@/lib/blog'
import BlogIndexView from '@/components/BlogIndexView'

type Locale = (typeof routing.locales)[number]

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh-TW'
  const canonical = `https://ai-muninn.com/${locale}/blog`

  return {
    title: isZh ? '技術筆記' : 'Blog',
    description: isZh
      ? 'AI 推理基礎設施踩坑記錄：DGX Spark、SM121、vLLM、本地 AI Agent。每篇都是實際跑過、踩過、修過的。'
      : 'Notes on AI inference infrastructure: DGX Spark, SM121, vLLM, local AI agents. Debugging stories and working solutions.',
    alternates: {
      canonical,
      languages: {
        'en': 'https://ai-muninn.com/en/blog',
        'zh-TW': 'https://ai-muninn.com/zh-TW/blog',
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      locale: isZh ? 'zh_TW' : 'en_US',
      alternateLocale: isZh ? ['en_US'] : ['zh_TW'],
      images: [{ url: '/og-image.png' }],
    },
  }
}

type SeriesGroup = { name: string; posts: BlogPost[] }

function groupBySeries(posts: BlogPost[]): { groups: SeriesGroup[]; standalone: BlogPost[] } {
  const seriesMap = new Map<string, BlogPost[]>()
  const standalone: BlogPost[] = []

  for (const post of posts) {
    if (post.series) {
      if (!seriesMap.has(post.series)) seriesMap.set(post.series, [])
      seriesMap.get(post.series)!.push(post)
    } else {
      standalone.push(post)
    }
  }

  const groups: SeriesGroup[] = []
  for (const [name, seriesPosts] of seriesMap) {
    groups.push({
      name,
      posts: seriesPosts.sort((a, b) => (a.part ?? 0) - (b.part ?? 0)),
    })
  }

  groups.sort((a, b) => {
    const aDate = a.posts[0]?.date ?? ''
    const bDate = b.posts[0]?.date ?? ''
    return aDate > bDate ? -1 : 1
  })

  return { groups, standalone }
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh-TW'
  const posts = getAllPosts(locale)
  const tags = getAllTags(locale)
  const { groups, standalone } = groupBySeries(posts)

  return (
    <BlogIndexView
      posts={posts}
      groups={groups}
      standalone={standalone}
      tags={tags}
      locale={locale}
      isZh={isZh}
    />
  )
}
