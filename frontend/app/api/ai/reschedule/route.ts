import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { GATE_EE_SUBJECTS, GATE_EE_WEIGHTAGE_PROMPT } from "@/lib/gate-ee";
import { normalizePlanSlots, parseSlotArrayFromAi } from "@/lib/parse-ai-plan";
import {
  buildDeterministicTimetableSlots,
  getUnfinishedPlaylistLectures,
  selectedLectureFoldersFromBody,
  selectedSubjectsFromBody,
} from "@/lib/timetable-lecture-plan";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const selectedSubjects = selectedSubjectsFromBody(body);
  const selectedLectureFolders = selectedLectureFoldersFromBody(body);
  const unfinishedLectures = await getUnfinishedPlaylistLectures(prisma, userId, selectedLectureFolders);
  const studyHoursPerDay = body.studyHoursPerDay ?? body.hoursPerDay ?? 4;
  const fullDayFree = Boolean(body.fullDayFree ?? body.holiday);

  const prompt = `You reschedule GATE EE study slots. Return ONLY JSON array (no markdown).

Each item: { "dayOfWeek": 0-6 Mon=0, "startTime": "HH:MM", "durationMinutes": number, "subject": string, "topic": string }

Subjects only from: ${GATE_EE_SUBJECTS.join(" | ")}.
Use this GATE EE 2017-2025 weightage table to decide what gets protected, moved earlier, or expanded:
${GATE_EE_WEIGHTAGE_PROMPT}

Missed / backlog context:
${JSON.stringify(body.missed ?? [])}

Recent performance snapshot:
${JSON.stringify(body.performance ?? {})}

Student constraints:
- GATE exam date: fixed as 2027-02-05
- Study time target per day: ${studyHoursPerDay} hours
- Study style: ${body.style ?? "balanced"}
- Full day free / holiday mode: ${fullDayFree ? "yes, spread blocks across the full available day with breaks" : "no, place blocks compactly from the start time"}
- Start studying after: ${body.startTime ?? "06:00"}
- Stop studying by: ${body.endTime ?? "23:00"}
- Selected subjects that MUST drive the plan: ${JSON.stringify(selectedSubjects)}
- Selected playlist folders that constrain lecture slots: ${JSON.stringify(selectedLectureFolders)}
- Available unfinished lectures from those folders, already sorted by serial number: ${JSON.stringify(unfinishedLectures.slice(0, 80))}

Rebuild a realistic weekly timetable that clears backlog while balancing weak areas. Every slot must start inside the start/end window and must not end after the end time. Use only half-hour-aligned start times ending in :00 or :30, for example 06:00, 06:30, 07:00, 07:30. The total study time per day must match the study time target. If selected subjects are provided, prioritize those subjects instead of inventing unrelated ones. If full day free is true, spread the slots across the window with breaks; otherwise place them compactly from the start time. Lecture topics must be actual lecture titles from the provided unfinished lecture list; revision topics must be exactly "Revision"; practice topics must be exactly "Question Practice".`;

  const result = await callAI(userId, "reschedule", prompt);
  if (!result.ok) {
    const quotaExceeded = "quotaExceeded" in result && result.quotaExceeded;
    return NextResponse.json(
      {
        error: result.content,
        ...(quotaExceeded && {
          quotaExceeded: true,
          upgradeRequired: true,
          billingUrl: "/api/billing/checkout",
        }),
      },
      { status: quotaExceeded ? 402 : result.unavailable ? 503 : 500 },
    );
  }

  const normalizedSlots = normalizePlanSlots(parseSlotArrayFromAi(result.content));
  const previewSlots = buildDeterministicTimetableSlots(
    normalizedSlots,
    body,
    selectedLectureFolders,
    unfinishedLectures,
  );
  const message = unfinishedLectures.length
    ? `Generated ${previewSlots.length} rescheduled slots using ${unfinishedLectures.length} unfinished lecture(s) from selected playlist folders.`
    : "No unfinished lectures found in the selected playlist folders. Generated Revision and Question Practice slots only.";
  return NextResponse.json({ previewSlots, slotCount: previewSlots.length, message });
}
