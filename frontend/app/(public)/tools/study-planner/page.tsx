"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2, ChevronRight } from "lucide-react";

export default function StudyPlannerPage() {
  const [branch, setBranch] = useState("EE");
  const [months, setMonths] = useState<number>(6);
  const [hours, setHours] = useState<number>(4);
  const [isGenerated, setIsGenerated] = useState(false);

  const totalHours = months * 30 * hours;

  // Simple algorithm to divide hours
  const phase1Hours = Math.floor(totalHours * 0.5); // 50% Foundation
  const phase2Hours = Math.floor(totalHours * 0.3); // 30% Advanced & Math
  const phase3Hours = Math.floor(totalHours * 0.2); // 20% Revision & Mocks

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-[#E5E7EB] font-sans selection:bg-[#f59e0b]/30 pb-24">
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#f59e0b]/15 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
        <Link 
          href="/tools" 
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-[#f59e0b]"
        >
          <ArrowLeft size={16} /> Back to Tools
        </Link>

        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg border border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]">
            <CalendarDays size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Smart Study Planner</h1>
            <p className="text-gray-400 mt-1">Generate a dynamic roadmap based on your available time.</p>
          </div>
        </div>

        {!isGenerated ? (
          <form onSubmit={handleGenerate} className="rounded-2xl border border-gray-800 bg-[#111216]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Tell us about your prep</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Target Branch</label>
                <select 
                  value={branch} 
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-3 text-white focus:border-[#f59e0b] focus:outline-none"
                >
                  <option value="EE">Electrical (EE)</option>
                  <option value="CS">Computer Science (CS)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="ME">Mechanical (ME)</option>
                  <option value="CE">Civil (CE)</option>
                  <option value="IN">Instrumentation (IN)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Months Left for GATE</label>
                <input 
                  type="number" min="1" max="24" required
                  value={months} onChange={(e) => setMonths(Number(e.target.value))} 
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-3 text-white focus:border-[#f59e0b] focus:outline-none" 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-300 mb-2">Daily Study Hours Dedicated</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="1" max="14" 
                    value={hours} onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full accent-[#f59e0b]"
                  />
                  <span className="flex-shrink-0 w-16 text-center font-bold text-white bg-gray-800 py-1 rounded-lg">{hours} hrs</span>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full rounded-xl bg-[#f59e0b] py-3.5 font-bold text-black hover:bg-[#f59e0b]/90 transition-all flex items-center justify-center gap-2">
              Generate My Roadmap <ChevronRight size={18} />
            </button>
          </form>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-gray-800 bg-[#111216] p-6">
              <div>
                <h2 className="text-xl font-bold text-white">Your GATE {branch} Roadmap</h2>
                <p className="text-sm text-gray-400 mt-1">Total estimated effort: <strong className="text-[#f59e0b]">{totalHours} hours</strong></p>
              </div>
              <button 
                onClick={() => setIsGenerated(false)}
                className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Re-calculate
              </button>
            </div>

            {/* Timeline UI */}
            <div className="relative border-l-2 border-gray-800 ml-4 md:ml-6 space-y-10 py-4">
              
              {/* Phase 1 */}
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full border-4 border-[#0e0f14] bg-[#f59e0b]" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold uppercase mb-3 border border-[#f59e0b]/20">
                  Phase 1: Foundation
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Core Subject Mastery</h3>
                <p className="text-gray-400 mb-4 max-w-2xl text-sm leading-relaxed">
                  Focus purely on the highest weightage technical subjects for your branch. Do not worry about speed; focus entirely on concept building and standard textbook problems.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300 bg-gray-800/40 w-fit px-4 py-2 rounded-lg">
                  <CheckCircle2 size={16} className="text-[#f59e0b]" /> Allocate: {phase1Hours} hours
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full border-4 border-[#0e0f14] bg-blue-500" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase mb-3 border border-blue-500/20">
                  Phase 2: Advancement
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Math, Aptitude & Remaining Core</h3>
                <p className="text-gray-400 mb-4 max-w-2xl text-sm leading-relaxed">
                  Cover Engineering Mathematics and General Aptitude (constitutes 28-30 marks). Wrap up the remaining low-weightage core subjects. Start practicing PYQs chapter-wise.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300 bg-gray-800/40 w-fit px-4 py-2 rounded-lg">
                  <CheckCircle2 size={16} className="text-blue-500" /> Allocate: {phase2Hours} hours
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full border-4 border-[#0e0f14] bg-green-500" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase mb-3 border border-green-500/20">
                  Phase 3: The Climax
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Revision & Full-Length Mocks</h3>
                <p className="text-gray-400 mb-4 max-w-2xl text-sm leading-relaxed">
                  No new subjects. Rely entirely on short notes and formula sheets. Attempt at least 15-20 full-length mock tests and spend equal time analyzing your mistakes.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300 bg-gray-800/40 w-fit px-4 py-2 rounded-lg">
                  <CheckCircle2 size={16} className="text-green-500" /> Allocate: {phase3Hours} hours
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}