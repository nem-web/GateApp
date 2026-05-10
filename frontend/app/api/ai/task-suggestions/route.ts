import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("task-suggestions", body, (b) =>
    `Suggest exactly 5 actionable GATE prep tasks as a numbered list for weak topics: ${JSON.stringify(b.weakTopics ?? [])}.`,
  );
}
