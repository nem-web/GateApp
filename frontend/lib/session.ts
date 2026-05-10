import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GATE_EXAM_DATE_ISO } from "@/lib/gate-ee";

const DEFAULT_EMAIL = "nem@gateprep.local";
const DEFAULT_NAME = "Nem";
const DEFAULT_STREAM = "GATE-EE";

/** Single-user mode: return logged-in id if present, otherwise ensure Nem's profile exists. */
export async function getSessionUserId(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    const id = session?.user?.id?.trim();
    if (id) return id;
  } catch {
    /* ignore auth errors in single-user mode */
  }

  try {
    const user = await prisma.user.upsert({
      where: { email: DEFAULT_EMAIL },
      update: {
        name: DEFAULT_NAME,
        branch: "EE",
        streamLabel: DEFAULT_STREAM,
        gateDate: new Date(GATE_EXAM_DATE_ISO),
      },
      create: {
        email: DEFAULT_EMAIL,
        name: DEFAULT_NAME,
        branch: "EE",
        streamLabel: DEFAULT_STREAM,
        gateDate: new Date(GATE_EXAM_DATE_ISO),
        hoursPerDay: 4,
      },
    });
    return user.id;
  } catch {
    return null;
  }
}
