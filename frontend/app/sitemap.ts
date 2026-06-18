import type { MetadataRoute } from 'next'
import { PUBLIC_SEO_PAGES } from '@/lib/seo-pages'
import { LEGAL_PAGES } from '@/lib/legal-pages'
import { absoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: absoluteUrl('/gate-ee'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/pricing'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/upgrade'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...LEGAL_PAGES.map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: page.slug === 'contact-us' || page.slug === 'about-us' ? 0.7 : 0.55,
    })),
    ...PUBLIC_SEO_PAGES.map((page) => ({
      url: absoluteUrl(`/gate-ee/${page.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ]
}
