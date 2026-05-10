import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("dashboard-insight", body, (b) =>
    [
      "You mentor GATE Electrical Engineering candidates.",
      "Give ONE short paragraph (3 sentences max) with a sharp insight: what to fix this week and why.",
      `Weak EE subjects: ${JSON.stringify(b.weakSubjects ?? [])}`,
      `Recent mock trend: ${JSON.stringify(b.recentScores ?? [])}`,
      `Study consistency last 30d (% days active): ${b.consistency ?? "n/a"}`,
      `Flashcards due: ${b.flashcardsDue ?? 0}; tasks open: ${b.tasksOpen ?? 0}`,
    ].join("\n"),
  );
}

