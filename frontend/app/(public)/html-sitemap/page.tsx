import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { LEGAL_PAGES } from "@/lib/legal-pages";
import { Map, FolderTree, FileText, Wrench, GraduationCap, Scale } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "HTML Sitemap | GATEPrep Pro",
  description: "Browse all public GATEPrep pages including GATE EE, CSE, ECE branch hubs, subjects, free notes, formula sheets, PYQs, quizzes, blogs, tools, and policies.",
  path: "/html-sitemap",
});

// Known branches and sub-resources from our architecture
const BRANCHES = [
  { id: "gate-ee", label: "Electrical Engineering (EE)" },
  { id: "gate-cs", label: "Computer Science (CS)" },
  { id: "gate-ece", label: "Electronics & Comm. (ECE)" },
  { id: "gate-me", label: "Mechanical Engineering (ME)" },
  { id: "gate-ce", label: "Civil Engineering (CE)" },
  { id: "gate-in", label: "Instrumentation (IN)" }
];

export default async function HtmlSitemapPage() {
  // Fetch dynamic content
  const [subjects, blogs, vlogs] = await Promise.all([
    prisma.subjectSeoPage.findMany({ where: { status: "PUBLISHED" }, orderBy: { slug: "asc" }, select: { slug: true, title: true } }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, select: { slug: true, title: true } }),
    prisma.vlogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, select: { slug: true, title: true } }),
  ]).catch(() => [[], [], []]);

  // Static SEO Hubs Grouping
  const sitemapGroups = [
    {
      title: "Core Pages",
      icon: Map,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      items: [
        { href: "/", label: "Homepage" },
        { href: "/features", label: "Features & Modules" },
        { href: "/pricing", label: "Pricing & Plans" },
        { href: "/upgrade", label: "Upgrade to Premium" },
        { href: "/about-us", label: "About Us" },
        { href: "/authors", label: "Our Authors" }
      ]
    },
    {
      title: "Smart Tools",
      icon: Wrench,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      items: [
        { href: "/tools", label: "All Tools Hub" },
        { href: "/tools/rank-predictor", label: "GATE Rank Predictor" },
        { href: "/tools/marks-calculator", label: "GATE Marks Calculator" },
        { href: "/tools/study-planner", label: "AI Study Planner" },
        { href: "/mock-tests", label: "Mock Drill Tests" },
        { href: "/daily-quiz", label: "Daily GATE Quiz" }
      ]
    },
    {
      title: "Resource Hubs",
      icon: FolderTree,
      color: "text-[#22c55e]",
      bg: "bg-[#22c55e]/10",
      items: [
        { href: "/resources", label: "All Resources" },
        { href: "/free-notes", label: "Free GATE Notes" },
        { href: "/revision-notes", label: "Quick Revision Notes" },
        { href: "/formula-sheets", label: "Formula Cheat Sheets" },
        { href: "/pyqs", label: "Previous Year Questions (PYQs)" }
      ]
    },
    {
      title: "Branch Directories",
      icon: GraduationCap,
      color: "text-[#f59e0b]",
      bg: "bg-[#f59e0b]/10",
      items: BRANCHES.map(b => ({ href: `/resources/${b.id}`, label: `${b.label} Hub` }))
    }
  ];

  // Dynamic Content Grouping
  const dynamicGroups = [
    {
      title: "Blog Articles",
      icon: FileText,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      items: [{ href: "/blog", label: "Blog Index" }, ...blogs.map(b => ({ href: `/blog/${b.slug}`, label: b.title }))]
    },
    {
      title: "Subjects & Syllabus",
      icon: FileText,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      items: subjects.map(s => ({ href: `/subject/${s.slug}`, label: s.title }))
    },
    {
      title: "Legal & Trust",
      icon: Scale,
      color: "text-gray-400",
      bg: "bg-gray-500/10",
      items: LEGAL_PAGES.map(l => ({ href: `/${l.slug}`, label: l.title }))
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0f14] text-white font-sans selection:bg-[#22c55e]/30 pb-24">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white mb-4">
            HTML <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#22c55e]">Sitemap</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Navigate through our entire architecture of GATE preparation resources, tools, and articles.
          </p>
        </div>

        {/* Masonry-style Grid for Sitemap Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          
          {/* Render Static/Core Groups */}
          {sitemapGroups.map((group) => (
            <section key={group.title} className="rounded-2xl border border-gray-800 bg-[#111216]/80 backdrop-blur-xl p-6 hover:border-gray-700 transition-colors shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800/60">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${group.bg} ${group.color}`}>
                  <group.icon size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">{group.title}</h2>
              </div>
              <ul className="space-y-3 text-sm">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-gray-400 hover:text-white hover:underline decoration-[#22c55e]/50 underline-offset-4 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Render Dynamic Groups (Only if they have items) */}
          {dynamicGroups.map((group) => {
            if (group.items.length === 0) return null;
            return (
              <section key={group.title} className="rounded-2xl border border-gray-800 bg-[#111216]/80 backdrop-blur-xl p-6 hover:border-gray-700 transition-colors shadow-lg">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800/60">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${group.bg} ${group.color}`}>
                    <group.icon size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">{group.title}</h2>
                </div>
                <ul className="space-y-3 text-sm max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-gray-400 hover:text-white hover:underline decoration-blue-400/50 underline-offset-4 transition-colors block truncate">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

        </div>
      </main>
      
      {/* Add a tiny style block for the custom scrollbar in the dynamic sections */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4B5563; }
      `}} />
    </div>
  );
}