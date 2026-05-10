import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Authenticated NextAuth user id only — no demo / implicit users. */
export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id?.trim();
  return id ? id : null;
}
