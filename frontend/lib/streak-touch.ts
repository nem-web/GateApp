import { startOfDay } from "date-fns";
import type { PrismaClient } from "@prisma/client";

export async function touchStreakDay(prisma: PrismaClient, userId: string, at = new Date()) {
  const day = startOfDay(at);
  await prisma.streakDay.upsert({
    where: { userId_day: { userId, day } },
    update: {},
    create: { userId, day },
  });
}
