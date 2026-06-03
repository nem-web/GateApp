import { runAICall } from "../_shared";
import { GATE_EE_WEIGHTAGE_PROMPT } from "@/lib/gate-ee";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("task-suggestions", body, (b) =>
    [
      "You are a GATE Electrical Engineering mentor.",
      "Suggest exactly 5 numbered, actionable study tasks for ONE student.",
      "Every task MUST relate to GATE EE syllabus only (machines, power systems, control, measurements, etc.).",
      "Never suggest generic CS/software topics.",
      `Use this GATE EE 2017-2025 subject weightage when ranking tasks: ${GATE_EE_WEIGHTAGE_PROMPT}`,
      "",
      `Weak subjects: ${JSON.stringify(b.weakSubjects ?? [])}`,
      `Open incomplete tasks: ${JSON.stringify(b.openTasks ?? [])}`,
      `Recent mock scores (%): ${JSON.stringify(b.recentScores ?? [])}`,
      `Study streak (days): ${b.streak ?? "unknown"}`,
      `Pending EE topics from timetable: ${JSON.stringify(b.backlog ?? [])}`,
      "",
      "Keep each task under 2 lines.",
    ].join("\n"),
  );
}

