import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  BookOpen, 
  ArrowRight, 
  Download, 
  ChevronRight,
  Zap,
  Monitor,
  Settings,
  Cpu,
  Building2,
  Network,
  HelpCircle,
  Target
} from "lucide-react";

// --- HIGH-INTENT SEO METADATA ---
export const metadata: Metadata = {
  title: "GATE Syllabus 2027 & PDF Downloads | EE, CSE, ECE, ME, CE",
  description: "Explore the official chapter-wise GATE 2027 syllabus for Electrical, Computer Science, Electronics, Mechanical, and Civil Engineering. Download free PDFs.",
  keywords: [
    "GATE syllabus 2027",
    "GATE syllabus PDF download",
    "GATE EE syllabus",
    "GATE CSE syllabus",
    "GATE ECE syllabus",
    "GATE mechanical syllabus"
  ],
  alternates: {
    canonical: "https://www.gateprep.tech/syllabus",
  },
};

// --- Complete Branch Data Structure ---
const syllabusData = [
  {
    id: "EE",
    title: "Electrical Engineering",
    short: "GATE EE",
    theme: {
      text: "text-[#22c55e]",
      bg: "bg-[#22c55e]",
      bgSubtle: "bg-[#22c55e]/10",
      border: "border-[#22c55e]/30",
    },
    resourceLink: "/resources/gate-ee",
    icon: Zap,
    sections: [
      { title: "Engineering Mathematics", topics: "Linear Algebra, Calculus, Differential Equations, Complex Variables, Probability and Statistics, Numerical Methods." },
      { title: "Electric Circuits", topics: "Network elements, KCL, KVL, Node and Mesh analysis, Transient response, AC circuits, Resonance, Two-port networks." },
      { title: "Electromagnetic Fields", topics: "Coulomb's Law, Electric Field Intensity, Gauss's Law, Ampere's Law, Faraday's Law, Magnetic circuits, Dielectrics." },
      { title: "Signals and Systems", topics: "Continuous and Discrete time signals, LTI systems, Fourier series, Fourier Transform, Laplace Transform, Z-Transform." },
      { title: "Electrical Machines", topics: "Single phase transformer, DC machines, Induction machines, Synchronous machines, Operating principles and performance." },
      { title: "Power Systems", topics: "Power generation concepts, Transmission line models, Per-unit quantities, Load flow methods, Fault analysis, System stability." },
    ]
  },
  {
    id: "CS",
    title: "Computer Science & IT",
    short: "GATE CS",
    theme: {
      text: "text-[#3b82f6]",
      bg: "bg-[#3b82f6]",
      bgSubtle: "bg-[#3b82f6]/10",
      border: "border-[#3b82f6]/30",
    },
    resourceLink: "/resources/gate-cs",
    icon: Monitor,
    sections: [
      { title: "Engineering & Discrete Mathematics", topics: "Discrete Math (Logic, Sets, Graphs, Combinatorics), Linear Algebra, Calculus, Probability and Statistics." },
      { title: "Digital Logic", topics: "Boolean algebra, Combinational and sequential circuits, Minimization, Number representations and computer arithmetic." },
      { title: "Computer Organization and Architecture", topics: "Machine instructions and addressing modes, ALU, data-path and control unit, Instruction pipelining, Memory hierarchy, I/O interface." },
      { title: "Programming and Data Structures", topics: "Programming in C, Recursion, Arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs." },
      { title: "Algorithms", topics: "Searching, sorting, hashing, Asymptotic worst case time and space complexity, Algorithm design techniques." },
      { title: "Operating Systems", topics: "System calls, processes, threads, inter-process communication, concurrency and synchronization, Deadlock, CPU and I/O scheduling." },
    ]
  },
  {
    id: "ME",
    title: "Mechanical Engineering",
    short: "GATE ME",
    theme: {
      text: "text-[#ef4444]",
      bg: "bg-[#ef4444]",
      bgSubtle: "bg-[#ef4444]/10",
      border: "border-[#ef4444]/30",
    },
    resourceLink: "/resources/gate-me",
    icon: Settings,
    sections: [
      { title: "Engineering Mathematics", topics: "Linear Algebra, Calculus, Differential Equations, Complex Variables, Probability and Statistics, Numerical Methods." },
      { title: "Applied Mechanics & Vibrations", topics: "Free-body diagrams and equilibrium, trusses and frames, virtual work, kinematics and dynamics, impulse and momentum, vibration." },
      { title: "Mechanics of Materials & Design", topics: "Stress and strain, elastic constants, shear force and bending moment diagrams, deflection of beams, torsion, failure theories." },
      { title: "Fluid Mechanics & Thermal", topics: "Fluid properties, fluid statics, manometry, buoyancy, Bernoulli's equations, Thermodynamic systems and processes, IC engines." },
      { title: "Heat Transfer", topics: "Modes of heat transfer, one-dimensional heat conduction, resistance concept, heat transfer through fins, free and forced convection." },
      { title: "Manufacturing Engineering", topics: "Structure and properties of engineering materials, phase diagrams, heat treatment, casting, forming and joining processes, machining." },
    ]
  },
  {
    id: "ECE",
    title: "Electronics & Comm.",
    short: "GATE ECE",
    theme: {
      text: "text-[#a855f7]",
      bg: "bg-[#a855f7]",
      bgSubtle: "bg-[#a855f7]/10",
      border: "border-[#a855f7]/30",
    },
    resourceLink: "/resources/gate-ece",
    icon: Cpu,
    sections: [
      { title: "Engineering Mathematics", topics: "Linear Algebra, Calculus, Differential Equations, Vector Analysis, Complex Analysis, Probability." },
      { title: "Networks, Signals and Systems", topics: "Network solution methods, continuous and discrete-time signals, LTI systems, Laplace and Z-transforms." },
      { title: "Electronic Devices", topics: "Energy bands, carrier transport, P-N junction, Zener diode, BJT, MOSFET, LED, photodiode." },
      { title: "Analog Circuits", topics: "Diode circuits, BJT and MOSFET amplifiers, op-amps, active filters, oscillators." },
      { title: "Digital Circuits", topics: "Number systems, combinatorial circuits, sequential circuits, data converters, semiconductor memories." },
      { title: "Communications", topics: "Random processes, analog communications, digital communications, SNR, error probability." },
    ]
  }
];

export default function SyllabusPage() {
  // --- STRUCTURED DATA (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.gateprep.tech" },
          { "@type": "ListItem", "position": 2, "name": "GATE Syllabus", "item": "https://www.gateprep.tech/syllabus" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Has the GATE 2027 syllabus changed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The core topics for major engineering branches like CSE, ECE, EE, and ME remain largely unchanged. Any minor updates provided by the organizing IIT will be instantly reflected in our syllabus hub."
            }
          },
          {
            "@type": "Question",
            "name": "How can I download the GATE syllabus PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can download the official branch-wise GATE syllabus PDF directly from our platform. Scroll to your specific branch section below and click the 'Download Official PDF' button."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans pb-24 overflow-hidden scroll-smooth">
      
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-20 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">
            <BookOpen size={14} /> Official Guidelines
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            GATE Syllabus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#22c55e]">2027</span>
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto leading-relaxed">
            Explore the complete, chapter-wise syllabus breakdown for top engineering branches. Download official PDFs and jump directly into our prep resources.
          </p>
        </div>

        {/* QUICK NAVIGATION (Anchor Links) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-20">
          {syllabusData.map((branch) => (
            <Link
              key={`nav-${branch.id}`}
              href={`#${branch.id.toLowerCase()}`}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#1A1D27] rounded-xl border border-white/5 transition-all duration-300 hover:border-white/20 hover:bg-[#2A2D3E]"
            >
              <branch.icon size={16} className={branch.theme.text} />
              {branch.short}
            </Link>
          ))}
        </div>

        {/* STACKED SYLLABUS SECTIONS (Fully Indexable) */}
        <div className="space-y-32">
          {syllabusData.map((branch) => (
            <section key={branch.id} id={branch.id.toLowerCase()} className="scroll-mt-32">
              <div className="flex flex-col lg:flex-row gap-10">
                
                {/* Left: Syllabus Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${branch.theme.bgSubtle} ${branch.theme.text}`}>
                      <branch.icon size={24} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{branch.title} Syllabus</h2>
                      <p className="text-sm text-gray-400 mt-1">Core topics for {branch.short}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {branch.sections.map((section, idx) => (
                      <div 
                        key={idx} 
                        className="group rounded-2xl border border-white/5 bg-[#1A1D27] p-6 transition-colors hover:border-white/10"
                      >
                        <h3 className={`mb-3 text-lg font-bold ${branch.theme.text}`}>
                          {section.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#9CA3AF]">
                          {section.topics}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Actions Sidebar */}
                <div className="lg:w-[320px] shrink-0 space-y-6">
                  <div className="sticky top-28">
                    {/* Prepare CTA */}
                    <div className={`rounded-2xl border ${branch.theme.border} ${branch.theme.bgSubtle} p-6 mb-6 shadow-lg`}>
                      <h3 className="text-lg font-bold text-white mb-2">Prepare for {branch.short}</h3>
                      <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
                        Access our complete library of PYQs, formula sheets, and study materials curated strictly to this syllabus.
                      </p>
                      <Link
                        href={branch.resourceLink}
                        className={`flex items-center justify-center gap-2 w-full rounded-xl ${branch.theme.bg} px-4 py-3 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95`}
                      >
                        Start Preparation <ArrowRight size={16} />
                      </Link>
                    </div>

                    {/* PDF Download Stub */}
                    <div className="rounded-2xl border border-white/5 bg-[#1A1D27] p-6 shadow-lg">
                      <h3 className="text-sm font-bold text-white mb-4">Official Documents</h3>
                      <button className="group flex w-full items-center justify-between rounded-xl bg-[#0F1117] p-4 border border-white/5 transition-colors hover:border-white/10">
                        <div className="flex items-center gap-3">
                          <Download size={18} className={branch.theme.text} />
                          <span className="text-sm font-medium text-[#E5E7EB]">Download PDF</span>
                        </div>
                        <ChevronRight size={16} className="text-[#9CA3AF] transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          ))}
        </div>

        {/* SEO FAQ SECTION */}
        <section className="mx-auto max-w-4xl py-24 mt-12 border-t border-white/5">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-[#111216] p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-blue-400" /> Has the GATE 2027 syllabus changed?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                The core topics for major engineering branches like CSE, ECE, EE, and ME remain largely unchanged year-over-year. Any minor updates provided by the organizing IIT will be instantly reflected in our syllabus hub above.
              </p>
            </div>
            
            <div className="rounded-xl border border-gray-800 bg-[#111216] p-6">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="h-5 w-5 text-blue-400" /> How can I download the GATE syllabus PDF?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                You can download the official branch-wise GATE syllabus PDF directly from our platform. Scroll to your specific branch section above and click the &quot;Download PDF&quot; button located in the sidebar.
              </p>
            </div>
          </div>
        </section>

        {/* GLOBAL CTA */}
        <section className="pb-12">
          <div className="mx-auto max-w-4xl rounded-3xl border-2 border-[#22c55e]/30 bg-gradient-to-b from-[#22c55e]/10 to-[#111216] p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#22c55e]/20 blur-3xl rounded-full pointer-events-none" />
            <Target className="h-10 w-10 text-[#22c55e] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Cover the syllabus faster with AI</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Don&apos;t just read the syllabus. Let our AI study planner build a custom daily schedule based on your weak areas and remaining time.
            </p>
            <Link href="/login?mode=signup" className="inline-flex rounded-xl bg-[#22c55e] px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#22c55e]/90 hover:scale-105 shadow-lg">
              Start Your Free Trial
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}