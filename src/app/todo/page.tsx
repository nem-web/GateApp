"use client";

import { useState } from "react";
import { AIPanel } from "@/components/ai-panel";

type T = { id: number; title: string; priority: "high" | "medium" | "low"; done: boolean };

export default function TodoPage() {
  const [tasks, setTasks] = useState<T[]>([{ id: 1, title: "Revise trees", priority: "high", done: false }]);
  const [input, setInput] = useState("");
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">To-Do List</h1>
      <div className="card space-y-3">
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" placeholder="Add task..." />
          <button className="rounded bg-brand px-3 py-2 text-sm text-white" onClick={() => {
            if (!input) return;
            setTasks((t) => [...t, { id: Date.now(), title: input, priority: "medium", done: false }]);
            setInput("");
          }}>Add</button>
        </div>
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded border p-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={t.done} onChange={() => setTasks((all) => all.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))} />
              {t.title}
            </label>
            <span className={`rounded px-2 py-1 text-xs ${t.priority === "high" ? "bg-red-100 text-red-700" : t.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{t.priority}</span>
          </div>
        ))}
      </div>
      <AIPanel title="AI Task Suggestions" endpoint="/api/ai/task-suggestions" payload={{ weakTopics: ["Graph Theory", "CN"] }} />
    </div>
  );
}
