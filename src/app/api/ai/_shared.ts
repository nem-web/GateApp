import { NextResponse } from "next/server";
import { callClaude } from "@/lib/ai";

export async function runAICall(type: string, body: unknown, promptBuilder: (body: any) => string) {
  const prompt = promptBuilder(body as any);
  const result = await callClaude("demo-user", type, prompt);
  if (!result.ok) return NextResponse.json({ error: result.content, content: result.content }, { status: result.unavailable ? 503 : 500 });
  return NextResponse.json({ content: result.content });
}
