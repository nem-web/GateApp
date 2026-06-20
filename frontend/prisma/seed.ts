import { PrismaClient } from "@prisma/client";
import { GATE_EE_SUBJECTS } from "../lib/gate-ee";
import { subjectSlugFromTitle } from "../lib/subject-resolve";

/**
 * GATE EE seeded drill referenced by slug `gate-ee-sample-drill`.
 * Correct answers live only in Postgres — sample API omits them.
 */
const SAMPLE_DRILL_QUESTIONS: {
  id: string;
  topic: string;
  text: string;
  options: string[];
  correctIndex: number;
  subjectTitle: string;
}[] = [
  {
    id: "ee-sample-q1",
    subjectTitle: "Power Systems",
    topic: "Load Flow",
    text: "In Newton-Raphson load flow, the Jacobian relates corrections mainly between:",
    options: ["P-Q pairs always", "P-angle & Q-V mismatches", "Only slack bus injections", "Only reactive power"],
    correctIndex: 1,
  },
  {
    id: "ee-sample-q2",
    subjectTitle: "Electrical Machines",
    topic: "Transformers",
    text: "A transformer draws negligible current on open circuit mainly due to:",
    options: [
      "High leakage inductance",
      "Low magnetizing reactance path dominates flux setup",
      "Core saturation limit",
      "Winding resistance only",
    ],
    correctIndex: 1,
  },
  {
    id: "ee-sample-q3",
    subjectTitle: "Control Systems",
    topic: "Stability",
    text: "For unity feedback second-order system, damping ratio ζ < 1 implies:",
    options: ["Overdamped", "Critically damped", "Underdamped oscillatory step response", "Unconditionally unstable"],
    correctIndex: 2,
  },
  {
    id: "ee-sample-q4",
    subjectTitle: "Measurements",
    topic: "Bridges",
    text: "A Maxwell bridge is commonly employed for:",
    options: [
      "Capacitor inductance comparison networks",
      "Unknown inductance with stray capacitance",
      "Resistance-only calibration",
      "High voltage divider tuning",
    ],
    correctIndex: 1,
  },
  {
    id: "ee-sample-q5",
    subjectTitle: "Network Theory",
    topic: "AC circuits",
    text: "In sinusoidal steady state, the magnitude |Z| of impedance relates:",
    options: ["Only reactive components", "|√(R²+X²)| where Z=R+jX", "|R+X| always", "|V/I| without phase"],
    correctIndex: 1,
  },
];

const GATE_EE_CUTOFFS: {
  year: number;
  gen: number;
  obc: number;
  scst: number;
  remarks: string;
}[] = [
  { year: 2016, gen: 25.1, obc: 22.5, scst: 16.7, remarks: "GATE EE qualifying marks" },
  { year: 2017, gen: 25.2, obc: 22.6, scst: 16.7, remarks: "GATE EE qualifying marks" },
  { year: 2018, gen: 29.1, obc: 26.1, scst: 19.4, remarks: "GATE EE qualifying marks" },
  { year: 2019, gen: 39.6, obc: 35.6, scst: 26.4, remarks: "GATE EE qualifying marks" },
  { year: 2020, gen: 33.4, obc: 30.0, scst: 22.2, remarks: "GATE EE qualifying marks" },
  { year: 2021, gen: 30.3, obc: 27.2, scst: 20.2, remarks: "GATE EE qualifying marks" },
  { year: 2022, gen: 30.7, obc: 27.6, scst: 20.4, remarks: "GATE EE qualifying marks" },
  { year: 2023, gen: 25.0, obc: 22.5, scst: 16.6, remarks: "GATE EE qualifying marks" },
  { year: 2024, gen: 25.7, obc: 23.1, scst: 17.1, remarks: "GATE EE qualifying marks" },
  { year: 2025, gen: 25.0, obc: 22.5, scst: 16.6, remarks: "GATE EE qualifying marks" },
];

const prisma = new PrismaClient();

const GATE_BRANCH_PAGES = [
  {
    code: "ee",
    slug: "gate-ee",
    name: "GATE Electrical Engineering",
    title: "GATE EE Preparation Guide: Syllabus, PYQs, Strategy and Resources",
    description:
      "Prepare for GATE Electrical Engineering with syllabus planning, important topics, PYQs, quizzes, formula revision, and structured study resources.",
    overview:
      "GATE Electrical Engineering preparation rewards a balance of concept clarity, formula recall, numerical practice, and repeated previous-year question analysis. Use this page as the public hub for EE subjects, notes, formulas, PYQs, quizzes, and strategy content published by GATEPrep.",
    syllabus: [
      "Engineering Mathematics",
      "Electric Circuits",
      "Electromagnetic Fields",
      "Signals and Systems",
      "Electrical Machines",
      "Power Systems",
      "Control Systems",
      "Electrical and Electronic Measurements",
      "Analog and Digital Electronics",
      "Power Electronics",
      "General Aptitude",
    ],
    importantTopics: ["Network theorems", "Transformers", "Load flow", "Stability", "Power converters", "Laplace transforms"],
    books: ["Standard textbooks and institute notes aligned to the official GATE syllabus", "Previous-year GATE papers with verified solutions"],
    preparation:
      "Build preparation around weekly subject blocks, PYQ review, formula sheets, timed quizzes, and revision cycles. Prioritize high-yield subjects while keeping aptitude and mathematics active every week.",
  },
  {
    code: "ec",
    slug: "gate-ec",
    name: "GATE Electronics and Communication",
    title: "GATE EC Preparation Guide: Syllabus, Topics, PYQs and Strategy",
    description:
      "A crawlable GATE EC preparation hub for syllabus planning, important topics, books, PYQs, quizzes, and related learning resources.",
    overview:
      "GATE EC preparation combines networks, signals, control, analog electronics, digital circuits, communications, electromagnetics, and mathematics. This hub organizes published EC resources as the content library grows.",
    syllabus: ["Engineering Mathematics", "Networks", "Signals and Systems", "Electronic Devices", "Analog Circuits", "Digital Circuits", "Control Systems", "Communications", "Electromagnetics", "General Aptitude"],
    importantTopics: ["Convolution", "Bode plots", "MOSFET biasing", "Digital logic", "Modulation", "Transmission lines"],
    books: ["Official syllabus-aligned textbooks", "Previous-year GATE EC papers"],
    preparation:
      "Rotate theory, solved examples, PYQs, and short quizzes. Keep formula revision active for networks, signals, communications, and electromagnetics.",
  },
  {
    code: "ece",
    slug: "gate-ece",
    name: "GATE Electronics and Communication",
    title: "GATE ECE Preparation Guide: Syllabus, Topics, PYQs and Strategy",
    description:
      "A GATE ECE preparation hub for syllabus planning, important topics, books, PYQs, quizzes, and related learning resources.",
    overview:
      "GATE ECE preparation combines networks, signals, control, analog electronics, digital circuits, communications, electromagnetics, and mathematics. This hub organizes published ECE resources as the content library grows.",
    syllabus: ["Engineering Mathematics", "Networks", "Signals and Systems", "Electronic Devices", "Analog Circuits", "Digital Circuits", "Control Systems", "Communications", "Electromagnetics", "General Aptitude"],
    importantTopics: ["Convolution", "Bode plots", "MOSFET biasing", "Digital logic", "Modulation", "Transmission lines"],
    books: ["Official syllabus-aligned ECE textbooks", "Previous-year GATE ECE papers"],
    preparation:
      "Rotate theory, solved examples, PYQs, and short quizzes. Keep formula revision active for networks, signals, communications, and electromagnetics.",
  },
  {
    code: "cs",
    slug: "gate-cs",
    name: "GATE Computer Science",
    title: "GATE CS Preparation Guide: Syllabus, Topics, PYQs and Strategy",
    description:
      "A GATE CS preparation hub for algorithms, data structures, OS, DBMS, networks, theory, PYQs, quizzes, and study strategy.",
    overview:
      "GATE CS preparation depends on precise fundamentals, problem-solving speed, and repeated revision of core CS subjects. This hub connects published CS resources as they are created.",
    syllabus: ["Engineering Mathematics", "Discrete Mathematics", "Programming", "Data Structures", "Algorithms", "Theory of Computation", "Compiler Design", "Operating Systems", "DBMS", "Computer Networks", "Digital Logic", "General Aptitude"],
    importantTopics: ["Asymptotic analysis", "Graphs", "Scheduling", "Normalization", "TCP/IP", "Automata"],
    books: ["Official syllabus-aligned CS textbooks", "Previous-year GATE CS papers"],
    preparation:
      "Use topic-wise PYQs after each chapter, maintain short notes for definitions and edge cases, and attempt mixed quizzes to connect concepts across subjects.",
  },
  {
    code: "me",
    slug: "gate-me",
    name: "GATE Mechanical Engineering",
    title: "GATE ME Preparation Guide: Syllabus, Topics, PYQs and Strategy",
    description:
      "A GATE ME preparation hub for thermodynamics, SOM, manufacturing, fluid mechanics, machines, PYQs, quizzes, and study strategy.",
    overview:
      "GATE ME preparation requires strong numerical fluency, formula recall, and conceptual clarity across thermal, design, production, and mathematics areas.",
    syllabus: ["Engineering Mathematics", "Applied Mechanics", "Strength of Materials", "Theory of Machines", "Machine Design", "Fluid Mechanics", "Thermodynamics", "Heat Transfer", "Manufacturing", "Industrial Engineering", "General Aptitude"],
    importantTopics: ["Mohr circle", "IC engines", "Turbomachinery", "Heat exchangers", "Casting", "Inventory models"],
    books: ["Official syllabus-aligned ME textbooks", "Previous-year GATE ME papers"],
    preparation:
      "Alternate numerical practice with formula revision. Convert repeated mistakes from PYQs into revision notes and timed quizzes.",
  },
  {
    code: "ce",
    slug: "gate-ce",
    name: "GATE Civil Engineering",
    title: "GATE CE Preparation Guide: Syllabus, Topics, PYQs and Strategy",
    description:
      "A GATE CE preparation hub for structural, geotechnical, transportation, environmental, water resources, PYQs, quizzes, and strategy.",
    overview:
      "GATE CE preparation is broad, so a subject-wise plan, recurring formula revision, and previous-year question analysis are essential for steady progress.",
    syllabus: ["Engineering Mathematics", "Structural Engineering", "Geotechnical Engineering", "Water Resources", "Environmental Engineering", "Transportation Engineering", "Geomatics", "General Aptitude"],
    importantTopics: ["Bending moment", "Soil classification", "Open channel flow", "BOD/COD", "Highway materials", "Surveying"],
    books: ["Official syllabus-aligned CE textbooks", "Previous-year GATE CE papers"],
    preparation:
      "Prioritize repeated PYQ topics, maintain formula sheets for numericals, and use mixed practice after completing each subject cluster.",
  },
  {
    code: "in",
    slug: "gate-in",
    name: "GATE Instrumentation Engineering",
    title: "GATE IN Preparation Guide: Syllabus, Topics, PYQs and Strategy",
    description:
      "A GATE IN preparation hub for measurements, control, signals, transducers, electronics, PYQs, quizzes, and strategy.",
    overview:
      "GATE Instrumentation preparation connects measurement systems, control, signals, electronics, sensors, and mathematics. This hub organizes published IN resources for crawlable discovery.",
    syllabus: ["Engineering Mathematics", "Electrical Circuits", "Signals and Systems", "Control Systems", "Analog Electronics", "Digital Electronics", "Measurements", "Sensors", "Process Control", "General Aptitude"],
    importantTopics: ["Error analysis", "Bridges", "Transducers", "PID control", "Filters", "Signal conditioning"],
    books: ["Official syllabus-aligned IN textbooks", "Previous-year GATE IN papers"],
    preparation:
      "Study measurement principles with solved numericals, revise control and signals frequently, and solve previous-year questions topic-wise.",
  },
];

const SUBJECT_SEO_PAGES = [
  {
    slug: "power-systems",
    title: "Power Systems for GATE EE: Syllabus, Important Topics and PYQs",
    description: "Study Power Systems for GATE EE with important topics, syllabus coverage, books, PYQ strategy, and linked practice resources.",
    subjectName: "Power Systems",
    overview:
      "Power Systems is a core GATE EE subject covering generation, transmission, distribution, power flow, faults, stability, protection, and economic operation.",
    importantTopics: ["Load flow", "Fault analysis", "Economic dispatch", "Stability", "Protection", "Per-unit system"],
    books: ["Official syllabus-aligned power systems references", "Previous-year GATE EE papers"],
    strategy: "Start with per-unit and transmission fundamentals, then move to load flow, faults, stability, protection, and repeated PYQ practice.",
  },
  {
    slug: "control-systems",
    title: "Control Systems for GATE EE: Syllabus, Important Topics and PYQs",
    description: "Prepare Control Systems for GATE with stability, root locus, frequency response, state space, quizzes, and PYQ links.",
    subjectName: "Control Systems",
    overview:
      "Control Systems tests transfer functions, time response, stability, root locus, frequency response, compensators, and state-space analysis.",
    importantTopics: ["Routh stability", "Root locus", "Bode plots", "Nyquist", "Steady-state error", "State space"],
    books: ["Official syllabus-aligned control systems references", "Previous-year GATE papers"],
    strategy: "Keep formula sheets for standard second-order systems and practice stability questions until the test logic is automatic.",
  },
  {
    slug: "electrical-machines",
    title: "Electrical Machines for GATE EE: Syllabus, Important Topics and PYQs",
    description: "Prepare Electrical Machines for GATE EE with transformers, DC machines, induction machines, synchronous machines, and PYQs.",
    subjectName: "Electrical Machines",
    overview:
      "Electrical Machines is a high-yield GATE EE subject covering transformers, DC machines, induction machines, synchronous machines, and machine performance.",
    importantTopics: ["Transformers", "DC machines", "Induction motor", "Synchronous machine", "Equivalent circuits", "Testing"],
    books: ["Official syllabus-aligned machines references", "Previous-year GATE EE papers"],
    strategy: "Build equivalent circuit fluency first, then solve performance and testing PYQs under time constraints.",
  },
];

async function main() {
  for (let i = 0; i < GATE_EE_SUBJECTS.length; i++) {
    const title = GATE_EE_SUBJECTS[i]!;
    await prisma.subject.upsert({
      where: { slug: subjectSlugFromTitle(title) },
      update: { title, sortOrder: i, branch: "EE" },
      create: { slug: subjectSlugFromTitle(title), title, sortOrder: i, branch: "EE" },
    });
  }

  const subjectsByTitle = Object.fromEntries(
    (await prisma.subject.findMany()).map((s) => [s.title, s] as const),
  );

  const packSlug = "gate-ee-sample-drill";
  const pack = await prisma.testPack.upsert({
    where: { slug: packSlug },
    update: {},
    create: {
      slug: packSlug,
      title: "GATE EE — mixed fundamentals drill",
      durationMinutes: 25,
    },
  });

  for (const q of SAMPLE_DRILL_QUESTIONS) {
    const subject = subjectsByTitle[q.subjectTitle];
    if (!subject) throw new Error(`Seed subject missing for ${q.subjectTitle}`);
    await prisma.question.upsert({
      where: { id: q.id },
      update: {
        testPackId: pack.id,
        subjectId: subject.id,
        topic: q.topic,
        prompt: q.text,
        options: q.options,
        correctOptionIndex: q.correctIndex,
        type: "mcq",
        difficulty: "medium",
        source: "seed",
      },
      create: {
        id: q.id,
        testPackId: pack.id,
        subjectId: subject.id,
        topic: q.topic,
        prompt: q.text,
        type: "mcq",
        options: q.options,
        correctOptionIndex: q.correctIndex,
        difficulty: "medium",
        source: "seed",
      },
    });
  }

  for (const row of GATE_EE_CUTOFFS) {
    const categoryMarks = [
      ["GEN", row.gen],
      ["OBC", row.obc],
      ["EWS", row.obc],
      ["SC", row.scst],
      ["ST", row.scst],
      ["PWD", row.scst],
    ] as const;

    for (const [category, marks] of categoryMarks) {
      await prisma.gateEeCutoff.upsert({
        where: { year_category: { year: row.year, category } },
        update: { marks, remarks: row.remarks },
        create: { year: row.year, category, marks, remarks: row.remarks },
      });
    }
  }

  for (const page of GATE_BRANCH_PAGES) {
    await prisma.gateBranchPage.upsert({
      where: { slug: page.slug },
      update: { ...page, status: "PUBLISHED", publishedAt: new Date("2026-06-20T00:00:00.000Z") },
      create: { ...page, status: "PUBLISHED", publishedAt: new Date("2026-06-20T00:00:00.000Z") },
    });
  }

  for (const page of SUBJECT_SEO_PAGES) {
    await prisma.subjectSeoPage.upsert({
      where: { slug: page.slug },
      update: { ...page, branchCode: "ee", status: "PUBLISHED", publishedAt: new Date("2026-06-20T00:00:00.000Z") },
      create: { ...page, branchCode: "ee", status: "PUBLISHED", publishedAt: new Date("2026-06-20T00:00:00.000Z") },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
