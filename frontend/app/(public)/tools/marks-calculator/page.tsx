"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, RotateCcw, Award } from "lucide-react";

export default function MarksCalculatorPage() {
  // State for 1-Mark Questions
  const [mcq1Correct, setMcq1Correct] = useState<number>(0);
  const [mcq1Wrong, setMcq1Wrong] = useState<number>(0);
  const [nat1Correct, setNat1Correct] = useState<number>(0); // NAT/MSQ have no negative marking

  // State for 2-Mark Questions
  const [mcq2Correct, setMcq2Correct] = useState<number>(0);
  const [mcq2Wrong, setMcq2Wrong] = useState<number>(0);
  const [nat2Correct, setNat2Correct] = useState<number>(0);

  // Calculations
  const positiveMarks = mcq1Correct * 1 + nat1Correct * 1 + mcq2Correct * 2 + nat2Correct * 2;
  const negativeMarks = mcq1Wrong * (1 / 3) + mcq2Wrong * (2 / 3);
  const totalMarks = positiveMarks - negativeMarks;

  const handleReset = () => {
    setMcq1Correct(0); setMcq1Wrong(0); setNat1Correct(0);
    setMcq2Correct(0); setMcq2Wrong(0); setNat2Correct(0);
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-[#E5E7EB] font-sans selection:bg-[#3b82f6]/30 pb-24">
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3b82f6]/15 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        <Link 
          href="/tools" 
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-[#3b82f6]"
        >
          <ArrowLeft size={16} /> Back to Tools
        </Link>

        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6]">
              <Calculator size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">GATE Marks Calculator</h1>
              <p className="text-gray-400 mt-1">Calculate precise scores with official negative marking rules.</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1-Mark Section */}
            <div className="rounded-2xl border border-gray-800 bg-[#111216]/80 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">1-Mark Questions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">MCQs (1/3 Negative)</h3>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Correct Attempts</label>
                    <input type="number" min="0" value={mcq1Correct || ""} onChange={(e) => setMcq1Correct(Number(e.target.value))} className="w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-2 text-white focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Wrong Attempts</label>
                    <input type="number" min="0" value={mcq1Wrong || ""} onChange={(e) => setMcq1Wrong(Number(e.target.value))} className="w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">NATs / MSQs (No Negative)</h3>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Correct Attempts</label>
                    <input type="number" min="0" value={nat1Correct || ""} onChange={(e) => setNat1Correct(Number(e.target.value))} className="w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-2 text-white focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Mark Section */}
            <div className="rounded-2xl border border-gray-800 bg-[#111216]/80 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">2-Mark Questions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">MCQs (2/3 Negative)</h3>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Correct Attempts</label>
                    <input type="number" min="0" value={mcq2Correct || ""} onChange={(e) => setMcq2Correct(Number(e.target.value))} className="w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-2 text-white focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Wrong Attempts</label>
                    <input type="number" min="0" value={mcq2Wrong || ""} onChange={(e) => setMcq2Wrong(Number(e.target.value))} className="w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">NATs / MSQs (No Negative)</h3>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Correct Attempts</label>
                    <input type="number" min="0" value={nat2Correct || ""} onChange={(e) => setNat2Correct(Number(e.target.value))} className="w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-2 text-white focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-[#3b82f6]/30 bg-gradient-to-b from-[#3b82f6]/10 to-[#111216] p-6 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#3b82f6]/20 text-[#3b82f6] mb-4">
                  <Award size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-300">Estimated Score</h3>
                <div className="text-5xl font-extrabold text-white mt-2">
                  {totalMarks.toFixed(2)} <span className="text-xl text-gray-500 font-normal">/ 100</span>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-800 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Positive Marks</span>
                  <span className="font-bold text-green-400">+{positiveMarks.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Negative Penalties</span>
                  <span className="font-bold text-red-400">-{negativeMarks.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Attempted</span>
                  <span className="font-bold text-white">
                    {mcq1Correct + mcq1Wrong + nat1Correct + mcq2Correct + mcq2Wrong + nat2Correct} / 65
                  </span>
                </div>
              </div>

              <button className="mt-8 w-full rounded-xl bg-[#3b82f6] py-3 font-bold text-black hover:bg-[#3b82f6]/90 transition-colors">
                Predict Rank
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}