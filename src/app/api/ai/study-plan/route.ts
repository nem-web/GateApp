import { runAICall } from "../_shared";
import { GATE_SUBJECTS } from "@/lib/constants";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall(
    "study-plan",
    body,
    (b) => `Generate a week-by-week GATE prep plan in strict JSON.

Allowed subjects:
${GATE_SUBJECTS.join(" | ")}

Inputs:
- Gate date: ${b.gateDate ?? "2027-02-01"}
- Weak or selected subjects: ${JSON.stringify(b.weak ?? [])}
- Full day free: ${b.fullDayFree ? "yes" : "no"}
- Starting time: ${b.startTime ?? "07:00"}
- Stop by: ${b.endTime ?? "22:00"}
- Time of study per day: ${b.hoursPerDay ?? 4} hours
- Study style: ${b.studyStyle ?? "Balanced"}

Return JSON only. Each slot must include day, startTime, durationMinutes, subject, and topic. Respect the study window and daily study time.`,
  );
}
