import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import { LEGAL_PAGES } from '@/lib/legal-pages'

// Known branches from our architecture
const BRANCHES = ['gate-ee', 'gate-cs', 'gate-me', 'gate-ece', 'gate-ce', 'gate-in'];

// Nested resources available for every branch
const BRANCH_RESOURCES = [
  'pyq',
  'free-notes',
  'formula-sheets',
  'syllabus',
  'iit-cutoffs',
  'nit-cutoffs',
  'psu-cutoffs',
  'guidance'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Fetch dynamic content from the database
  const [blogs, vlogs, subjects] = await Promise.all([
    prisma.blogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.vlogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.subjectSeoPage.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
  ]).catch(() => [[], [], []] as const)

  // 1. Core Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: absoluteUrl('/pricing'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/features'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/upgrade'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  // 2. Resource Hubs (High Priority)
  const resourceHubs: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/resources'), lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/free-notes'), lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: absoluteUrl('/revision-notes'), lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: absoluteUrl('/formula-sheets'), lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: absoluteUrl('/pyqs'), lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: absoluteUrl('/daily-quiz'), lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: absoluteUrl('/html-sitemap'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  // 3. Tools Section
  const toolsPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/tools'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/tools/rank-predictor'), lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: absoluteUrl('/tools/marks-calculator'), lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: absoluteUrl('/tools/study-planner'), lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: absoluteUrl('/mock-tests'), lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
  ]

  // 4. Content Directories
  const contentDirectories: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/blog'), lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: absoluteUrl('/vlogs'), lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: absoluteUrl('/authors'), lastModified: now, changeFrequency: 'weekly', priority: 0.65 },
  ]

  // 5. Generate URLs for All Branches and Their Nested Resources
  const branchPages: MetadataRoute.Sitemap = BRANCHES.flatMap((branch) => {
    // The main branch landing page
    const pages: MetadataRoute.Sitemap = [
      {
        url: absoluteUrl(`/resources/${branch}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      // The dedicated hubs for each branch
      { url: absoluteUrl(`/free-notes/${branch}`), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
      { url: absoluteUrl(`/revision-notes/${branch}`), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
      { url: absoluteUrl(`/pyqs/${branch}`), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ];

    // All the sub-pages (Syllabus, Cutoffs, Guidance, etc.) under /resources/[branch]/...
    const subPages = BRANCH_RESOURCES.map((resource) => ({
      url: absoluteUrl(`/resources/${branch}/${resource}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...pages, ...subPages];
  });

  // 6. Dynamic Database Content
  const dbContent: MetadataRoute.Sitemap = [
    ...blogs.map((page) => ({
      url: absoluteUrl(`/blog/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
    ...vlogs.map((page) => ({
      url: absoluteUrl(`/vlogs/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...subjects.map((page) => ({
      url: absoluteUrl(`/subject/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  // 7. Legal Pages
  const legalPages: MetadataRoute.Sitemap = LEGAL_PAGES.map((page) => ({
    url: absoluteUrl(`/${page.slug}`),
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: page.slug === 'contact-us' || page.slug === 'about-us' ? 0.6 : 0.4,
  }))

  return [
    ...staticPages,
    ...resourceHubs,
    ...toolsPages,
    ...contentDirectories,
    ...branchPages,
    ...dbContent,
    ...legalPages,
  ]
}