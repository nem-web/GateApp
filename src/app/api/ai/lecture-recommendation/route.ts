import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("lecture-recommendation", body, (b) => `Recommend next lectures for weak subjects: ${JSON.stringify(b.weakSubjects)}.`);
}
