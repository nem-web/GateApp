import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("predict-hot-topics", body, (b) =>
    `Given topic frequencies ${JSON.stringify(b.frequencies ?? [])}, list top 5 likely hot GATE EE topics next year with brief reasoning. Do not mention CS topics.`,
  );
}

