import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("study-plan", body, (b) => `Generate a week-by-week GATE prep plan in strict JSON for gateDate=${b.gateDate} weakSubjects=${JSON.stringify(b.weak)}.`);
}
