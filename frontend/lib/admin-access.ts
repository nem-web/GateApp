import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ADMIN_ROLE } from "@/lib/admin-config";
import { prisma } from "@/lib/prisma";

export async function getCurrentAdminUser() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id?.trim();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, approved: true },
  });

  if (user?.role !== ADMIN_ROLE) return null;
  return user;
}

export async function requireAdminUser() {
  const admin = await getCurrentAdminUser();
  if (!admin) redirect("/login?callbackUrl=/admin");
  return admin;
}

export async function requireApprovedForStorage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { approved: true, role: true },
  });

  if (user?.approved || user?.role === ADMIN_ROLE) return null;

  return NextResponse.json(
    {
      error:
        "Your account is pending admin approval. File uploads unlock after approval.",
      approvalRequired: true,
    },
    { status: 403 },
  );
}

