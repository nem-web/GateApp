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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
