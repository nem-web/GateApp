import React from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar"; // Adjust path if needed
import { PublicFooter } from "@/components/PublicFooter"; // Adjust path if needed
import { Check, X } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0e0f14] text-white selection:bg-[#22c55e]/30 font-sans">
      
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <WeightageSection />
        <PricingSection />
        <TestimonialSection />
        <CtaSection />
      </main>

    </div>
  );
}

// --- SUBCOMPONENTS ---

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center lg:pt-32 lg:pb-24">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1 text-xs font-medium text-[#22c55e]">
        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#22c55e]"></span>
        Built for GATE Aspirants
      </div>

      {/* Heading */}
      <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
        Crack GATE EE with a study <br className="hidden sm:block" /> system that actually compounds
      </h1>
      
      <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg">
        AI study planner, PYQ analysis, spaced flashcards, mock tests, <br className="hidden sm:block" /> weak-topic signals — all in one private dashboard.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/login?mode=signup"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-[#22c55e] px-8 text-sm font-semibold text-black transition-colors hover:bg-[#22c55e]/90"
        >
          Start Free Trial
        </Link>
        <Link
          href="/features"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-700 bg-transparent px-8 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Explore Features
        </Link>
      </div>

      {/* Mock Dashboard UI */}
      <div className="mt-16 w-full max-w-5xl rounded-xl border border-gray-800 bg-[#111216] p-4 shadow-2xl sm:p-6 lg:p-8">
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
                <p className="text-xs text-gray-500 font-medium">GATE 2026 Countdown</p>
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
                  { name: "Networks", prog: "78%" },
                  { name: "Control Systems", prog: "55%" },
                  { name: "Signals & Systems", prog: "62%" },
                  { name: "Power Systems", prog: "40%" },
                  { name: "Machines", prog: "33%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="w-32 text-gray-400">{item.name}</span>
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

function StatsSection() {
  return (
    <section className="border-y border-gray-800/50 bg-[#111216]/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          <div>
            <div className="text-3xl font-bold text-[#22c55e]">13</div>
            <div className="mt-1 text-xs text-gray-400">Subjects tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#22c55e]">2017–2025</div>
            <div className="mt-1 text-xs text-gray-400">PYQ coverage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#22c55e]">8</div>
            <div className="mt-1 text-xs text-gray-400">Core workflows</div>
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

function FeaturesSection() {
  const features = [
    { title: "AI Study Planner", desc: "Auto-builds weekly timetable from your weak topics" },
    { title: "PYQ Papers", desc: "Upload and organize previous year papers by subject" },
    { title: "Flashcards", desc: "Spaced repetition for formula revision" },
    { title: "Weak Topic Signals", desc: "Derived from tests, backlog, and recall accuracy" },
    { title: "Private Notes", desc: "Subject-linked notes that stay organized" },
    { title: "Mock Drill Tests", desc: "Timed tests with instant score analytics" },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything GATE needs, in one workspace</h2>
        <p className="mt-4 text-gray-400">Six purpose-built modules that work together.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feat, i) => (
          <div key={i} className="rounded-xl border border-gray-800 bg-[#111216] p-6 hover:border-gray-700 transition-colors">
            <div className="mb-4 h-8 w-8 rounded bg-[#22c55e]"></div>
            <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WeightageSection() {
  const data = [
    { sub: "Signals & Systems", avg: "7-9%", cur: "8%" },
    { sub: "Electrical Machines", avg: "7-9%", cur: "7%" },
    { sub: "Analog Circuits", avg: "6-8%", cur: "7%" },
    { sub: "Digital Circuits", avg: "5-7%", cur: "6%" },
    { sub: "Electromagnetic Fields", avg: "4-6%", cur: "5%" },
    { sub: "Power Electronics", avg: "4-6%", cur: "5%" },
    { sub: "Measurements", avg: "4-5%", cur: "4%" },
    { sub: "Engineering Math", avg: "13-15%", cur: "14%" },
    { sub: "General Aptitude", avg: "15%", cur: "15%" },
  ];

  return (
    <section className="border-t border-gray-800/50 bg-[#15161b] py-24 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Know where GATE EE marks come from</h2>
        <p className="mt-4 text-gray-400">Focus your energy where it matters most.</p>

        <div className="mt-12 overflow-hidden rounded-xl border border-gray-800 bg-[#0B0C10]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#111216] text-gray-400">
              <tr>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium text-center">Avg Weightage</th>
                <th className="p-4 font-medium text-center">2025</th>
              </tr>
            </thead>
            <tbody>
              {/* Highlighted Top Rows */}
              <tr className="bg-[#22c55e] text-black font-medium">
                <td className="p-4">General Aptitude</td>
                <td className="p-4 text-center">15%</td>
                <td className="p-4"></td>
              </tr>
              <tr className="bg-[#22c55e]/90 text-black font-medium">
                <td className="p-4 border-t border-black/10">Engineering Math</td>
                <td className="p-4 text-center border-t border-black/10">10-12%</td>
                <td className="p-4 border-t border-black/10"></td>
              </tr>
              <tr className="bg-[#22c55e]/80 text-black font-medium border-b border-gray-800">
                <td className="p-4 border-t border-black/10">Power Systems</td>
                <td className="p-4 text-center border-t border-black/10">9-11%</td>
                <td className="p-4 border-t border-black/10"></td>
              </tr>
              
              {/* Standard Rows */}
              {data.map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50 text-gray-300 last:border-0 hover:bg-[#111216]/50">
                  <td className="p-4">{row.sub}</td>
                  <td className="p-4 text-center">{row.avg}</td>
                  <td className="p-4 text-center font-semibold text-white">{row.cur}</td>
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
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Simple, honest pricing</h2>
        <p className="mt-4 text-gray-400">Start free. Upgrade when you&apos;re ready to go serious.</p>
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
            <li className="flex items-center text-sm text-gray-300 gap-3">
              <X className="h-4 w-4 text-gray-500" /> Basic analytics
            </li>
          </ul>
          
          <button className="w-full rounded-lg bg-gray-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700">
            Start Trial
          </button>
        </div>

        {/* Premium Plan */}
        <div className="rounded-2xl border-2 border-[#22c55e] bg-[#111216] p-8 flex flex-col relative">
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
              <Check className="h-4 w-4 text-[#22c55e]" /> All 13 subjects unlocked
            </li>
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> Full PYQ bank 2017–2025
            </li>
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> Unlimited flashcards
            </li>
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> Unlimited mock drill tests
            </li>
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> AI study planner
            </li>
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> Weak topic signals
            </li>
            <li className="flex items-center text-sm text-white gap-3">
              <Check className="h-4 w-4 text-[#22c55e]" /> Priority support
            </li>
          </ul>
          
          <button className="w-full rounded-lg bg-[#f59e0b] py-3 text-sm font-semibold text-black transition-colors hover:bg-[#d97706]">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: "GATEPrep Pro completely changed how I studied. The weak topic signals helped me identify that I was neglecting Power Systems. Ended up scoring 68 in GATE EE.",
      name: "Rohan Mehta",
      rank: "AIR 312, GATE EE 2025"
    },
    {
      quote: "The AI planner builds my weekly schedule automatically. I just follow it. No more wasted time figuring out what to study next.",
      name: "Priya Nair",
      rank: "AIR 580, GATE EE 2025"
    },
    {
      quote: "Spaced flashcards saved me during the last month. I could revise all formulae in under an hour. Nothing else comes close.",
      name: "Arjun Singh",
      rank: "AIR 741, GATE EE 2024"
    }
  ];

  return (
    <section className="border-t border-gray-800/50 bg-[#15161b] py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">From students who cracked it</h2>
          <p className="mt-4 text-gray-400">Real results from real GATE aspirants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, i) => (
            <div key={i} className="flex flex-col justify-between rounded-xl border border-gray-800 bg-[#0B0C10] p-6">
              <p className="text-sm text-gray-300 leading-relaxed mb-8">&quot;{test.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex-shrink-0"></div>
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

function CtaSection() {
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-800 bg-[#111216] px-6 py-16 text-center sm:px-12">
        <div className="mb-4 inline-flex items-center text-xs font-semibold text-[#f59e0b]">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#f59e0b]"></span>
          GATE 2026 COUNTDOWN
        </div>
        
        <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-5xl">
          <span className="text-[#f59e0b]">228 days</span> to GATE 2026.
        </h2>
        <p className="mb-8 text-gray-400">Start your structured prep today.</p>
        
        <button className="rounded-lg bg-[#22c55e] px-8 py-3.5 text-sm font-bold text-black transition-colors hover:bg-[#22c55e]/90">
          Create Free Account
        </button>
      </div>
    </section>
  );
}