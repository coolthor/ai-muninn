import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export default function Home() {
  const posts = getAllPosts().slice(0, 5)

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section>
        <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--cyan)' }}>~</span> /home/coolthor
        </p>
        <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--cyan)' }}>
          ai-muninn<span className="cursor" />
        </h1>
        <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--text)' }}>
          Research notes on AI infrastructure, LLM serving, and autonomous agents.
          Things that took too long to figure out, written down so you don&apos;t have to.
        </p>
      </section>

      {/* whoami */}
      <section className="text-sm space-y-2">
        <p style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--cyan)' }}>❯</span> whoami
        </p>
        <div className="pl-4 space-y-1" style={{ color: 'var(--text)' }}>
          <p>hardware enthusiast running 120B models at home on DGX Spark</p>
          <p>building options trading infrastructure with AI agents</p>
          <p>occasionally ships iOS apps</p>
        </div>
      </section>

      {/* Recent posts */}
      {posts.length > 0 && (
        <section>
          <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            <span style={{ color: 'var(--cyan)' }}>❯</span> ls -lt ~/blog | head -5
          </p>
          <ul className="space-y-4">
            {posts.map(post => (
              <li key={post.slug} className="flex items-baseline gap-4">
                <span className="text-xs shrink-0 tabular-nums" style={{ color: 'var(--text-dim)' }}>
                  {post.date}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm hover:text-[var(--cyan-dim)] transition-colors"
                  style={{ color: 'var(--cyan)' }}
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link href="/blog" className="text-xs" style={{ color: 'var(--text-dim)' }}>
              view all posts →
            </Link>
          </div>
        </section>
      )}

      {/* No posts yet */}
      {posts.length === 0 && (
        <section className="text-sm" style={{ color: 'var(--text-dim)' }}>
          <p><span style={{ color: 'var(--cyan)' }}>❯</span> ls ~/blog</p>
          <p className="pl-4 mt-1">no posts yet. first one incoming.</p>
        </section>
      )}
    </div>
  )
}
