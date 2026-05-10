import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("generate-quiz", body, (b) =>
    `Generate 5 GATE-style MCQs from this note. Format: Q, options A–D, correct letter, one-line explanation.\n${String(b.text ?? "")}`,
  );
}
