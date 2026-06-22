import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "GATE CS Cutoff 2027 | Category-wise Cutoff Trends & Analysis",
  description: "GATE Computer Science cutoff analysis with previous year cutoffs, category-wise tables, trend analysis, safe score estimates, and top institute score ranges for GATE CS 2027.",
  path: "/gate-cs/cutoffs",
});

const cutoffData = [
  { year: 2025, general: 35.1, obc: 31.6, sc: 23.4, st: 15.6, ews: 31.6, pwd: 17.5 },
  { year: 2024, general: 34.2, obc: 30.8, sc: 22.8, st: 15.2, ews: 30.8, pwd: 17.1 },
  { year: 2023, general: 36.7, obc: 33.0, sc: 24.5, st: 16.3, ews: 33.0, pwd: 18.3 },
  { year: 2022, general: 33.5, obc: 30.1, sc: 22.3, st: 14.9, ews: 30.1, pwd: 16.7 },
  { year: 2021, general: 37.0, obc: 33.3, sc: 24.7, st: 16.5, ews: 33.3, pwd: 18.5 },
  { year: 2020, general: 39.2, obc: 35.3, sc: 26.1, st: 17.4, ews: 35.3, pwd: 19.6 },
];

const instituteScores = [
  { institute: "IIT Bombay (CSE)", general: 850, obc: 450, sc: 250, st: 150 },
  { institute: "IIT Delhi (CSE)", general: 800, obc: 400, sc: 220, st: 130 },
  { institute: "IIT Madras (CSE)", general: 750, obc: 380, sc: 200, st: 120 },
  { institute: "IIT Kanpur (CSE)", general: 700, obc: 350, sc: 180, st: 110 },
  { institute: "IIT Kharagpur (CSE)", general: 650, obc: 320, sc: 170, st: 100 },
  { institute: "IIT Roorkee (CSE)", general: 600, obc: 300, sc: 160, st: 90 },
  { institute: "IIT Guwahati (CSE)", general: 550, obc: 280, sc: 150, st: 85 },
  { institute: "NIT Trichy (CSE)", general: 400, obc: 200, sc: 100, st: 60 },
  { institute: "NIT Surathkal (CSE)", general: 350, obc: 180, sc: 90, st: 50 },
  { institute: "IIIT Hyderabad (CSE)", general: 500, obc: 250, sc: 130, st: 75 },
];

const safeScores = [
  { target: "Top IITs (Bombay, Delhi, Madras)", general: "80+", obc: "70+", sc: "60+", st: "50+" },
  { target: "Other IITs (Kanpur, Kharagpur, Roorkee)", general: "70+", obc: "60+", sc: "50+", st: "40+" },
  { target: "NITs & IIITs (Top Tier)", general: "60+", obc: "50+", sc: "40+", st: "35+" },
  { target: "PSU Recruitment", general: "75+", obc: "65+", sc: "55+", st: "45+" },
  { target: "Qualifying Cutoff", general: "35-40", obc: "30-35", sc: "22-26", st: "15-18" },
];

export default function GateCSCutoffsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }, { name: "Cutoffs", path: "/gate-cs/cutoffs" }]),
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/gate-cs" className="hover:text-foreground">GATE CS</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium" aria-current="page">Cutoffs</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE CS analysis</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">GATE CS Cutoff Analysis</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Understanding GATE CS cutoff trends is crucial for setting realistic score targets. Analyze previous year
            qualifying cutoffs, institute-wise rank requirements, and safe score estimates to plan your preparation effectively.
          </p>
        </header>

        {/* Qualifying Cutoffs */}
        <section aria-labelledby="cutoff-table-heading">
          <h2 id="cutoff-table-heading" className="text-xl font-semibold">Previous Year Qualifying Cutoffs (Marks)</h2>
          <p className="mt-1 text-sm text-muted-foreground">GATE CS qualifying cutoff marks by category over the last 6 years</p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left font-semibold">Year</th>
                  <th className="p-3 text-left font-semibold">General</th>
                  <th className="p-3 text-left font-semibold">OBC-NCL</th>
                  <th className="p-3 text-left font-semibold">SC</th>
                  <th className="p-3 text-left font-semibold">ST</th>
                  <th className="p-3 text-left font-semibold">EWS</th>
                  <th className="p-3 text-left font-semibold">PwD</th>
                </tr>
              </thead>
              <tbody>
                {cutoffData.map((row) => (
                  <tr key={row.year} className="border-b border-border">
                    <td className="p-3 font-medium">{row.year}</td>
                    <td className="p-3">{row.general}</td>
                    <td className="p-3">{row.obc}</td>
                    <td className="p-3">{row.sc}</td>
                    <td className="p-3">{row.st}</td>
                    <td className="p-3">{row.ews}</td>
                    <td className="p-3">{row.pwd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">* Cutoffs vary yearly based on paper difficulty and candidate pool. These are qualifying cutoffs, not admission cutoffs.</p>
        </section>

        {/* Trend Analysis */}
        <section aria-labelledby="trend-heading" className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <h2 id="trend-heading" className="text-xl font-semibold">Trend Analysis</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            GATE CS qualifying cutoffs have remained relatively stable over the last 6 years. General category cutoff
            hovers around 34-39 marks (out of 100). The fluctuation is typically within 5 marks across years. A safe
            score strategy recommends targeting at least 5-10 marks above the previous year cutoff to account for
            variance.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-background p-4">
              <div className="text-2xl font-bold text-primary">34-39</div>
              <div className="text-sm text-muted-foreground">General Range (6 yrs)</div>
            </div>
            <div className="rounded-lg bg-background p-4">
              <div className="text-2xl font-bold text-primary">5-7%</div>
              <div className="text-sm text-muted-foreground">Avg. Yearly Variation</div>
            </div>
            <div className="rounded-lg bg-background p-4">
              <div className="text-2xl font-bold text-primary">45+</div>
              <div className="text-sm text-muted-foreground">Safe Score (General)</div>
            </div>
          </div>
        </section>

        {/* Institute-wise Score Ranges */}
        <section aria-labelledby="institute-heading">
          <h2 id="institute-heading" className="text-xl font-semibold">Top Institute Score Ranges (Approx. Rank)</h2>
          <p className="mt-1 text-sm text-muted-foreground">Approximate rank ranges for MTech CSE admissions at top institutes</p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left font-semibold">Institute</th>
                  <th className="p-3 text-left font-semibold">General Rank</th>
                  <th className="p-3 text-left font-semibold">OBC Rank</th>
                  <th className="p-3 text-left font-semibold">SC Rank</th>
                  <th className="p-3 text-left font-semibold">ST Rank</th>
                </tr>
              </thead>
              <tbody>
                {instituteScores.map((row) => (
                  <tr key={row.institute} className="border-b border-border">
                    <td className="p-3 font-medium">{row.institute}</td>
                    <td className="p-3">{row.general}</td>
                    <td className="p-3">{row.obc}</td>
                    <td className="p-3">{row.sc}</td>
                    <td className="p-3">{row.st}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Safe Score Estimates */}
        <section aria-labelledby="safe-scores-heading">
          <h2 id="safe-scores-heading" className="text-xl font-semibold">Safe Score Estimates</h2>
          <p className="mt-1 text-sm text-muted-foreground">Target scores for different admission goals</p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left font-semibold">Target</th>
                  <th className="p-3 text-left font-semibold">General</th>
                  <th className="p-3 text-left font-semibold">OBC</th>
                  <th className="p-3 text-left font-semibold">SC</th>
                  <th className="p-3 text-left font-semibold">ST</th>
                </tr>
              </thead>
              <tbody>
                {safeScores.map((row) => (
                  <tr key={row.target} className="border-b border-border">
                    <td className="p-3 font-medium">{row.target}</td>
                    <td className="p-3">{row.general}</td>
                    <td className="p-3">{row.obc}</td>
                    <td className="p-3">{row.sc}</td>
                    <td className="p-3">{row.st}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gate-cs/study-plan" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Build Your Study Plan
          </Link>
          <Link href="/gate-cs/mock-tests" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
            Check Your Score with Mock Tests
          </Link>
        </div>
      </main>
    </div>
  );
}