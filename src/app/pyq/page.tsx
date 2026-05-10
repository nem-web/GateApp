"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AIPanel } from "@/components/ai-panel";

const data = [
  { topic: "Graph Theory", freq: 12 },
  { topic: "DBMS", freq: 9 },
  { topic: "CN", freq: 11 },
  { topic: "TOC", freq: 7 }
];

export default function PYQPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Previous Year Questions</h1>
      <div className="card">
        <p className="mb-2 text-sm">Inline PDF Viewer (PDF.js integration point)</p>
        <iframe className="h-96 w-full rounded border" src="/sample-pyq.pdf" />
      </div>
      <div className="card">
        <h2 className="mb-2 font-semibold">Topic Heatmap</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="topic" /><YAxis /><Tooltip />
              <Bar dataKey="freq" fill="#5b7cfa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <AIPanel title="Predict Hot Topics" endpoint="/api/ai/predict-hot-topics" payload={{ frequencies: data }} />
    </div>
  );
}
