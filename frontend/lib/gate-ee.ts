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

