import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const ADMIN_ROLE = "ADMIN";

export function getConfiguredAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

function getConfiguredAdminPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";
}

export function isConfiguredAdminEmail(email: string) {
  const adminEmail = getConfiguredAdminEmail();
  return Boolean(adminEmail && email.trim().toLowerCase() === adminEmail);
}

export async function verifyConfiguredAdminPassword(email: string, password: string) {
  const hash = getConfiguredAdminPasswordHash();
  if (!isConfiguredAdminEmail(email) || !hash) return false;
  return compare(password, hash);
}

export async function upsertConfiguredAdminUser(email: string) {
  const passwordHash = getConfiguredAdminPasswordHash();
  const normalizedEmail = email.trim().toLowerCase();

  return prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      role: ADMIN_ROLE,
      approved: true,
      approvedAt: new Date(),
      ...(passwordHash ? { password: passwordHash } : {}),
    },
    create: {
      email: normalizedEmail,
      name: "Admin",
      password: passwordHash || null,
      role: ADMIN_ROLE,
      approved: true,
      approvedAt: new Date(),
      branch: "EE",
      streamLabel: "Admin",
      gateDate: new Date("2027-02-05T00:00:00.000Z"),
    },
  });
}

