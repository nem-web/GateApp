import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Historical rows live in DB (seed). Predicted uses naive linear extrapolation for GEN marks. */
export async function GET() {
  const rows = await prisma.gateEeCutoff.findMany({
    orderBy: [{ year: "desc" }, { category: "asc" }],
  });

  const genByYear = new Map<number, number>();
  for (const r of rows) {
    if (r.category === "GEN" && r.marks != null) genByYear.set(r.year, r.marks);
  }
  const years = [...genByYear.keys()].sort((a, b) => a - b);
  let predicted2027 = 26;
  if (years.length >= 2) {
    const y1 = years[years.length - 2];
    const y2 = years[years.length - 1];
    const m1 = genByYear.get(y1)!;
    const m2 = genByYear.get(y2)!;
    const slope = (m2 - m1) / (y2 - y1);
    predicted2027 = Math.round((m2 + slope * (2027 - y2)) * 10) / 10;
    predicted2027 = Math.min(40, Math.max(15, predicted2027));
  }

  const safeScores = {
    IITInterviewLikely: Math.round(predicted2027 + 22),
    PSUCandidateBand: `${Math.round(predicted2027 + 8)} – ${Math.round(predicted2027 + 18)}`,
    disclaimer:
      "Qualifying marks vary yearly; predicted values are heuristic trends only — verify with official GATE notices.",
  };

  return NextResponse.json({
    historical: rows,
    predictedGENQualifying2027: predicted2027,
    safeScores,
  });
}

