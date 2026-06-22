import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { Brain, ChevronRight, Sparkles, Layers, RotateCcw, BarChart3 } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "GATE CS Flashcards | Subject-wise Revision Decks",
  description: "GATE Computer Science flashcards for active recall and spaced repetition. Subject-wise revision decks covering Algorithms, OS, DBMS, Networks, TOC, Compiler Design, COA, Digital Logic, and Mathematics.",
  path: "/gate-cs/flashcards",
});

const decks = [
  { subject: "Operating Systems", cards: 120, topics: "Processes, Scheduling, Memory, Deadlocks", color: "from-orange-500/10 to-orange-600/5", borderColor: "border-orange-500/20" },
  { subject: "Databases (DBMS)", cards: 95, topics: "SQL, Normalization, Transactions, ER Model", color: "from-cyan-500/10 to-cyan-600/5", borderColor: "border-cyan-500/20" },
  { subject: "Computer Networks", cards: 110, topics: "TCP/IP, Routing, OSI, Application Protocols", color: "from-yellow-500/10 to-yellow-600/5", borderColor: "border-yellow-500/20" },
  { subject: "Theory of Computation", cards: 85, topics: "Automata, Regular Languages, CFL, TM", color: "from-indigo-500/10 to-indigo-600/5", borderColor: "border-indigo-500/20" },
  { subject: "Compiler Design", cards: 70, topics: "Parsing, Lexical Analysis, Code Optimization", color: "from-teal-500/10 to-teal-600/5", borderColor: "border-teal-500/20" },
  { subject: "Algorithms", cards: 130, topics: "Complexity, Sorting, DP, Graph Algorithms", color: "from-red-500/10 to-red-600/5", borderColor: "border-red-500/20" },
  { subject: "Computer Organization & Architecture", cards: 100, topics: "CPU, Memory, Cache, Pipelining", color: "from-purple-500/10 to-purple-600/5", borderColor: "border-purple-500/20" },
  { subject: "Digital Logic", cards: 65, topics: "Boolean Algebra, K-Maps, Sequential Circuits", color: "from-green-500/10 to-green-600/5", borderColor: "border-green-500/20" },
  { subject: "Engineering Mathematics", cards: 150, topics: "Discrete Math, Linear Algebra, Probability", color: "from-blue-500/10 to-blue-600/5", borderColor: "border-blue-500/20" },
];

export default function GateCSFlashcardsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }, { name: "Flashcards", path: "/gate-cs/flashcards" }]),
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/gate-cs" className="hover:text-foreground">GATE CS</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium" aria-current="page">Flashcards</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE CS revision</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">GATE CS Flashcards</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Master GATE CS concepts with active recall using spaced-repetition flashcards. Each deck is organized by
            subject with cards covering key formulas, definitions, algorithms, and common GATE traps. Review consistently
            to strengthen weak areas and retain information longer.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">9</div>
            <div className="text-sm text-muted-foreground">Subject Decks</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">925+</div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Cards Reviewed</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">--%</div>
            <div className="text-sm text-muted-foreground">Mastery Rate</div>
          </div>
        </div>

        {/* Subject Decks */}
        <section aria-labelledby="decks-heading">
          <h2 id="decks-heading" className="text-xl font-semibold">Subject-wise Flashcard Decks</h2>
          <p className="mt-1 text-sm text-muted-foreground">Click on a deck to start reviewing</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <Link key={deck.subject} href={`/gate-cs/flashcards/${deck.subject.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className={`rounded-xl border ${deck.borderColor} bg-gradient-to-br ${deck.color} bg-card p-5 hover:shadow-lg transition-all hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-3">
                    <Brain className="size-7 text-primary" />
                    <span className="text-xs font-medium text-primary">{deck.cards} cards</span>
                  </div>
                  <h3 className="font-semibold">{deck.subject}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{deck.topics}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                    Start Reviewing <ChevronRight className="size-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How Spaced Repetition Works */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="size-5 text-primary" /> How Spaced Repetition Works</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="p-3 rounded-lg bg-secondary/50">
              <RotateCcw className="size-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Active Recall</h3>
              <p className="mt-1 text-xs text-muted-foreground">Each card forces you to retrieve information from memory, strengthening neural pathways and improving long-term retention.</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <Layers className="size-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Spaced Intervals</h3>
              <p className="mt-1 text-xs text-muted-foreground">Cards you find difficult appear more frequently. Mastered cards appear at increasing intervals for efficient revision.</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <BarChart3 className="size-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Progress Tracking</h3>
              <p className="mt-1 text-xs text-muted-foreground">Monitor your mastery rate per subject. Focus review time on decks with lower retention for maximum efficiency.</p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gate-cs/notes" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Browse Notes for Reference
          </Link>
          <Link href="/gate-cs/practice-questions" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
            Test Your Knowledge
          </Link>
        </div>
      </main>
    </div>
  );
}