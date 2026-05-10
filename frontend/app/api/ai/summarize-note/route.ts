import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("summarize-note", body, (b) => `Summarize this GATE note in bullet points:\n${String(b.text ?? "")}`);
}
