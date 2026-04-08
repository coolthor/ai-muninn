export default function TLDRCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="my-8 p-4 rounded-lg text-sm"
      style={{
        background: 'rgba(0, 255, 200, 0.04)',
        border: '1px solid rgba(0, 255, 200, 0.15)',
      }}
    >
      <p
        className="text-xs font-semibold mb-2 tracking-wider"
        style={{ color: 'var(--cyan)', fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        TL;DR
      </p>
      <div style={{ color: 'var(--text-dim)' }}>{children}</div>
    </div>
  )
}
