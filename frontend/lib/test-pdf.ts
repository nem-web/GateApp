import { GATE_EE_SUBJECTS } from "@/lib/gate-ee";
import path from "node:path";
import { pathToFileURL } from "node:url";

export type ParsedQuestion = {
  number: number;
  prompt: string;
  options: string[];
  subject: string;
  topic: string;
};

const OPTION_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

export async function extractPdfText(bytes: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const workerPath = path.join(
    process.cwd(),
    "node_modules",
    "pdf-parse",
    "dist",
    "pdf-parse",
    "cjs",
    "pdf.worker.mjs",
  );
  PDFParse.setWorker(pathToFileURL(workerPath).href);
  const parser = new PDFParse({ data: bytes });
  try {
    const result = await parser.getText();
    return result.text ?? "";
  } finally {
    await parser.destroy();
  }
}

function cleanText(value: string) {
  return value
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function prepareQuestionText(text: string) {
  return cleanText(text)
    .replace(/\s+(\(?[A-Da-d]\)?[\).:-])\s+/g, "\n$1 ")
    .replace(/\s+(?:Q(?:uestion)?\s*)?(\d{1,3}[\).:-])\s+/gi, "\n$1 ");
}

function inferSubject(block: string) {
  const lower = block.toLowerCase();
  const hit = GATE_EE_SUBJECTS.find((subject) => lower.includes(subject.toLowerCase()));
  return hit ?? "Engineering Mathematics";
}

export function parseQuestionsFromText(text: string): ParsedQuestion[] {
  const lines = prepareQuestionText(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const questions: ParsedQuestion[] = [];
  let current:
    | {
        number: number;
        promptParts: string[];
        optionParts: string[][];
        activeOption: number | null;
        rawParts: string[];
      }
    | null = null;

  const flush = () => {
    if (!current) return;
    const prompt = current.promptParts.join(" ").replace(/\s+/g, " ").trim();
    const options = current.optionParts
      .slice(0, 4)
      .map((parts) => parts.join(" ").replace(/\s+/g, " ").trim());
    if (prompt.length >= 8 && options.length === 4 && options.every((option) => option.length > 0)) {
      const raw = current.rawParts.join(" ");
      questions.push({
        number: current.number,
        prompt,
        options,
        subject: inferSubject(raw),
        topic: "Imported PDF",
      });
    }
  };

  for (const line of lines) {
    const qMatch = line.match(/^(?:Q(?:uestion)?\s*)?(\d{1,3})[\).:-]\s+(.+)$/i);
    if (qMatch) {
      flush();
      current = {
        number: Number(qMatch[1]),
        promptParts: [qMatch[2]!.trim()],
        optionParts: [],
        activeOption: null,
        rawParts: [line],
      };
      continue;
    }

    if (!current) continue;
    current.rawParts.push(line);

    const optionMatch = line.match(/^\(?([A-Da-d])\)?[\).:-]\s+(.+)$/);
    if (optionMatch) {
      const idx = OPTION_INDEX[optionMatch[1]!.toUpperCase()];
      if (idx !== undefined) {
        current.activeOption = idx;
        current.optionParts[idx] = [optionMatch[2]!.trim()];
      }
      continue;
    }

    if (current.activeOption != null && current.optionParts[current.activeOption]) {
      current.optionParts[current.activeOption]!.push(line);
    } else {
      current.promptParts.push(line);
    }
  }

  flush();
  return questions.sort((a, b) => a.number - b.number);
}

export function parseAnswerKeyFromText(text: string): Map<number, number> {
  const answers = new Map<number, number>();
  const normalized = cleanText(text)
    .replace(/\bAnswer\s+Key\b/gi, " ")
    .replace(/\bCorrect\s+Option\b/gi, " ");

  const lineCandidates = normalized.split(/\n|,/).map((line) => line.trim()).filter(Boolean);
  for (const line of lineCandidates) {
    const match = line.match(/^(?:Q(?:uestion)?\s*)?(\d{1,3})\s*[\).:-]?\s*(?:Ans(?:wer)?\s*[\).:-]?\s*)?\(?([A-Da-d])\)?\b/);
    if (!match) continue;
    const idx = OPTION_INDEX[match[2]!.toUpperCase()];
    if (idx !== undefined) answers.set(Number(match[1]), idx);
  }

  const pairRegex = /(?:^|[\s;|])(?:Q(?:uestion)?\s*)?(\d{1,3})\s*[\).:-]?\s*(?:Ans(?:wer)?\s*[\).:-]?\s*)?\(?([A-Da-d])\)?(?=$|[\s;|])/gi;
  let match: RegExpExecArray | null;
  while ((match = pairRegex.exec(normalized)) !== null) {
    const idx = OPTION_INDEX[match[2]!.toUpperCase()];
    if (idx !== undefined) answers.set(Number(match[1]), idx);
  }

  return answers;
}

export function slugFromTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "uploaded-test";
}
