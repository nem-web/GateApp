import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("college-advisor", body, (b) =>
    `Student approximate GATE rank: ${b.rank}, branch: ${b.branch}, category: ${b.category}. Recommend target IIT/NIT/IIIT programs with short reasoning.`,
  );
}

