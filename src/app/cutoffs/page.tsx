"use client";

import { useState } from "react";
import { AIPanel } from "@/components/ai-panel";

const table = [
  { college: "IIT Bombay", year: 2024, branch: "CSE", category: "General", cutoff: 72 },
  { college: "NIT Trichy", year: 2024, branch: "CSE", category: "General", cutoff: 65 }
];

export default function CutoffsPage() {
  const [score, setScore] = useState(60);
  const rank = Math.max(1, Math.round(1200 - score * 12));
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Cutoffs & College Info</h1>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr><th>College</th><th>Year</th><th>Branch</th><th>Category</th><th>Cutoff</th></tr></thead>
          <tbody>{table.map((r) => <tr key={r.college}><td>{r.college}</td><td>{r.year}</td><td>{r.branch}</td><td>{r.category}</td><td>{r.cutoff}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="card">
        <h2 className="font-semibold">Score to Rank Predictor</h2>
        <input type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} className="mt-2 rounded border px-3 py-2 text-sm" />
        <p className="mt-2 text-sm">Estimated rank range: {rank - 120} to {rank + 120}</p>
      </div>
      <AIPanel title="AI College Advisor" endpoint="/api/ai/college-advisor" payload={{ rank, branch: "CSE", category: "General" }} />
    </div>
  );
}
