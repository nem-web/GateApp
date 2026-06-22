import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { PenTool, Filter, ChevronRight, BookOpen, Layers, Target } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "GATE CS Practice Questions | Topic-wise & Difficulty-based Practice",
  description: "Practice GATE Computer Science questions with topic-wise and difficulty-based filters. Easy, Medium, and Hard levels covering all subjects for GATE CS 2027 preparation.",
  path: "/gate-cs/practice-questions",
});

const subjects = [
  { name: "Engineering Mathematics", easy: 30, medium: 25, hard: 15, total: 70 },
  { name: "Digital Logic", easy: 20, medium: 15, hard: 8, total: 43 },
  { name: "Computer Organization & Architecture", easy: 18, medium: 22, hard: 15, total: 55 },
  { name: "Programming & Data Structures", easy: 25, medium: 30, hard: 20, total: 75 },
  { name: "Algorithms", easy: 20, medium: 28, hard: 25, total: 73 },
  { name: "Theory of Computation", easy: 15, medium: 20, hard: 12, total: 47 },
  { name: "Compiler Design", easy: 12, medium: 15, hard: 10, total: 37 },
  { name: "Operating Systems", easy: 20, medium: 25, hard: 18, total: 63 },
  { name: "Databases (DBMS)", easy: 18, medium: 22, hard: 15, total: 55 },
  { name: "Computer Networks", easy: 18, medium: 22, hard: 14, total: 54 },
  { name: "General Aptitude", easy: 40, medium: 30, hard: 15, total: 85 },
];

const difficultyLevels = [
  { level: "Easy", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", description: "Basic concept testing and direct formula application" },
  { level: "Medium", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", description: "Multi-step problems requiring concept combination" },
  { level: "Hard", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", description: "Complex problems with advanced application and edge cases" },
];

export default function GateCSPracticeQuestionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }, { name: "Practice Questions", path: "/gate-cs/practice-questions" }]),
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/gate-cs" className="hover:text-foreground">GATE CS</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium" aria-current="page">Practice Questions</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE CS practice</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">GATE CS Practice Questions</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Strengthen your GATE CS preparation with topic-wise and difficulty-based practice questions. Filter by
            subject, difficulty level, or specific topics. Each question includes detailed solutions and explanations.
          </p>
        </header>

        {/* Difficulty Levels */}
        <section aria-labelledby="difficulty-heading">
          <h2 id="difficulty-heading" className="text-xl font-semibold">Practice by Difficulty Level</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {difficultyLevels.map((item) => (
              <Link key={item.level} href={`/gate-cs/practice-questions/${item.level.toLowerCase()}`}>
                <div className="rounded-lg border border-border bg-card p-5 hover:bg-secondary transition-colors">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-2 ${item.color}`}>
                    {item.level}
                  </span>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Subject-wise Practice */}
        <section aria-labelledby="subject-practice-heading">
          <h2 id="subject-practice-heading" className="text-xl font-semibold">Practice by Subject</h2>
          <p className="mt-1 text-sm text-muted-foreground">Select a subject to practice topic-wise questions</p>
          <div className="mt-4 grid gap-3">
            {subjects.map((subj) => (
              <Link key={subj.name} href={`/gate-cs/practice-questions/${subj.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-secondary transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenTool className="size-5 text-primary" />
                      <h3 className="font-medium">{subj.name}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="text-green-600 font-medium">E: {subj.easy}</span>
                      <span className="text-yellow-600 font-medium">M: {subj.medium}</span>
                      <span className="text-red-600 font-medium">H: {subj.hard}</span>
                      <span className="font-semibold text-foreground">Total: {subj.total}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">236</div>
            <div className="text-sm text-muted-foreground">Easy Questions</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">254</div>
            <div className="text-sm text-muted-foreground">Medium Questions</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-red-600">167</div>
            <div className="text-sm text-muted-foreground">Hard Questions</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">657+</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gate-cs/pyqs" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <BookOpen className="size-4" /> Practice PYQs
          </Link>
          <Link href="/gate-cs/mock-tests" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
            <Target className="size-4" /> Take Mock Tests
          </Link>
        </div>
      </main>
    </div>
  );
}