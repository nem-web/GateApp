import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { readingTimeMinutes, plainTextFromMarkdown } from "@/lib/content-utils";
import { 
  ArrowRight, 
  ArrowDown, 
  Calculator, 
  TrendingUp, 
  Zap, 
  Bell, 
  ChevronRight, 
  PenSquare,
  Target
} from "lucide-react";
import NewsletterForm from '@/components/NewsletterForm'
import { AdSlot } from "@/components/ads/AdSlot";
import { NativeBannerSlot } from "@/components/ads/NativeBannerSlot";
import { SmartLinkLink } from "@/components/ads/SmartLinkLink";

// --- HIGH-INTENT SEO METADATA ---
export const metadata: Metadata = createMetadata({
  title: "GATE Preparation Blog 2027 | Strategies for CSE, ECE, EE & ME",
  description: "Master your GATE preparation for CSE, ECE, and EE. Read expert strategies, PYQ analysis, and discover why smart notes beat traditional GATE preparation books.",
  path: "/blog",
});

// Helper to format dates cleanly
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

// Helper for dynamic category colors
const getCategoryColor = (category: string | null) => {
  const cat = (category || "").toUpperCase();
  if (cat.includes("PYQ")) return "bg-blue-500/10 text-blue-400";
  if (cat.includes("STRATEGY")) return "bg-[#22c55e]/10 text-[#22c55e]";
  if (cat.includes("GUIDE")) return "bg-[#f59e0b]/10 text-[#f59e0b]";
  if (cat.includes("CUTOFF") || cat.includes("RANK")) return "bg-pink-500/10 text-pink-400";
  if (cat.includes("TOOL")) return "bg-teal-500/10 text-teal-400";
  return "bg-[#22c55e]/10 text-[#22c55e]";
};

// Helper for dynamic author avatar colors
const getAuthorAvatar = (name: string | null) => {
  const initial = (name?.[0] || "G").toUpperCase();
  const colorMap: Record<string, string> = {
    N: "bg-blue-500 text-white",
    P: "bg-[#f59e0b] text-black",
    A: "bg-pink-500 text-white",
  };
  return colorMap[initial] || "bg-[#22c55e] text-black";
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
    take: 48,
  });

  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  // --- STRUCTURED DATA (JSON-LD) FOR RICH CAROUSELS ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "GATE Preparation Blog | GATEPrep Pro",
    "description": "Expert strategies, subject guides, and PYQ analysis for GATE CSE, ECE, EE, and ME.",
    "url": "https://www.gateprep.tech/blog",
    "blogPost": posts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://www.gateprep.tech/blog/${post.slug}`,
      "datePublished": post.publishedAt?.toISOString(),
      "dateModified": post.updatedAt?.toISOString(),
      "author": {
        "@type": "Person",
        "name": post.author?.name || "GATEPrep Editorial Team"
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-white font-sans pt-10 pb-24 selection:bg-[#22c55e]/30">
      
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <div className="mb-14 flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 rounded-full bg-[#22c55e]" />
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                GATE Preparation Blog 2027
              </h1>
            </div>
            
            {/* SEO-Optimized Description capturing long-tail keywords */}
            <p className="max-w-3xl text-gray-400 text-sm sm:text-base leading-relaxed">
              Master your <strong>GATE preparation for CSE, ECE, EE, and ME</strong>. Discover topper strategies, PYQ breakdowns, and learn why smart AI tools are replacing traditional GATE preparation books.
            </p>
            
            {/* CATEGORY PILLS */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="cursor-pointer rounded-full bg-[#22c55e] px-5 py-1.5 text-xs font-semibold text-black transition-transform hover:scale-105">
                All
              </span>
              {["PYQ Analysis", "Preparation Strategy", "Subject Guides", "Cutoff & Rank", "Tools"].map((cat) => (
                <span 
                  key={cat} 
                  className="cursor-pointer rounded-full border border-gray-800 bg-transparent px-5 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-gray-600 hover:text-white"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* WRITE POST CTA BUTTON */}
          <SmartLinkLink
            href="/blog/write"
            smartLinkSource="blog-write-post"
            className="group flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#22c55e]/90 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95"
          >
            <PenSquare className="h-4 w-4" />
            Write a Post
          </SmartLinkLink>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          
          {/* LEFT: CONTENT AREA */}
          <div className="space-y-12">
            
            {/* FEATURED POST */}
            {featuredPost && (
              <section>
                <div className="mb-6 flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Featured</span>
                  <div className="h-px flex-1 bg-gray-800/60" />
                </div>
                
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-gray-800 bg-[#111216] transition-colors hover:border-gray-700 shadow-xl"
                >
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
                        <span className={`rounded px-2.5 py-1 font-bold tracking-wide uppercase ${getCategoryColor(featuredPost.category)}`}>
                          {featuredPost.category || "STRATEGY"}
                        </span>
                        <span className="text-gray-400 font-medium">
                          {readingTimeMinutes(plainTextFromMarkdown(featuredPost.content))} min read
                        </span>
                      </div>
                      <h2 className="mb-4 text-2xl font-bold leading-snug text-white transition-colors group-hover:text-[#22c55e]">
                        {featuredPost.title}
                      </h2>
                      <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${getAuthorAvatar(featuredPost.author?.name)}`}>
                          {(featuredPost.author?.name?.[0] || "G").toUpperCase()}
                        </div>
                        <span className="text-gray-300">{featuredPost.author?.name || "GATEPrep Editorial"}</span>
                        <span className="text-gray-600 mx-1">•</span>
                        <span className="text-gray-500">{formatDate(featuredPost.publishedAt || new Date())}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[#22c55e] opacity-90 transition-transform group-hover:translate-x-1">
                        Read article <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                  
                  {/* Abstract Graphic representing Subject Weightage */}
                  <div className="hidden md:flex w-[300px] border-l border-gray-800/50 bg-[#0B0C10] flex-col items-center justify-center p-8">
                    <div className="relative flex h-full w-full flex-col items-center justify-center space-y-6 opacity-80 group-hover:opacity-100 transition-opacity">
                       <div className="flex w-full items-center justify-between gap-4">
                         <div className="flex-1 space-y-3">
                            <div className="h-3 w-full rounded-full bg-gray-800"></div>
                            <div className="h-3 w-4/5 rounded-full bg-gray-800"></div>
                            <div className="h-3 w-full rounded-full bg-gray-800"></div>
                         </div>
                         <div className="h-16 w-16 rounded-full border-[6px] border-gray-800/50 relative">
                            <div className="absolute top-0 right-0 h-1/2 w-1/2 border-t-[6px] border-r-[6px] border-[#22c55e] rounded-tr-full -m-[6px]"></div>
                         </div>
                       </div>
                       <div className="flex w-full gap-2 pt-4">
                          <div className="h-6 w-1/4 rounded bg-[#22c55e]"></div>
                          <div className="h-6 w-1/4 rounded bg-blue-500"></div>
                          <div className="h-6 w-1/4 rounded bg-[#f59e0b]"></div>
                          <div className="h-6 w-1/4 rounded bg-[#22c55e]"></div>
                       </div>
                       <p className="text-[10px] text-gray-500 font-medium">Subject Weightage Chart</p>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* LATEST ARTICLES */}
            <section>
              <div className="mb-6 flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Latest Articles</span>
                <div className="h-px flex-1 bg-gray-800/60" />
                <span className="text-[10px] text-gray-500">{latestPosts.length} articles</span>
              </div>

              <NativeBannerSlot slotId="blog-native-feed" className="mb-6" />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {latestPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-gray-800 bg-[#111216] p-6 transition-colors hover:border-gray-700"
                  >
                    <div className="mb-4 flex items-center justify-between text-xs">
                      <span className={`rounded px-2.5 py-1 font-bold tracking-wide uppercase ${getCategoryColor(post.category)}`}>
                        {post.category || "GATE 2027"}
                      </span>
                      <span className="text-gray-400 font-medium">
                        {readingTimeMinutes(plainTextFromMarkdown(post.content))} min read
                      </span>
                    </div>
                    
                    <h2 className="mb-3 text-lg font-bold leading-tight text-white transition-colors group-hover:text-[#22c55e]">
                      {post.title}
                    </h2>
                    
                    <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-400 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-gray-800/60 pt-4 text-xs font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${getAuthorAvatar(post.author?.name)}`}>
                          {(post.author?.name?.[0] || "G").toUpperCase()}
                        </div>
                        <span className="text-gray-300">{post.author?.name || "GATEPrep Author"}</span>
                      </div>
                      <span className="text-gray-500">
                        {post.publishedAt ? formatDate(post.publishedAt) : ""}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* LOAD MORE BUTTON */}
            <div className="flex justify-center pt-4">
              <button className="flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-[#22c55e] transition-colors hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5">
                Load more articles <ArrowDown className="h-4 w-4" />
              </button>
            </div>

          </div>

          {/* RIGHT: SIDEBAR */}
          <aside className="space-y-6">
            <div className="hidden lg:flex flex-col items-center gap-6">
              <AdSlot
                slotId="blog-side-rail-primary"
                format="banner-160x600"
                variants={[{ width: 160, height: 600, minViewport: 1024 }]}
                smartLinkSource="blog-side-rail-primary"
              />
              <AdSlot
                slotId="blog-side-rail-secondary"
                format="banner-160x300"
                variants={[{ width: 160, height: 300, minViewport: 1024 }]}
                smartLinkSource="blog-side-rail-secondary"
              />
            </div>
            
            {/* CRO WIDGET: Call to Action (Added based on SEO Report recommendations) */}
            <div className="rounded-2xl border-2 border-[#22c55e]/30 bg-gradient-to-b from-[#22c55e]/10 to-[#111216] p-6 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#22c55e]/20 blur-3xl rounded-full pointer-events-none" />
              <Target className="h-8 w-8 text-[#22c55e] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Serious about GATE 2027?</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Stop jumping between blogs. Get the AI planner, PYQs, and flashcards in one dashboard.
              </p>
              <SmartLinkLink href="/login?mode=signup" smartLinkSource="blog-sidebar-start-trial" className="block w-full rounded-xl bg-[#22c55e] py-3 text-sm font-bold text-black hover:bg-[#22c55e]/90 transition-colors shadow-lg">
                Start Free Trial
              </SmartLinkLink>
            </div>

            {/* Widget: Quick Tools */}
            <div className="rounded-2xl border border-gray-800 bg-[#111216] p-6">
              <h3 className="text-base font-bold text-white">Quick Tools</h3>
              <p className="mb-6 text-xs text-gray-400 mt-1">Essential tools for GATE prep</p>
              
              <div className="space-y-3">
                <Link href="/tools/marks-calculator" className="group flex items-center justify-between rounded-xl border border-gray-800 bg-[#0B0C10] p-3 transition-colors hover:border-gray-700">
                   <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22c55e]/10 text-[#22c55e]">
                         <Calculator className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Marks Calculator</p>
                        <p className="text-[10px] text-gray-500">Estimate your score</p>
                      </div>
                   </div>
                   <ChevronRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-gray-400" />
                </Link>
                
                <Link href="/tools/rank-predictor" className="group flex items-center justify-between rounded-xl border border-gray-800 bg-[#0B0C10] p-3 transition-colors hover:border-gray-700">
                   <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22c55e]/10 text-[#22c55e]">
                         <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Rank Predictor</p>
                        <p className="text-[10px] text-gray-500">Predict your AIR</p>
                      </div>
                   </div>
                   <ChevronRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-gray-400" />
                </Link>

                <Link href="/daily-quiz" className="group flex items-center justify-between rounded-xl border border-gray-800 bg-[#0B0C10] p-3 transition-colors hover:border-gray-700">
                   <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                         <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Daily Quiz</p>
                        <p className="text-[10px] text-gray-500">5 questions daily</p>
                      </div>
                   </div>
                   <ChevronRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Widget: Popular Subjects */}
            <div className="rounded-2xl border border-gray-800 bg-[#111216] p-6">
              <h3 className="text-base font-bold text-white">Branch Content</h3>
              <p className="mb-6 text-xs text-gray-400 mt-1">Browse articles by branch</p>
              
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: "GATE CSE", color: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" },
                  { name: "GATE ECE", color: "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30" },
                  { name: "GATE EE", color: "bg-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/30" },
                  { name: "GATE ME", color: "bg-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/30" },
                ].map((subject) => (
                  <Link
                    key={subject.name}
                    href={`/subject/${subject.name.toLowerCase().replace(" ", "-")}`}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${subject.color}`}
                  >
                    {subject.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget: Weekly Digest */}
            <div className="rounded-2xl border border-gray-800 bg-[#111216] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#22c55e]/5 blur-3xl rounded-full pointer-events-none"></div>
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-[#22c55e]" />
                <h3 className="text-base font-bold text-white">Weekly Digest</h3>
              </div>
              <p className="mb-6 text-xs text-gray-400 leading-relaxed">
                Get the latest GATE tips and PYQ analysis every week.
              </p>
              
              <NewsletterForm />
            </div>

          </aside>
        </div>
        
      </div>
    </div>
  );
}