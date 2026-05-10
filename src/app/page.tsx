"use client";

import Link from "next/link";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AIPanel } from "@/components/ai-panel";
import { GATE_SUBJECTS } from "@/lib/constants";

const trend = [
  { week: "W1", score: 42 },
  { week: "W2", score: 51 },
  { week: "W3", score: 56 },
  { week: "W4", score: 62 }
];

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Streak", "12 days"],
          ["Hours today", "3.5h"],
          ["Subjects", "7 / 10"],
          ["GATE countdown", "210 days"]
        ].map(([k, v]) => (
          <div key={k} className="card">
            <p className="text-xs text-slate-500">{k}</p>
            <p className="text-xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-semibold">Subject Progress</h2>
          <div className="space-y-2">
            {GATE_SUBJECTS.map((s, i) => (
              <div key={s}>
                <div className="mb-1 flex justify-between text-xs"><span>{s}</span><span>{45 + i * 5}%</span></div>
                <div className="h-2 rounded bg-slate-200"><div className="h-2 rounded bg-brand" style={{ width: `${45 + i * 5}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <AIPanel title="AI Insight" endpoint="/api/ai/dashboard-insight" payload={{ recentScores: trend }} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-semibold">Today Top Tasks</h2>
          <ul className="list-disc pl-5 text-sm">
            <li>Revise Graph Theory notes</li>
            <li>Solve 20 TOC PYQs</li>
            <li>Watch DBMS indexing lecture</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Link href="/study-plan" className="rounded bg-brand px-3 py-2 text-xs text-white">Resume session</Link>
            <Link href="/test" className="rounded border px-3 py-2 text-xs">Start test</Link>
            <Link href="/notes" className="rounded border px-3 py-2 text-xs">Add note</Link>
            <Link href="/games" className="rounded border px-3 py-2 text-xs">Take 5-min break</Link>
          </div>
        </div>
        <div className="card">
          <h2 className="mb-3 font-semibold">Score Trend</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#5b7cfa" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
