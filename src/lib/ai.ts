import { prisma } from "@/lib/prisma";

const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest";

function getGeminiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  // Backward compatibility for earlier local env files that put a Google key here.
  const legacyKey = process.env.ANTHROPIC_API_KEY;
  return legacyKey?.startsWith("AIza") ? legacyKey : undefined;
}

function getAnthropicKey() {
  const key = process.env.ANTHROPIC_API_KEY;
  return key?.startsWith("sk-ant") ? key : undefined;
}

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
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

async function callGemini(prompt: string): Promise<string | null> {
  const key = getGeminiKey();
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
    return data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("")?.trim() ?? null;
  } catch {
    return null;
  }
}

async function callAnthropic(prompt: string): Promise<string | null> {
  const key = getAnthropicKey();
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
    return data.content?.find((p) => p.type === "text")?.text?.trim() ?? null;
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
    return {
      ok: false as const,
      unavailable: true as const,
      content: "AI unavailable: set GROQ_API_KEY, GEMINI_API_KEY, or a valid ANTHROPIC_API_KEY.",
    };
  }

  if (userId) {
    try {
      await prisma.aISuggestion.create({
        data: { userId, type, content },
      });
    } catch {
      /* Optional persistence should not fail the AI response. */
    }
  }

  return { ok: true as const, content };
}
