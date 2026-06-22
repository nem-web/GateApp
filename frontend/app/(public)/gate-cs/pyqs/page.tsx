import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { FileText, Search, Filter, BookmarkPlus, CheckCircle2, ChevronRight, BookOpen, BarChart3 } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "GATE CS PYQs | Previous Year Questions (2010-2026)",
  description: "Access GATE Computer Science previous year questions from 2010 to 2026. Practice year-wise, subject-wise, and topic-wise PYQs with solved and unsolved options for GATE CS preparation.",
  path: "/gate-cs/pyqs",
});

const years = Array.from({ length: 17 }, (_, i) => (2026 - i).toString());

const subjectPYQs = [
  { subject: "Engineering Mathematics", count: 45, icon: BarChart3, color: "border-blue-400" },
  { subject: "Digital Logic", count: 28, icon: BarChart3, color: "border-green-400" },
  { subject: "Computer Organization & Architecture", count: 42, icon: BarChart3, color: "border-purple-400" },
  { subject: "Programming & Data Structures", count: 56, icon: BarChart3, color: "border-pink-400" },
  { subject: "Algorithms", count: 52, icon: BarChart3, color: "border-red-400" },
  { subject: "Theory of Computation", count: 32, icon: BarChart3, color: "border-indigo-400" },
  { subject: "Compiler Design", count: 24, icon: BarChart3, color: "border-teal-400" },
  { subject: "Operating Systems", count: 48, icon: BarChart3, color: "border-orange-400" },
  { subject: "Databases (DBMS)", count: 38, icon: BarChart3, color: "border-cyan-400" },
  { subject: "Computer Networks", count: 36, icon: BarChart3, color: "border-yellow-400" },
  { subject: "General Aptitude", count: 85, icon: BarChart3, color: "border-gray-400" },
];

const topicCategories = [
  { topic: "Time Complexity & Recurrence", subject: "Algorithms", count: 18 },
  { topic: "Sorting & Searching", subject: "Algorithms", count: 22 },
  { topic: "Dynamic Programming", subject: "Algorithms", count: 15 },
  { topic: "Graph Algorithms", subject: "Algorithms", count: 20 },
  { topic: "Tree Traversals & BST", subject: "Data Structures", count: 25 },
  { topic: "Hashing & Collision", subject: "Data Structures", count: 12 },
  { topic: "CPU Scheduling", subject: "Operating Systems", count: 18 },
  { topic: "Page Replacement", subject: "Operating Systems", count: 14 },
  { topic: "SQL Queries", subject: "DBMS", count: 22 },
  { topic: "Normalization", subject: "DBMS", count: 16 },
  { topic: "TCP/IP & Routing", subject: "Networks", count: 20 },
  { topic: "DFA & NFA Design", subject: "TOC", count: 18 },
  { topic: "LR Parsing", subject: "Compiler Design", count: 12 },
  { topic: "Cache Memory", subject: "COA", count: 15 },
  { topic: "Boolean Algebra", subject: "Digital Logic", count: 18 },
  { topic: "Probability", subject: "Engineering Math", count: 20 },
];

export default function GateCSPYQsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }, { name: "PYQs", path: "/gate-cs/pyqs" }]),
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/gate-cs" className="hover:text-foreground">GATE CS</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium" aria-current="page">PYQs</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE CS practice</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">GATE CS Previous Year Questions</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Practice with actual GATE CS questions from 2010 to 2026. Browse by year, subject, or specific topic.
            Mark questions as solved, unsolved, or bookmarked for focused revision.
          </p>
        </header>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <Filter className="size-4 text-primary" /> Filter
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <Search className="size-4 text-primary" /> Search Questions
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <BookmarkPlus className="size-4 text-primary" /> Bookmarked (0)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <CheckCircle2 className="size-4 text-primary" /> Solved (0)
          </span>
        </div>

        {/* Year-wise Section */}
        <section aria-labelledby="year-wise-heading">
          <h2 id="year-wise-heading" className="text-xl font-semibold">Year-wise PYQs</h2>
          <p className="mt-1 text-sm text-muted-foreground">Browse and practice full question papers by year</p>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {years.map((year) => (
              <Link key={year} href={`/gate-cs/pyqs/${year}`}>
                <div className="rounded-lg border border-border bg-card p-3 text-center hover:bg-secondary transition-colors hover:shadow-md">
                  <FileText className="size-5 mx-auto text-primary mb-1" />
                  <div className="text-sm font-semibold">{year}</div>
                  <div className="text-xs text-muted-foreground">65 Qs</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Subject-wise Section */}
        <section aria-labelledby="subject-wise-heading">
          <h2 id="subject-wise-heading" className="text-xl font-semibold">Subject-wise PYQs</h2>
          <p className="mt-1 text-sm text-muted-foreground">Practice questions organized by GATE CS subject</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {subjectPYQs.map((item) => (
              <Link key={item.subject} href={`/gate-cs/pyqs/subject/${item.subject.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className={`rounded-lg border-l-4 ${item.color} border border-border bg-card p-4 hover:bg-secondary transition-colors`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="size-5 text-primary" />
                      <h3 className="font-medium text-sm">{item.subject}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.count} questions</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Topic-wise Section */}
        <section aria-labelledby="topic-wise-heading">
          <h2 id="topic-wise-heading" className="text-xl font-semibold">Topic-wise PYQs</h2>
          <p className="mt-1 text-sm text-muted-foreground">Drill down to specific topics for targeted practice</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topicCategories.map((item) => (
              <Link key={item.topic} href={`/gate-cs/pyqs/topic/${item.topic.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="rounded-lg border border-border bg-card p-3 hover:bg-secondary transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{item.topic}</h3>
                      <p className="text-xs text-muted-foreground">{item.subject}</p>
                    </div>
                    <span className="text-xs text-primary font-medium">{item.count} Qs</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats & Status */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold text-sm">Solved Questions</h3>
            <div className="mt-2 text-lg font-bold text-green-600">0 / 486+</div>
            <div className="mt-1 text-xs text-muted-foreground">Track your solved PYQ progress</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold text-sm">Bookmarked</h3>
            <div className="mt-2 text-lg font-bold text-primary">0</div>
            <div className="mt-1 text-xs text-muted-foreground">Save important questions for revision</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold text-sm">Accuracy</h3>
            <div className="mt-2 text-lg font-bold text-orange-600">--%</div>
            <div className="mt-1 text-xs text-muted-foreground">Start practicing to see your accuracy</div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gate-cs/practice-questions" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <BookOpen className="size-4" /> Practice Questions
          </Link>
          <Link href="/gate-cs/mock-tests" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
            <ChevronRight className="size-4" /> Take Mock Test
          </Link>
        </div>
      </main>
    </div>
  );
}