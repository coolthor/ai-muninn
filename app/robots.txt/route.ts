import { NextResponse } from 'next/server'

const ROBOTS_TXT = `User-Agent: *
Allow: /

User-Agent: GPTBot
Allow: /

User-Agent: OAI-SearchBot
Allow: /

User-Agent: ClaudeBot
Allow: /

User-Agent: Claude-Web
Allow: /

User-Agent: PerplexityBot
Allow: /

User-Agent: GoogleOther
Allow: /

User-Agent: Googlebot
Allow: /

Sitemap: https://ai-muninn.com/sitemap.xml

Content-Signal: ai-train=no, search=yes, ai-input=yes
`

export function GET() {
  return new NextResponse(ROBOTS_TXT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
