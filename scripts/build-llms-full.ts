/**
 * Generates /public/llms-full.txt — all EN articles concatenated into one markdown file.
 * AI tools (Claude, ChatGPT, Cursor) can load this as full-site context.
 *
 * Run: npx tsx scripts/build-llms-full.ts
 * Should also run as part of the build step.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog/en')
const OUT_PATH = path.join(process.cwd(), 'public/llms-full.txt')
const BASE_URL = 'https://ai-muninn.com'

interface Post {
  slug: string
  title: string
  date: string
  series?: string
  part?: number
  content: string
}

function loadPosts(): Post[] {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
  return files.map(f => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8')
    const { data, content } = matter(raw)
    return {
      slug: f.replace(/\.(mdx|md)$/, ''),
      title: data.title ?? f,
      date: data.date ?? '',
      series: data.series,
      part: data.part,
      content: content
        .replace(/<TLDRCard>/g, '')
        .replace(/<\/TLDRCard>/g, '')
        .replace(/<VideoEmbed[^/]*\/>/g, '')
        .trim(),
    }
  }).sort((a, b) => (a.date > b.date ? -1 : 1))
}

function build() {
  const posts = loadPosts()
  const lines: string[] = [
    '# ai-muninn — Full Site Content',
    `# ${BASE_URL}`,
    `# Generated: ${new Date().toISOString().split('T')[0]}`,
    `# Articles: ${posts.length}`,
    '',
    'This file contains the full text of all articles on ai-muninn.com.',
    'It is intended for AI tools that need complete site context.',
    'For the article index only, see /llms.txt.',
    '',
  ]

  for (const post of posts) {
    lines.push('---')
    lines.push('')
    lines.push(`# ${post.title}`)
    lines.push(`URL: ${BASE_URL}/en/blog/${post.slug}`)
    lines.push(`Date: ${post.date}`)
    if (post.series) lines.push(`Series: ${post.series}${post.part != null ? ` (Part ${post.part})` : ''}`)
    lines.push('')
    lines.push(post.content)
    lines.push('')
  }

  fs.writeFileSync(OUT_PATH, lines.join('\n'), 'utf8')
  const size = (fs.statSync(OUT_PATH).size / 1024).toFixed(0)
  console.log(`✓ llms-full.txt generated: ${posts.length} articles, ${size} KB`)
}

build()
