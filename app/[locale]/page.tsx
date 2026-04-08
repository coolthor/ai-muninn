import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import type { BlogPost } from '@/lib/blog'
import Search from '@/components/Search'

const BASE_URL = 'https://ai-muninn.com'

type Locale = (typeof routing.locales)[number]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'en' ? 'zh-TW' : 'en'
  return {
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        [locale]: `${BASE_URL}/${locale}`,
        [otherLocale]: `${BASE_URL}/${otherLocale}`,
      },
    },
    openGraph: {
      url: `${BASE_URL}/${locale}`,
      locale: locale === 'zh-TW' ? 'zh_TW' : 'en_US',
      alternateLocale: locale === 'zh-TW' ? 'en_US' : 'zh_TW',
    },
  }
}

const CONCEPT_SERIES = new Set(['AI 怎麼問', 'Ask AI Right', 'LLM 101'])

function splitByCategory(posts: BlogPost[]): { concepts: BlogPost[]; fieldNotes: BlogPost[] } {
  const concepts: BlogPost[] = []
  const fieldNotes: BlogPost[] = []
  for (const post of posts) {
    if (post.series && CONCEPT_SERIES.has(post.series)) {
      concepts.push(post)
    } else {
      fieldNotes.push(post)
    }
  }
  return { concepts, fieldNotes }
}

const ui = {
  en: {
    whoami: [
      'hardware enthusiast running 120B models at home on DGX Spark',
      'building options trading infrastructure with AI agents',
      'occasionally ships iOS apps',
    ],
    concepts: { title: 'Concepts & Methods', sub: 'For those who want to understand how AI works' },
    fieldNotes: { title: 'Field Notes', sub: 'For those who run models and debug the hard way' },
    viewAll: 'view all posts →',
    noPost: 'no posts yet. first one incoming.',
  },
  'zh-TW': {
    whoami: [
      '在家用 DGX Spark 跑 120B 模型的硬體愛好者',
      '用 AI Agent 建造期權交易基礎設施',
      '偶爾也會上架 iOS App',
    ],
    concepts: { title: '概念與方法 (Concepts)', sub: '給想理解 AI 怎麼運作的人' },
    fieldNotes: { title: '實戰紀錄 (Field Notes)', sub: '給在跑模型、踩過坑的人' },
    viewAll: '查看全部文章 →',
    noPost: '還沒有文章，第一篇即將發布。',
  },
} as const

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'coolthor',
  url: BASE_URL,
  sameAs: [
    'https://github.com/coolthor',
    'https://www.linkedin.com/in/%E5%AD%90%E5%93%B2-%E6%9E%97-65300a9a/',
  ],
  description: 'AI infrastructure engineer. Runs 120B models at home, builds options trading systems with AI agents.',
}

function PostList({ posts, locale, max }: { posts: BlogPost[]; locale: string; max: number }) {
  const shown = posts.slice(0, max)
  return (
    <ul className="space-y-4">
      {shown.map(post => (
        <li key={post.slug} className="flex items-baseline gap-4">
          <span className="text-xs shrink-0 tabular-nums" style={{ color: 'var(--text-dim)' }}>
            {post.date}
          </span>
          <div className="min-w-0">
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="text-sm hover:text-[var(--cyan-dim)] transition-colors"
              style={{ color: 'var(--cyan)' }}
            >
              {post.title}
            </Link>
            {post.description && (
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                {post.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const allPosts = getAllPosts(locale)
  const totalCount = allPosts.length
  const { concepts, fieldNotes } = splitByCategory(allPosts)
  const t = ui[l] ?? ui.en

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <section>
        <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--cyan)' }}>~</span> /home/coolthor
        </p>
        <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--cyan)' }}>
          ai-muninn<span className="cursor" />
        </h1>
        <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--text)' }}>
          {l === 'zh-TW'
            ? 'AI 基礎設施、LLM 部署與自主 Agent 的研究筆記。那些花了太長時間才搞懂的事，寫下來讓你不用重踩。'
            : 'Research notes on AI infrastructure, LLM serving, and autonomous agents. Things that took too long to figure out, written down so you don\'t have to.'}
        </p>
      </section>

      <section className="text-sm space-y-2">
        <p style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--cyan)' }}>❯</span> whoami
        </p>
        <div className="pl-4 space-y-1" style={{ color: 'var(--text)' }}>
          {t.whoami.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </section>

      <Search locale={locale} />

      {totalCount === 0 ? (
        <section className="text-sm" style={{ color: 'var(--text-dim)' }}>
          <p><span style={{ color: 'var(--cyan)' }}>❯</span> ls ~/blog</p>
          <p className="pl-4 mt-1">{t.noPost}</p>
        </section>
      ) : (
        <>
          {/* 概念與方法 */}
          {concepts.length > 0 && (
            <section>
              <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
                <span style={{ color: 'var(--cyan)' }}>❯</span> cat ~/blog/{l === 'zh-TW' ? '概念' : 'concepts'}
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                {t.concepts.title}
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
                {t.concepts.sub}
              </p>
              <PostList posts={concepts} locale={l} max={5} />
            </section>
          )}

          {/* 實戰紀錄 */}
          {fieldNotes.length > 0 && (
            <section>
              <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
                <span style={{ color: 'var(--cyan)' }}>❯</span> cat ~/blog/{l === 'zh-TW' ? '實戰' : 'field-notes'}
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                {t.fieldNotes.title}
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
                {t.fieldNotes.sub}
              </p>
              <PostList posts={fieldNotes} locale={l} max={5} />
            </section>
          )}

          {/* Footer */}
          <div>
            <Link href={`/${l}/blog`} className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {l === 'zh-TW'
                ? `共 ${totalCount} 篇文章 · ${t.viewAll}`
                : `${totalCount} posts total · ${t.viewAll}`}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
