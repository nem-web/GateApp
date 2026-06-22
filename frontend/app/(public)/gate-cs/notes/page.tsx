import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { Library, FileText, BookOpen, Download, ChevronRight, ArrowRight } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "GATE CS Notes | Subject-wise Study Notes & Formula Sheets",
  description: "Comprehensive GATE Computer Science study notes, formula sheets, and quick revision notes for all 11 subjects. Downloadable PDFs covering Engineering Mathematics to General Aptitude for GATE CS 2027.",
  path: "/gate-cs/notes",
});

const subjects = [
  {
    name: "Engineering Mathematics",
    topics: 26,
    pages: 45,
    keyFormulas: ["Eigenvalues & Eigenvectors", "Bayes Theorem", "Master Theorem", "Graph Isomorphism", "Group Theory Properties"],
    color: "border-blue-400",
    href: "/gate-cs/notes/engineering-mathematics",
  },
  {
    name: "Digital Logic",
    topics: 20,
    pages: 30,
    keyFormulas: ["K-Map Minimization", "Boolean Algebra Laws", "Flip-Flop Excitation Tables", "Counter Design"],
    color: "border-green-400",
    href: "/gate-cs/notes/digital-logic",
  },
  {
    name: "Computer Organization & Architecture",
    topics: 28,
    pages: 40,
    keyFormulas: ["Cache Mapping Formulas", "Pipeline Speedup", "Address Translation", "DMA Transfer Rate"],
    color: "border-purple-400",
    href: "/gate-cs/notes/coa",
  },
  {
    name: "Programming & Data Structures",
    topics: 42,
    pages: 55,
    keyFormulas: ["Pointer Arithmetic", "Tree Traversal Complexities", "Hashing Load Factor", "Stack Applications"],
    color: "border-pink-400",
    href: "/gate-cs/notes/programming-data-structures",
  },
  {
    name: "Algorithms",
    topics: 30,
    pages: 50,
    keyFormulas: ["Recurrence Master Theorem", "DP Recurrence Relations", "Graph Algorithm Complexities", "Sorting Complexities"],
    color: "border-red-400",
    href: "/gate-cs/notes/algorithms",
  },
  {
    name: "Theory of Computation",
    topics: 24,
    pages: 35,
    keyFormulas: ["Pumping Lemma Conditions", "DFA to Regular Expression", "CFG Normal Forms", "Turing Machine Transitions"],
    color: "border-indigo-400",
    href: "/gate-cs/notes/toc",
  },
  {
    name: "Compiler Design",
    topics: 20,
    pages: 32,
    keyFormulas: ["FIRST & FOLLOW Sets", "LR Item Sets", "Syntax Directed Definitions", "Three Address Code"],
    color: "border-teal-400",
    href: "/gate-cs/notes/compiler-design",
  },
  {
    name: "Operating Systems",
    topics: 30,
    pages: 42,
    keyFormulas: ["Scheduling Criteria Formulas", "Page Replacement Algorithms", "Banker's Algorithm", "Disk Scheduling"],
    color: "border-orange-400",
    href: "/gate-cs/notes/operating-systems",
  },
  {
    name: "Databases (DBMS)",
    topics: 26,
    pages: 38,
    keyFormulas: ["Functional Dependency Closure", "Normal Form Conditions", "Transaction Isolation Levels", "Lock Compatibility"],
    color: "border-cyan-400",
    href: "/gate-cs/notes/dbms",
  },
  {
    name: "Computer Networks",
    topics: 28,
    pages: 40,
    keyFormulas: ["CRC Calculation", "IP Subnetting", "Congestion Window", "CSMA/CD Efficiency"],
    color: "border-yellow-400",
    href: "/gate-cs/notes/computer-networks",
  },
  {
    name: "General Aptitude",
    topics: 15,
    pages: 25,
    keyFormulas: ["Permutation & Combination", "Probability Basics", "Percentage & Ratio", "Data Interpretation"],
    color: "border-gray-400",
    href: "/gate-cs/notes/general-aptitude",
  },
];

const formulaSheets = [
  { title: "Complete Formula Sheet", subjects: "All 11 Subjects", pages: 120, href: "/gate-cs/notes/formula-sheet" },
  { title: "Quick Revision Notes", subjects: "Subject-wise Summaries", pages: 85, href: "/gate-cs/notes/quick-revision" },
  { title: "Important Definitions", subjects: "Key Terminology", pages: 45, href: "/gate-cs/notes/definitions" },
  { title: "Common GATE Traps", subjects: "Mistake Prevention", pages: 30, href: "/gate-cs/notes/common-traps" },
];

export default function GateCSNotesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }, { name: "Notes", path: "/gate-cs/notes" }]),
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/gate-cs" className="hover:text-foreground">GATE CS</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium" aria-current="page">Notes</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE CS study material</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">GATE CS Notes & Study Material</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Comprehensive subject-wise notes covering the entire GATE CS syllabus. Each subject includes detailed
            explanations, important formulas, solved examples, and quick revision summaries. Perfect for both
            concept building and last-minute revision.
          </p>
        </header>

        {/* Formula Sheets Section */}
        <section aria-labelledby="formula-sheets-heading">
          <h2 id="formula-sheets-heading" className="text-xl font-semibold">Formula Sheets & Quick Revision</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {formulaSheets.map((sheet) => (
              <Link key={sheet.title} href={sheet.href}>
                <div className="rounded-lg border border-border bg-card p-5 hover:bg-secondary transition-colors">
                  <Download className="size-6 text-primary mb-2" />
                  <h3 className="font-medium text-sm">{sheet.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{sheet.subjects} · {sheet.pages} pages</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Subject Notes */}
        <section aria-labelledby="subject-notes-heading">
          <h2 id="subject-notes-heading" className="text-xl font-semibold">Subject-wise Notes</h2>
          <p className="mt-1 text-sm text-muted-foreground">Detailed study notes organized by GATE CS subject</p>
          <div className="mt-4 grid gap-3">
            {subjects.map((subj) => (
              <Link key={subj.name} href={subj.href}>
                <div className={`rounded-lg border-l-4 ${subj.color} border border-border bg-card p-4 hover:bg-secondary transition-colors`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="size-5 text-primary shrink-0" />
                      <div>
                        <h3 className="font-medium">{subj.name}</h3>
                        <p className="text-xs text-muted-foreground">{subj.topics} topics · {subj.pages} pages</p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subj.keyFormulas.map((formula) => (
                      <span key={formula} className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                        {formula}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">11</div>
            <div className="text-sm text-muted-foreground">Subject Notes</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">432+</div>
            <div className="text-sm text-muted-foreground">Total Pages</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">4</div>
            <div className="text-sm text-muted-foreground">Formula Sheets</div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gate-cs/flashcards" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <ArrowRight className="size-4" /> Practice with Flashcards
          </Link>
          <Link href="/gate-cs/practice-questions" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
            <FileText className="size-4" /> Test Your Knowledge
          </Link>
        </div>
      </main>
    </div>
  );
}