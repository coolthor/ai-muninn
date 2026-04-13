import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import GithubSlugger from 'github-slugger'
import { getAllSlugs, getPost, hasTranslation, type FaqItem } from '@/lib/blog'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import TLDRCard from '@/components/TLDRCard'
import VideoEmbed from '@/components/VideoEmbed'
import ShareButtons from '@/components/ShareButtons'
import TocSidebar from '@/components/TocSidebar'

const BASE_URL = 'https://ai-muninn.com'

type Locale = (typeof routing.locales)[number]

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    for (const slug of getAllSlugs(locale)) {
      params.push({ locale, slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPost(slug, locale)
  if (!post) return {}

  const url = `${BASE_URL}/${locale}/blog/${slug}`
  const otherLocale = locale === 'en' ? 'zh-TW' : 'en'
  const otherExists = hasTranslation(slug, otherLocale)

  // Extract OG image from first VideoEmbed in content
  const videoMatch = post.content.match(/VideoEmbed\s+src="\/videos\/([^"]+)\.mp4"/)
  const ogImage = videoMatch
    ? `${BASE_URL}/og/${videoMatch[1]}.jpg`
    : undefined

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      languages: {
        'x-default': `${BASE_URL}/en/blog/${slug}`,
        [locale]: url,
        ...(otherExists && {
          [otherLocale]: `${BASE_URL}/${otherLocale}/blog/${slug}`,
        }),
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      locale: locale === 'zh-TW' ? 'zh_TW' : 'en_US',
      ...(otherExists && {
        alternateLocale: locale === 'zh-TW' ? 'en_US' : 'zh_TW',
      }),
      publishedTime: post.date,
      tags: post.tags,
      ...(post.series && { section: post.series }),
      ...(ogImage && { images: [{ url: ogImage, width: 1280, height: 720 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

function JsonLd({ post, url, locale, slug }: {
  post: { title: string; description: string; date: string; updatedAt?: string; tags: string[]; series?: string; part?: number; faq?: FaqItem[] }
  url: string
  locale: string
  slug: string
}) {
  const isZh = locale === 'zh-TW'
  const articleSchema: Record<string, unknown> = {
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    url,
    inLanguage: isZh ? 'zh-TW' : 'en',
    author: {
      '@type': 'Person',
      name: 'coolthor',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'coolthor',
      url: BASE_URL,
    },
    keywords: post.tags.join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.tldr-card', 'article h2:first-of-type + p'],
    },
    ...(post.series && {
      isPartOf: {
        '@type': 'CreativeWorkSeries',
        name: post.series,
        url: `${BASE_URL}/${locale}/blog`,
      },
      position: post.part,
    }),
  }

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isZh ? '首頁' : 'Home',
        item: `${BASE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isZh ? '技術筆記' : 'Blog',
        item: `${BASE_URL}/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  }

  const faqSchema = post.faq?.length ? {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: post.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null

  const graph = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const l = locale as Locale
  const post = getPost(slug, locale)
  if (!post) notFound()

  const otherLocale: Locale = l === 'en' ? 'zh-TW' : 'en'
  const otherExists = hasTranslation(slug, otherLocale)
  const isZh = l === 'zh-TW'
  const url = `${BASE_URL}/${l}/blog/${slug}`

  return (
    <article>
      <JsonLd post={{ title: post.title, description: post.description, date: post.date, updatedAt: post.updatedAt, tags: post.tags, series: post.series, part: post.part, faq: post.faq }} url={url} locale={l} slug={slug} />

      {/* breadcrumb */}
      <div className="mb-8 text-xs" style={{ color: 'var(--text-dim)' }}>
        <Link href={`/${l}`} className="hover:text-[var(--cyan)] transition-colors">~</Link>
        <span className="mx-1">/</span>
        <Link href={`/${l}/blog`} className="hover:text-[var(--cyan)] transition-colors">blog</Link>
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
          {post.updatedAt && post.updatedAt !== post.date && (
            <span style={{ color: 'var(--cyan)', opacity: 0.7 }}>
              {isZh ? `更新於 ${post.updatedAt}` : `updated ${post.updatedAt}`}
            </span>
          )}
          <span>{post.readingTime} {isZh ? '分鐘閱讀' : 'min read'}</span>
          {post.tags.slice(0, 4).map(tag => {
            const tagSlug = tag.toLowerCase().replace(/\s+/g, '-')
            return (
              <Link
                key={tag}
                href={`/${l}/blog/tag/${encodeURIComponent(tagSlug)}`}
                className="hover:underline hover:text-[var(--cyan)] transition-colors"
              >
                #{tagSlug}
              </Link>
            )
          })}
          {otherExists && (
            <Link
              href={`/${otherLocale}/blog/${slug}`}
              className="px-2 py-0.5 border rounded hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
              style={{ borderColor: 'var(--border)' }}
            >
              {otherLocale === 'zh-TW' ? '中文版' : 'English'}
            </Link>
          )}
        </div>
      </header>

      {/* content + sidebar TOC */}
      <div className="relative">
        {(() => {
          const slugger = new GithubSlugger()
          const headings = post.content
            .split('\n')
            .filter(line => /^#{2,3}\s/.test(line))
            .map(line => {
              const level = line.startsWith('### ') ? 3 : 2
              const text = line.replace(/^#{2,3}\s+/, '').replace(/\*\*/g, '')
              const id = slugger.slug(text)
              return { level, text, id }
            })
          if (headings.length < 3) return null
          return (
            <>
              {/* Mobile TOC — inline collapsible */}
              <details className="mb-8 text-xs xl:hidden">
                <summary className="cursor-pointer mb-2" style={{ color: 'var(--text-dim)' }}>
                  <span style={{ color: 'var(--cyan)' }}>❯</span> cat --toc
                </summary>
                <ul className="space-y-1 pl-4" style={{ color: 'var(--text-dim)' }}>
                  {headings.map((h, i) => (
                    <li key={i} style={{ paddingLeft: h.level === 3 ? '1rem' : 0 }}>
                      <a href={`#${h.id}`} className="hover:text-[var(--cyan)] transition-colors">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>

              {/* Desktop TOC — fixed sidebar with active tracking */}
              <TocSidebar headings={headings} />
            </>
          )
        })()}

        {/* content */}
        <div className="prose">
          <MDXRemote source={post.content} components={{ TLDRCard, VideoEmbed }} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
        </div>
      </div>

      {/* FAQ section */}
      {post.faq?.length ? (
        <section className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold mb-6 tracking-wider uppercase" style={{ color: 'var(--cyan)' }}>
            {isZh ? '常見問題' : 'FAQ'}
          </h2>
          <dl className="space-y-6">
            {post.faq.map(({ q, a }, i) => (
              <div key={i}>
                <dt className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{q}</dt>
                <dd className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* share */}
      <div className="mt-12 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <ShareButtons url={url} title={post.title} />
      </div>

      {/* footer nav */}
      <div className="mt-6 text-sm">
        <Link href={`/${l}/blog`} style={{ color: 'var(--text-dim)' }} className="hover:text-[var(--cyan)] transition-colors">
          {isZh ? '← 返回文章列表' : '← back to blog'}
        </Link>
      </div>
    </article>
  )
}
