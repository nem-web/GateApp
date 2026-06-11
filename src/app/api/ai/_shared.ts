import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

export async function runAICall(type: string, body: unknown, promptBuilder: (body: any) => string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const prompt = promptBuilder(body as any);
  const result = await callAI(userId, type, prompt);
  if (!result.ok) return NextResponse.json({ error: result.content, content: result.content }, { status: result.unavailable ? 503 : 500 });
  return NextResponse.json({ content: result.content });
}
