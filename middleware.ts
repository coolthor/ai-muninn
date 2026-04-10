import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// alternateLinks: false — HTML head already emits correct canonical/hreflang.
// The auto-generated HTTP Link header added an x-default pointing at the
// unprefixed /blog/:slug path, which Google then indexed as a separate URL
// alongside /en/blog/:slug, splitting ranking signal and tanking CTR.
export default createMiddleware({
  ...routing,
  alternateLinks: false,
})

export const config = {
  matcher: [
    // Skip bpstracker callback (OAuth compat), api routes, static files
    '/((?!bpstracker|api|_next|_vercel|.*\\..*).*)',
  ],
}
