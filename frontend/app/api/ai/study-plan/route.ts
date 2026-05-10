import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("study-plan", body, (b) =>
    `Return a JSON object with key "weeks" array; each week has "weekNumber", "items" array of { "day", "subject", "topic", "hours" }. GATE date: ${b.gateDate}, hours/day: ${b.hoursPerDay}, weak: ${JSON.stringify(b.weak ?? [])}, style: ${b.style ?? "balanced"}. Only output valid JSON.`,
  );
}
