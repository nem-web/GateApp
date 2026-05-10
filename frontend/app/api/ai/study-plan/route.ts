import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { getSessionUserId } from "@/lib/session";
import { GATE_EE_SUBJECTS } from "@/lib/gate-ee";
import { normalizePlanSlots, parseSlotArrayFromAi } from "@/lib/parse-ai-plan";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const prompt = `You are an expert coach for GATE Electrical Engineering (EE).

Return ONLY valid JSON: an array of timetable objects (no markdown, no commentary).
Each object: { "dayOfWeek": 0-6 (Monday=0 .. Sunday=6), "startTime": "HH:MM", "durationMinutes": number, "subject": string, "topic": string }

Subjects MUST be exactly one of: ${GATE_EE_SUBJECTS.join(" | ")}.

Context:
- GATE exam date: ${body.gateDate ?? "2027-02-05"}
- Typical daily study hours: ${body.hoursPerDay ?? 4}
- Study intensity: ${body.style ?? "balanced"}
- Weak / priority areas: ${JSON.stringify(body.weak ?? [])}
- Remaining days roughly: ${body.remainingDays ?? "unknown"}

Produce 18–32 varied slots across the week covering syllabus gaps and weak areas.`;

  const result = await callAI(userId, "study-plan", prompt);
  if (!result.ok) {
    return NextResponse.json({ error: result.content }, { status: result.unavailable ? 503 : 500 });
  }

  const parsed = parseSlotArrayFromAi(result.content);
  const previewSlots = normalizePlanSlots(parsed);
  return NextResponse.json({
    previewSlots,
    slotCount: previewSlots.length,
  });
}
