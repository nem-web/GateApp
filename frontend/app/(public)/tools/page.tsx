import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Calculator, 
  CalendarDays, 
  Trophy, 
  ArrowRight,
  Wrench,
  HelpCircle
} from "lucide-react";

// --- HIGH-INTENT SEO METADATA ---
export const metadata: Metadata = {
  title: "GATE Prep Tools | Rank Predictor, Marks Calculator & Study Planner",
  description: "Use our free GATE 2027 preparation tools. Predict your rank, calculate marks with negative marking, and generate a personalized AI study plan.",
  keywords: [
    "GATE rank predictor",
    "GATE 2027 marks calculator",
    "GATE study planner",
    "calculate GATE marks with negative marking",
    "GATE preparation tools"
  ],
  alternates: {
    canonical: "https://www.gateprep.tech/tools",
  },
};

const toolsData = [
  {
    id: "rank-predictor",
    name: "GATE Rank Predictor",
    description: "Analyze your expected GATE rank based on your marks, category, and paper difficulty using our advanced AI algorithm.",
    color: "#a855f7",
    href: "/tools/rank-predictor",
    icon: Trophy,
    tags: ["Live", "AI Powered"],
  },
  {
    id: "marks-calculator",
    name: "Marks Calculator",
    description: "Paste your GATE response sheet URL to instantly calculate your exact marks, positive score, and negative penalties.",
    color: "#3b82f6",
    href: "/tools/marks-calculator",
    icon: Calculator,
    tags: ["Response Sheet", "Instant"],
  },
  {
    id: "study-planner",
    name: "Smart Study Planner",
    description: "Generate a personalized day-by-day revision schedule based on your target branch and remaining time.",
    color: "#f59e0b",
    href: "/tools/study-planner",
    icon: CalendarDays,
    tags: ["Personalized", "Tracker"],
  },
];

export default function ToolsIndexPage() {
  // --- STRUCTURED DATA (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "GATEPrep Pro Tools",
        "url": "https://www.gateprep.tech/tools",
        "applicationCategory": "EducationalApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How accurate is the GATE rank predictor?",
            "acceptedAnswer": { "@type": "Answer", "text": "Our GATE rank predictor uses historical data from previous years combined with AI analysis of the current paper's difficulty to provide a highly accurate rank estimate." }
          },
          {
            "@type": "Question",
            "name": "Does the marks calculator include negative marking?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, our marks calculator strictly follows the official GATE marking scheme, including positive marks for correct answers and negative penalties for incorrect MCQ selections." }
          }
        ]
      }
    ]
  };

  return (
    <div className="relative min-h-screen bg-[#0e0f14] text-[#E5E7EB] font-sans selection:bg-[#a855f7]/30 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#a855f7]/15 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 text-xs font-bold uppercase tracking-widest text-[#a855f7] mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Wrench size={14} /> Smart Preparation Tools
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            GATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899]">Toolbox</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[#9CA3AF] text-lg leading-relaxed">
            Optimize your GATE 2027 strategy. Calculate your potential, predict your rank, and build a smart study plan with our data-driven engineering tools.
          </p>
        </div>

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsData.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex flex-col justify-between h-full rounded-3xl border border-gray-800 bg-[#111216]/80 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div 
                    className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner border border-white/5 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                  >
                    <tool.icon size={28} strokeWidth={1.5} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">{tool.name}</h2>
                <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">{tool.description}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {tool.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border border-gray-700 bg-gray-800/50 text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-800/60 pt-5">
                <span className="text-sm font-bold tracking-wide transition-colors" style={{ color: tool.color }}>
                  Open Tool
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                  <ArrowRight size={16} style={{ color: tool.color }} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO FAQ SECTION */}
        <div className="max-w-4xl mx-auto mt-24 border-t border-gray-800/60 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Common Tool FAQs</h2>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-[#111216]/80 p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-purple-400" /> How accurate is the GATE rank predictor?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                Our GATE rank predictor uses historical data from previous years combined with AI analysis of the current paper&apos;s difficulty to provide a highly accurate rank estimate based on your percentile and category.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-[#111216]/80 p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-blue-400" /> Does the marks calculator include negative marking?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                Yes, our marks calculator strictly follows the official GATE marking scheme, including positive marks for correct answers and negative penalties for incorrect MCQ selections.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}