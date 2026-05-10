import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const count = Array.isArray(body?.questions) ? body.questions.length : 0;
  return NextResponse.json({ message: "Upload scaffold received", count });
}

