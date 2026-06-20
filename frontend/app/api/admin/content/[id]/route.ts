import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-access";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, ctx: Ctx) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { id } = await ctx.params;
  const type = new URL(req.url).searchParams.get("type") ?? "blog";
  if (type === "vlog") await prisma.vlogPost.delete({ where: { id } });
  else if (type === "resource") await prisma.seoResource.delete({ where: { id } });
  else await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
