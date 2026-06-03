import { runAICall } from "../_shared";
import { GATE_EE_WEIGHTAGE_PROMPT } from "@/lib/gate-ee";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("lecture-recommendation", body, (b) =>
    [
      "Recommend the next 3 GATE EE video topics to watch. Short bullets.",
      `Weak subjects: ${JSON.stringify(b.weakSubjects ?? [])}`,
      `Prioritize with this 2017-2025 weightage table: ${GATE_EE_WEIGHTAGE_PROMPT}`,
    ].join("\n"),
  );
}

