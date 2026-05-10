"use client";

import { useEffect, useMemo, useState } from "react";

export default function GamesPage() {
  const [a, b] = useMemo(() => [Math.ceil(Math.random() * 20), Math.ceil(Math.random() * 20)], []);
  const [secs, setSecs] = useState(30);
  const [quote, setQuote] = useState("Loading quote...");

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((r) => r.json())
      .then((d) => setQuote(d.content))
      .catch(() => setQuote("Keep pushing. You are closer than you think."));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Mind Refresh Games</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card"><h2 className="font-semibold">Math Speed (30s)</h2><p className="mt-2">{a} + {b} = ? ({secs}s)</p></div>
        <div className="card"><h2 className="font-semibold">Memory Match</h2><p className="mt-2 text-sm">16-card matching grid scaffold.</p></div>
        <div className="card"><h2 className="font-semibold">Breathing 4-7-8</h2><div className="mt-3 h-20 w-20 animate-pulse rounded-full bg-brand/40" /></div>
        <div className="card"><h2 className="font-semibold">2048 Mini</h2><p className="mt-2 text-sm">Plug in lightweight 2048 component here.</p></div>
      </div>
      <div className="card"><p className="text-sm italic">{quote}</p></div>
    </div>
  );
}
