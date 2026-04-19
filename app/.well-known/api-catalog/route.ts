import { NextResponse } from 'next/server'

const CATALOG = {
  linkset: [
    {
      anchor: 'https://ai-muninn.com/',
      'service-doc': [
        {
          href: 'https://ai-muninn.com/llms.txt',
          type: 'text/plain',
        },
        {
          href: 'https://ai-muninn.com/llms-full.txt',
          type: 'text/plain',
        },
      ],
      index: [
        {
          href: 'https://ai-muninn.com/sitemap.xml',
          type: 'application/xml',
        },
      ],
      alternate: [
        {
          href: 'https://ai-muninn.com/en/feed.xml',
          type: 'application/rss+xml',
        },
        {
          href: 'https://ai-muninn.com/zh-TW/feed.xml',
          type: 'application/rss+xml',
        },
      ],
    },
  ],
}

export function GET() {
  return NextResponse.json(CATALOG, {
    headers: { 'Content-Type': 'application/linkset+json' },
  })
}
