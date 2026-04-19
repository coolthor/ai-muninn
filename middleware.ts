import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware({
  ...routing,
  alternateLinks: false,
})

export default function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') ?? ''
  const pathname = request.nextUrl.pathname

  if (
    accept.includes('text/markdown') &&
    /^\/(en|zh-TW)\/blog\/[a-z0-9-]+$/.test(pathname)
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/api/markdown'
    url.searchParams.set('path', pathname)
    return NextResponse.rewrite(url)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!bpstracker|api|_next|_vercel|.*\\..*).*)',
  ],
}
