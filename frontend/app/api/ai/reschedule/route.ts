import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { getSessionUserId } from "@/lib/session";
import { GATE_EE_SUBJECTS } from "@/lib/gate-ee";
import { normalizePlanSlots, parseSlotArrayFromAi } from "@/lib/parse-ai-plan";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const prompt = `You reschedule GATE EE study slots. Return ONLY JSON array (no markdown).

Each item: { "dayOfWeek": 0-6 Mon=0, "startTime": "HH:MM", "durationMinutes": number, "subject": string, "topic": string }

Subjects only from: ${GATE_EE_SUBJECTS.join(" | ")}.

Missed / backlog context:
${JSON.stringify(body.missed ?? [])}

Recent performance snapshot:
${JSON.stringify(body.performance ?? {})}

Rebuild a realistic weekly timetable that clears backlog while balancing weak areas.`;

  const result = await callAI(userId, "reschedule", prompt);
  if (!result.ok) {
    return NextResponse.json({ error: result.content }, { status: result.unavailable ? 503 : 500 });
  }

  const previewSlots = normalizePlanSlots(parseSlotArrayFromAi(result.content));
  return NextResponse.json({ previewSlots, slotCount: previewSlots.length });
}
