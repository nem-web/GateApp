import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
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
  const selectedLectureFolders = selectedLectureFoldersFromBody(body);
  const selectedSubjects = selectedSubjectsFromBody(body);
  const unfinishedLectures = await getUnfinishedPlaylistLectures(prisma, userId, selectedLectureFolders);
  const lecturePromptContext = unfinishedLectures.slice(0, 80).map((lecture) => ({
    subject: lecture.subject,
    folder: lecture.folder,
    lectureNumber: lecture.lectureNumber,
    title: lecture.title,
  }));

  const prompt = `You are an expert coach for GATE Electrical Engineering (EE).

Return ONLY valid JSON: an array of timetable objects (no markdown, no commentary).
Each object: { "dayOfWeek": 0-6 (Monday=0 .. Sunday=6), "startTime": "HH:MM", "durationMinutes": number, "subject": string, "topic": string }

Subjects MUST be exactly one of: ${GATE_EE_SUBJECTS.join(" | ")}.
Use this GATE EE 2017-2025 weightage table as the priority signal, while still respecting weak areas and available time:
${GATE_EE_WEIGHTAGE_PROMPT}

Context:
- GATE exam date: fixed as 2027-02-05
- Typical daily study hours: ${body.hoursPerDay ?? 4}
- Study intensity: ${body.style ?? "balanced"}
- Holiday mode: ${body.holiday ? "yes, the whole available day can be used with breaks" : "no, keep the plan inside the normal study target"}
- Available study window: ${body.startTime ?? "06:00"} to ${body.endTime ?? "23:00"}
- Selected subjects: ${JSON.stringify(selectedSubjects)}
- Selected playlist folders: ${JSON.stringify(selectedLectureFolders)}
- Weak / priority areas: ${JSON.stringify(body.weak ?? [])}
- Available unfinished lectures from selected playlist folders, already sorted by detected lecture number. Use lecture slots only from these titles; use exactly "Revision" for revision slots and exactly "Question Practice" for practice slots: ${JSON.stringify(lecturePromptContext)}
- Remaining days roughly: ${body.remainingDays ?? "unknown"}

Plan rule: every day from Monday through Sunday must receive the same study-hour target and a similar number of study blocks. Do not reduce the number of slots later in the week. Every slot must start within the available study window and must not end after it. Use only half-hour-aligned start times ending in :00 or :30, for example 06:00, 06:30, 07:00, 07:30. If holiday mode is true, use more of the free day with breaks. High-weight selected/weak subjects get more and earlier slots; low-weight subjects stay present but lighter.
Produce 18-32 varied slots across the week covering syllabus gaps and weak areas.`;

  const result = await callAI(userId, "study-plan", prompt);
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

  const parsed = parseSlotArrayFromAi(result.content);
  const previewSlots = buildDeterministicTimetableSlots(
    normalizePlanSlots(parsed),
    body,
    selectedLectureFolders,
    unfinishedLectures,
  );
  const message = unfinishedLectures.length
    ? `Generated ${previewSlots.length} slots using ${unfinishedLectures.length} unfinished lecture(s) from selected playlist folders.`
    : "No unfinished lectures found in the selected playlist folders. Generated Revision and Question Practice slots only.";
  return NextResponse.json({
    previewSlots,
    slotCount: previewSlots.length,
    message,
  });
}
