import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { getSessionUserId } from "@/lib/session";

function extractScore(value: unknown): number | null {
  const text = String(value ?? "");
  const match = text.match(/score\s*=\s*(\d+(?:\.\d+)?)/i) ?? text.match(/(\d+(?:\.\d+)?)/);
  if (!match?.[1]) return null;
  const score = Number(match[1]);
  return Number.isFinite(score) ? score : null;
}

function normalizeCategory(value: unknown) {
  const c = String(value ?? "GEN").toUpperCase();
  if (["ST", "SC", "OBC", "EWS", "PWD", "GEN", "GENERAL"].includes(c)) {
    return c === "GENERAL" ? "GEN" : c;
  }
  return "GEN";
}

function deterministicCollegeBand(score: number | null, category: string) {
  if (score == null) {
    return "Score missing. Give marks out of 100 for a category-aware college/PSU band.";
  }

  const reserved = category === "ST" || category === "SC" || category === "PWD";
  const obcEws = category === "OBC" || category === "EWS";

  if (reserved && score >= 50) {
    return [
      `${category} + ${score}/100 is a strong GATE EE score.`,
      "Do not treat this as only an NIT band. You should consider IITs and top/interview-based options first.",
      "Realistic priority order: old IIT M.Tech/MS/RAP/interview programs, IISc/IIT research programs where fit is strong, then top NITs as backups.",
      "Exact calls depend on AIR, paper difficulty, COAP rounds, specialization, and institute interview shortlists.",
    ].join("\n");
  }

  if (category === "GEN" && score >= 65) {
    return "GEN + 65+ is a strong IIT/PSU conversation zone. Prioritize old IITs, IISc/IIT research programs, and PSU shortlists depending on AIR.";
  }
  if (category === "GEN" && score >= 50) {
    return "GEN + 50 is usually above qualification but not automatically top IIT. Consider newer IITs, NITs, and specialization-specific COAP options.";
  }
  if (obcEws && score >= 55) {
    return `${category} + ${score}/100 can be competitive for IIT/NIT options; do not reduce it to generic NIT advice without AIR/specialization.`;
  }
  if (score >= 40) {
    return `${category} + ${score}/100 is above many qualifying cutoffs. Build a shortlist across newer IITs, NITs, and state/central institutes based on AIR.`;
  }
  return `${category} + ${score}/100 may clear qualification depending on year/category, but college options need AIR and current COAP/CCMT cutoffs.`;
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = await getSessionUserId();
  const score = extractScore(body.rank);
  const category = normalizeCategory(body.category);
  const baseline = deterministicCollegeBand(score, category);

  const prompt = `You are advising a GATE Electrical Engineering candidate.

Marks out of 100: ${score ?? "unknown"}
Category: ${category}
Branch: ${body.branch ?? "GATE-EE"}
Known cutoff context: ${JSON.stringify(body.cutoffContext ?? {})}

Hard rule: if category is ST/SC/PWD and marks are around 50/100 or higher, do NOT say only NIT is realistic. Mention IIT and IISc/IIT research/interview possibilities before NIT backups, while warning that AIR, COAP, CCMT, specialization, and interview cutoffs decide final admission.

Start with this deterministic baseline and expand it:
${baseline}

Give concise target tiers, not fake guarantees.`;

  const ai = await callAI(userId, "college-advisor", prompt);
  if (!ai.ok && "quotaExceeded" in ai && ai.quotaExceeded) {
    return NextResponse.json(
      {
        error: ai.content,
        content: ai.content,
        quotaExceeded: true,
        upgradeRequired: true,
        billingUrl: "/api/billing/checkout",
      },
      { status: 402 },
    );
  }

  const content = ai.ok ? `${baseline}\n\n${ai.content}` : baseline;
  return NextResponse.json({ content, baseline, category, score });
}
