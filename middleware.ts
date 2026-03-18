import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Skip bpstracker callback (OAuth compat), api routes, static files
    '/((?!bpstracker|api|_next|_vercel|.*\\..*).*)',
  ],
}
