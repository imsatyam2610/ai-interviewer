import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { voiceInterviewTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { generateFromGemini } from "@/config/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { interviewId, conversationLog } = body;

    if (!interviewId || !conversationLog) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(voiceInterviewTable)
      .where(eq(voiceInterviewTable.interview_id, interviewId));

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const prompt = `${conversationLog}

Based on this mock interview conversation between interviewer (assistant) and candidate (user), provide feedback in the following structured JSON format:

{
  "feedback": {
    "rating": {
      "technicalSkills": 0-10,
      "communication": 0-10,
      "problemSolving": 0-10,
      "experience": 0-10
    }
  },
  "summary": "<3 lines summary>",
  "recommendation": "Yes/No",
  "recommendationMsg": "<1 line message>"
}

Only return valid JSON — no explanations, no extra text.
`;

    const raw = await generateFromGemini({ prompt });
    const clean = raw.replace(/```json|```/g, "").trim();
    console.log("raw", raw);
    console.log("clean", clean)
    let feedback;
    try {
      feedback = JSON.parse(clean);
    } catch (e) {
      console.error("❌ JSON parse error:", e);
      return NextResponse.json(
        { error: "Invalid response format from Gemini", raw },
        { status: 500 }
      );
    }
console.log("feedback", feedback)
    await db
      .update(voiceInterviewTable)
      .set({ answers: feedback })
      .where(eq(voiceInterviewTable.interview_id, interviewId));

    return NextResponse.json({ success: true, feedback });
  } catch (err) {
    console.error("❌ Error saving feedback:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
