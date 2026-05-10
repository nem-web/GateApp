import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SINGLE_USER_EMAIL = "nem@gate-ee.local";
const SINGLE_USER_NAME = "Nem";
const SINGLE_USER_STREAM = "GATE-EE";

let defaultUserPromise: Promise<string> | null = null;

async function ensureSingleUserId(): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { email: SINGLE_USER_EMAIL },
    select: { id: true },
  });
  if (existing?.id) return existing.id;

  const created = await prisma.user.create({
    data: {
      email: SINGLE_USER_EMAIL,
      name: SINGLE_USER_NAME,
      branch: "EE",
      streamLabel: SINGLE_USER_STREAM,
      gateDate: new Date("2027-02-05T00:00:00.000Z"),
    },
    select: { id: true },
  });
  return created.id;
}

/** Authenticated NextAuth user id only — no demo / implicit users. */
export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id?.trim();
  if (id) return id;

  // Single-user mode fallback: keep platform fully usable without sign-in walls.
  if (!defaultUserPromise) {
    defaultUserPromise = ensureSingleUserId().catch((err) => {
      defaultUserPromise = null;
      throw err;
    });
  }
  try {
    return await defaultUserPromise;
  } catch {
    return null;
  }
}
