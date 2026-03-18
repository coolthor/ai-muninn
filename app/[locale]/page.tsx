import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'

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

const ui: Record<Locale, { prompt: string; viewAll: string; noPost: string; whoami: string[] }> = {
  en: {
    prompt: '❯ ls -lt ~/blog | head -5',
    viewAll: 'view all posts →',
    noPost: 'no posts yet. first one incoming.',
    whoami: [
      'hardware enthusiast running 120B models at home on DGX Spark',
      'building options trading infrastructure with AI agents',
      'occasionally ships iOS apps',
    ],
  },
  'zh-TW': {
    prompt: '❯ ls -lt ~/blog | head -5',
    viewAll: '查看全部文章 →',
    noPost: '還沒有文章，第一篇即將發布。',
    whoami: [
      '在家用 DGX Spark 跑 120B 模型的硬體愛好者',
      '用 AI Agent 建造期權交易基礎設施',
      '偶爾也會上架 iOS App',
    ],
  },
}

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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const posts = getAllPosts(locale).slice(0, 5)
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

      {posts.length > 0 ? (
        <section>
          <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            <span style={{ color: 'var(--cyan)' }}>❯</span> {t.prompt}
          </p>
          <ul className="space-y-4">
            {posts.map(post => (
              <li key={post.slug} className="flex items-baseline gap-4">
                <span className="text-xs shrink-0 tabular-nums" style={{ color: 'var(--text-dim)' }}>
                  {post.date}
                </span>
                <Link
                  href={`/${l}/blog/${post.slug}`}
                  className="text-sm hover:text-[var(--cyan-dim)] transition-colors"
                  style={{ color: 'var(--cyan)' }}
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link href={`/${l}/blog`} className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {t.viewAll}
            </Link>
          </div>
        </section>
      ) : (
        <section className="text-sm" style={{ color: 'var(--text-dim)' }}>
          <p><span style={{ color: 'var(--cyan)' }}>❯</span> ls ~/blog</p>
          <p className="pl-4 mt-1">{t.noPost}</p>
        </section>
      )}
    </div>
  )
}
