"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Brain,
  Target,
  BarChart3,
  FileText,
  PenTool,
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronRight,
  Calendar,
  Award,
  Library,
  Zap,
  BookMarked,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { JsonLd, absoluteUrl, breadcrumbSchema } from "@/lib/seo";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const hubCards = [
  { title: "Syllabus", href: "/gate-cs/syllabus", icon: BookOpen, description: "Complete subject-wise syllabus with topics, weightage & difficulty", color: "from-blue-500/10 to-blue-600/5", borderColor: "border-blue-500/20" },
  { title: "Study Plan", href: "/gate-cs/study-plan", icon: Calendar, description: "12-month, 6-month, 3-month & 30-day preparation plans", color: "from-emerald-500/10 to-emerald-600/5", borderColor: "border-emerald-500/20" },
  { title: "PYQs", href: "/gate-cs/pyqs", icon: FileText, description: "Year-wise & topic-wise previous year questions (2010-2026)", color: "from-violet-500/10 to-violet-600/5", borderColor: "border-violet-500/20" },
  { title: "Cutoffs", href: "/gate-cs/cutoffs", icon: BarChart3, description: "Category-wise cutoff trends, safe scores & institute analysis", color: "from-orange-500/10 to-orange-600/5", borderColor: "border-orange-500/20" },
  { title: "Flashcards", href: "/gate-cs/flashcards", icon: Brain, description: "Subject-wise revision decks with spaced repetition", color: "from-pink-500/10 to-pink-600/5", borderColor: "border-pink-500/20" },
  { title: "Practice Questions", href: "/gate-cs/practice-questions", icon: PenTool, description: "Topic-wise & difficulty-based practice sets", color: "from-cyan-500/10 to-cyan-600/5", borderColor: "border-cyan-500/20" },
  { title: "Notes", href: "/gate-cs/notes", icon: Library, description: "Comprehensive subject notes & formula sheets", color: "from-amber-500/10 to-amber-600/5", borderColor: "border-amber-500/20" },
  { title: "Mock Tests", href: "/gate-cs/mock-tests", icon: Target, description: "Full-length, subject & topic tests with analysis", color: "from-red-500/10 to-red-600/5", borderColor: "border-red-500/20" },
  { title: "Study Planner", href: "/gate-cs/study-planner", icon: Layers, description: "Personalized planner with daily goals & tracking", color: "from-indigo-500/10 to-indigo-600/5", borderColor: "border-indigo-500/20" },
];

const benefits = [
  { icon: BookMarked, title: "Complete Syllabus Coverage", description: "All 11 GATE CS subjects covered with detailed topic breakdowns" },
  { icon: Sparkles, title: "Structured Learning Path", description: "Progressive learning from fundamentals to advanced concepts" },
  { icon: TrendingUp, title: "Performance Analytics", description: "Track accuracy, speed, and weak topics with detailed insights" },
  { icon: Zap, title: "Smart Revision Tools", description: "Flashcards, formula sheets, and quick revision notes for every subject" },
  { icon: Target, title: "Exam-Focused Practice", description: "Real exam pattern questions with detailed solutions" },
  { icon: Lightbulb, title: "Expert Strategies", description: "Time-tested preparation strategies from GATE toppers" },
];

const subjects = [
  { name: "Engineering Mathematics", weight: "13-15%", difficulty: "Moderate", link: "/gate-cs/syllabus#engineering-mathematics" },
  { name: "Digital Logic", weight: "4-5%", difficulty: "Easy", link: "/gate-cs/syllabus#digital-logic" },
  { name: "Computer Organization & Architecture", weight: "7-9%", difficulty: "Moderate-Hard", link: "/gate-cs/syllabus#coa" },
  { name: "Programming & Data Structures", weight: "10-13%", difficulty: "Moderate", link: "/gate-cs/syllabus#programming" },
  { name: "Algorithms", weight: "13-15%", difficulty: "Hard", link: "/gate-cs/syllabus#algorithms" },
  { name: "Theory of Computation", weight: "5-7%", difficulty: "Moderate", link: "/gate-cs/syllabus#toc" },
  { name: "Compiler Design", weight: "4-6%", difficulty: "Moderate", link: "/gate-cs/syllabus#compiler-design" },
  { name: "Operating Systems", weight: "8-10%", difficulty: "Moderate", link: "/gate-cs/syllabus#operating-systems" },
  { name: "Databases (DBMS)", weight: "7-9%", difficulty: "Moderate", link: "/gate-cs/syllabus#databases" },
  { name: "Computer Networks", weight: "7-9%", difficulty: "Moderate", link: "/gate-cs/syllabus#networks" },
  { name: "General Aptitude", weight: "15%", difficulty: "Easy", link: "/gate-cs/syllabus#aptitude" },
];

const roadmapPhases = [
  { phase: "Foundation (Months 1-4)", topics: "Programming, Discrete Math, Digital Logic, Basic Mathematics", icon: Layers, color: "border-blue-400" },
  { phase: "Core (Months 5-8)", topics: "Data Structures, Algorithms, OS, DBMS, COA, Networks", icon: BookOpen, color: "border-emerald-400" },
  { phase: "Advanced (Months 9-10)", topics: "TOC, Compiler Design, Advanced Math, Mixed Practice", icon: Brain, color: "border-violet-400" },
  { phase: "Revision & Mocks (Months 11-12)", topics: "Full syllabus revision, PYQs, Mock Tests, Weak area focus", icon: Target, color: "border-orange-400" },
];

const faqs = [
  { q: "How to prepare for GATE CS 2027?", a: "Start by understanding the GATE CS syllabus and exam pattern. Create a structured study plan covering all subjects. Focus on high-weightage topics like Algorithms, Data Structures, Operating Systems, and DBMS. Practice previous year questions regularly and take mock tests to track progress." },
  { q: "Is GATE CS difficult?", a: "GATE CS is considered moderately difficult. Theory subjects like TOC require conceptual clarity, while application subjects like Algorithms demand problem-solving practice. With consistent 6-12 months of preparation, GATE CS is achievable." },
  { q: "What is a good GATE CS score?", a: "A score above 60-65 marks is generally good. For IIT MTech admission, scores above 70-75 with rank within top 500 are competitive. For PSU recruitment, scores above 75-80 are often required." },
  { q: "What is the GATE CS exam pattern?", a: "GATE CS is a 3-hour computer-based test with 65 questions worth 100 marks: General Aptitude (15 marks), Engineering Mathematics (13-15 marks), and Core CS subjects (70-72 marks). Question types include MCQ, MSQ, and NAT." },
  { q: "Which IITs offer MTech through GATE CS?", a: "All IITs including IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur, IIT Roorkee, IIT Guwahati, and IIT Hyderabad offer MTech programs through GATE CS scores via CCMT counseling." },
];

export default function GateCSHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "GATE CS 2027 Preparation Hub",
            description: "Complete GATE Computer Science preparation resources including syllabus, study plans, PYQs, mock tests, notes, flashcards, and more.",
            provider: { "@type": "Organization", name: "GatePrep", url: absoluteUrl("/") },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question", name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-10 md:py-14">
        {/* HERO */}
        <motion.section initial="initial" animate="animate" className="max-w-3xl" aria-labelledby="hero-heading">
          <motion.p variants={fadeInUp} className="text-sm font-medium text-primary">GATE preparation hub</motion.p>
          <motion.h1 variants={fadeInUp} id="hero-heading" className="mt-3 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            GATE CS 2027 <span className="text-primary">Preparation</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
            Master the GATE Computer Science & Information Technology (CS) paper with GatePrep. Access a complete
            study ecosystem with detailed syllabus, expert strategies, high-quality practice, and personalized
            progress tracking. Whether you're targeting IIT MTech admission, PSU recruitment, or research
            opportunities, this is your launchpad for GATE CS 2027 success.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
            <Link href="/gate-cs/syllabus" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105">
              Explore Syllabus <ArrowRight className="size-4" />
            </Link>
            <Link href="/gate-cs/study-plan" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold transition-all hover:bg-secondary hover:scale-105">
              Create Study Plan <Calendar className="size-4" />
            </Link>
            <Link href="/gate-cs/pyqs" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold transition-all hover:bg-secondary hover:scale-105">
              Practice PYQs <FileText className="size-4" />
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> 11 Subjects</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> 100+ Practice Sets</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> 6500+ PYQs</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> 20+ Mock Tests</span>
          </motion.div>
        </motion.section>

        {/* BENEFITS */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          aria-labelledby="benefits-heading"
        >
          <motion.h2 variants={fadeInUp} id="benefits-heading" className="text-2xl font-semibold">Why GatePrep for GATE CS?</motion.h2>
          <motion.div variants={fadeInUp} className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <item.icon className="size-8 text-primary mb-3" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* SUBJECT CARDS */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          aria-labelledby="subjects-heading"
        >
          <motion.h2 variants={fadeInUp} id="subjects-heading" className="text-2xl font-semibold">GATE CS Subjects at a Glance</motion.h2>
          <motion.p variants={fadeInUp} className="mt-2 text-muted-foreground">11 subjects covering the complete GATE Computer Science syllabus</motion.p>
          <motion.div variants={fadeInUp} className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subj) => (
              <Link key={subj.name} href={subj.link}>
                <motion.div
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{subj.name}</h3>
                    <span className="text-xs font-medium text-primary">{subj.weight}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      subj.difficulty === "Easy" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      subj.difficulty === "Moderate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      subj.difficulty === "Moderate-Hard" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {subj.difficulty}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.section>

        {/* HUB CARDS - Navigation to all CS pages */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          aria-labelledby="resources-heading"
        >
          <motion.h2 variants={fadeInUp} id="resources-heading" className="text-2xl font-semibold">Explore GATE CS Resources</motion.h2>
          <motion.div variants={fadeInUp} className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hubCards.map((card) => (
              <Link key={card.title} href={card.href}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.2 } }}
                  className={`rounded-xl border ${card.borderColor} bg-gradient-to-br ${card.color} bg-card p-5 transition-shadow hover:shadow-lg`}
                >
                  <card.icon className="size-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                    Explore <ChevronRight className="size-3" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.section>

        {/* EXAM OVERVIEW */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          aria-labelledby="exam-heading"
        >
          <motion.h2 variants={fadeInUp} id="exam-heading" className="text-2xl font-semibold">GATE CS Exam Overview</motion.h2>
          <motion.div variants={fadeInUp} className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-5 text-center">
              <Clock className="size-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">3 Hours</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 text-center">
              <FileText className="size-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">65</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 text-center">
              <Award className="size-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">100</div>
              <div className="text-sm text-muted-foreground">Total Marks</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 text-center">
              <GraduationCap className="size-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">CBT</div>
              <div className="text-sm text-muted-foreground">Computer-Based Test</div>
            </div>
          </motion.div>
        </motion.section>

        {/* CAREER OPPORTUNITIES */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          aria-labelledby="career-heading"
        >
          <motion.h2 variants={fadeInUp} id="career-heading" className="text-2xl font-semibold">Career Opportunities</motion.h2>
          <motion.div variants={fadeInUp} className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <Star className="size-7 text-primary mb-3" />
              <h3 className="font-semibold text-lg">PSU Jobs</h3>
              <p className="mt-2 text-sm text-muted-foreground">IOCL, NTPC, ONGC, GAIL, Power Grid, BEL, and more recruit through GATE CS scores with salaries of 8-15 LPA plus benefits.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <GraduationCap className="size-7 text-primary mb-3" />
              <h3 className="font-semibold text-lg">MTech Admissions</h3>
              <p className="mt-2 text-sm text-muted-foreground">IITs, NITs, IIITs offer MTech in CS, AI, Data Science, Cybersecurity with stipends of 12,400-35,000 INR/month.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <Lightbulb className="size-7 text-primary mb-3" />
              <h3 className="font-semibold text-lg">Research & PhD</h3>
              <p className="mt-2 text-sm text-muted-foreground">PhD programs, research fellowships, and R&D roles at Microsoft Research, Google Research, and IBM Research.</p>
            </div>
          </motion.div>
        </motion.section>

        {/* EXAM PATTERN TABLE */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          aria-labelledby="pattern-heading"
        >
          <motion.h2 variants={fadeInUp} id="pattern-heading" className="text-2xl font-semibold">Exam Pattern & Marks Distribution</motion.h2>
          <motion.div variants={fadeInUp} className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left font-semibold">Section</th>
                  <th className="p-3 text-left font-semibold">Questions</th>
                  <th className="p-3 text-left font-semibold">Marks</th>
                  <th className="p-3 text-left font-semibold">Question Types</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-medium">General Aptitude</td>
                  <td className="p-3">10</td>
                  <td className="p-3">15</td>
                  <td className="p-3">MCQ (5×1 mark + 5×2 marks)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-medium">Engineering Mathematics</td>
                  <td className="p-3">8-10</td>
                  <td className="p-3">13-15</td>
                  <td className="p-3">MCQ + MSQ + NAT</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Core CS Subjects</td>
                  <td className="p-3">45-47</td>
                  <td className="p-3">70-72</td>
                  <td className="p-3">MCQ + MSQ + NAT</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </motion.section>

        {/* PREPARATION ROADMAP */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          aria-labelledby="roadmap-heading"
        >
          <motion.h2 variants={fadeInUp} id="roadmap-heading" className="text-2xl font-semibold">Preparation Roadmap</motion.h2>
          <motion.div variants={fadeInUp} className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {roadmapPhases.map((phase) => (
              <motion.div
                key={phase.phase}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className={`rounded-lg border-l-4 ${phase.color} border border-border bg-card p-5`}
              >
                <phase.icon className="size-6 text-primary mb-2" />
                <h3 className="font-semibold text-sm">{phase.phase}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{phase.topics}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-6 flex justify-center">
            <Link href="/gate-cs/study-plan" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
              View Detailed Study Plans <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </motion.section>

        {/* FAQS */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          aria-labelledby="faq-heading"
        >
          <motion.h2 variants={fadeInUp} id="faq-heading" className="text-2xl font-semibold">Frequently Asked Questions</motion.h2>
          <motion.div variants={fadeInUp} className="mt-6 divide-y divide-border rounded-lg border border-border">
            {faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium hover:bg-muted/30">
                  {faq.q}
                  <ChevronRight className="size-4 shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
              </details>
            ))}
          </motion.div>
        </motion.section>

        {/* FINAL CTA */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          aria-labelledby="cta-heading"
          className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center"
        >
          <motion.h2 variants={fadeInUp} id="cta-heading" className="text-2xl font-semibold">
            Start Your GATE CS 2027 Journey Today
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 max-w-2xl mx-auto leading-7 text-muted-foreground">
            GatePrep provides everything you need: comprehensive notes, thousands of practice questions, intelligent
            study planning, performance analytics, and a supportive community. Begin your journey toward IIT MTech,
            PSU careers, and research excellence.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/gate-cs/notes" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105">
              <Library className="size-4" /> Browse Notes
            </Link>
            <Link href="/gate-cs/practice-questions" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold transition-all hover:bg-secondary hover:scale-105">
              <PenTool className="size-4" /> Start Practicing
            </Link>
            <Link href="/gate-cs/mock-tests" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold transition-all hover:bg-secondary hover:scale-105">
              <Target className="size-4" /> Take a Mock Test
            </Link>
          </motion.div>
        </motion.section>

        {/* BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li className="text-muted-foreground/50">/</li>
            <li className="text-foreground font-medium" aria-current="page">GATE CS</li>
          </ol>
        </nav>
      </main>
    </div>
  );
}