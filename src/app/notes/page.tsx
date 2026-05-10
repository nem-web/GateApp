"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import { AIPanel } from "@/components/ai-panel";

export default function NotesPage() {
  const [front, setFront] = useState("Term");
  const [back, setBack] = useState("Definition");
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: "Write full note..." })],
    content: "<p>GATE notes...</p>"
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Notes</h1>
      <div className="card">
        <h2 className="mb-2 font-semibold">Full Notes (TipTap)</h2>
        <EditorContent editor={editor} className="min-h-48 rounded border p-3" />
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <AIPanel title="Summarize Note" endpoint="/api/ai/summarize-note" payload={{ text: editor?.getText() ?? "" }} />
          <AIPanel title="Explain Concept" endpoint="/api/ai/explain-concept" payload={{ text: editor?.getText() ?? "" }} />
          <AIPanel title="Generate Quiz (5 MCQ)" endpoint="/api/ai/generate-quiz" payload={{ text: editor?.getText() ?? "" }} />
        </div>
      </div>

      <div className="card">
        <h2 className="mb-2 font-semibold">Flashcards / Short Notes (SM-2 ready)</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <input className="rounded border px-3 py-2 text-sm" value={front} onChange={(e) => setFront(e.target.value)} />
          <input className="rounded border px-3 py-2 text-sm" value={back} onChange={(e) => setBack(e.target.value)} />
        </div>
        <div className="mt-3 rounded border p-3 [perspective:1000px]">
          <div className="duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
            <div className="backface-hidden">{front}</div>
            <div className="backface-hidden [transform:rotateY(180deg)]">{back}</div>
          </div>
        </div>
        <div className="mt-3">
          <AIPanel title="Generate Flashcards from Note" endpoint="/api/ai/generate-flashcards" payload={{ text: editor?.getText() ?? "" }} />
        </div>
      </div>
    </div>
  );
}
