import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware({
  ...routing,
  alternateLinks: false,
})

const LINK_HEADER = '</llms.txt>; rel="service-doc", </sitemap.xml>; rel="index", </.well-known/api-catalog>; rel="api-catalog"'

export default function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') ?? ''
  const pathname = request.nextUrl.pathname

  if (accept.includes('text/markdown')) {
    if (/^\/(en|zh-TW)\/blog\/[a-z0-9-]+$/.test(pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/api/markdown'
      url.searchParams.set('path', pathname)
      return NextResponse.rewrite(url)
    }

    if (pathname === '/' || /^\/(en|zh-TW)\/?$/.test(pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/api/markdown'
      url.searchParams.set('path', '/')
      return NextResponse.rewrite(url)
    }
  }

  const response = intlMiddleware(request)

  if (pathname === '/' || /^\/(en|zh-TW)$/.test(pathname)) {
    response.headers.set('Link', LINK_HEADER)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!bpstracker|api|_next|_vercel|.*\\..*).*)',
  ],
}
