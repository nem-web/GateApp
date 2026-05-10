import { PrismaClient } from "@prisma/client";
import { GATE_EE_SUBJECTS, GATE_EXAM_DATE_ISO } from "../lib/gate-ee";
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

  await prisma.user.upsert({
    where: { email: "nem@gateprep.local" },
    update: {
      name: "Nem",
      branch: "EE",
      streamLabel: "GATE-EE",
      gateDate: new Date(GATE_EXAM_DATE_ISO),
      hoursPerDay: 4,
    },
    create: {
      email: "nem@gateprep.local",
      name: "Nem",
      branch: "EE",
      streamLabel: "GATE-EE",
      gateDate: new Date(GATE_EXAM_DATE_ISO),
      hoursPerDay: 4,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
