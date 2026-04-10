'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface SearchResult {
  url: string
  title: string
  excerpt: string
}

export default function Search({ locale }: { locale: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const pagefindRef = useRef<{ search: (q: string) => Promise<{ results: Array<{ data: () => Promise<{ url: string; meta: { title: string }; excerpt: string }> }> }> } | null>(null)

  useEffect(() => {
    async function load() {
      try {
        // @ts-expect-error pagefind is loaded from static files
        const pf = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js')
        await pf.init()
        pagefindRef.current = pf
      } catch {
        // Pagefind not available (dev mode)
      }
    }
    load()
  }, [])

  const doSearch = useCallback(async (q: string) => {
    if (!pagefindRef.current || q.length < 2) {
      setResults([])
      return
    }
    const search = await pagefindRef.current.search(q)
    const items = await Promise.all(
      search.results.slice(0, 8).map(async (r) => {
        const data = await r.data()
        return {
          url: data.url.replace(/\.html$/, '').replace(/^\//, '/'),
          title: data.meta?.title ?? '',
          excerpt: data.excerpt ?? '',
        }
      })
    )
    // Filter to current locale
    setResults(items.filter(r => r.url.includes(`/${locale}/`)))
  }, [locale])

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 200)
    return () => clearTimeout(timer)
  }, [query, doSearch])

  const isZh = locale === 'zh-TW'

  return (
    <div className="mb-6">
      <div
        className="flex items-center gap-2 text-xs px-3 py-2 rounded-md"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        <span style={{ color: 'var(--cyan)' }}>❯</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={isZh ? '搜尋文章...' : 'search posts...'}
          className="flex-1 bg-transparent outline-none text-xs"
          style={{ color: 'var(--text)' }}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setQuery('')
              setResults([])
            }
          }}
        />
      </div>

      {results.length > 0 && (
        <ul className="mt-3 space-y-3">
          {results.map(r => (
            <li key={r.url}>
              <a
                href={r.url}
                className="block group"
              >
                <span
                  className="text-sm group-hover:text-[var(--cyan-dim)] transition-colors"
                  style={{ color: 'var(--cyan)' }}
                >
                  {r.title}
                </span>
                <p
                  className="text-xs mt-0.5 line-clamp-2"
                  style={{ color: 'var(--text-muted)' }}
                  dangerouslySetInnerHTML={{ __html: r.excerpt }}
                />
              </a>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 2 && results.length === 0 && (
        <p className="text-xs mt-3" style={{ color: 'var(--text-dim)' }}>
          {isZh ? '沒有找到相關文章' : 'no matches found'}
        </p>
      )}
    </div>
  )
}
