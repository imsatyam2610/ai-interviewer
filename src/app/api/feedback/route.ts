import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { voiceInterviewTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { interviewId, questionId, questionText, answer } = body;

    if (!interviewId || !questionId || !questionText || !answer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch current answers
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

    const currentAnswers = existing[0].answers || [];

    const newAnswer = {
      questionId,
      questionText,
      answer,
      timestamp: new Date().toISOString(),
    };
    //@ts-ignore
    const updatedAnswers = [...currentAnswers, newAnswer];

    await db
      .update(voiceInterviewTable)
      .set({ answers: updatedAnswers })
      .where(eq(voiceInterviewTable.interview_id, interviewId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving feedback:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
