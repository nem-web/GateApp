import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const model = "claude-sonnet-4-20250514";

export async function callClaude(userId: string, type: string, prompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, unavailable: true, content: "AI unavailable: missing API key." };
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const res = await anthropic.messages.create({
      model,
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }]
    });
    const content = res.content
      .map((c) => ("text" in c ? c.text : ""))
      .join("\n")
      .trim();

    await prisma.aISuggestion.create({
      data: { userId, type, content }
    });

    return { ok: true, content };
  } catch (error) {
    return { ok: false, unavailable: false, content: "AI request failed. Try again." };
  }
}
