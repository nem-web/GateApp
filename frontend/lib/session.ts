import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEMO_EMAIL = "demo@gateprep.local";

/** Logged-in user, or demo user in DB. Returns null if the database is unreachable. */
export async function getEffectiveUserId(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) return session.user.id;

    const demo = await prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      update: {},
      create: {
        email: DEMO_EMAIL,
        name: "Demo Student",
        gateDate: new Date("2025-02-01"),
        branch: "CSE",
        hoursPerDay: 6,
        weakSubjects: ["Graph Theory", "Theory of Computation"],
      },
    });
    return demo.id;
  } catch {
    return null;
  }
}
