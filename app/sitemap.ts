import type { MetadataRoute } from 'next'
import { getAllSlugs, getPost } from '@/lib/blog'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://ai-muninn.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage + blog index for each locale
  for (const locale of routing.locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    })
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
    entries.push({
      url: `${BASE_URL}/${locale}/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    })
  }

  // Blog posts
  // Use en slugs as the canonical set; zh-TW posts have the same slugs
  const slugs = getAllSlugs('en')
  for (const slug of slugs) {
    const post = getPost(slug, 'en')
    const lastModified = post?.updatedAt
      ? new Date(post.updatedAt)
      : post?.date ? new Date(post.date) : new Date()
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  return entries
}
