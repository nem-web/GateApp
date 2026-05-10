import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("explain-concept", body, (b) =>
    `Explain the hardest concept in this note in simple GATE-focused language:\n${String(b.text ?? "")}`,
  );
}

