/**
 * Free-tier AI providers (no paid Claude required):
 * 1) Groq — https://console.groq.com/keys (fast Llama / Mixtral, generous free tier)
 * 2) Google AI Studio — https://aistudio.google.com/apikey (Gemini free tier)
 *
 * Set GROQ_API_KEY and/or GEMINI_API_KEY in Vercel Environment Variables.
 */

import { prisma } from "@/lib/prisma";

const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest";

async function callGroq(prompt: string): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
        temperature: 0.5,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    return text ?? null;
  } catch {
    return null;
  }
}

async function callGemini(prompt: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("")?.trim();
    return text ?? null;
  } catch {
    return null;
  }
}

async function callAnthropic(prompt: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const text = data.content?.find((p) => p.type === "text")?.text?.trim();
    return text ?? null;
  } catch {
    return null;
  }
}

export async function callAI(userId: string | null, type: string, prompt: string) {
  const groq = await callGroq(prompt);
  const gemini = groq ? null : await callGemini(prompt);
  const anthropic = groq || gemini ? null : await callAnthropic(prompt);
  const content = groq ?? gemini ?? anthropic;

  if (!content) {
    const hint =
      "AI unavailable: set GROQ_API_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY in Vercel env vars.";
    return { ok: false as const, unavailable: true as const, content: hint };
  }

  if (userId) {
    try {
      await prisma.aISuggestion.create({
        data: { userId, type, content },
      });
    } catch {
      /* optional persistence */
    }
  }

  return { ok: true as const, content };
}

