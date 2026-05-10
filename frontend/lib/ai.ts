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

async function callGroq(prompt: string): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
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
}

async function callGemini(prompt: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;
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
}

export async function callAI(userId: string | null, type: string, prompt: string) {
  const groq = await callGroq(prompt);
  const gemini = groq ? null : await callGemini(prompt);
  const content = groq ?? gemini;

  if (!content) {
    const hint =
      "AI unavailable: add a free API key in Vercel → Settings → Environment Variables. " +
      "Use GROQ_API_KEY from https://console.groq.com/keys and/or GEMINI_API_KEY from https://aistudio.google.com/apikey";
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

