import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("dashboard-insight", body, (b) =>
    `You are a GATE mentor. Based on recent score trend JSON ${JSON.stringify(b.recentScores ?? [])}, give ONE concise personalized tip (2–3 sentences).`,
  );
}
