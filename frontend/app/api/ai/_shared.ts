import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { getEffectiveUserId } from "@/lib/session";

export async function runAICall(
  type: string,
  body: unknown,
  promptBuilder: (body: Record<string, unknown>) => string,
) {
  const userId = await getEffectiveUserId();
  const prompt = promptBuilder(body as Record<string, unknown>);
  const result = await callAI(userId, type, prompt);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.content, content: result.content },
      { status: result.unavailable ? 503 : 500 },
    );
  }
  return NextResponse.json({ content: result.content });
}
