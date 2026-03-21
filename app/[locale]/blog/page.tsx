import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import type { BlogPost } from '@/lib/blog'

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

  // Sort groups by earliest post date
  groups.sort((a, b) => {
    const aDate = a.posts[0]?.date ?? ''
    const bDate = b.posts[0]?.date ?? ''
    return aDate > bDate ? -1 : 1
  })

  return { groups, standalone }
}

function PostRow({ post, locale, showPart }: { post: BlogPost; locale: string; showPart?: boolean }) {
  return (
    <li className="flex items-baseline gap-4 py-2 group">
      <span className="w-24 shrink-0 text-xs tabular-nums" style={{ color: 'var(--text-dim)' }}>
        {post.date}
      </span>
      <span className="w-16 shrink-0 text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
        {post.readingTime}m
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          {showPart && post.part != null && (
            <span className="text-xs shrink-0 tabular-nums" style={{ color: 'var(--text-dim)' }}>
              {post.part}.
            </span>
          )}
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className="text-sm group-hover:text-[var(--cyan-dim)] transition-colors leading-snug"
            style={{ color: 'var(--cyan)' }}
          >
            {post.title}
          </Link>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {post.tags.slice(0, 4).map(tag => (
              <span key={tag} className="text-xs" style={{ color: 'var(--text-dim)' }}>
                #{tag.toLowerCase().replace(/\s+/g, '-')}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const posts = getAllPosts(locale)
  const isZh = l === 'zh-TW'
  const { groups, standalone } = groupBySeries(posts)
  const totalCount = posts.length

  const tableHeader = (
    <li className="flex gap-4 pb-2 mb-2 text-xs border-b" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
      <span className="w-24 shrink-0">{isZh ? '日期' : 'date'}</span>
      <span className="w-16 shrink-0 hidden sm:block">{isZh ? '閱讀' : 'read'}</span>
      <span>{isZh ? '標題' : 'title'}</span>
    </li>
  )

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--cyan)' }}>❯</span> ls -lt ~/blog
        </p>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {totalCount} {isZh ? '篇文章' : `post${totalCount !== 1 ? 's' : ''}`}
          {groups.length > 0 && (
            <span> · {groups.length} {isZh ? '個系列' : `series`}</span>
          )}
        </p>
      </div>

      {totalCount === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {isZh ? '尚無文章' : 'nothing here yet'}
        </p>
      ) : (
        <div className="space-y-10">
          {groups.map(group => (
            <div key={group.name}>
              <p className="text-xs mb-3 flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>
                <span style={{ color: 'var(--cyan)' }}>▸</span>
                <span style={{ color: 'var(--text-muted)' }}>{group.name}</span>
                <span>({group.posts.length})</span>
              </p>
              <ul className="space-y-px">
                {tableHeader}
                {group.posts.map(post => (
                  <PostRow key={post.slug} post={post} locale={l} showPart />
                ))}
              </ul>
            </div>
          ))}

          {standalone.length > 0 && (
            <div>
              {groups.length > 0 && (
                <p className="text-xs mb-3 flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>
                  <span style={{ color: 'var(--cyan)' }}>▸</span>
                  <span style={{ color: 'var(--text-muted)' }}>{isZh ? '其他' : 'standalone'}</span>
                </p>
              )}
              <ul className="space-y-px">
                {tableHeader}
                {standalone.map(post => (
                  <PostRow key={post.slug} post={post} locale={l} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
