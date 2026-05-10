import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("generate-quiz", body, (b) => `Generate 5 MCQs with options and answers from this note in JSON:\n${b.text}`);
}
