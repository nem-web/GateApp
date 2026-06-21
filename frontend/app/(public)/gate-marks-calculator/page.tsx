import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "GATE Marks Calculator",
  description: "Calculate estimated GATE marks from correct, wrong, and NAT answers with negative marking support.",
  path: "/gate-marks-calculator",
});

export default async function MarksCalculatorPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const oneCorrect = Number(sp.oneCorrect ?? 0);
  const twoCorrect = Number(sp.twoCorrect ?? 0);
  const oneWrong = Number(sp.oneWrong ?? 0);
  const twoWrong = Number(sp.twoWrong ?? 0);
  const natMarks = Number(sp.natMarks ?? 0);
  const score = oneCorrect - oneWrong / 3 + twoCorrect * 2 - (twoWrong * 2) / 3 + natMarks;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">GATE marks calculator</h1>
        <form className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-5">
          {[
            ["oneCorrect", "1-mark correct"],
            ["oneWrong", "1-mark wrong"],
            ["twoCorrect", "2-mark correct"],
            ["twoWrong", "2-mark wrong"],
            ["natMarks", "NAT/MSQ marks scored"],
          ].map(([name, label]) => (
            <label key={name} className="grid gap-1 text-sm">
              {label}
              <input name={name} defaultValue={sp[name] ?? "0"} className="min-h-10 rounded-md border border-border bg-background px-3" type="number" step="0.01" />
            </label>
          ))}
          <button className="min-h-11 rounded-md bg-primary px-5 text-primary-foreground">Calculate</button>
        </form>
        <p className="mt-6 rounded-lg border border-border p-5 text-2xl font-semibold">Estimated marks: {score.toFixed(2)}</p>
      </main>    </div>
  );
}
