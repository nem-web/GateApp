import Link from "next/link";
import type { Metadata } from "next";
import { PublicFooter } from "@/components/PublicFooter";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "GATE Revision Tracker",
  description: "Track GATE revision cycles and connect progress to the signed-in dashboard.",
  path: "/revision-tracker",
});

export default async function RevisionTrackerPage({ searchParams }: { searchParams: Promise<{ topics?: string; revised?: string }> }) {
  const sp = await searchParams;
  const topics = Math.max(0, Number(sp.topics ?? 0));
  const revised = Math.max(0, Number(sp.revised ?? 0));
  const pct = topics ? Math.min(100, Math.round((revised / topics) * 100)) : 0;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">GATE revision tracker</h1>
        <form className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-5">
          <label className="grid gap-1 text-sm">Total topics<input name="topics" defaultValue={String(topics)} className="min-h-10 rounded-md border border-border bg-background px-3" type="number" /></label>
          <label className="grid gap-1 text-sm">Revised topics<input name="revised" defaultValue={String(revised)} className="min-h-10 rounded-md border border-border bg-background px-3" type="number" /></label>
          <button className="min-h-11 rounded-md bg-primary px-5 text-primary-foreground">Update</button>
        </form>
        <p className="mt-6 rounded-lg border border-border p-5 text-xl font-semibold">Revision completion: {pct}%</p>
        <Link href="/todos" className="mt-4 inline-flex text-primary underline">Persist revision tasks in the dashboard</Link>
      </main>
      <div className="bg-red-500 text-white text-5xl font-bold p-8">
        TAILWIND TEST
      </div>
      <PublicFooter />
    </div>
  );
}
