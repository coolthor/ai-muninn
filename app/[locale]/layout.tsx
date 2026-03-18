import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Link from 'next/link'
import LangSwitcher from '@/components/LangSwitcher'

export const metadata: Metadata = {
  title: { default: 'ai-muninn', template: '%s — ai-muninn' },
  description: 'Research notes on AI infrastructure, LLM serving, and autonomous agents.',
  openGraph: { siteName: 'ai-muninn', type: 'website' },
  alternates: {
    canonical: 'https://ai-muninn.com/en',
    languages: {
      'en': 'https://ai-muninn.com/en',
      'zh-TW': 'https://ai-muninn.com/zh-TW',
    },
  },
}

type Locale = (typeof routing.locales)[number]

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as Locale)) notFound()

  return (
    <>
      <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4 sm:px-6">
          <header className="py-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <nav className="flex items-center justify-between">
              <Link href={`/${locale}`} className="text-sm font-semibold" style={{ color: 'var(--cyan)' }}>
                ~/ai-muninn
              </Link>
              <div className="flex items-center gap-5 text-sm" style={{ color: 'var(--text-dim)' }}>
                <Link href={`/${locale}/blog`} className="hover:text-[var(--cyan)] transition-colors">
                  blog
                </Link>
                <a href="https://github.com/coolthor" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">
                  github
                </a>
                <LangSwitcher currentLocale={locale} />
              </div>
            </nav>
          </header>

          <main className="flex-1 py-10">{children}</main>

          <footer className="py-6 border-t text-xs flex items-center gap-3" style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}>
            <span style={{ color: 'var(--cyan)' }}>coolthor</span>
            <span>·</span>
            <a href="https://github.com/coolthor" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">github</a>
            <span>·</span>
            <a href="https://www.linkedin.com/in/%E5%AD%90%E5%93%B2-%E6%9E%97-65300a9a/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">linkedin</a>
            <span>·</span>
            <a href="https://bpstracker.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">bpstracker</a>
            <span>·</span>
            <span>built in public · {new Date().getFullYear()}</span>
          </footer>
        </div>
    </>
  )
}
