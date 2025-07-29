import { NextRequest, NextResponse } from "next/server";
import { generateFromGemini } from "@/config/gemini";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const prompt = `Analyze this code and suggest improvements. Detect errors, anti-patterns, or optimizations. Reply in plain English.

${code}`;

  const raw = await generateFromGemini({ prompt });
  const clean = raw.replace(/```json|```/g, "").trim();
  return NextResponse.json({ success: true, feedback: clean });
}
