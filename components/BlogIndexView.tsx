'use client'

import { useState } from 'react'
import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  series?: string
  part?: number
  readingTime: number
}

interface TagInfo {
  tag: string
  slug: string
  count: number
}

interface SeriesGroup {
  name: string
  posts: BlogPost[]
}

type ViewMode = 'all' | 'series'

function PostRow({ post, locale, showPart, showDescription }: {
  post: BlogPost
  locale: string
  showPart?: boolean
  showDescription?: boolean
}) {
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
        {showDescription && post.description && (
          <p className="text-xs mt-1 leading-relaxed line-clamp-1" style={{ color: 'var(--text-muted)' }}>
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {post.tags.slice(0, 4).map(tag => {
              const tagSlug = tag.toLowerCase().replace(/\s+/g, '-')
              return (
                <Link
                  key={tag}
                  href={`/${locale}/blog/tag/${encodeURIComponent(tagSlug)}`}
                  className="text-xs hover:underline"
                  style={{ color: 'var(--text-dim)' }}
                >
                  #{tagSlug}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </li>
  )
}

export default function BlogIndexView({
  posts,
  groups,
  standalone,
  tags,
  locale,
  isZh,
}: {
  posts: BlogPost[]
  groups: SeriesGroup[]
  standalone: BlogPost[]
  tags: TagInfo[]
  locale: string
  isZh: boolean
}) {
  const [view, setView] = useState<ViewMode>('all')
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
      {/* Header with view toggle */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            <span style={{ color: 'var(--cyan)' }}>❯</span> ls -la ~/blog
          </p>
          <div className="flex gap-3 text-xs">
            <button
              onClick={() => setView('all')}
              className="transition-colors cursor-pointer"
              style={{ color: view === 'all' ? 'var(--cyan)' : 'var(--text-dim)' }}
            >
              [{isZh ? '全部' : 'all'}]
            </button>
            <button
              onClick={() => setView('series')}
              className="transition-colors cursor-pointer"
              style={{ color: view === 'series' ? 'var(--cyan)' : 'var(--text-dim)' }}
            >
              [{isZh ? '按系列' : 'by series'}]
            </button>
          </div>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {totalCount} {isZh ? '篇文章' : `post${totalCount !== 1 ? 's' : ''}`}
          {groups.length > 0 && (
            <span> · {groups.length} {isZh ? '個系列' : 'series'}</span>
          )}
        </p>
      </div>

      {/* Tag filter bar */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          {tags.slice(0, 15).map(t => (
            <Link
              key={t.slug}
              href={`/${locale}/blog/tag/${encodeURIComponent(t.slug)}`}
              className="text-xs px-2 py-0.5 rounded border hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}
            >
              #{t.slug} <span style={{ color: 'var(--text-muted)' }}>({t.count})</span>
            </Link>
          ))}
        </div>
      )}

      {totalCount === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {isZh ? '尚無文章' : 'nothing here yet'}
        </p>
      ) : view === 'all' ? (
        /* Flat list view */
        <ul className="space-y-px">
          {tableHeader}
          {posts.map(post => (
            <PostRow key={post.slug} post={post} locale={locale} showDescription />
          ))}
        </ul>
      ) : (
        /* Series view */
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
                  <PostRow key={post.slug} post={post} locale={locale} showPart showDescription />
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
                  <PostRow key={post.slug} post={post} locale={locale} showDescription />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer stats */}
      <p className="text-xs mt-8 pt-4 border-t" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
        showing {totalCount} {isZh ? '篇文章' : `post${totalCount !== 1 ? 's' : ''}`}
      </p>
    </div>
  )
}
