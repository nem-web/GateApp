import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { Calendar, Clock, Target, Brain, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "GATE CS Study Plan 2027 | 12-Month, 6-Month, 3-Month & 30-Day Plans",
  description: "Complete GATE CS study plans for 2027: 12-month, 6-month, 3-month revision, and last 30-day strategy. Weekly schedules, daily goals, revision plans, and PYQ milestones for GATE Computer Science preparation.",
  path: "/gate-cs/study-plan",
});

const plans = [
  {
    title: "12-Month Preparation Plan",
    duration: "Months 1-12",
    icon: Calendar,
    color: "border-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    idealFor: "Working professionals and students with 2-3 hours daily",
    phases: [
      { phase: "Foundation (Months 1-4)", tasks: ["Learn C programming fundamentals", "Cover Discrete Mathematics completely", "Study Digital Logic basics", "Start Engineering Mathematics (Calculus, Linear Algebra)", "Daily: 2-3 hours study + 30 min revision"], pyqMilestone: "Solve topic-wise PYQs for Digital Logic & Discrete Math" },
      { phase: "Core Subjects (Months 5-8)", tasks: ["Deep dive: Data Structures & Algorithms", "Study Operating Systems & DBMS", "Cover COA & Computer Networks", "Start topic-wise PYQ practice", "Daily: 3-4 hours study + 1 hour practice"], pyqMilestone: "Complete 5 years of topic-wise PYQs for core subjects" },
      { phase: "Advanced Topics (Months 9-10)", tasks: ["Study TOC & Compiler Design", "Complete remaining Mathematics topics", "Mixed subject practice sessions", "Begin full-length PYQs", "Daily: 4-5 hours study + 1.5 hours practice"], pyqMilestone: "Solve full-length papers from 2020-2024" },
      { phase: "Revision & Mocks (Months 11-12)", tasks: ["Full syllabus rapid revision", "15+ full-length mock tests", "Identify and fix weak areas", "Formula and concept revision", "Daily: 5-6 hours revision + 1 mock test every 2 days"], pyqMilestone: "Solve all available PYQs (2010-2025)" },
    ],
  },
  {
    title: "6-Month Preparation Plan",
    duration: "Months 1-6",
    icon: Clock,
    color: "border-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    idealFor: "Candidates with 4-6 hours daily study time",
    phases: [
      { phase: "Foundation & Core (Months 1-2)", tasks: ["Accelerated C programming & Discrete Math", "Complete Digital Logic quickly", "Start Data Structures & Algorithms", "Begin Engineering Mathematics", "Daily: 5-6 hours study"], pyqMilestone: "Solve topic-wise PYQs for completed subjects" },
      { phase: "System Subjects (Months 3-4)", tasks: ["Operating Systems with scheduling problems", "DBMS with SQL practice", "COA with numerical problems", "Computer Networks protocols", "TOC basics completion", "Daily: 5-6 hours study + practice"], pyqMilestone: "Complete 5 years of PYQs for OS, DBMS, COA, Networks" },
      { phase: "Advanced & Revision (Months 5-6)", tasks: ["Compiler Design & TOC remaining topics", "Engineering Mathematics completion", "Full syllabus revision", "15+ mock tests with analysis", "Daily: 6-7 hours intensive preparation"], pyqMilestone: "Solve 10 full-length previous year papers" },
    ],
  },
  {
    title: "3-Month Revision Plan",
    duration: "Months 1-3",
    icon: Brain,
    color: "border-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/20",
    idealFor: "Candidates who have completed the syllabus once",
    phases: [
      { phase: "Rapid Revision (Month 1)", tasks: ["Quick revision of all 11 subjects using notes", "Focus on formulas, key concepts, definitions", "Flashcard revision for all subjects", "Solve 2-3 topic-wise practice sets daily", "Daily: 6-7 hours revision"], pyqMilestone: "Solve 5 years of topic-wise PYQs" },
      { phase: "Intensive Practice (Month 2)", tasks: ["Solve 10 years of full-length PYQs", "8-10 subject-specific timed tests", "Analyze every mistake and fix weak areas", "Create and review a mistake log", "Daily: 1 full-length test + analysis"], pyqMilestone: "Complete all PYQs from 2015-2025" },
      { phase: "Mock Tests & Fine-Tuning (Month 3)", tasks: ["10-12 full-length mock tests", "Time management strategy refinement", "Question selection and attempt strategy", "Formula and concept final revision", "Daily: 1 mock test + focused revision"], pyqMilestone: "Re-solve incorrectly answered PYQs" },
    ],
  },
  {
    title: "Last 30 Days Strategy",
    duration: "Final Month",
    icon: Target,
    color: "border-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/20",
    idealFor: "Final sprint before the exam",
    phases: [
      { phase: "Weeks 1-2: Intensive Mocks", tasks: ["Take one full-length mock test every 2 days", "Analyze errors thoroughly after each test", "Revise formulas and key concepts daily", "Focus on time management strategies", "Review weak areas from mistake log"], pyqMilestone: "Solve 2 full-length previous year papers per week" },
      { phase: "Week 3: High-Weightage Focus", tasks: ["Focus on: Algorithms, OS, DBMS, Networks", "Review PYQ patterns from last 5 years", "Engineering Mathematics formula revision", "General Aptitude quick practice", "Take 3-4 more full-length tests"], pyqMilestone: "Re-solve 2020-2025 papers" },
      { phase: "Week 4: Final Polish", tasks: ["Light revision only - no new topics", "Revisit formula sheets and flashcards", "Review mistake logs and key concepts", "Take 1-2 mocks to maintain tempo", "Adequate sleep, stress management, confidence building"], pyqMilestone: "Quick review of PYQ patterns only" },
    ],
  },
];

export default function GateCSStudyPlanPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }, { name: "Study Plan", path: "/gate-cs/study-plan" }]),
          { "@context": "https://schema.org", "@type": "Article", name: "GATE CS Study Plan 2027", description: "Comprehensive GATE CS study plans with weekly schedules, daily goals, and PYQ milestones." },
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/gate-cs" className="hover:text-foreground">GATE CS</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium" aria-current="page">Study Plan</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE CS preparation</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">GATE CS Study Plan 2027</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            A well-structured study plan is the foundation of GATE CS success. Choose the plan that matches your
            available preparation time. Each plan includes weekly schedules, daily goals, topic prioritization,
            and PYQ milestones to track progress.
          </p>
        </header>

        <div className="space-y-8">
          {plans.map((plan) => (
            <section key={plan.title} className={`rounded-xl border ${plan.color} ${plan.bg} p-6 md:p-8`}>
              <div className="flex items-center gap-3 mb-2">
                <plan.icon className="size-6 text-primary" />
                <h2 className="text-xl font-semibold">{plan.title}</h2>
                <span className="text-sm text-muted-foreground">({plan.duration})</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{plan.idealFor}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {plan.phases.map((phase) => (
                  <div key={phase.phase} className="rounded-lg border border-border bg-card p-4">
                    <h3 className="font-semibold text-sm">{phase.phase}</h3>
                    <ul className="mt-2 space-y-1">
                      {phase.tasks.map((task) => (
                        <li key={task} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="size-3 mt-0.5 shrink-0 text-primary" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-start gap-2 rounded-md bg-primary/5 p-2.5 text-xs">
                      <span className="font-medium text-primary shrink-0">PYQ:</span>
                      <span className="text-muted-foreground">{phase.pyqMilestone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gate-cs/pyqs" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <BookOpen className="size-4" /> Start PYQ Practice
          </Link>
          <Link href="/gate-cs/mock-tests" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
            <Target className="size-4" /> Take Mock Tests
          </Link>
          <Link href="/gate-cs/syllabus" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
            <ArrowRight className="size-4" /> Review Syllabus
          </Link>
        </div>
      </main>
    </div>
  );
}