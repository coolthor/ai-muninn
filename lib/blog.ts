import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog/en')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  series?: string
  part?: number
  readingTime: number
}

export interface BlogPostWithContent extends BlogPost {
  content: string
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))

  return files
    .map(filename => {
      const slug = filename.replace(/\.(mdx|md)$/, '')
      const fullPath = path.join(BLOG_DIR, filename)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(raw)
      const wordCount = content.split(/\s+/).length
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        date: data.date ?? '',
        tags: data.tags ?? [],
        series: data.series,
        part: data.part,
        readingTime: Math.ceil(wordCount / 200),
      }
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPost(slug: string): BlogPostWithContent | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`)
  const mdPath = path.join(BLOG_DIR, `${slug}.md`)
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null

  if (!fullPath) return null

  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)
  const wordCount = content.split(/\s+/).length

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ?? '',
    tags: data.tags ?? [],
    series: data.series,
    part: data.part,
    readingTime: Math.ceil(wordCount / 200),
    content,
  }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(f => f.replace(/\.(mdx|md)$/, ''))
}
