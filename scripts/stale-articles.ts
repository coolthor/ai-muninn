/**
 * Lists articles with updatedAt older than N days (default: 30).
 * Run monthly to keep content fresh for AEO (3.2x citation rate for <30 day content).
 *
 * Usage: npx tsx scripts/stale-articles.ts [days]
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog/en')
const MAX_DAYS = parseInt(process.argv[2] ?? '30', 10)
const NOW = Date.now()
const DAY_MS = 86400000

interface StalePost {
  slug: string
  title: string
  updatedAt: string
  daysStale: number
  series?: string
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
const stale: StalePost[] = []

for (const f of files) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8')
  const { data } = matter(raw)
  const dateStr = data.updatedAt ?? data.date ?? ''
  if (!dateStr) continue
  const age = Math.floor((NOW - new Date(dateStr).getTime()) / DAY_MS)
  if (age > MAX_DAYS) {
    stale.push({
      slug: f.replace(/\.(mdx|md)$/, ''),
      title: data.title ?? f,
      updatedAt: dateStr,
      daysStale: age,
      series: data.series,
    })
  }
}

stale.sort((a, b) => b.daysStale - a.daysStale)

if (stale.length === 0) {
  console.log(`✅ All ${files.length} articles updated within ${MAX_DAYS} days.`)
} else {
  console.log(`⚠️  ${stale.length}/${files.length} articles older than ${MAX_DAYS} days:\n`)
  console.log('Days  Updated     Series                Slug')
  console.log('----  ----------  --------------------  ----')
  for (const p of stale) {
    const series = (p.series ?? '').padEnd(20).slice(0, 20)
    console.log(`${String(p.daysStale).padStart(4)}  ${p.updatedAt}  ${series}  ${p.slug}`)
  }
  console.log(`\nTip: Even small updates (add a data point, update a version) reset freshness.`)
}
