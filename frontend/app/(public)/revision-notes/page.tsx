import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Zap, 
  Monitor, 
  Settings, 
  Cpu, 
  Building2, 
  Network, 
  ArrowRight, 
  Clock,
  FileText,
  HelpCircle
} from "lucide-react";

// --- HIGH-INTENT SEO METADATA ---
export const metadata: Metadata = {
  title: "GATE Short Notes & Quick Revision Material 2027 | GATEPrep Pro",
  description: "Download high-yield GATE short notes, cheat sheets, and quick revision material for CSE, ECE, EE, ME, CE. The smarter alternative to heavy GATE preparation books.",
  keywords: [
    "gate preparation revision notes",
    "gate short notes pdf",
    "gate preparation for cse short notes",
    "gate preparation for ece revision",
    "gate preparation books alternative",
    "gate 2027 last minute prep"
  ],
  alternates: {
    canonical: "https://www.gateprep.tech/revision-notes",
  },
};

// --- Branch Data Configuration ---
const branches = [
  {
    id: "EE",
    name: "Electrical Engineering",
    short: "GATE EE",
    color: "#22c55e",
    bgHover: "hover:border-[#22c55e]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    href: "/revision-notes/gate-ee",
    icon: Zap,
    topicCount: 11,
    delay: "delay-[100ms]",
  },
  {
    id: "CS",
    name: "Computer Science & IT",
    short: "GATE CSE",
    color: "#3b82f6",
    bgHover: "hover:border-[#3b82f6]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    href: "/revision-notes/gate-cs",
    icon: Monitor,
    topicCount: 12,
    delay: "delay-[150ms]",
  },
  {
    id: "ME",
    name: "Mechanical Engineering",
    short: "GATE ME",
    color: "#ef4444",
    bgHover: "hover:border-[#ef4444]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    href: "/revision-notes/gate-me",
    icon: Settings,
    topicCount: 14,
    delay: "delay-[200ms]",
  },
  {
    id: "ECE",
    name: "Electronics & Comm.",
    short: "GATE ECE",
    color: "#a855f7",
    bgHover: "hover:border-[#a855f7]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    href: "/revision-notes/gate-ece",
    icon: Cpu,
    topicCount: 10,
    delay: "delay-[250ms]",
  },
  {
    id: "CE",
    name: "Civil Engineering",
    short: "GATE CE",
    color: "#f59e0b",
    bgHover: "hover:border-[#f59e0b]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    href: "/revision-notes/gate-ce",
    icon: Building2,
    topicCount: 8,
    delay: "delay-[300ms]",
  },
  {
    id: "IN",
    name: "Instrumentation Engg.",
    short: "GATE IN",
    color: "#06b6d4",
    bgHover: "hover:border-[#06b6d4]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    href: "/revision-notes/gate-in",
    icon: Network,
    topicCount: 9,
    delay: "delay-[350ms]",
  },
];

export default function RevisionNotesIndexPage() {
  // --- STRUCTURED DATA (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.gateprep.tech" },
          { "@type": "ListItem", "position": 2, "name": "Revision Notes", "item": "https://www.gateprep.tech/revision-notes" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are revision notes better than GATE preparation books?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "While standard GATE preparation books are essential for building foundational concepts, they are too bulky for last-minute review. Our high-yield short notes and cheat sheets are designed specifically for rapid revision in the final 60 days of your GATE 2027 prep."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide short notes for GATE CSE and ECE?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we provide highly condensed, chapter-wise revision notes tailored specifically for Computer Science (CSE), Electronics & Communication (ECE), Electrical (EE), and other major branches."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="relative min-h-screen bg-[#0e0f14] text-[#E5E7EB] font-sans selection:bg-[#F59E0B]/30 overflow-hidden pb-24">
      
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient Background Glows (Slightly warmer tone for revision) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F59E0B]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ef4444]/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Clock size={14} /> Last Minute Preparation
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Quick Revision <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#ef4444]">Notes & Formulas</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-[#9CA3AF] text-lg leading-relaxed">
            Accelerate your GATE 2027 prep. Swap out heavy textbooks for our high-yield short notes, cheat sheets, and formula mind-maps designed for <strong>CSE, ECE, EE, ME, CE & IN</strong>.
          </p>
        </div>

        {/* BRANCH GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {branches.map((branch) => (
            <div 
              key={branch.id} 
              className={`animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both ${branch.delay}`}
            >
              <Link
                href={branch.href}
                className={`group flex flex-col justify-between h-full rounded-3xl border border-gray-800 bg-[#111216]/80 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 ${branch.bgHover} ${branch.glow}`}
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div 
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110 border border-white/5"
                      style={{ backgroundColor: `${branch.color}15`, color: branch.color }}
                    >
                      <branch.icon size={28} strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex items-center gap-1.5 rounded-full bg-[#0B0C10] border border-gray-800 px-3 py-1 text-xs font-medium text-[#9CA3AF]">
                      <FileText size={12} /> Cheat Sheets
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2 transition-colors group-hover:text-white">
                    {branch.name}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] mb-8 leading-relaxed">
                    Compact summaries, key formulas, and must-know concepts for {branch.short} at a glance.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-800/60 pt-5">
                  <span 
                    className="text-sm font-bold tracking-wide transition-colors"
                    style={{ color: branch.color }}
                  >
                    View Revision Notes
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-300 group-hover:bg-white/10">
                    <ArrowRight 
                      size={16} 
                      className="transition-transform group-hover:translate-x-1" 
                      style={{ color: branch.color }}
                    />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* SEO FAQ SECTION */}
        <div className="max-w-4xl mx-auto border-t border-gray-800/60 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="mt-4 text-gray-400">Everything you need to know about our short notes.</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-[#111216]/80 backdrop-blur-md p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-[#F59E0B]" /> Are revision notes better than GATE preparation books?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                While standard GATE preparation books are essential for building foundational concepts, they are too bulky for last-minute review. Our high-yield short notes and cheat sheets are designed specifically for rapid revision in the final 60 days of your GATE 2027 prep.
              </p>
            </div>
            
            <div className="rounded-xl border border-gray-800 bg-[#111216]/80 backdrop-blur-md p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-[#F59E0B]" /> Do you provide short notes for GATE CSE and ECE?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                Yes, we provide highly condensed, chapter-wise revision notes tailored specifically for Computer Science (CSE), Electronics & Communication (ECE), Electrical (EE), and other major branches to help you maximize your score.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}