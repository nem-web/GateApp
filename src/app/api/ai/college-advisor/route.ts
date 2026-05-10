import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("college-advisor", body, (b) => `Student rank=${b.rank}, branch=${b.branch}, category=${b.category}. Recommend target colleges with concise reasoning.`);
}
