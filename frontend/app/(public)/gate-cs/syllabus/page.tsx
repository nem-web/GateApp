import Link from "next/link";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "GATE CS Syllabus 2027 | Complete Subject-wise Syllabus & Weightage",
  description: "Complete GATE Computer Science (CS) syllabus with detailed subject breakdown, topic lists, weightage analysis, difficulty levels, and recommended study order. Covers Engineering Mathematics, Digital Logic, COA, Programming, Algorithms, TOC, Compiler Design, OS, DBMS, Networks, and Aptitude.",
  path: "/gate-cs/syllabus",
});

const subjects = [
  {
    id: "engineering-mathematics",
    title: "Engineering Mathematics",
    weightage: "13-15%",
    difficulty: "Moderate",
    priority: "High",
    topics: 26,
    studyOrder: 1,
    description: "Engineering Mathematics forms the quantitative backbone of GATE CS. It carries substantial weightage and directly impacts algorithm analysis and problem-solving. Mastery of discrete mathematics, linear algebra, and probability is essential.",
    topicsList: [
      { name: "Discrete Mathematics", subtopics: ["Sets, Relations & Functions", "Propositional & Predicate Logic", "Group Theory", "Combinatorics & Counting", "Graph Theory Basics", "Lattices & Boolean Algebra"] },
      { name: "Linear Algebra", subtopics: ["Matrix Algebra & Operations", "Systems of Linear Equations", "Eigenvalues & Eigenvectors", "Vector Spaces", "Linear Transformations"] },
      { name: "Calculus", subtopics: ["Limits, Continuity & Differentiability", "Mean Value Theorems", "Partial Derivatives", "Maxima & Minima", "Definite & Indefinite Integrals"] },
      { name: "Probability", subtopics: ["Probability Axioms", "Conditional Probability & Bayes Theorem", "Random Variables", "Probability Distributions", "Expectation & Variance"] },
      { name: "Statistics", subtopics: ["Descriptive Statistics", "Sampling & Estimation", "Hypothesis Testing", "Correlation & Regression"] },
    ],
  },
  {
    id: "digital-logic",
    title: "Digital Logic",
    weightage: "4-5%",
    difficulty: "Easy",
    priority: "Medium",
    topics: 20,
    studyOrder: 3,
    description: "Digital Logic covers the building blocks of digital circuits. This is a scoring subject that requires conceptual clarity. Questions typically involve Boolean algebra simplification, circuit analysis, and number systems.",
    topicsList: [
      { name: "Boolean Algebra", subtopics: ["Boolean Functions & Expressions", "Canonical Forms (SOP, POS)", "Karnaugh Maps (K-Maps)", "Quine-McCluskey Minimization", "Logic Gates & Universal Gates"] },
      { name: "Combinational Circuits", subtopics: ["Multiplexers & Demultiplexers", "Encoders & Decoders", "Adders & Subtractors", "Comparators", "ALU Design"] },
      { name: "Sequential Circuits", subtopics: ["Flip-Flops (SR, JK, D, T)", "Registers & Shift Registers", "Counters (Synchronous/Asynchronous)", "Finite State Machines", "Memory Elements"] },
      { name: "Number Systems", subtopics: ["Binary, Octal, Decimal, Hexadecimal", "Number Base Conversions", "Signed Number Representations", "Binary Arithmetic", "Floating Point Representation"] },
    ],
  },
  {
    id: "coa",
    title: "Computer Organization & Architecture",
    weightage: "7-9%",
    difficulty: "Moderate-Hard",
    priority: "High",
    topics: 28,
    studyOrder: 6,
    description: "COA explores the structural and functional aspects of computer systems. This high-weightage subject bridges digital logic and high-level programming, making it essential for performance optimization.",
    topicsList: [
      { name: "Machine Instructions", subtopics: ["Instruction Formats", "Addressing Modes", "Instruction Set Architectures", "RISC vs CISC", "Data Path & Control Unit"] },
      { name: "CPU Design", subtopics: ["ALU Design", "Control Unit (Hardwired/Microprogrammed)", "Register File", "Single-cycle & Multi-cycle Processors"] },
      { name: "Memory Organization", subtopics: ["Memory Hierarchy", "RAM & ROM", "Cache Memory Organization", "Virtual Memory", "Address Translation", "TLB"] },
      { name: "Cache & Pipelining", subtopics: ["Cache Mapping Techniques", "Replacement & Write Policies", "Pipeline Stages", "Pipeline Hazards", "Branch Prediction"] },
      { name: "I/O Systems", subtopics: ["I/O Interface", "Interrupt-driven I/O", "DMA", "Storage Systems"] },
    ],
  },
  {
    id: "programming",
    title: "Programming & Data Structures",
    weightage: "10-13%",
    difficulty: "Moderate",
    priority: "Very High",
    topics: 42,
    studyOrder: 2,
    description: "Programming and Data Structures is a core competency subject testing both theoretical knowledge and practical implementation. It forms the foundation for algorithms and system design.",
    topicsList: [
      { name: "C Programming", subtopics: ["Data Types & Operators", "Control Statements", "Functions & Recursion", "Pointers & Arrays", "Structures & Unions", "Dynamic Memory Allocation", "File Handling"] },
      { name: "Recursion", subtopics: ["Recursive Functions", "Recurrence Relations", "Tail Recursion", "Backtracking Basics", "Recursion vs Iteration"] },
      { name: "Linear Data Structures", subtopics: ["Arrays & Multi-dimensional Arrays", "Singly/Doubly/Circular Linked Lists", "Stack Operations & Applications", "Queue Types & Applications"] },
      { name: "Non-Linear Data Structures", subtopics: ["Binary Trees & BST", "Tree Traversals", "AVL Trees", "B & B+ Trees", "Heaps", "Graph Representations"] },
      { name: "Hashing", subtopics: ["Hash Functions", "Collision Resolution (Chaining/Open Addressing)", "Load Factor & Rehashing"] },
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms",
    weightage: "13-15%",
    difficulty: "Hard",
    priority: "Very High",
    topics: 30,
    studyOrder: 4,
    description: "Algorithms is the most important subject in GATE CS. It tests your ability to design, analyze, and optimize computational solutions. Carry one of the highest weightages and requires deep understanding.",
    topicsList: [
      { name: "Asymptotic Analysis", subtopics: ["Big-O, Theta, Omega Notation", "Recurrence Relations", "Master Theorem", "Amortized Analysis", "Complexity Classes"] },
      { name: "Divide & Conquer", subtopics: ["Merge Sort", "Quick Sort", "Binary Search", "Closest Pair", "Strassen's Matrix Multiplication"] },
      { name: "Greedy Algorithms", subtopics: ["Fractional Knapsack", "Huffman Coding", "Activity Selection", "Minimum Spanning Trees", "Dijkstra's Algorithm"] },
      { name: "Dynamic Programming", subtopics: ["0/1 Knapsack", "Longest Common Subsequence", "Matrix Chain Multiplication", "Shortest Path Algorithms", "Optimal BST"] },
      { name: "Graph Algorithms", subtopics: ["DFS & BFS", "Topological Sorting", "Strongly Connected Components", "MST (Prim's, Kruskal's)", "Shortest Paths"] },
      { name: "NP-Completeness", subtopics: ["P, NP, NP-Complete, NP-Hard", "Polynomial Reducibility", "Cook-Levin Theorem", "Approximation Algorithms"] },
    ],
  },
  {
    id: "toc",
    title: "Theory of Computation",
    weightage: "5-7%",
    difficulty: "Moderate",
    priority: "Medium",
    topics: 24,
    studyOrder: 7,
    description: "TOC explores the fundamental limits of computation. It develops abstract thinking essential for compiler design, programming languages, and computational complexity.",
    topicsList: [
      { name: "Regular Languages", subtopics: ["Regular Expressions", "Properties of Regular Languages", "Pumping Lemma", "Closure Properties", "Myhill-Nerode Theorem"] },
      { name: "Finite Automata", subtopics: ["DFA & NFA", "NFA to DFA Conversion", "DFA Minimization", "Moore & Mealy Machines"] },
      { name: "Context-Free Languages", subtopics: ["Context-Free Grammars", "Derivation & Parse Trees", "Ambiguity", "Chomsky Normal Form", "Pumping Lemma for CFL"] },
      { name: "Pushdown Automata", subtopics: ["PDA Definition & Design", "PDA for CFG", "Deterministic vs Nondeterministic PDA"] },
      { name: "Turing Machines & Decidability", subtopics: ["Turing Machine Design", "Variants of TM", "Decidable/Undecidable Problems", "Halting Problem", "Rice's Theorem"] },
    ],
  },
  {
    id: "compiler-design",
    title: "Compiler Design",
    weightage: "4-6%",
    difficulty: "Moderate",
    priority: "Medium",
    topics: 20,
    studyOrder: 9,
    description: "Compiler Design applies theoretical concepts to build compilers. It tests understanding of how high-level code is translated to machine code and optimized.",
    topicsList: [
      { name: "Lexical Analysis", subtopics: ["Role of Lexical Analyzer", "Regular Expressions to NFA/DFA", "Lex & Flex", "Pattern Matching", "Input Buffering"] },
      { name: "Parsing", subtopics: ["Top-Down Parsing (LL)", "Bottom-Up Parsing (LR)", "SLR, CLR, LALR Parsers", "Error Handling", "Yacc"] },
      { name: "Syntax Directed Translation", subtopics: ["Syntax Directed Definitions", "Evaluation Orders", "Type Checking", "Intermediate Code Generation"] },
      { name: "Code Generation & Optimization", subtopics: ["Basic Blocks & Flow Graphs", "Register Allocation", "DAG Representation", "Peephole Optimization", "Loop Optimizations"] },
    ],
  },
  {
    id: "operating-systems",
    title: "Operating Systems",
    weightage: "8-10%",
    difficulty: "Moderate",
    priority: "High",
    topics: 30,
    studyOrder: 5,
    description: "Operating Systems covers how software manages hardware resources. Essential for system-level programming and multi-threaded application design.",
    topicsList: [
      { name: "Processes & Threads", subtopics: ["Process Concept & States", "PCB & Context Switching", "Thread Models", "Multithreading Models"] },
      { name: "CPU Scheduling", subtopics: ["Scheduling Criteria", "FCFS, SJF, Round Robin, Priority", "Multilevel Queue & Feedback", "Real-Time Scheduling"] },
      { name: "Deadlocks", subtopics: ["Necessary Conditions", "Resource Allocation Graph", "Deadlock Prevention/Avoidance", "Banker's Algorithm", "Detection & Recovery"] },
      { name: "Memory Management", subtopics: ["Contiguous Allocation", "Paging & Segmentation", "Page Table Structures", "TLB"] },
      { name: "Virtual Memory", subtopics: ["Demand Paging", "Page Replacement (FIFO, LRU, Optimal, Clock)", "Thrashing", "Working Set Model"] },
      { name: "File Systems", subtopics: ["File Concepts & Access Methods", "Directory Structure", "File Allocation Methods", "Disk Scheduling", "RAID"] },
    ],
  },
  {
    id: "databases",
    title: "Databases (DBMS)",
    weightage: "7-9%",
    difficulty: "Moderate",
    priority: "High",
    topics: 26,
    studyOrder: 5,
    description: "Databases deals with efficient storage, retrieval, and management of data. Tests both theoretical concepts and practical SQL query skills.",
    topicsList: [
      { name: "ER Model", subtopics: ["Entity & Relationship Sets", "Attributes & Keys", "ER-to-Relational Mapping", "Design Issues"] },
      { name: "Relational Algebra & Calculus", subtopics: ["Selection, Projection, Join", "Set Operations & Division", "Tuple & Domain Relational Calculus"] },
      { name: "SQL", subtopics: ["DDL, DML, DCL", "Nested Queries & Joins", "Aggregate Functions", "Views & Indexes", "PL/SQL"] },
      { name: "Normalization", subtopics: ["Functional Dependencies", "Normal Forms (1NF-4NF)", "Dependency Preservation", "Lossless Decomposition"] },
      { name: "Transactions & Concurrency", subtopics: ["ACID Properties", "Serializability", "Two-Phase Locking", "Timestamp Protocols", "Deadlock Handling"] },
    ],
  },
  {
    id: "networks",
    title: "Computer Networks",
    weightage: "7-9%",
    difficulty: "Moderate",
    priority: "High",
    topics: 28,
    studyOrder: 8,
    description: "Computer Networks covers data communication and network protocols. Understanding the layered architecture and protocol functions is essential.",
    topicsList: [
      { name: "OSI & TCP/IP Models", subtopics: ["OSI Seven Layers", "Layer Functions & Protocols", "TCP/IP Protocol Suite", "IPv4 & IPv6 Addressing"] },
      { name: "Routing", subtopics: ["Distance Vector (Bellman-Ford)", "Link State (Dijkstra)", "OSPF & BGP", "Subnetting & CIDR"] },
      { name: "Congestion & Flow Control", subtopics: ["TCP Congestion Control", "Tahoe, Reno, Vegas", "Leaky Bucket & Token Bucket", "Sliding Window"] },
      { name: "Transport Layer", subtopics: ["TCP & UDP Headers", "Three-Way Handshake", "Reliable Data Transfer"] },
      { name: "Application Layer", subtopics: ["DNS & DHCP", "HTTP/HTTPS", "Email (SMTP, POP3, IMAP)", "FTP", "Network Security Basics"] },
    ],
  },
  {
    id: "aptitude",
    title: "General Aptitude",
    weightage: "15%",
    difficulty: "Easy",
    priority: "Very High",
    topics: 15,
    studyOrder: 0,
    description: "General Aptitude is mandatory and carries 15 marks. It's the easiest section to score high with consistent practice. Covers verbal, numerical, and analytical reasoning.",
    topicsList: [
      { name: "Verbal Ability", subtopics: ["English Grammar & Vocabulary", "Sentence Completion", "Synonyms & Antonyms", "Reading Comprehension", "Sentence Correction"] },
      { name: "Numerical Ability", subtopics: ["Arithmetic (Percentage, Ratio, TSD)", "Number Systems & Series", "Data Interpretation", "Permutations & Combinations", "Probability Basics"] },
      { name: "Analytical Reasoning", subtopics: ["Logical Reasoning", "Analytical Puzzles", "Blood Relations", "Direction Sense", "Coding-Decoding"] },
    ],
  },
];

export default function GateCSSyllabusPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "GATE CS", path: "/gate-cs" }, { name: "Syllabus", path: "/gate-cs/syllabus" }]),
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: "GATE CS Syllabus 2027",
            description: "Complete GATE Computer Science syllabus covering all 11 subjects with topics, weightage, and difficulty levels.",
            provider: { "@type": "Organization", name: "GatePrep", url: absoluteUrl("/") },
          },
        ]}
      />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 md:py-14">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li className="text-muted-foreground/50">/</li>
            <li><Link href="/gate-cs" className="hover:text-foreground transition-colors">GATE CS</Link></li>
            <li className="text-muted-foreground/50">/</li>
            <li className="text-foreground font-medium" aria-current="page">Syllabus</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">GATE CS preparation</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">GATE CS Syllabus 2027</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            The GATE Computer Science syllabus spans 11 major sections covering theoretical foundations, system concepts,
            and application domains. Each section includes detailed topic breakdowns, weightage analysis, difficulty
            ratings, and study order recommendations to guide your preparation.
          </p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">11</div>
            <div className="text-sm text-muted-foreground">Subjects</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">269+</div>
            <div className="text-sm text-muted-foreground">Topics</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">100</div>
            <div className="text-sm text-muted-foreground">Total Marks</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">65</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
        </div>

        {/* Syllabus Accordion */}
        <Accordion type="multiple" className="space-y-4">
          {subjects.map((subject) => (
            <AccordionItem key={subject.id} value={subject.id} className="rounded-lg border border-border bg-card px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 flex-col items-start gap-2 text-left sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-base font-semibold">{subject.title}</span>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {subject.weightage}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        subject.difficulty === "Easy" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        subject.difficulty === "Moderate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {subject.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">{subject.topics} topics</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">Priority: {subject.priority}</span>
                    <span>·</span>
                    <span>Study Order: #{subject.studyOrder}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {subject.topicsList.map((topic) => (
                    <div key={topic.name} className="rounded-md bg-secondary/50 p-3">
                      <h4 className="text-sm font-semibold">{topic.name}</h4>
                      <ul className="mt-1.5 space-y-0.5">
                        {topic.subtopics.map((sub) => (
                          <li key={sub} className="text-xs text-muted-foreground list-disc list-inside">{sub}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Related Links */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm">
          <h2 className="font-semibold text-foreground mb-2">Related Resources</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/gate-cs/study-plan" className="text-primary underline underline-offset-2 hover:text-primary/80">Study Plan</Link>
            <Link href="/gate-cs/notes" className="text-primary underline underline-offset-2 hover:text-primary/80">Notes</Link>
            <Link href="/gate-cs/pyqs" className="text-primary underline underline-offset-2 hover:text-primary/80">PYQs</Link>
            <Link href="/gate-cs/practice-questions" className="text-primary underline underline-offset-2 hover:text-primary/80">Practice Questions</Link>
            <Link href="/gate-cs/flashcards" className="text-primary underline underline-offset-2 hover:text-primary/80">Flashcards</Link>
            <Link href="/gate-cs/mock-tests" className="text-primary underline underline-offset-2 hover:text-primary/80">Mock Tests</Link>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Note:</span> This syllabus reflects the current GATE CS paper structure.
          Minor updates may be introduced for GATE 2027. Always verify with the official GATE website.
        </p>
      </main>
    </div>
  );
}