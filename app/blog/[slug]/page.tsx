import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllSlugs, getPost } from '@/lib/blog'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} — ai-muninn`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: 'article' },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <article>
      {/* breadcrumb */}
      <div className="mb-8 text-xs" style={{ color: 'var(--text-dim)' }}>
        <Link href="/" className="hover:text-[var(--cyan)] transition-colors">~</Link>
        <span className="mx-1">/</span>
        <Link href="/blog" className="hover:text-[var(--cyan)] transition-colors">blog</Link>
        <span className="mx-1">/</span>
        <span>{slug}</span>
      </div>

      {/* meta */}
      <header className="mb-8 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
        {post.series && (
          <p className="text-xs mb-2" style={{ color: 'var(--text-dim)' }}>
            {post.series} · part {post.part}
          </p>
        )}
        <h1 className="text-xl font-semibold leading-snug mb-3" style={{ color: 'var(--cyan)' }}>
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-dim)' }}>
          <span>{post.date}</span>
          <span>{post.readingTime} min read</span>
          {post.tags.slice(0, 4).map(tag => (
            <span key={tag}>#{tag.toLowerCase().replace(/\s+/g, '-')}</span>
          ))}
        </div>
      </header>

      {/* content */}
      <div className="prose">
        <MDXRemote source={post.content} />
      </div>

      {/* footer nav */}
      <div className="mt-12 pt-6 border-t text-sm" style={{ borderColor: 'var(--border)' }}>
        <Link href="/blog" style={{ color: 'var(--text-dim)' }} className="hover:text-[var(--cyan)] transition-colors">
          ← back to blog
        </Link>
      </div>
    </article>
  )
}
