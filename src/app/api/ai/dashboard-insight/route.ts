import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("dashboard-insight", body, (b) => `You are a GATE mentor. Based on recent scores ${JSON.stringify(b.recentScores)}, give one concise personalized tip.`);
}
