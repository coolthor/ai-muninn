'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const labels: Record<string, string> = { en: '中', 'zh-TW': 'EN' }

export default function LangSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname()
  const targetLocale = currentLocale === 'en' ? 'zh-TW' : 'en'
  // pathname = /en/blog/slug → /zh-TW/blog/slug
  const targetPath = pathname.replace(new RegExp(`^/${currentLocale}(/|$)`), `/${targetLocale}$1`)

  return (
    <Link
      href={targetPath}
      className="text-xs px-2 py-0.5 border rounded transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
      style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}
      title={`Switch to ${targetLocale}`}
    >
      {labels[currentLocale]}
    </Link>
  )
}
