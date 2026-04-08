import Link from 'next/link'
import { getAllTags, getPostsByTag } from '@/lib/blog'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'

type Locale = (typeof routing.locales)[number]

export function generateStaticParams() {
  const params: { locale: string; tag: string }[] = []
  for (const locale of routing.locales) {
    for (const { slug } of getAllTags(locale)) {
      params.push({ locale, tag: slug })
    }
  }
  return params
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; tag: string }> }
): Promise<Metadata> {
  const { locale, tag } = await params
  const isZh = locale === 'zh-TW'
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(locale, decodedTag)

  return {
    title: isZh ? `#${decodedTag} — 技術筆記` : `#${decodedTag} — Blog`,
    description: isZh
      ? `${posts.length} 篇關於 #${decodedTag} 的文章`
      : `${posts.length} post${posts.length !== 1 ? 's' : ''} tagged #${decodedTag}`,
    alternates: {
      canonical: `https://ai-muninn.com/${locale}/blog/tag/${tag}`,
      languages: {
        'en': `https://ai-muninn.com/en/blog/tag/${tag}`,
        'zh-TW': `https://ai-muninn.com/zh-TW/blog/tag/${tag}`,
      },
    },
  }
}

export default async function TagPage({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag } = await params
  const l = locale as Locale
  const isZh = l === 'zh-TW'
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(locale, decodedTag)

  return (
    <div>
      <div className="mb-2">
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          <Link href={`/${l}/blog`} className="hover:underline" style={{ color: 'var(--text-dim)' }}>
            ~ / blog
          </Link>
          {' / '}
          <span style={{ color: 'var(--cyan)' }}>tag / {decodedTag}</span>
        </p>
      </div>

      <div className="mb-8">
        <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--cyan)' }}>❯</span> grep -r &quot;#{decodedTag}&quot; ~/blog
        </p>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {posts.length} {isZh ? '篇文章' : `match${posts.length !== 1 ? 'es' : ''}`}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {isZh ? '沒有找到相關文章' : 'no matches found'}
        </p>
      ) : (
        <ul className="space-y-px">
          <li className="flex gap-4 pb-2 mb-2 text-xs border-b" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
            <span className="w-24 shrink-0">{isZh ? '日期' : 'date'}</span>
            <span className="w-16 shrink-0 hidden sm:block">{isZh ? '閱讀' : 'read'}</span>
            <span>{isZh ? '標題' : 'title'}</span>
          </li>
          {posts.map(post => (
            <li key={post.slug} className="flex items-baseline gap-4 py-2 group">
              <span className="w-24 shrink-0 text-xs tabular-nums" style={{ color: 'var(--text-dim)' }}>
                {post.date}
              </span>
              <span className="w-16 shrink-0 text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                {post.readingTime}m
              </span>
              <div className="min-w-0">
                <Link
                  href={`/${l}/blog/${post.slug}`}
                  className="text-sm group-hover:text-[var(--cyan-dim)] transition-colors leading-snug"
                  style={{ color: 'var(--cyan)' }}
                >
                  {post.title}
                </Link>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {post.tags.slice(0, 4).map(t => {
                      const tSlug = t.toLowerCase().replace(/\s+/g, '-')
                      return (
                        <Link
                          key={t}
                          href={`/${l}/blog/tag/${encodeURIComponent(tSlug)}`}
                          className="text-xs hover:underline"
                          style={{ color: tSlug === decodedTag ? 'var(--cyan)' : 'var(--text-dim)' }}
                        >
                          #{tSlug}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link
          href={`/${l}/blog`}
          className="text-xs hover:underline"
          style={{ color: 'var(--text-dim)' }}
        >
          ← {isZh ? '回到所有文章' : 'back to all posts'}
        </Link>
      </div>
    </div>
  )
}
