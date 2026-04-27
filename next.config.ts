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
