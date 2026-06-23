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
  FileQuestion,
  History,
  HelpCircle,
  Download
} from "lucide-react";

// --- HIGH-INTENT SEO METADATA ---
export const metadata: Metadata = {
  title: "GATE Previous Year Question Papers (PYQ) PDF & Solutions 2027",
  description: "Download 15+ years of official GATE Previous Year Question Papers (PYQs) with detailed solutions for CSE, ECE, EE, ME, CE, and IN. Boost your GATE 2027 preparation.",
  keywords: [
    "gate pyq pdf",
    "gate previous year question papers",
    "gate pyq with solutions",
    "gate preparation for cse",
    "gate preparation for ece",
    "gate 2027 pyq",
    "gate ee previous year papers"
  ],
  alternates: {
    canonical: "https://www.gateprep.tech/pyqs",
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
    href: "/resources/gate-ee/pyq",
    icon: Zap,
    yearCount: "2010–2025 Papers",
    delay: "delay-[100ms]",
  },
  {
    id: "CS",
    name: "Computer Science & IT",
    short: "GATE CSE",
    color: "#3b82f6",
    bgHover: "hover:border-[#3b82f6]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    href: "/resources/gate-cs/pyq",
    icon: Monitor,
    yearCount: "2010–2025 Papers",
    delay: "delay-[150ms]",
  },
  {
    id: "ME",
    name: "Mechanical Engineering",
    short: "GATE ME",
    color: "#ef4444",
    bgHover: "hover:border-[#ef4444]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    href: "/resources/gate-me/pyq",
    icon: Settings,
    yearCount: "2010–2025 Papers",
    delay: "delay-[200ms]",
  },
  {
    id: "ECE",
    name: "Electronics & Comm.",
    short: "GATE ECE",
    color: "#a855f7",
    bgHover: "hover:border-[#a855f7]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    href: "/resources/gate-ece/pyq",
    icon: Cpu,
    yearCount: "2010–2025 Papers",
    delay: "delay-[250ms]",
  },
  {
    id: "CE",
    name: "Civil Engineering",
    short: "GATE CE",
    color: "#f59e0b",
    bgHover: "hover:border-[#f59e0b]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    href: "/resources/gate-ce/pyq",
    icon: Building2,
    yearCount: "2010–2025 Papers",
    delay: "delay-[300ms]",
  },
  {
    id: "IN",
    name: "Instrumentation Engg.",
    short: "GATE IN",
    color: "#06b6d4",
    bgHover: "hover:border-[#06b6d4]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    href: "/resources/gate-in/pyq",
    icon: Network,
    yearCount: "2010–2025 Papers",
    delay: "delay-[350ms]",
  },
];

export default function PyqIndexPage() {
  // --- STRUCTURED DATA (JSON-LD) FOR FAQ & BREADCRUMBS ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.gateprep.tech" },
          { "@type": "ListItem", "position": 2, "name": "Previous Year Questions", "item": "https://www.gateprep.tech/pyqs" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How many years of PYQs should I solve for GATE preparation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For optimal GATE 2027 preparation, you should solve at least the last 10-15 years of official Previous Year Question (PYQ) papers. This helps you identify recurring patterns and high-weightage topics in CSE, ECE, EE, and other branches."
            }
          },
          {
            "@type": "Question",
            "name": "Are these GATE PYQs provided with solutions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, GATEPrep Pro provides chapter-wise and full-length GATE PYQs completely mapped with official answer keys and detailed step-by-step solutions."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="relative min-h-screen bg-[#0e0f14] text-[#E5E7EB] font-sans selection:bg-[#06b6d4]/30 overflow-hidden pb-24">
      
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient Background Glows (Cyan/Teal theme for PYQs) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#06b6d4]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/10 text-xs font-bold uppercase tracking-widest text-[#06b6d4] mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <History size={14} /> Official GATE Archives
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Previous Year <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]">Questions</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-[#9CA3AF] text-lg leading-relaxed">
            Practice with 15+ years of official GATE papers for <strong>CSE, ECE, EE, ME, CE & IN</strong>. Access downloadable PDFs, detailed solutions, and advanced PYQ analytics.
          </p>
        </div>

        {/* BRANCH GRID (Converted to Tailwind Animations for SEO & Speed) */}
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
                      <Download size={12} /> {branch.yearCount}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2 transition-colors group-hover:text-white">
                    {branch.name}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] mb-8 leading-relaxed">
                    Access chapter-wise and full-length official PYQs with solutions for {branch.short}.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-800/60 pt-5">
                  <span 
                    className="text-sm font-bold tracking-wide transition-colors"
                    style={{ color: branch.color }}
                  >
                    View Papers & Solutions
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

        {/* SEO FAQ SECTION (Crucial for ranking for PYQ keywords) */}
        <div className="max-w-4xl mx-auto border-t border-gray-800/60 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="mt-4 text-gray-400">Everything you need to know about GATE Previous Year Questions.</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-[#111216]/80 backdrop-blur-md p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-[#06b6d4]" /> How many years of PYQs should I solve for GATE preparation?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                For optimal GATE 2027 preparation, you should solve at least the last 10-15 years of official Previous Year Question (PYQ) papers. This helps you identify recurring patterns and high-weightage topics in your specific branch.
              </p>
            </div>
            
            <div className="rounded-xl border border-gray-800 bg-[#111216]/80 backdrop-blur-md p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-[#06b6d4]" /> Are these GATE PYQs provided with solutions?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                Yes, GATEPrep Pro provides chapter-wise and full-length GATE PYQs completely mapped with official answer keys and detailed step-by-step solutions to help you understand the core concepts.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}