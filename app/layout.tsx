import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ai-muninn — AI research & infra deep dives',
  description: 'Personal research blog — AI agents, LLM infrastructure, and technical findings by coolthor.',
  openGraph: {
    siteName: 'ai-muninn',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body>
        <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4 sm:px-6">
          <header className="py-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-sm font-semibold tracking-wide" style={{ color: 'var(--cyan)' }}>
                ~/ai-muninn
              </Link>
              <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-dim)' }}>
                <Link href="/blog" className="hover:text-[var(--cyan)] transition-colors">blog</Link>
                <a href="https://github.com/coolthor" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">github</a>
              </div>
            </nav>
          </header>

          <main className="flex-1 py-10">
            {children}
          </main>

          <footer className="py-6 border-t text-xs flex items-center gap-3" style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}>
            <span style={{ color: 'var(--cyan)' }}>coolthor</span>
            <span>·</span>
            <a href="https://github.com/coolthor" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">github</a>
            <span>·</span>
            <a href="https://www.linkedin.com/in/%E5%AD%90%E5%93%B2-%E6%9E%97-65300a9a/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">linkedin</a>
            <span>·</span>
            <span>built in public · {new Date().getFullYear()}</span>
          </footer>
        </div>
      </body>
    </html>
  )
}
