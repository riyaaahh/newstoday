import { ImageResponse } from 'next/og'

// Branded default social card. Used as the OpenGraph image for pages without a
// hero image. Kept Latin-only on purpose: Satori (the renderer) does not shape
// Malayalam conjuncts reliably, so per-article cards use the hero image instead.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #14171a 0%, #2a2f36 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 84, fontWeight: 800 }}>
          <span>News</span>
          <span style={{ color: '#c1121f' }}>Today</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 36, color: '#c9ced4' }}>
          Malayalam news · കേരളം · India · World
        </div>
        <div
          style={{
            marginTop: 'auto',
            fontSize: 26,
            color: '#8a929b',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          newstoday
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
