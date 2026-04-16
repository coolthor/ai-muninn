const KOFI_URL = 'https://ko-fi.com/coolthor'

const CoffeeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </svg>
)

export default function CoffeeCard({ locale }: { locale: string }) {
  const isZh = locale === 'zh-TW'

  return (
    <aside
      className="mt-10 p-4 border rounded text-xs"
      style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}
    >
      <div className="mb-2 font-mono" style={{ color: 'var(--cyan)' }}>
        <span>❯</span> echo &quot;thanks for reading&quot;
      </div>
      <p className="leading-relaxed mb-3">
        {isZh
          ? '這篇有幫到你的話，可以請我喝杯咖啡。訂閱費直接進 GPU 時數和 API credits，讓下一篇繼續寫得下去。'
          : 'If this saved you time, you can buy me a coffee — goes straight into GPU hours and API credits so the next post keeps coming.'}
      </p>
      <a
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-1.5 border rounded transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)] focus:outline-none focus-visible:border-[var(--cyan)] focus-visible:text-[var(--cyan)]"
        style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}
      >
        <CoffeeIcon />
        {isZh ? '請我喝咖啡 · ko-fi' : 'Buy me a coffee · ko-fi'}
      </a>
    </aside>
  )
}
