import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("reschedule", body, (b) =>
    `Reschedule these missed or pending study sessions into a balanced weekly grid. Input: ${JSON.stringify(b.missed ?? [])}. Respond with bullet list of concrete slots.`,
  );
}
