import type { Metadata } from "next";
import { PublicFooter } from "@/components/PublicFooter";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "GATE Rank Predictor",
  description: "Estimate a broad GATE rank band from marks and branch for planning purposes.",
  path: "/gate-rank-predictor",
});

function rankBand(marks: number) {
  if (marks >= 80) return "Top 500 target band";
  if (marks >= 70) return "500-1500 target band";
  if (marks >= 60) return "1500-4000 target band";
  if (marks >= 50) return "4000-9000 target band";
  if (marks >= 35) return "Qualifying-to-mid rank band";
  return "Below typical qualifying-safe band";
}

export default async function RankPredictorPage({ searchParams }: { searchParams: Promise<{ marks?: string; branch?: string }> }) {
  const sp = await searchParams;
  const marks = Number(sp.marks ?? 0);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">GATE rank predictor</h1>
        <form className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-5">
          <label className="grid gap-1 text-sm">Branch code<input name="branch" defaultValue={sp.branch ?? "EE"} className="min-h-10 rounded-md border border-border bg-background px-3" /></label>
          <label className="grid gap-1 text-sm">Marks<input name="marks" defaultValue={sp.marks ?? "0"} className="min-h-10 rounded-md border border-border bg-background px-3" type="number" step="0.01" /></label>
          <button className="min-h-11 rounded-md bg-primary px-5 text-primary-foreground">Predict band</button>
        </form>
        <p className="mt-6 rounded-lg border border-border p-5 text-2xl font-semibold">{rankBand(marks)}</p>
      </main>
      <PublicFooter />
    </div>
  );
}
