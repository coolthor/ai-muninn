import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_ROOT = path.join(process.cwd(), 'content/blog')

function blogDir(locale: string) {
  return path.join(BLOG_ROOT, locale)
}

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

function parseFile(filePath: string, slug: string): BlogPost {
  const raw = fs.readFileSync(filePath, 'utf8')
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
}

export function getAllPosts(locale = 'en'): BlogPost[] {
  const dir = blogDir(locale)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(filename => parseFile(path.join(dir, filename), filename.replace(/\.(mdx|md)$/, '')))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPost(slug: string, locale = 'en'): BlogPostWithContent | null {
  const dir = blogDir(locale)
  const mdxPath = path.join(dir, `${slug}.mdx`)
  const mdPath = path.join(dir, `${slug}.md`)
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

export function getAllSlugs(locale = 'en'): string[] {
  const dir = blogDir(locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(f => f.replace(/\.(mdx|md)$/, ''))
}

/** Returns true if a translation exists for the given slug + locale */
export function hasTranslation(slug: string, locale: string): boolean {
  const dir = blogDir(locale)
  return fs.existsSync(path.join(dir, `${slug}.mdx`)) || fs.existsSync(path.join(dir, `${slug}.md`))
}
