import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          // --- Main Pages ---
          '/about',
          '/contact',
          '/careers',
          '/pricing',
          '/features',
          
          // --- Content & SEO Hubs ---
          '/blog',
          '/vlogs',
          '/daily-quiz',
          '/weightage-analysis',
          '/html-sitemap',
          
          // --- Study Materials ---
          '/resources',
          '/free-notes',
          '/revision-notes',
          '/formula-sheets',
          '/pyqs',
          '/syllabus',
          '/subject',
          
          // --- Preparation & Tools ---
          '/tools',
          '/mock-tests',
          '/upgrade',
        ],
        disallow: [
          // --- System & API ---
          '/api/',
          '/_next/',
          
          // --- Authentication & Admin ---
          '/login',
          '/admin',
          '/blog/write', // Protected route for authoring posts
          
          // --- Private/User Dashboard Apps ---
          '/todos',
          '/flashcards',
          '/lectures',
          
          // --- Testing & Deprecated ---
          '/test',
          '/games',
          '/other',
          '/cutoffs', // Assuming old route (new ones are correctly under /resources/[branch]/)
          '/study-plan', // Assuming old route (new one is /tools/study-planner)
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}