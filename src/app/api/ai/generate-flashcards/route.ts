import { runAICall } from "../_shared";

export async function POST(req: Request) {
  const body = await req.json();
  return runAICall("generate-flashcards", body, (b) => `Generate flashcards as JSON array of {front, back} from:\n${b.text}`);
}
