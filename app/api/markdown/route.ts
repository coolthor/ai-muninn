import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_ROOT = path.join(process.cwd(), 'content/blog')

export function GET(request: NextRequest) {
  const pagePath = request.nextUrl.searchParams.get('path') ?? ''

  if (pagePath === '/') {
    const llmsPath = path.join(process.cwd(), 'public/llms.txt')
    if (!fs.existsSync(llmsPath)) {
      return new NextResponse('Not found', { status: 404 })
    }
    const content = fs.readFileSync(llmsPath, 'utf8')
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'x-markdown-tokens': String(Math.ceil(content.split(/\s+/).length * 1.3)),
      },
    })
  }

  const match = pagePath.match(/^\/(en|zh-TW)\/blog\/([a-z0-9-]+)$/)
  if (!match) {
    return new NextResponse('Not found', { status: 404 })
  }

  const [, locale, slug] = match
  const mdxPath = path.join(BLOG_ROOT, locale, `${slug}.mdx`)
  const mdPath = path.join(BLOG_ROOT, locale, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null

  if (!filePath) {
    return new NextResponse('Not found', { status: 404 })
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  const header = [
    `# ${data.title}`,
    '',
    data.description ? `> ${data.description}` : '',
    '',
    `Date: ${data.date}`,
    data.updatedAt ? `Updated: ${data.updatedAt}` : '',
    data.tags?.length ? `Tags: ${data.tags.join(', ')}` : '',
    data.series ? `Series: ${data.series}${data.part != null ? ` — Part ${data.part}` : ''}` : '',
    `Source: https://ai-muninn.com${pagePath}`,
    '',
    '---',
    '',
  ].filter(Boolean).join('\n')

  const markdown = header + content
  const tokenEstimate = Math.ceil(markdown.split(/\s+/).length * 1.3)

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(tokenEstimate),
    },
  })
}
