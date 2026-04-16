import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://ai-muninn.com'

type Locale = (typeof routing.locales)[number]

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh-TW'
  const url = `${BASE_URL}/${locale}/methodology`

  return {
    title: isZh ? '寫作方法論' : 'Methodology',
    description: isZh
      ? 'ai-muninn 的寫作方法論：AI 協助產出、實機驗證、邀請指正。'
      : 'How this blog works — AI-assisted drafts, hand-verified data, lab-notebook mode.',
    alternates: {
      canonical: url,
      languages: {
        'x-default': `${BASE_URL}/en/methodology`,
        'en': `${BASE_URL}/en/methodology`,
        'zh-TW': `${BASE_URL}/zh-TW/methodology`,
      },
    },
    openGraph: {
      title: isZh ? '寫作方法論 — ai-muninn' : 'Methodology — ai-muninn',
      url,
      type: 'article',
      locale: isZh ? 'zh_TW' : 'en_US',
    },
  }
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const l = locale as Locale
  if (!routing.locales.includes(l)) notFound()
  const isZh = l === 'zh-TW'

  const rows: [string, string][] = isZh
    ? [
        ['實驗、benchmark、初稿', 'AI 協助產出'],
        ['數據、數字、bug 紀錄', '實機跑、我的硬體'],
        ['判斷、結論', '我自己，交叉驗證'],
        ['錯誤處理', 'lab notebook > textbook'],
      ]
    : [
        ['experiments, benchmarks, drafts', 'AI-assisted'],
        ['data, numbers, bug reports', 'actual runs, my hardware'],
        ['judgments, conclusions', 'mine, cross-verified'],
        ['error handling', 'lab notebook > textbook'],
      ]

  return (
    <article>
      {/* breadcrumb */}
      <div className="mb-8 text-xs" style={{ color: 'var(--text-dim)' }}>
        <Link href={`/${l}`} className="hover:text-[var(--cyan)] transition-colors">~</Link>
        <span className="mx-1">/</span>
        <span>methodology</span>
      </div>

      {/* header */}
      <header className="mb-8 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl font-semibold leading-snug mb-2 font-mono" style={{ color: 'var(--cyan)' }}>
          $ cat methodology.txt
        </h1>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {isZh ? '這個 blog 是怎麼寫的' : 'How this blog works'}
        </p>
      </header>

      {/* terminal block */}
      <div className="font-mono text-xs leading-relaxed">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          {rows.map(([label, value], i) => (
            <div key={i} className="contents">
              <div style={{ color: 'var(--cyan)' }}>- {label}:</div>
              <div style={{ color: 'var(--text-dim)' }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8" style={{ color: 'var(--text-dim)' }}>
          {isZh ? '看到哪裡怪怪的？可能真的是錯的，幫我指正。' : 'spot something wrong? probably is. ping me.'}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2" style={{ color: 'var(--text-dim)' }}>
          <a
            href="https://github.com/coolthor"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--cyan)] transition-colors"
          >
            github.com/coolthor
          </a>
          <span>·</span>
          <a
            href="https://www.linkedin.com/in/%E5%AD%90%E5%93%B2-%E6%9E%97-65300a9a/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--cyan)] transition-colors"
          >
            linkedin
          </a>
        </div>
      </div>

      {/* footer nav */}
      <div className="mt-12 pt-6 border-t text-sm" style={{ borderColor: 'var(--border)' }}>
        <Link href={`/${l}`} style={{ color: 'var(--text-dim)' }} className="hover:text-[var(--cyan)] transition-colors">
          {isZh ? '← 回首頁' : '← back home'}
        </Link>
      </div>
    </article>
  )
}
