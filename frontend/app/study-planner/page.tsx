import Link from "next/link";
import type { Metadata } from "next";
import { PublicFooter } from "@/components/PublicFooter";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "GATE Study Planner",
  description: "Plan weekly GATE study blocks and connect your saved timetable after signing in.",
  path: "/study-planner",
});

export default async function StudyPlannerPublicPage({ searchParams }: { searchParams: Promise<{ hours?: string; days?: string }> }) {
  const sp = await searchParams;
  const hours = Math.max(1, Number(sp.hours ?? 3));
  const days = Math.max(1, Number(sp.days ?? 6));
  const total = hours * days;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">GATE study planner</h1>
        <form className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-5">
          <label className="grid gap-1 text-sm">Hours per day<input name="hours" defaultValue={String(hours)} className="min-h-10 rounded-md border border-border bg-background px-3" type="number" /></label>
          <label className="grid gap-1 text-sm">Study days per week<input name="days" defaultValue={String(days)} className="min-h-10 rounded-md border border-border bg-background px-3" type="number" /></label>
          <button className="min-h-11 rounded-md bg-primary px-5 text-primary-foreground">Plan weekly load</button>
        </form>
        <p className="mt-6 rounded-lg border border-border p-5 text-xl font-semibold">Weekly study capacity: {total} focused hours.</p>
        <Link href="/study-plan" className="mt-4 inline-flex text-primary underline">Save a database-backed timetable in the app</Link>
      </main>
      <PublicFooter />
    </div>
  );
}
