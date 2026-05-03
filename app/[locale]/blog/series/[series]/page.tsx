import Link from 'next/link'
import { getAllSeries, getPostsBySeries } from '@/lib/blog'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Locale = (typeof routing.locales)[number]

export const dynamicParams = false

export function generateStaticParams() {
  const params: { locale: string; series: string }[] = []
  for (const locale of routing.locales) {
    for (const { slug } of getAllSeries(locale)) {
      params.push({ locale, series: slug })
    }
  }
  return params
}

function resolveSeriesName(locale: string, slug: string): string | null {
  const match = getAllSeries(locale).find(s => s.slug === slug)
  return match?.name ?? null
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; series: string }> }
): Promise<Metadata> {
  const { locale, series } = await params
  const isZh = locale === 'zh-TW'
  const seriesSlug = decodeURIComponent(series)
  const name = resolveSeriesName(locale, seriesSlug)
  if (!name) notFound()
  const posts = getPostsBySeries(locale, seriesSlug)

  return {
    title: isZh ? `${name} — 系列文章` : `${name} — Series`,
    description: isZh
      ? `${posts.length} 篇 ${name} 系列文章`
      : `${posts.length} post${posts.length !== 1 ? 's' : ''} in the ${name} series`,
    alternates: {
      canonical: `https://ai-muninn.com/${locale}/blog/series/${seriesSlug}`,
      languages: {
        'en': `https://ai-muninn.com/en/blog/series/${seriesSlug}`,
        'zh-TW': `https://ai-muninn.com/zh-TW/blog/series/${seriesSlug}`,
      },
    },
  }
}

export default async function SeriesPage({ params }: { params: Promise<{ locale: string; series: string }> }) {
  const { locale, series } = await params
  const l = locale as Locale
  const isZh = l === 'zh-TW'
  const seriesSlug = decodeURIComponent(series)
  const name = resolveSeriesName(locale, seriesSlug)
  if (!name) notFound()
  const posts = getPostsBySeries(locale, seriesSlug)

  return (
    <div>
      <div className="mb-2">
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          <Link href={`/${l}/blog`} className="hover:underline" style={{ color: 'var(--text-dim)' }}>
            ~ / blog
          </Link>
          {' / '}
          <span style={{ color: 'var(--cyan)' }}>series / {name}</span>
        </p>
      </div>

      <div className="mb-8">
        <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--cyan)' }}>❯</span> ls ~/blog/series/{seriesSlug}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {posts.length} {isZh ? '篇文章' : `post${posts.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {isZh ? '尚無文章' : 'nothing here yet'}
        </p>
      ) : (
        <ul className="space-y-px">
          <li className="flex gap-4 pb-2 mb-2 text-xs border-b" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
            <span className="w-12 shrink-0">{isZh ? '#' : 'part'}</span>
            <span className="w-24 shrink-0">{isZh ? '日期' : 'date'}</span>
            <span className="w-16 shrink-0 hidden sm:block">{isZh ? '閱讀' : 'read'}</span>
            <span>{isZh ? '標題' : 'title'}</span>
          </li>
          {posts.map(post => (
            <li key={post.slug} className="flex items-baseline gap-4 py-2 group">
              <span className="w-12 shrink-0 text-xs tabular-nums" style={{ color: 'var(--text-dim)' }}>
                {post.part != null ? post.part : '·'}
              </span>
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
                {post.description && (
                  <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                    {post.description}
                  </p>
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
