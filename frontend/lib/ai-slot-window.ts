export type AiSlotWithWindow = {
  dayOfWeek: number;
  startTime: string;
  durationMinutes: number;
  subject: string;
  topic: string | null;
};

function timeToMinutes(value: unknown, fallback: number): number {
  if (typeof value !== "string") return fallback;
  const [hh, mm] = value.split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return fallback;
  return Math.min(24 * 60, Math.max(0, hh * 60 + mm));
}

function minutesToTime(minutes: number): string {
  const clamped = Math.min(23 * 60 + 59, Math.max(0, minutes));
  const hh = Math.floor(clamped / 60);
  const mm = clamped % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function constrainAiSlotsToWindow(
  slots: AiSlotWithWindow[],
  startTime: unknown,
  endTime: unknown,
): AiSlotWithWindow[] {
  const start = timeToMinutes(startTime, 6 * 60);
  const end = timeToMinutes(endTime, 23 * 60);
  if (end <= start) return slots;

  return slots
    .map((slot) => {
      const slotStart = Math.max(start, timeToMinutes(slot.startTime, start));
      const maxDuration = end - slotStart;
      if (maxDuration < 15) return null;
      return {
        ...slot,
        startTime: minutesToTime(slotStart),
        durationMinutes: Math.min(slot.durationMinutes, maxDuration),
      };
    })
    .filter((slot): slot is AiSlotWithWindow => Boolean(slot));
}
