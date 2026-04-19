import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

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
}

export default withNextIntl(nextConfig)
