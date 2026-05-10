import type { PrismaClient, Subject } from "@prisma/client";
import { GATE_EE_SUBJECTS } from "@/lib/gate-ee";

type SubjectDb = Pick<PrismaClient, "subject">;

export function subjectSlugFromTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Resolve a subject row from free text (canonical EE titles, slug, fuzzy match against seeded rows). */
export async function resolveSubject(
  prisma: SubjectDb,
  input?: string | null,
): Promise<Subject> {
  const all = await prisma.subject.findMany({ orderBy: { sortOrder: "asc" } });
  if (!all.length) {
    throw new Error("Subjects are not seeded. Run `npx prisma db seed`.");
  }
  const fallback = all[0]!;

  if (!input?.trim()) return fallback;

  const raw = input.trim();

  const byTitle = all.find((s) => s.title.toLowerCase() === raw.toLowerCase());
  if (byTitle) return byTitle;

  const canon = (GATE_EE_SUBJECTS as readonly string[]).find(
    (t) => t.toLowerCase() === raw.toLowerCase(),
  );
  if (canon) {
    const hit = all.find((s) => s.title === canon);
    if (hit) return hit;
  }

  const wantSlug = subjectSlugFromTitle(raw);
  const bySlug = all.find((s) => s.slug === wantSlug);
  if (bySlug) return bySlug;

  const subjectsLc = new Map(all.map((s) => [s.title.toLowerCase(), s]));
  const fuzzyCanon = subjectsLc.get(raw.toLowerCase());
  if (fuzzyCanon) return fuzzyCanon;

  const contains = all.find((s) => s.title.toLowerCase().includes(raw.toLowerCase()));
  if (contains) return contains;

  return fallback;
}
