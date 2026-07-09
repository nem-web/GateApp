import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Check, X, HelpCircle } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { SmartLinkLink } from "@/components/ads/SmartLinkLink";

// --- HIGHLY OPTIMIZED METADATA ---
export const metadata: Metadata = {
  title: "GATE Preparation 2027 | Best Platform for CS, EE | GATEPrep Pro",
  description: "The ultimate GATE preparation platform. Access AI study planners, PYQs, flashcards, and notes for Computer Science (CSE), ECE, Electrical (EE), and Mechanical. Start for free!",
  keywords: [
    "gate preparation",
    "gate preparation 2027",
    "gate preparation for cse",
    "gate preparation for ece",
    "gate preparation for ee",
    "gate preparation books",
    "best gate preparation app",
    "gate study planner",
    "gate pyq online"
  ],
  alternates: {
    canonical: "https://www.gateprep.tech",
  },
  openGraph: {
    title: "Complete GATE Preparation Workspace | GATEPrep Pro",
    description: "AI-coached study plans, previous year papers, flashcards, and precise weak-area tracking for GATE 2027 aspirants.",
    url: "https://www.gateprep.tech",
    siteName: "GATEPrep Pro",
    images: [
      {
        url: "/og-homepage.jpg", // Ensure you add this image to your public folder
        width: 1200,
        height: 630,
        alt: "GATEPrep Pro Dashboard Preview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function HomePage() {
  // --- STRUCTURED DATA (JSON-LD) FOR RICH SNIPPETS & AI SEARCH ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "GATEPrep Pro",
        "operatingSystem": "Web, iOS, Android",
        "applicationCategory": "EducationalApplication",
        "offers": {
          "@type": "Offer",
          "price": "299",
          "priceCurrency": "INR"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "125"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How to start GATE preparation 2027 for CSE and ECE?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Start by analyzing the syllabus and weightage for your specific branch (CSE, ECE, or EE). Use the GATEPrep Pro AI Study Planner to generate a daily roadmap, and begin practicing Previous Year Questions (PYQs) immediately."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need standard GATE preparation books?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "While standard GATE preparation books build foundational concepts, solving numericals is the key to a high rank. GATEPrep Pro supplements your books with interactive flashcards, concise revision notes, and highly organized PYQ analytics."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-white selection:bg-[#22c55e]/30 font-sans">
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main>
        <HeroSection />
        <TopBannerSection />
        <StatsSection />
        <SupportedBranchesSection />
        <FeaturesSection />
        <Inline468Section />
        <WeightageSection />
        <PricingSection />
        <Inline300x250Section />
        <TestimonialSection />
        <FaqSection />
        <CtaSection />
      </main>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22c55e]/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Badge */}
      <div className="relative z-10 mb-6 inline-flex items-center rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1 text-xs font-medium text-[#22c55e]">
        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#22c55e]"></span>
        Targeting GATE 2027
      </div>

      {/* Optimized H1 Heading */}
      <h1 className="relative z-10 mx-auto max-w-5xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
        The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#10b981]">GATE Preparation</span> Platform
      </h1>
      
      <p className="relative z-10 mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg">
        Stop relying on heavy GATE preparation books alone. Combine AI study planners, PYQ analysis, spaced flashcards, and mock tests for <strong>CSE, ECE, EE, and ME</strong>.
      </p>

      {/* Buttons */}
      <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <SmartLinkLink
          href="/login?mode=signup"
          smartLinkSource="home-hero-start-trial"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-[#22c55e] px-8 text-sm font-semibold text-black transition-all hover:bg-[#22c55e]/90 shadow-lg hover:shadow-[#22c55e]/20 hover:-translate-y-0.5"
        >
          Start Free Trial
        </SmartLinkLink>
        <Link
          href="/features"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-700 bg-[#111216]/80 px-8 text-sm font-medium text-white transition-colors hover:bg-gray-800 backdrop-blur-sm"
        >
          Explore Features
        </Link>
      </div>

      {/* Mock Dashboard UI */}
      <div className="relative z-10 mt-16 w-full max-w-5xl rounded-xl border border-gray-800 bg-[#111216]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
        <div className="flex h-4 items-center gap-1.5 mb-6 opacity-50">
          <div className="h-3 w-3 rounded-full bg-gray-600"></div>
          <div className="h-3 w-3 rounded-full bg-gray-600"></div>
          <div className="h-3 w-3 rounded-full bg-gray-600"></div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="hidden md:flex w-48 flex-col space-y-2">
            <div className="rounded-lg bg-[#22c55e] px-4 py-2.5 text-xs font-semibold text-black">Dashboard</div>
            <div className="rounded-lg px-4 py-2.5 text-xs font-medium text-gray-400">PYQ Papers</div>
            <div className="rounded-lg px-4 py-2.5 text-xs font-medium text-gray-400">Flashcards</div>
            <div className="rounded-lg px-4 py-2.5 text-xs font-medium text-gray-400">Mock Tests</div>
            <div className="rounded-lg px-4 py-2.5 text-xs font-medium text-gray-400">Notes</div>
            <div className="rounded-lg px-4 py-2.5 text-xs font-medium text-gray-400">Analytics</div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Top Bar / Countdown */}
            <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-[#0B0C10] p-5">
              <div>
                <p className="text-xs text-gray-500 font-medium">GATE 2027 Countdown</p>
                <p className="text-2xl font-bold text-white"><span className="text-[#f59e0b]">228</span> days remaining</p>
              </div>
              <div className="flex gap-4 text-center hidden sm:flex">
                <div><p className="text-[#f59e0b] font-bold text-xl">228</p><p className="text-[10px] text-gray-500 uppercase">Days</p></div>
                <div><p className="text-[#f59e0b] font-bold text-xl">12</p><p className="text-[10px] text-gray-500 uppercase">Hours</p></div>
                <div><p className="text-[#f59e0b] font-bold text-xl">45</p><p className="text-[10px] text-gray-500 uppercase">Mins</p></div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="rounded-lg border border-gray-800 bg-[#0B0C10] p-6">
              <h3 className="mb-6 text-center text-sm font-semibold text-white">Subject Progress</h3>
              <div className="space-y-4">
                {[
                  { name: "Networks / Data Structures", prog: "78%" },
                  { name: "Control Systems / Algorithms", prog: "55%" },
                  { name: "Signals / Operating Systems", prog: "62%" },
                  { name: "Power Systems / DBMS", prog: "40%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="w-40 text-gray-400 truncate pr-2">{item.name}</span>
                    <div className="mx-4 h-2 flex-1 rounded-full bg-gray-800 overflow-hidden">
                      <div className="h-full bg-[#22c55e] rounded-full" style={{ width: item.prog }}></div>
                    </div>
                    <span className="w-8 text-right text-[#22c55e] font-medium">{item.prog}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TopBannerSection() {
  return (
    <section className="border-y border-gray-800/50 bg-[#111216]/70 py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot
          slotId="home-top-leaderboard"
          format="banner-728x90"
          variants={[
            { width: 728, height: 90, minViewport: 1024 },
            { width: 468, height: 60, minViewport: 640, maxViewport: 1023 },
            { width: 320, height: 50, maxViewport: 639 },
          ]}
          smartLinkSource="home-top-leaderboard"
        />
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="border-y border-gray-800/50 bg-[#111216]/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          <div>
            <div className="text-3xl font-bold text-[#22c55e]">15+</div>
            <div className="mt-1 text-xs text-gray-400">Subjects tracked per branch</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#22c55e]">2013–2025</div>
            <div className="mt-1 text-xs text-gray-400">PYQ coverage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#22c55e]">8</div>
            <div className="mt-1 text-xs text-gray-400">Core study workflows</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#22c55e]">₹299/mo</div>
            <div className="mt-1 text-xs text-gray-400">Premium plan</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- NEW: Supported Branches Section to rank for CSE/ECE keywords ---
function SupportedBranchesSection() {
  const branches = [
    { name: "Computer Science (CSE)", href: "/resources/gate-cs" },
    { name: "Electronics (ECE)", href: "/resources/gate-ece" },
    { name: "Electrical (EE)", href: "/resources/gate-ee" },
    { name: "Mechanical (ME)", href: "/resources/gate-me" },
    { name: "Civil (CE)", href: "/resources/gate-ce" },
    { name: "Instrumentation (IN)", href: "/resources/gate-in" },
  ];

  return (
    <section className="py-16 bg-[#0B0C10] border-b border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-8">Specialized preparation for top branches</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {branches.map((branch, i) => (
            <Link 
              key={i} 
              href={branch.href}
              className="px-6 py-2.5 rounded-full border border-gray-700 bg-[#111216] text-sm font-medium text-gray-300 hover:border-[#22c55e] hover:text-[#22c55e] transition-all"
            >
              {branch.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: "AI Study Planner", desc: "Auto-builds a weekly timetable based on your weak topics and remaining days to GATE 2027." },
    { title: "PYQ Analytics", desc: "Upload and organize previous year papers by subject. See exactly which chapters repeat most." },
    { title: "Spaced Flashcards", desc: "Ditch traditional GATE preparation books for quick, spaced-repetition formula revision." },
    { title: "Weak Topic Signals", desc: "Our algorithm derives your weaknesses directly from mock tests, backlog, and recall accuracy." },
    { title: "Digital Notes", desc: "Subject-linked, markdown-supported private notes that stay permanently organized." },
    { title: "Mock Drill Tests", desc: "Timed full-length and subject-wise tests with instant score analytics and negative marking calculations." },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything GATE needs, in one workspace</h2>
        <p className="mt-4 text-gray-400">Six purpose-built modules that replace unorganized notebooks.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feat, i) => (
          <div key={i} className="rounded-xl border border-gray-800 bg-[#111216] p-6 hover:border-gray-700 transition-colors">
            <div className="mb-4 h-8 w-8 rounded bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center font-bold">
              {i + 1}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Inline468Section() {
  return (
    <section className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdSlot
          slotId="home-mid-inline-468"
          format="banner-468x60"
          variants={[
            { width: 468, height: 60, minViewport: 768 },
            { width: 320, height: 50, maxViewport: 767 },
          ]}
          smartLinkSource="home-mid-inline-468"
        />
      </div>
    </section>
  );
}

function WeightageSection() {
  const data = [
    { sub: "Core Branch Subjects", avg: "65-70%", cur: "70%" },
    { sub: "Engineering Math", avg: "13-15%", cur: "15%" },
    { sub: "General Aptitude", avg: "15%", cur: "15%" },
  ];

  return (
    <section className="border-t border-gray-800/50 bg-[#15161b] py-24 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Know exactly where marks come from</h2>
        <p className="mt-4 text-gray-400">Focus your energy where it matters most, whether you are in CSE, ECE, or EE.</p>

        <div className="mt-12 overflow-hidden rounded-xl border border-gray-800 bg-[#0B0C10]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#111216] text-gray-400">
              <tr>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-center">Avg Weightage</th>
                <th className="p-4 font-medium text-center">GATE 2025</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className={`border-b border-gray-800/50 last:border-0 ${i === 2 ? 'bg-[#22c55e]/10 text-white font-medium' : 'text-gray-300'}`}>
                  <td className="p-4">{row.sub}</td>
                  <td className="p-4 text-center">{row.avg}</td>
                  <td className={`p-4 text-center font-semibold ${i === 2 ? 'text-[#22c55e]' : 'text-white'}`}>{row.cur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-24 px-4 mx-auto max-w-5xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Honest pricing for Indian students</h2>
        <p className="mt-4 text-gray-400">Start free. Upgrade when you&apos;re ready to get serious about your rank.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="rounded-2xl border border-gray-800 bg-[#111216] p-8 flex flex-col">
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Trial</p>
          <h3 className="text-3xl font-bold text-white mb-2">Free</h3>
          <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">No credit card needed</p>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-sm text-gray-300 gap-3">
              <X className="h-4 w-4 text-gray-500" /> 3 subjects only
            </li>
            <li className="flex items-center text-sm text-gray-300 gap-3">
              <X className="h-4 w-4 text-gray-500" /> 10 PYQs per subject
            </li>
            <li className="flex items-center text-sm text-gray-300 gap-3">
              <X className="h-4 w-4 text-gray-500" /> 50 flashcards limit
            </li>
            <li className="flex items-center text-sm text-gray-300 gap-3">
              <X className="h-4 w-4 text-gray-500" /> No mock tests
            </li>
          </ul>
          
          <Link href="/login" className="w-full text-center rounded-lg bg-gray-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700">
            Start Trial
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="rounded-2xl border-2 border-[#22c55e] bg-[#111216] p-8 flex flex-col relative shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#22c55e] text-black text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </div>
          <p className="text-xs font-semibold text-[#22c55e] tracking-wider uppercase mb-2">Premium</p>
          <div className="flex items-baseline gap-1 mb-2">
            <h3 className="text-3xl font-bold text-white">₹299</h3>
            <span className="text-gray-400 text-sm">/mo</span>
          </div>
          <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Everything you need to crack GATE</p>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> All subjects unlocked
            </li>
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> Full PYQ bank 2013–2025
            </li>
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> Unlimited flashcards & tests
            </li>
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> AI study planner & weak signals
            </li>
          </ul>
          
          <Link href="/pricing" className="w-full text-center rounded-lg bg-[#f59e0b] py-3 text-sm font-semibold text-black transition-colors hover:bg-[#d97706]">
            Upgrade to Premium
          </Link>
        </div>
      </div>
    </section>
  );
}

function Inline300x250Section() {
  return (
    <section className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdSlot
          slotId="home-inline-300x250"
          format="banner-300x250"
          variants={[
            { width: 300, height: 250, minViewport: 640 },
            { width: 320, height: 50, maxViewport: 639 },
          ]}
          smartLinkSource="home-inline-300x250"
        />
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: "GATEPrep Pro completely changed how I studied. The weak topic signals helped me identify that I was neglecting Data Structures. Ended up scoring 68 in GATE CSE.",
      name: "Rohan Mehta",
      rank: "AIR 312, GATE CSE 2025"
    },
    {
      quote: "The AI planner builds my weekly schedule automatically. No more wasting time figuring out what to study next. It replaces 5 different GATE preparation books.",
      name: "Priya Nair",
      rank: "AIR 580, GATE ECE 2025"
    },
    {
      quote: "Spaced flashcards saved me during the last month. I could revise all formulas in under an hour. Best investment for my GATE EE journey.",
      name: "Arjun Singh",
      rank: "AIR 741, GATE EE 2024"
    }
  ];

  return (
    <section className="border-t border-gray-800/50 bg-[#15161b] py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">From students who cracked it</h2>
          <p className="mt-4 text-gray-400">Real results from aspirants using our integrated preparation system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, i) => (
            <div key={i} className="flex flex-col justify-between rounded-xl border border-gray-800 bg-[#0B0C10] p-6 hover:border-gray-700 transition-colors">
              <p className="text-sm text-gray-300 leading-relaxed mb-8">&quot;{test.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0 flex items-center justify-center font-bold text-gray-400">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{test.name}</p>
                  <p className="text-xs text-[#22c55e]">{test.rank}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- NEW: FAQ Section for AI Search & Keyword Targeting ---
function FaqSection() {
  const faqs = [
    {
      q: "How to start GATE preparation 2027 for CSE and ECE?",
      a: "Start by analyzing the syllabus and weightage for your specific branch. Use the GATEPrep Pro AI Study Planner to generate a daily roadmap, read standard books for foundation, and begin practicing Previous Year Questions (PYQs) immediately."
    },
    {
      q: "Are standard GATE preparation books enough?",
      a: "While standard books build foundational concepts, solving numericals is the key to a high rank. GATEPrep Pro supplements your books with interactive flashcards, concise revision notes, and highly organized PYQ analytics."
    },
    {
      q: "Does this platform support Mechanical and Civil engineering?",
      a: "Yes! While many platforms focus only on CS or EE, GATEPrep Pro offers dedicated mock tests, PYQ databases, and study planners for Mechanical (ME), Civil (CE), and Instrumentation (IN)."
    }
  ];

  return (
    <section className="py-24 px-4 mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
        <p className="mt-4 text-gray-400">Everything you need to know about preparing for GATE 2027.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-gray-800 bg-[#111216] p-6">
            <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
              <HelpCircle className="h-5 w-5 text-[#22c55e]" /> {faq.q}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed ml-8">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-24 px-4 border-t border-gray-800/50">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#22c55e]/20 bg-[#22c55e]/5 px-6 py-16 text-center sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#22c55e]/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 mb-4 inline-flex items-center text-xs font-semibold text-[#f59e0b]">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#f59e0b]"></span>
          GATE 2027 COUNTDOWN
        </div>
        
        <h2 className="relative z-10 mb-4 text-3xl font-extrabold text-white sm:text-5xl">
          <span className="text-[#f59e0b]">228 days</span> to GATE 2027.
        </h2>
        <p className="relative z-10 mb-8 text-gray-400 max-w-xl mx-auto">
          Start your structured preparation today. Get access to the best AI tools, PYQs, and study materials for your branch.
        </p>
        
        <SmartLinkLink href="/login?mode=signup" smartLinkSource="home-bottom-cta" className="relative z-10 inline-flex rounded-lg bg-[#22c55e] px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#22c55e]/90 hover:scale-105 shadow-lg">
          Create Free Account
        </SmartLinkLink>
      </div>
    </section>
  );
}
