"use client";

import { useState } from "react";
import { toast } from "sonner";

export function AIPanel({ title, endpoint, payload }: { title: string; endpoint: string; payload: Record<string, unknown> }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("No suggestion yet.");
  const [error, setError] = useState<string>("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult(data.content);
      toast.success("AI response ready");
    } catch (e) {
      setError("Could not generate. Retry.");
      toast.error("AI call failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button className="rounded bg-brand px-3 py-1 text-xs text-white" onClick={generate} disabled={loading}>
          {loading ? "Loading..." : "Regenerate"}
        </button>
      </div>
      {loading ? <div className="h-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /> : <p className="text-sm text-slate-700 dark:text-slate-200">{result}</p>}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
