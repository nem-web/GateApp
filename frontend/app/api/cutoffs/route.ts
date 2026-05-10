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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const year = Number(body.year);
    const category = String(body.category ?? "GEN").toUpperCase();
    const marks = body.marks == null ? null : Number(body.marks);
    const airApprox = body.airApprox == null ? null : Number(body.airApprox);
    const remarks = body.remarks == null ? null : String(body.remarks);

    if (!Number.isFinite(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    }
    if (!["GEN", "OBC", "SC", "ST", "EWS", "PWD"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
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

