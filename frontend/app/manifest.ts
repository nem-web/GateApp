import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GATEPrep Pro - GATE EE Study Companion',
    short_name: 'GATEPrep Pro',
    description:
      'A GATE Electrical Engineering study platform with AI-powered planning, notes, flashcards, PYQ papers, tests, lectures, and cutoff analysis.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0F1117',
    theme_color: '#0F1117',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/pwa-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pwa-icon-maskable.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
