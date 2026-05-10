import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("reschedule", body, (b) => `Reschedule these missed sessions into a balanced plan: ${JSON.stringify(b.missed)}.`);
}
