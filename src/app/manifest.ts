import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NewsToday',
    short_name: 'NewsToday',
    description: 'Malayalam-first news portal',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#c1121f',
    icons: [
      { src: '/icon-192', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
