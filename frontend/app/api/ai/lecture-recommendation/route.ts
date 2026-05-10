import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("lecture-recommendation", body, (b) =>
    `Recommend the next 3 GATE video topics to watch given weak subjects ${JSON.stringify(b.weakSubjects ?? [])}. Short bullets.`,
  );
}

