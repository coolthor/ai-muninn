import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable'

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Permanent 308 redirect for legacy unprefixed /blog/* URLs that Google
  // had already indexed before next-intl middleware was introduced. Without
  // this they return a 307 temporary redirect, which Google treats as the
  // canonical URL and keeps in its index, splitting signal with /en/blog/*.
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/en/blog/:slug*',
        permanent: true,
      },
      // Cross-locale series slug aliases. EN slugs differ from zh-TW because
      // the series names are localized (Ask AI Right ↔ AI 怎麼問,
      // LLM Deep Dive ↔ LLM 深水區). Bots / readers guessing the EN slug
      // under /zh-TW/ would otherwise hit 404.
      {
        source: '/zh-TW/blog/series/ask-ai-right',
        destination: '/zh-TW/blog/series/ai-%E6%80%8E%E9%BA%BC%E5%95%8F',
        permanent: true,
      },
      {
        source: '/zh-TW/blog/series/llm-deep-dive',
        destination: '/zh-TW/blog/series/llm-%E6%B7%B1%E6%B0%B4%E5%8D%80',
        permanent: true,
      },
    ]
  },
  // Long-cache static media. Files in these directories have stable names
  // tied to article slugs — never re-upload with same name expecting an
  // update. If you must bust cache, rename the file or append ?v=N.
  async headers() {
    return [
      { source: '/videos/:path*', headers: [{ key: 'Cache-Control', value: IMMUTABLE_CACHE }] },
      { source: '/og/:path*', headers: [{ key: 'Cache-Control', value: IMMUTABLE_CACHE }] },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: IMMUTABLE_CACHE }] },
      { source: '/favicon-:size.png', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }] },
      { source: '/og-image.png', headers: [{ key: 'Cache-Control', value: IMMUTABLE_CACHE }] },
    ]
  },
}

export default withNextIntl(nextConfig)
