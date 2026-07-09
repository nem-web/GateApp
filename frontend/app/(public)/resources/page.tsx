import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Search, 
  ChevronRight, 
  Calculator,
  Download,
  BookMarked,
  Zap,
  Cpu,
  Monitor,
  Cog,
  HelpCircle,
  Target
} from "lucide-react";
import { NativeBannerSlot } from "@/components/ads/NativeBannerSlot";
import { SmartLinkLink } from "@/components/ads/SmartLinkLink";

// --- HIGH-INTENT SEO METADATA ---
export const metadata: Metadata = {
  title: "Free GATE Study Material 2027 | PYQs, Notes & Formulas | GATEPrep Pro",
  description: "Access comprehensive free GATE study material, previous year questions (PYQs) PDFs, short notes, and formula sheets for CSE, ECE, EE, ME, CE, and IN.",
  keywords: [
    "GATE study material free download",
    "GATE EE previous year papers PDF",
    "GATE CSE notes free",
    "GATE formula sheet",
    "free GATE resources",
    "GATE 2027 preparation material"
  ],
  alternates: {
    canonical: "https://www.gateprep.tech/resources",
  },
};

// --- Data ---
const gateBranches = [
  {
    title: "Electrical Engineering",
    code: "GATE EE",
    description: "Complete study material, PYQs, and mocks for EE.",
    icon: Zap,
    href: "/resources/gate-ee",
    color: "text-[#22c55e]",
    bg: "bg-[#22c55e]/10",
    border: "border-[#22c55e]/20",
  },
  {
    title: "Electronics & Comm.",
    code: "GATE ECE",
    description: "Analog, digital, signals, and communications resources.",
    icon: Cpu,
    href: "/resources/gate-ece",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    title: "Computer Science & IT",
    code: "GATE CS",
    description: "Data structures, algorithms, OS, and database notes.",
    icon: Monitor,
    href: "/resources/gate-cs",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
  {
    title: "Mechanical Engineering",
    code: "GATE ME",
    description: "Thermodynamics, fluid mechanics, and manufacturing PYQs.",
    icon: Cog,
    href: "/resources/gate-me",
    color: "text-[#f59e0b]",
    bg: "bg-[#f59e0b]/10",
    border: "border-[#f59e0b]/20",
  },
  {
    title: "Civil Engineering",
    code: "GATE CE",
    description: "Structural analysis, geotechnical engineering, and water resources PYQs.",
    icon: Cog,
    href: "/resources/gate-ce",
    color: "text-[#f59e0b]",
    bg: "bg-[#f59e0b]/10",
    border: "border-[#f59e0b]/20",
  },
];

const subjects = [
  { name: "Engineering Mathematics", branches: ["All Branches"], href: "/subject/engineering-mathematics" },
  { name: "General Aptitude", branches: ["All Branches"], href: "/subject/general-aptitude" },
  { name: "Signals & Systems", branches: ["EE", "ECE", "IN"], href: "/subject/signals-systems" },
  { name: "Networks", branches: ["EE", "ECE", "IN"], href: "/subject/networks" },
  { name: "Control Systems", branches: ["EE", "ECE", "IN"], href: "/subject/control-systems" },
  { name: "Electrical Machines", branches: ["EE", "IN"], href: "/subject/electrical-machines" },
  { name: "Power Systems", branches: ["EE"], href: "/subject/power-systems" },
  { name: "Analog Circuits", branches: ["EE", "ECE", "IN"], href: "/subject/analog-circuits" },
  { name: "Digital Circuits", branches: ["EE", "ECE", "IN", "CS"], href: "/subject/digital-circuits" },
  { name: "Electromagnetic Fields", branches: ["EE", "ECE"], href: "/subject/emt" },
];

export default function ResourcesPage() {
  // --- STRUCTURED DATA (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.gateprep.tech" },
          { "@type": "ListItem", "position": 2, "name": "Resources", "item": "https://www.gateprep.tech/resources" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where can I find free GATE study material and notes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "GATEPrep Pro provides free downloadable PDF formula sheets, subject-wise revision notes, and full PYQ papers for EE, CSE, ECE, ME, CE, and IN directly in our resource hub."
            }
          },
          {
            "@type": "Question",
            "name": "Are previous year question (PYQ) papers available for all branches?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we host 15+ years of official GATE PYQs with detailed solutions for all major engineering branches."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-white font-sans pb-24 selection:bg-[#22c55e]/30">
      
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-gray-800/50 bg-[#111216]/50 pt-20 pb-16">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#22c55e]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Free GATE Study Material & <span className="text-[#22c55e]">Resource Hub</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg">
            Everything you need to crack GATE 2027. Search for PYQs, formula sheets, subject notes, and smart prep tools all in one place.
          </p>

          {/* SEARCH BAR */}
          <div className="mx-auto mt-10 max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[#22c55e] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full rounded-xl border border-gray-800 bg-[#0B0C10] py-4 pl-12 pr-4 text-sm text-white placeholder-gray-500 transition-all focus:border-[#22c55e]/50 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/50 shadow-lg"
              placeholder="Search for subjects, PYQs, or formulas..."
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-[10px] font-medium text-gray-400">
                <span className="text-xs">⌘</span> K
              </kbd>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* BRANCHES GRID */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Browse by Branch</h2>
            <div className="h-px flex-1 bg-gray-800/60" />
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gateBranches.map((branch) => (
              <Link
                key={branch.code}
                href={branch.href}
                className={`group flex flex-col rounded-2xl border bg-gradient-to-br from-[#111216] to-[#0B0C10] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${branch.border}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${branch.bg} ${branch.color}`}>
                    <branch.icon className="h-6 w-6" />
                  </div>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${branch.bg} ${branch.color}`}>
                    {branch.code}
                  </span>
                </div>
                
                <h3 className="mb-2 text-lg font-bold text-white">{branch.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">
                  {branch.description}
                </p>
                <div className={`mt-6 flex items-center text-sm font-semibold transition-colors ${branch.color}`}>
                  Explore Branch <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <NativeBannerSlot slotId="resources-native-after-branches" />

        {/* SUBJECTS GRID */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Select Subject Notes</h2>
            <div className="h-px flex-1 bg-gray-800/60" />
            <Link href="/subject" className="text-sm font-medium text-[#22c55e] hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                href={subject.href}
                className="group flex items-center justify-between rounded-xl border border-gray-800 bg-[#111216] p-5 transition-colors hover:border-gray-700 hover:bg-[#15161b]"
              >
                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-[#22c55e] transition-colors">
                    {subject.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {subject.branches.map((branch) => (
                      <span key={branch} className="rounded bg-gray-800/80 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/50 text-gray-400 transition-colors group-hover:bg-[#22c55e]/10 group-hover:text-[#22c55e]">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED DOWNLOADS */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Featured Downloads</h2>
            <div className="h-px flex-1 bg-gray-800/60" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            <div className="flex items-start gap-5 rounded-2xl border border-[#22c55e]/20 bg-gradient-to-r from-[#22c55e]/10 to-transparent p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#22c55e]/20 text-[#22c55e]">
                <Calculator className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Maths Formula Sheet</h3>
                  <span className="rounded bg-[#22c55e] px-2 py-0.5 text-[10px] font-bold uppercase text-black">Free</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">All essential formulas for Engineering Mathematics.</p>
                <Link href="/formula-sheets" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#22c55e] hover:text-[#22c55e]/80 transition-colors">
                  <Download className="h-4 w-4" /> View Formulas
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-5 rounded-2xl border border-gray-800 bg-[#111216] p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-gray-300">
                <BookMarked className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Official PYQ Papers</h3>
                  <span className="rounded border border-gray-700 bg-gray-800 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-300">PDF</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">15+ years of official question papers with solutions.</p>
                <Link href="/pyqs" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  <Download className="h-4 w-4" /> Download PYQs
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* SEO FAQ SECTION */}
        <section className="mx-auto max-w-4xl py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-[#111216]/80 p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-[#22c55e]" /> Where can I find free GATE study material and notes?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                GATEPrep Pro provides free downloadable PDF formula sheets, subject-wise revision notes, and full PYQ papers for EE, CSE, ECE, ME, CE, and IN directly in our resource hub. Explore the branches above to access them.
              </p>
            </div>
            
            <div className="rounded-xl border border-gray-800 bg-[#111216]/80 p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-[#22c55e]" /> Are previous year question (PYQ) papers available for all branches?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                Yes, we host 15+ years of official GATE PYQs with detailed solutions for all major engineering branches. Click on the Official PYQ Papers link above to start practicing.
              </p>
            </div>
          </div>
        </section>

        {/* CRO UPGRADE CTA */}
        <section className="pb-12">
          <div className="mx-auto max-w-4xl rounded-3xl border-2 border-[#22c55e]/30 bg-gradient-to-b from-[#22c55e]/10 to-[#111216] p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#22c55e]/20 blur-3xl rounded-full pointer-events-none" />
            <Target className="h-10 w-10 text-[#22c55e] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Looking for a complete preparation workflow?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Don&apos;t just download PDFs. Join GATEPrep Pro Premium to access interactive flashcards, AI-powered study planners, and unlimited mock tests.
            </p>
            <SmartLinkLink href="/login?mode=signup" smartLinkSource="resources-bottom-cta" className="inline-flex rounded-xl bg-[#22c55e] px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#22c55e]/90 hover:scale-105 shadow-lg">
              Start Your Free Trial
            </SmartLinkLink>
          </div>
        </section>

      </main>
    </div>
  );
}