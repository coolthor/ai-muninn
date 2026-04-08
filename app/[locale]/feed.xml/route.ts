import { Feed } from 'feed'
import { getAllPosts } from '@/lib/blog'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://ai-muninn.com'

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  const isZh = locale === 'zh-TW'
  const posts = getAllPosts(locale)

  const feed = new Feed({
    title: isZh ? 'ai-muninn 技術筆記' : 'ai-muninn',
    description: isZh
      ? 'AI 推理基礎設施踩坑記錄：DGX Spark、vLLM、本地 AI Agent。'
      : 'Notes on AI inference infrastructure: DGX Spark, vLLM, local AI agents.',
    id: `${BASE_URL}/${locale}/blog`,
    link: `${BASE_URL}/${locale}/blog`,
    language: locale,
    favicon: `${BASE_URL}/favicon-192x192.png`,
    copyright: `${new Date().getFullYear()} coolthor`,
    feedLinks: {
      rss2: `${BASE_URL}/${locale}/feed.xml`,
    },
    author: {
      name: 'coolthor',
      link: BASE_URL,
    },
  })

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${BASE_URL}/${locale}/blog/${post.slug}`,
      link: `${BASE_URL}/${locale}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
      category: post.tags.map(tag => ({ name: tag })),
    })
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
