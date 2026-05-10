import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { getSessionUserId } from "@/lib/session";

export async function runAICall(
  type: string,
  body: unknown,
  promptBuilder: (body: Record<string, unknown>) => string,
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const prompt = promptBuilder(body as Record<string, unknown>);
    const result = await callAI(userId, type, prompt);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.content, content: result.content },
        { status: result.unavailable ? 503 : 500 },
      );
    }
    return NextResponse.json({ content: result.content });
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI call failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
