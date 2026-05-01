'use client'

interface YouTubeEmbedProps {
  id: string
  caption?: string
  start?: number
}

export default function YouTubeEmbed({ id, caption, start }: YouTubeEmbedProps) {
  const params = start ? `?start=${start}` : ''
  return (
    <div className="my-8">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: '1px solid rgba(0,255,200,0.15)',
          aspectRatio: '16 / 9',
          background: '#0a0a0f',
        }}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}${params}`}
          title={caption || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
      {caption && (
        <p
          className="text-xs text-center mt-2"
          style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          {caption}
        </p>
      )}
    </div>
  )
}
