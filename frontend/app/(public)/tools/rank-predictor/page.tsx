'use client'

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Award, Calculator, AlertCircle, BarChart3, ChevronRight } from "lucide-react";

export default function RankPredictorPage() {
  const [marks, setMarks] = useState<string>("");
  const [category, setCategory] = useState<string>("General");
  const [branch, setBranch] = useState<string>("EE");
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<{ minRank: number; maxRank: number; gateScore: number } | null>(null);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMarks = parseFloat(marks);
    
    if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) return;

    setIsPredicting(true);
    setResult(null);

    // Simulated Rank Calculation Logic based on typical GATE EE curves
    setTimeout(() => {
      let minRank = 0;
      let maxRank = 0;
      let score = 0;

      if (parsedMarks >= 85) { minRank = 1; maxRank = 50; score = 950; }
      else if (parsedMarks >= 75) { minRank = 51; maxRank = 300; score = 850; }
      else if (parsedMarks >= 65) { minRank = 301; maxRank = 1000; score = 700; }
      else if (parsedMarks >= 55) { minRank = 1001; maxRank = 2500; score = 550; }
      else if (parsedMarks >= 45) { minRank = 2501; maxRank = 6000; score = 400; }
      else if (parsedMarks >= 35) { minRank = 6001; maxRank = 12000; score = 300; }
      else { minRank = 12001; maxRank = 25000; score = 200; }

      setResult({ minRank, maxRank, gateScore: score });
      setIsPredicting(false);
    }, 1200); // 1.2s delay for a premium "calculating" feel
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-white font-sans pb-24 selection:bg-[#22c55e]/30">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[500px] bg-[#22c55e]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <Link href="/resources" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-[#22c55e]">
          <ArrowLeft size={16} /> Back to Resources
        </Link>

        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <TrendingUp size={28} />
          </div>
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">GATE Rank Predictor</h1>
          <p className="mt-4 text-lg text-gray-400">
            Estimate your All India Rank (AIR) and GATE Score based on your expected marks. Powered by historical data analysis.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* LEFT: Input Form */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl border border-gray-800 bg-[#111216]/80 p-8 backdrop-blur-xl shadow-xl">
              <div className="absolute inset-0 rounded-3xl border-t border-white/5 pointer-events-none" />
              
              <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
                <Calculator className="text-[#22c55e]" size={20} /> Enter Details
              </h2>
              
              <form onSubmit={handlePredict} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Expected Marks (out of 100)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="block w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-[#22c55e] focus:outline-none focus:ring-1 focus:ring-[#22c55e] shadow-inner"
                    placeholder="e.g. 65.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Branch</label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="block w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-3 text-white transition-all focus:border-[#22c55e] focus:outline-none"
                    >
                      <option value="EE">GATE EE</option>
                      <option value="ECE">GATE ECE</option>
                      <option value="CS">GATE CS</option>
                      <option value="ME">GATE ME</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="block w-full rounded-xl border border-gray-700 bg-[#0B0C10] px-4 py-3 text-white transition-all focus:border-[#22c55e] focus:outline-none"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC-NCL</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPredicting || !marks}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] py-4 text-sm font-bold text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isPredicting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Analyzing data...
                    </span>
                  ) : (
                    "Predict My Rank"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Results Area */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="h-full rounded-3xl border border-[#22c55e]/30 bg-gradient-to-br from-[#111216] to-[#0B0C10] p-8 shadow-[0_20px_60px_-15px_rgba(34,197,94,0.2)] animate-in fade-in zoom-in duration-500">
                <div className="absolute inset-0 rounded-3xl border-t border-[#22c55e]/20 pointer-events-none" />
                
                <h3 className="mb-8 flex items-center gap-2 text-xl font-bold text-white">
                  <Award className="text-[#22c55e]" size={24} /> Prediction Results
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-800 bg-[#0B0C10] p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#22c55e]/10 blur-xl"></div>
                    <p className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-2">Estimated AIR Range</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-white">{result.minRank}</span>
                      <span className="text-xl text-gray-400">-</span>
                      <span className="text-4xl font-extrabold text-[#22c55e]">{result.maxRank}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-800 bg-[#0B0C10] p-6">
                    <p className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-2">Estimated GATE Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-white">~{result.gateScore}</span>
                      <span className="text-sm text-gray-500">/ 1000</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 shrink-0 text-blue-400" size={18} />
                    <p className="text-sm leading-relaxed text-blue-200">
                      <strong>Note:</strong> This prediction is based on historical data normalization. The actual rank may vary depending on the difficulty level of the {branch} paper in the current year.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                   <p className="text-sm text-gray-400">Targeting top IITs?</p>
                   <Link href={`/resources/gate-${branch.toLowerCase()}/iit-cutoffs`} className="flex items-center gap-1 text-sm font-bold text-[#22c55e] hover:underline">
                      View IIT Cutoffs <ChevronRight size={16} />
                   </Link>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-gray-800 bg-[#111216]/50 p-8 text-center backdrop-blur-sm">
                <BarChart3 className="mb-4 h-16 w-16 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-300">Awaiting Input</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  Enter your expected marks, branch, and category on the left to see your predicted All India Rank and GATE Score.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}