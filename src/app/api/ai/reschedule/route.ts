import { runAICall } from "../_shared";
import { GATE_SUBJECTS } from "@/lib/constants";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall(
    "reschedule",
    body,
    (b) => `You are rescheduling a GATE study timetable.

Return a practical weekly timetable in JSON only. Each slot must use this shape:
{ "day": "Monday", "startTime": "HH:MM", "durationMinutes": 60, "subject": "Subject", "topic": "Topic" }

Allowed subjects:
${GATE_SUBJECTS.join(" | ")}

Missed or existing sessions to redistribute:
${JSON.stringify(b.missed ?? [])}

Student parameters that MUST be respected:
- Full day free: ${b.fullDayFree ? "yes; the whole day may be used with breaks" : "no; keep the timetable compact"}
- Starting time: ${b.startTime ?? "07:00"}
- Stop by: ${b.endTime ?? "22:00"}
- Time of study per day: ${b.hoursPerDay ?? 4} hours
- Selected subjects: ${JSON.stringify(b.selectedSubjects ?? [])}
- Study style: ${b.studyStyle ?? "Balanced"}

Rules:
- Do not invent a timetable independent of the parameters above.
- Every slot must start at or after the starting time and finish before the stop-by time.
- Total daily study duration should be close to the requested time of study per day.
- Prioritize selected subjects, and only include other subjects when needed to balance missed sessions.
- If full day free is true, spread sessions across morning, afternoon, and evening with breaks.
- If full day free is false, keep the sessions in the requested study window and avoid unnecessary gaps.`,
  );
}
