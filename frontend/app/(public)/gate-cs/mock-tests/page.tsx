import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { Target, Clock, Award, BarChart3, ChevronRight, BookOpen, Layers } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "GATE CS Mock Tests 2027 | Full-length, Subject & Topic Tests",
  description: "Take GATE Computer Science mock tests for 2027. Full-length tests, subject-specific tests, and topic-wise tests with detailed performance analysis, time management, and accuracy tracking.",
  path: "/gate-cs/mock-tests",
});

const fullLengthTests = [
  { name: "GATE CS Mock Test 1", questions: 65, marks: 100, duration: "3 Hours", difficulty: "Moderate" },
  { name: "GATE CS Mock Test 2", questions: 65, marks: 100, duration: "3 Hours", difficulty: "Hard" },
  { name: "GATE CS Mock Test 3", questions: 65, marks: 100, duration: "3 Hours", difficulty: "Moderate" },
  { name: "GATE CS Mock Test 4", questions: 65, marks: 100, duration: "3 Hours", difficulty: "Easy" },
  { name: "GATE CS Mock Test 5", questions: 65, marks: 100, duration: "3 Hours", difficulty: "Hard" },
];

const subjectTests = [
  { name: "Engineering Mathematics", questions: 20, duration: "45 min" },
  { name: "Digital Logic", questions: 15, duration: "30 min" },
  { name: "Computer Organization & Architecture", questions: 20, duration: "45 min" },
  { name: "Programming & Data Structures", questions: 25, duration: "60 min" },
  { name: "Algorithms", questions: 25, duration: "60 min" },
  { name: "Theory of Computation", questions: 15, duration: "30 min" },
  { name: "Compiler Design", questions: 15, duration: "30 min" },
  { name: "Operating Systems", questions: 20, duration: "45 min" },
  { name: "Databases (DBMS)", questions: 20, duration: "45 min" },
  { name: "Computer Networks", questions: 20, duration: "45 min" },
  { name: "General Aptitude", questions: 10, duration: "20 min" },
];

export default function GateCSMockTestsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }, { name: "Mock Tests", path: "/gate-cs/mock-tests" }]),
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/gate-cs" className="hover:text-foreground">GATE CS</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium" aria-current="page">Mock Tests</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE CS practice</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">GATE CS Mock Tests 2027</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Simulate the real GATE CS exam environment with our comprehensive mock tests. Choose from full-length
            tests, subject-specific assessments, or topic-wise practice. Each test includes detailed solutions
            and performance analytics.
          </p>
        </header>

        {/* Full Length Tests */}
        <section aria-labelledby="full-length-heading">
          <h2 id="full-length-heading" className="text-xl font-semibold">Full-Length Mock Tests</h2>
          <p className="mt-1 text-sm text-muted-foreground">Complete GATE CS simulation with 65 questions in 3 hours</p>
          <div className="mt-4 grid gap-3">
            {fullLengthTests.map((test, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="size-6 text-primary" />
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Clock className="size-3" /> {test.duration}</span>
                        <span>{test.questions} questions</span>
                        <span>{test.marks} marks</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          test.difficulty === "Easy" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          test.difficulty === "Moderate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {test.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary cursor-pointer hover:bg-primary/20 transition-colors">
                      Attempt Test
                    </span>
                    <span className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-secondary transition-colors">
                      Analysis
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subject Tests */}
        <section aria-labelledby="subject-tests-heading">
          <h2 id="subject-tests-heading" className="text-xl font-semibold">Subject-wise Tests</h2>
          <p className="mt-1 text-sm text-muted-foreground">Focused practice on individual GATE CS subjects</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {subjectTests.map((test) => (
              <div key={test.name} className="rounded-lg border border-border bg-card p-4 hover:bg-secondary transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="size-5 text-primary" />
                    <div>
                      <h3 className="font-medium text-sm">{test.name}</h3>
                      <p className="text-xs text-muted-foreground">{test.questions} questions · {test.duration}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary">Start</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Stats */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <BarChart3 className="size-5 mx-auto text-primary mb-1" />
            <div className="text-lg font-bold">0</div>
            <div className="text-xs text-muted-foreground">Tests Taken</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Award className="size-5 mx-auto text-primary mb-1" />
            <div className="text-lg font-bold">--</div>
            <div className="text-xs text-muted-foreground">Avg. Score</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Target className="size-5 mx-auto text-primary mb-1" />
            <div className="text-lg font-bold">--%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Clock className="size-5 mx-auto text-primary mb-1" />
            <div className="text-lg font-bold">--</div>
            <div className="text-xs text-muted-foreground">Best Rank</div>
          </div>
        </section>

        {/* Leaderboard Placeholder */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Award className="size-5 text-primary" /> Leaderboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Compete with other GATE CS aspirants. Complete mock tests to see your rank on the leaderboard.
            Top performers will be highlighted weekly.
          </p>
          <div className="mt-4 flex items-center justify-center rounded-lg bg-secondary/50 p-8 text-sm text-muted-foreground">
            Complete a mock test to view the leaderboard
          </div>
        </section>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gate-cs/practice-questions" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <BookOpen className="size-4" /> Practice Questions
          </Link>
          <Link href="/gate-cs/study-plan" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
            <ChevronRight className="size-4" /> View Study Plan
          </Link>
        </div>
      </main>
    </div>
  );
}