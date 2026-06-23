import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { relatedContent } from "@/lib/content-utils";
import { 
  BookOpen, 
  Target, 
  Brain, 
  CheckCircle2, 
  ChevronRight, 
  FileText,
  Zap,
  Rocket
} from "lucide-react";

type PageProps = { params: Promise<{ slug: string }> };

// --- HIGH-INTENT DYNAMIC METADATA ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.subjectSeoPage.findFirst({ where: { slug, status: "PUBLISHED" } });
  
  if (!page) return {};
  
  return createMetadata({ 
    title: `${page.subjectName} GATE Syllabus, Weightage & Notes 2027`, 
    description: `Complete GATE preparation guide for ${page.subjectName}. Explore the official syllabus, high-weightage important topics, preparation strategy, and free notes.`, 
    path: `/subject/${page.slug}`,
    keywords: [
      `${page.subjectName} GATE syllabus`,
      `${page.subjectName} important topics for GATE`,
      `${page.subjectName} GATE notes`,
      `${page.subjectName} preparation strategy`,
      `GATE ${page.branchCode} subjects`
    ]
  });
}

export default async function SubjectPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await prisma.subjectSeoPage.findFirst({ where: { slug, status: "PUBLISHED" } });
  
  if (!page) notFound();
  
  const related = await relatedContent({ subjectSlug: page.slug, tags: [page.subjectName, page.branchCode], take: 9 });
  const syllabus = Array.isArray(page.syllabus) ? page.syllabus.map(String) : [];

  // --- DYNAMIC STRUCTURED DATA (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.gateprep.tech" },
          { "@type": "ListItem", "position": 2, "name": "Subjects", "item": "https://www.gateprep.tech/html-sitemap" },
          { "@type": "ListItem", "position": 3, "name": page.subjectName, "item": `https://www.gateprep.tech/subject/${page.slug}` }
        ]
      },
      {
        "@type": "Course",
        "name": `${page.subjectName} for GATE Preparation`,
        "description": page.overview || page.description,
        "url": absoluteUrl(`/subject/${page.slug}`),
        "provider": { "@type": "Organization", "name": "GATEPrep Pro", "sameAs": "https://www.gateprep.tech" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What are the important topics for ${page.subjectName} in GATE?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `High-weightage topics for ${page.subjectName} include: ${page.importantTopics.slice(0, 5).join(", ")}.`
            }
          },
          {
            "@type": "Question",
            "name": `How to prepare for ${page.subjectName} for GATE 2027?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": page.strategy || `Focus on mastering the core concepts, practicing PYQs, and using GATEPrep Pro's AI planner and spaced flashcards for ${page.subjectName}.`
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-[#E5E7EB] font-sans selection:bg-[#22c55e]/30 pb-24">
      
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-20 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <header className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">
            <BookOpen size={14} /> GATE {page.branchCode} Subject Guide
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            {page.subjectName}
          </h1>
          
          <p className="max-w-3xl mx-auto text-[#9CA3AF] text-lg leading-relaxed">
            {page.overview || page.description}
          </p>
        </header>

        <div className="space-y-12">
          
          {/* IMPORTANT TOPICS (Moved up for high-intent SEO value) */}
          {page.importantTopics && page.importantTopics.length > 0 && (
            <section className="rounded-3xl border border-gray-800 bg-[#111216]/80 backdrop-blur-xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f59e0b]/10 text-[#f59e0b]">
                  <Target size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">High-Weightage Topics</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {page.importantTopics.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-gray-800/50 bg-[#0B0C10] p-4 transition-colors hover:border-[#f59e0b]/30">
                    <CheckCircle2 className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" />
                    <span className="text-gray-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* PREPARATION STRATEGY */}
          {page.strategy && (
            <section className="rounded-3xl border border-gray-800 bg-[#111216]/80 backdrop-blur-xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Brain size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">Preparation Strategy</h2>
              </div>
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                <p>{page.strategy}</p>
              </div>
            </section>
          )}

          {/* OFFICIAL SYLLABUS */}
          {syllabus.length > 0 && (
            <section className="rounded-3xl border border-gray-800 bg-[#111216]/80 backdrop-blur-xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">Official GATE Syllabus</h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {syllabus.map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-xl border border-gray-800/50 bg-[#0B0C10] p-4 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* RELATED CONTENT (Internal Linking for SEO) */}
          {related.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white">Related Resources</h2>
                <div className="h-px flex-1 bg-gray-800/60" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="group flex items-center justify-between rounded-xl border border-gray-800 bg-[#111216] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#22c55e]/50 hover:shadow-lg"
                  >
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white line-clamp-2">
                      {item.title}
                    </span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800/50 text-gray-500 transition-colors group-hover:bg-[#22c55e]/10 group-hover:text-[#22c55e]">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CRO SECTION (From SEO Report: "No conversion CTAs on resource pages") */}
          <section className="pt-8">
            <div className="mx-auto rounded-3xl border-2 border-[#22c55e]/30 bg-gradient-to-b from-[#22c55e]/10 to-[#111216] p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#22c55e]/20 blur-3xl rounded-full pointer-events-none" />
              
              <Rocket className="h-12 w-12 text-[#22c55e] mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Master {page.subjectName} with AI
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Stop jumping between scattered PDFs. Get personalized study plans, intelligent flashcards, and chapter-wise PYQ analytics for {page.subjectName} inside the GATEPrep Pro dashboard.
              </p>
              
              <Link 
                href="/login?mode=signup" 
                className="inline-flex rounded-xl bg-[#22c55e] px-8 py-4 text-base font-bold text-black transition-all hover:bg-[#22c55e]/90 hover:scale-105 shadow-lg"
              >
                Start Free Trial
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}