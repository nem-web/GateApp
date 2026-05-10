"use client";

import { useState } from "react";
import { AIPanel } from "@/components/ai-panel";
import { GATE_SUBJECTS } from "@/lib/constants";

export default function LecturesPage() {
  const [subject, setSubject] = useState(GATE_SUBJECTS[0]);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Lectures Playlist</h1>
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="card space-y-1">
          {GATE_SUBJECTS.map((s) => <button key={s} onClick={() => setSubject(s)} className={`block w-full rounded px-2 py-1 text-left text-sm ${s === subject ? "bg-brand text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{s}</button>)}
        </div>
        <div className="space-y-3">
          <div className="card">
            <p className="mb-2 text-sm font-medium">{subject} playlist</p>
            <iframe className="h-72 w-full rounded" src="https://www.youtube.com/embed/videoseries?list=PLbRMhDVUMngf8UuV4V2J6sfm6lANx7m0M" allowFullScreen />
          </div>
          <div className="card text-sm">Progress: 12 / 40 watched | Bookmark support available via `LectureProgress.bookmarks`.</div>
          <AIPanel title="AI Next Lecture Recommendation" endpoint="/api/ai/lecture-recommendation" payload={{ weakSubjects: ["Graph Theory", "TOC"] }} />
        </div>
      </div>
    </div>
  );
}
