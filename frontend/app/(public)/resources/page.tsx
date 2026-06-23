import React from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronRight, 
  Calculator,
  Download,
  BookMarked,
  Zap,
  Cpu,
  Monitor,
  Cog
} from "lucide-react";

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
  { name: "Engineering Mathematics", branches: ["All Branches"], href: "/subjects/mathematics" },
  { name: "General Aptitude", branches: ["All Branches"], href: "/subjects/aptitude" },
  { name: "Signals & Systems", branches: ["EE", "ECE", "IN"], href: "/subjects/signals-systems" },
  { name: "Networks", branches: ["EE", "ECE", "IN"], href: "/subjects/networks" },
  { name: "Control Systems", branches: ["EE", "ECE", "IN"], href: "/subjects/control-systems" },
  { name: "Electrical Machines", branches: ["EE", "IN"], href: "/subjects/electrical-machines" },
  { name: "Power Systems", branches: ["EE"], href: "/subjects/power-systems" },
  { name: "Analog Circuits", branches: ["EE", "ECE", "IN"], href: "/subjects/analog-circuits" },
  { name: "Digital Circuits", branches: ["EE", "ECE", "IN", "CS"], href: "/subjects/digital-circuits" },
  { name: "Electromagnetic Fields", branches: ["EE", "ECE"], href: "/subjects/emt" },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#0e0f14] text-white font-sans pb-24 selection:bg-[#22c55e]/30">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-gray-800/50 bg-[#111216]/50 pt-20 pb-16">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#22c55e]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Resource <span className="text-[#22c55e]">Hub</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg">
            Everything you need to crack GATE. Search for PYQs, formula sheets, subject notes, and smart tools all in one place.
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

        {/* SUBJECTS GRID */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Select Subject</h2>
            <div className="h-px flex-1 bg-gray-800/60" />
            <Link href="/subjects" className="text-sm font-medium text-[#22c55e] hover:underline">
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
                <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#22c55e] hover:text-[#22c55e]/80 transition-colors">
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>
            </div>

            <div className="flex items-start gap-5 rounded-2xl border border-gray-800 bg-[#111216] p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-gray-300">
                <BookMarked className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">GATE 2026 EE Syllabus</h3>
                  <span className="rounded border border-gray-700 bg-gray-800 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-300">PDF</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">Official syllabus with topic-wise weightage breakdown.</p>
                <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}