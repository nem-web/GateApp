import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("predict-hot-topics", body, (b) => `Given topic frequencies ${JSON.stringify(b.frequencies)}, predict top 5 likely GATE hot topics with reasoning.`);
}
