import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_CATEGORIES = ["GEN", "OBC", "EWS", "SC", "ST", "PWD"] as const;
type CutoffCategory = (typeof VALID_CATEGORIES)[number];

const DEFAULT_CUTOFFS = [
  { year: 2016, gen: 25.1, obc: 22.5, scst: 16.7 },
  { year: 2017, gen: 25.2, obc: 22.6, scst: 16.7 },
  { year: 2018, gen: 29.1, obc: 26.1, scst: 19.4 },
  { year: 2019, gen: 39.6, obc: 35.6, scst: 26.4 },
  { year: 2020, gen: 33.4, obc: 30.0, scst: 22.2 },
  { year: 2021, gen: 30.3, obc: 27.2, scst: 20.2 },
  { year: 2022, gen: 30.7, obc: 27.6, scst: 20.4 },
  { year: 2023, gen: 25.0, obc: 22.5, scst: 16.6 },
  { year: 2024, gen: 25.7, obc: 23.1, scst: 17.1 },
  { year: 2025, gen: 25.0, obc: 22.5, scst: 16.6 },
].flatMap((row) => {
  const categoryMarks = [
    ["GEN", row.gen],
    ["OBC", row.obc],
    ["EWS", row.obc],
    ["SC", row.scst],
    ["ST", row.scst],
    ["PWD", row.scst],
  ] as const;
  return categoryMarks.map(([category, marks]) => ({
    id: `seed-${row.year}-${category}`,
    year: row.year,
    category,
    marks,
    airApprox: null,
    remarks: "GATE EE qualifying marks",
  }));
});

function normalizeCategory(input: unknown): CutoffCategory {
  const category = String(input ?? "GEN").toUpperCase();
  return VALID_CATEGORIES.includes(category as CutoffCategory) ? (category as CutoffCategory) : "GEN";
}

function predictForCategory(
  rows: { year: number; category: string; marks: number | null }[],
  category: CutoffCategory,
) {
  const byYear = new Map<number, number>();
  for (const row of rows) {
    if (row.category === category && row.marks != null) byYear.set(row.year, row.marks);
  }

  const years = [...byYear.keys()].sort((a, b) => a - b);
  if (!years.length) return 0;
  if (years.length === 1) return byYear.get(years[0]) ?? 0;

  const y1 = years[years.length - 2];
  const y2 = years[years.length - 1];
  const m1 = byYear.get(y1)!;
  const m2 = byYear.get(y2)!;
  const slope = (m2 - m1) / (y2 - y1);
  const predicted = Math.round((m2 + slope * (2027 - y2)) * 10) / 10;
  return Math.min(45, Math.max(10, predicted));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const selectedCategory = normalizeCategory(searchParams.get("category"));

  let source = "database";
  let rows: { year: number; category: string; marks: number | null; airApprox: number | null; remarks: string | null }[];
  try {
    rows = await prisma.gateEeCutoff.findMany({
      orderBy: [{ year: "desc" }, { category: "asc" }],
    });
    if (!rows.length) {
      rows = DEFAULT_CUTOFFS;
      source = "seed-fallback";
    }
  } catch {
    rows = DEFAULT_CUTOFFS;
    source = "seed-fallback";
  }

  const predictionsByCategory = Object.fromEntries(
    VALID_CATEGORIES.map((category) => [category, predictForCategory(rows, category)]),
  ) as Record<CutoffCategory, number>;

  const predicted2027 = predictionsByCategory[selectedCategory];
  const safeScores = {
    category: selectedCategory,
    IITInterviewLikely: Math.round(predicted2027 + (selectedCategory === "GEN" ? 22 : 18)),
    PSUCandidateBand: `${Math.round(predicted2027 + 8)} - ${Math.round(predicted2027 + 18)}`,
    disclaimer:
      "Qualifying marks vary yearly; predicted values are heuristic trends only - verify with official GATE notices.",
  };

  return NextResponse.json({
    historical: rows,
    source,
    selectedCategory,
    predictedQualifying2027: predicted2027,
    predictedGENQualifying2027: predictionsByCategory.GEN,
    predictionsByCategory,
    safeScores,
    categories: VALID_CATEGORIES,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const year = Number(body.year);
    const category = normalizeCategory(body.category);
    const marks = body.marks == null ? null : Number(body.marks);
    const airApprox = body.airApprox == null ? null : Number(body.airApprox);
    const remarks = body.remarks == null ? null : String(body.remarks);

    if (!Number.isFinite(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    }
    if (marks !== null && (!Number.isFinite(marks) || marks < 0 || marks > 100)) {
      return NextResponse.json({ error: "Invalid marks" }, { status: 400 });
    }

    const row = await prisma.gateEeCutoff.upsert({
      where: { year_category: { year, category } },
      update: { marks, airApprox, remarks },
      create: { year, category, marks, airApprox, remarks },
    });
    return NextResponse.json({ ok: true, row });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Cutoff save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
