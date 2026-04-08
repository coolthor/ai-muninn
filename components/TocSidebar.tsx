'use client'

import { useEffect, useState } from 'react'

interface Heading {
  level: number
  text: string
  id: string
}

export default function TocSidebar({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const headingEls = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    if (headingEls.length === 0) return

    function onScroll() {
      let current = ''
      for (const el of headingEls) {
        if (el.getBoundingClientRect().top <= 100) {
          current = el.id
        } else {
          break
        }
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [headings])

  return (
    <nav
      className="hidden xl:block fixed w-52"
      style={{
        top: '6rem',
        right: 'max(1rem, calc((100vw - 48rem) / 2 - 16rem))',
        maxHeight: 'calc(100vh - 8rem)',
        overflowY: 'auto',
      }}
    >
      <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
        <span style={{ color: 'var(--cyan)' }}>❯</span> toc
      </p>
      <ul className="space-y-1.5 text-xs">
        {headings.map((h, i) => {
          const isActive = activeId === h.id
          return (
            <li key={i} style={{ paddingLeft: h.level === 3 ? '0.75rem' : 0 }}>
              <a
                href={`#${h.id}`}
                className="block leading-snug truncate transition-all duration-200 hover:text-[var(--cyan)] hover:pl-1"
                title={h.text}
                style={{
                  color: isActive ? 'var(--cyan)' : 'var(--text-dim)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
