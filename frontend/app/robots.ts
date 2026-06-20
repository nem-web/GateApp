import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/gate-ee', '/gate-ee/'],
        disallow: [
          '/login',
          '/admin',
          '/api/',
          '/study-plan',
          '/todos',
          '/flashcards',
          '/lectures',
          '/cutoffs',
          '/games',
          '/test',
          '/other',
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
