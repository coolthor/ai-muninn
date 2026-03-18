import { Link } from '@/i18n/navigation'
import { getAllPosts } from '@/lib/blog'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'blog' }

type Locale = (typeof routing.locales)[number]

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const posts = getAllPosts(locale)
  const isZh = l === 'zh-TW'

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--cyan)' }}>❯</span> ls -lt ~/blog
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
                  href={`/blog/${post.slug}`}
                  locale={l}
                  className="text-sm group-hover:text-[var(--cyan-dim)] transition-colors leading-snug"
                  style={{ color: 'var(--cyan)' }}
                >
                  {post.title}
                </Link>
                {post.series && (
                  <span className="ml-2 text-xs" style={{ color: 'var(--text-dim)' }}>
                    [{post.series} pt.{post.part}]
                  </span>
                )}
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
          ))}
        </ul>
      )}
    </div>
  )
}
