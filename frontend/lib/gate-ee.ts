/** GATE Electrical Engineering — syllabus subjects only */
export const GATE_EE_SUBJECTS = [
  "Engineering Mathematics",
  "Network Theory",
  "Signals and Systems",
  "Control Systems",
  "Electrical Machines",
  "Power Systems",
  "Power Electronics",
  "Analog Electronics",
  "Digital Electronics",
  "Measurements",
  "Electromagnetic Fields",
  "Aptitude",
  "English",
] as const;

export type GateEESubject = (typeof GATE_EE_SUBJECTS)[number];

export type GateEeSubjectWeightage = {
  subject: string;
  yearly: Record<number, number>;
  average: number;
  latest: number;
};

const RAW_GATE_EE_WEIGHTAGE: Array<{ subject: string; yearly: Record<number, number> }> = [
  { subject: "Engineering Mathematics", yearly: { 2017: 12, 2018: 11, 2019: 14, 2020: 12, 2021: 12, 2022: 13, 2023: 11, 2024: 13, 2025: 13 } },
  { subject: "Network Theory", yearly: { 2017: 9, 2018: 8, 2019: 11, 2020: 6, 2021: 11, 2022: 8, 2023: 8, 2024: 9, 2025: 9 } },
  { subject: "Electromagnetic Fields", yearly: { 2017: 3.5, 2018: 2, 2019: 1, 2020: 6, 2021: 6, 2022: 7, 2023: 5, 2024: 6, 2025: 6 } },
  { subject: "Digital Electronics", yearly: { 2017: 4, 2018: 7, 2019: 4, 2020: 3, 2021: 6, 2022: 2, 2023: 4, 2024: 5, 2025: 5 } },
  { subject: "Analog Electronics", yearly: { 2017: 5, 2018: 7, 2019: 6, 2020: 8, 2021: 3, 2022: 7, 2023: 6, 2024: 7, 2025: 7 } },
  { subject: "Control Systems", yearly: { 2017: 10.5, 2018: 8, 2019: 9, 2020: 10, 2021: 8, 2022: 8, 2023: 9, 2024: 9, 2025: 9 } },
  { subject: "Signals and Systems", yearly: { 2017: 6.5, 2018: 10, 2019: 4, 2020: 10, 2021: 8, 2022: 8, 2023: 12, 2024: 10, 2025: 10 } },
  { subject: "Electrical Machines", yearly: { 2017: 13, 2018: 8, 2019: 13, 2020: 10, 2021: 8, 2022: 12, 2023: 11, 2024: 11, 2025: 11 } },
  { subject: "Power Systems", yearly: { 2017: 9.5, 2018: 10, 2019: 11, 2020: 10, 2021: 12, 2022: 8, 2023: 11, 2024: 10, 2025: 10 } },
  { subject: "Power Electronics", yearly: { 2017: 8, 2018: 10, 2019: 10, 2020: 8, 2021: 9, 2022: 11, 2023: 6, 2024: 8, 2025: 8 } },
  { subject: "Measurements", yearly: { 2017: 4, 2018: 4, 2019: 2, 2020: 2, 2021: 2, 2022: 2, 2023: 2, 2024: 2, 2025: 2 } },
  { subject: "Aptitude", yearly: { 2017: 15, 2018: 15, 2019: 15, 2020: 15, 2021: 15, 2022: 15, 2023: 15, 2024: 15, 2025: 15 } },
];

export const GATE_EE_SUBJECT_ALIASES: Record<string, string> = {
  "Signals & Systems": "Signals and Systems",
  "Signals and Systems": "Signals and Systems",
  "Digital Circuits": "Digital Electronics",
  "Analog Circuits": "Analog Electronics",
  "Electromagnetic Theory": "Electromagnetic Fields",
  "General Aptitude": "Aptitude",
};

export const GATE_EE_WEIGHTAGE: GateEeSubjectWeightage[] = RAW_GATE_EE_WEIGHTAGE.map((row) => {
  const values = Object.values(row.yearly);
  return {
    subject: row.subject,
    yearly: row.yearly,
    average: Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10,
    latest: row.yearly[2025] ?? values[values.length - 1] ?? 0,
  };
});

export const GATE_EE_WEIGHTAGE_BY_SUBJECT: Record<string, GateEeSubjectWeightage> = Object.fromEntries(
  GATE_EE_WEIGHTAGE.map((row) => [row.subject, row]),
);

export const GATE_EE_WEIGHTAGE_PROMPT = GATE_EE_WEIGHTAGE
  .map((row) => `${row.subject}: avg ${row.average}%, 2025 ${row.latest}%`)
  .join("; ");

export function canonicalGateEESubject(subject: string): string {
  const trimmed = subject.trim();
  return GATE_EE_SUBJECT_ALIASES[trimmed] ?? trimmed;
}

/** GATE 2027 exam date (5 February 2027) — calendar countdown uses this instant */
export const GATE_EXAM_DATE_ISO = "2027-02-05T00:00:00.000Z";

export const PLATFORM_DISPLAY_NAME = "GATEPrep Pro";

/** Stable colors for progress bars / timetable */
export const SUBJECT_COLORS: Record<string, string> = Object.fromEntries(
  GATE_EE_SUBJECTS.map((s, i) => {
    const palette = [
      "#818CF8",
      "#34D399",
      "#60A5FA",
      "#F472B6",
      "#FBBF24",
      "#A78BFA",
      "#2DD4BF",
      "#FB923C",
      "#94A3B8",
      "#F87171",
      "#4ADE80",
      "#C084FC",
      "#38BDF8",
    ];
    return [s, palette[i % palette.length]];
  }),
);

export function isGateEESubject(s: string): boolean {
  return (GATE_EE_SUBJECTS as readonly string[]).includes(s);
}
