import { GATE_EE_SUBJECTS } from "@/lib/gate-ee";

export type NormalizedSlot = {
  dayOfWeek: number;
  startTime: string;
  durationMinutes: number;
  subject: string;
  topic: string | null;
};

/** Extract JSON array from model output (handles markdown fences). */
export function parseSlotArrayFromAi(text: string): unknown[] | null {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const payload = fence ? fence[1].trim() : trimmed;
  try {
    const parsed = JSON.parse(payload) as unknown;
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object" && "slots" in parsed && Array.isArray((parsed as { slots: unknown }).slots)) {
      return (parsed as { slots: unknown[] }).slots;
    }
    if (parsed && typeof parsed === "object" && "weeks" in parsed) {
      const weeks = (parsed as { weeks: { items?: unknown[] }[] }).weeks;
      const flat: unknown[] = [];
      for (const w of weeks || []) {
        if (Array.isArray(w.items)) flat.push(...w.items);
      }
      return flat.length ? flat : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function normalizePlanSlots(arr: unknown[] | null): NormalizedSlot[] {
  if (!arr) return [];
  const subjectsLc = new Map(GATE_EE_SUBJECTS.map((s) => [s.toLowerCase(), s]));
  const out: NormalizedSlot[] = [];
  for (const raw of arr) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    const dow = Number(o.dayOfWeek ?? o.day ?? 0);
    const dayOfWeek = Number.isFinite(dow) ? Math.min(6, Math.max(0, dow)) : 0;
    const startTime = String(o.startTime ?? o.time ?? "09:00").slice(0, 5);
    const durationMinutes = Math.min(240, Math.max(15, Number(o.durationMinutes ?? o.duration ?? 60)));
    let subject = String(o.subject ?? "Engineering Mathematics");
    const canon = subjectsLc.get(subject.toLowerCase());
    if (canon) subject = canon;
    else if (!(GATE_EE_SUBJECTS as readonly string[]).includes(subject)) subject = GATE_EE_SUBJECTS[0];
    const topic = o.topic != null ? String(o.topic) : null;
    out.push({ dayOfWeek, startTime, durationMinutes, subject, topic });
  }
  return out;
}

