import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "demo@gateprep.local" },
    update: {},
    create: {
      email: "demo@gateprep.local",
      name: "Demo Student",
      gateDate: new Date("2025-02-01"),
      branch: "CSE",
      hoursPerDay: 6,
      weakSubjects: ["Graph Theory", "Theory of Computation"],
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
