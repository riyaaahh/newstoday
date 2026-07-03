import { ImageResponse } from 'next/og'

/** Branded square app icon at the requested size (used by the PWA manifest). */
export function renderIcon(size: number): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#14171a',
          color: '#c1121f',
          fontSize: size * 0.62,
          fontWeight: 800,
        }}
      >
        N
      </div>
    ),
    { width: size, height: size },
  )
}
