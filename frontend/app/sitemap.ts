import type { MetadataRoute } from 'next'
import { PUBLIC_SEO_PAGES } from '@/lib/seo-pages'
import { LEGAL_PAGES } from '@/lib/legal-pages'
import { absoluteUrl } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import { resourceHref } from '@/lib/content-utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const [branches, subjects, resources, blogs, vlogs] = await Promise.all([
    prisma.gateBranchPage.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.subjectSeoPage.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.seoResource.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, kind: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.vlogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
  ]).catch(() => [[], [], [], [], []] as const)

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
    { url: absoluteUrl('/blog'), lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: absoluteUrl('/vlogs'), lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: absoluteUrl('/authors'), lastModified: now, changeFrequency: 'weekly', priority: 0.65 },
    { url: absoluteUrl('/html-sitemap'), lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: absoluteUrl('/search'), lastModified: now, changeFrequency: 'weekly', priority: 0.55 },
    { url: absoluteUrl('/free-gate-notes'), lastModified: now, changeFrequency: 'daily', priority: 0.86 },
    { url: absoluteUrl('/free-formula-sheets'), lastModified: now, changeFrequency: 'daily', priority: 0.84 },
    { url: absoluteUrl('/free-pyqs'), lastModified: now, changeFrequency: 'daily', priority: 0.86 },
    { url: absoluteUrl('/daily-quiz'), lastModified: now, changeFrequency: 'daily', priority: 0.82 },
    { url: absoluteUrl('/gate-rank-predictor'), lastModified: now, changeFrequency: 'monthly', priority: 0.78 },
    { url: absoluteUrl('/gate-marks-calculator'), lastModified: now, changeFrequency: 'monthly', priority: 0.78 },
    { url: absoluteUrl('/study-planner'), lastModified: now, changeFrequency: 'monthly', priority: 0.72 },
    { url: absoluteUrl('/revision-tracker'), lastModified: now, changeFrequency: 'monthly', priority: 0.72 },
    ...branches.map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    })),
    ...subjects.map((page) => ({
      url: absoluteUrl(`/subject/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.86,
    })),
    ...resources.map((page) => ({
      url: absoluteUrl(resourceHref(page.kind, page.slug)),
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.82,
    })),
    ...blogs.map((page) => ({
      url: absoluteUrl(`/blog/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...vlogs.map((page) => ({
      url: absoluteUrl(`/vlogs/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    })),
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
