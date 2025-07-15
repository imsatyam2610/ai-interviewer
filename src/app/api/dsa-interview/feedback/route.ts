import { db } from "@/config/db";
import { dsaInterviewTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { generateDSAFeedback } from "@/lib/generateVoiceQues"; // 👈 Gemini-based helper
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { interviewId, code, language, timeSpent, testResults } = body;
    console.log("code", code);
    const feedback = await generateDSAFeedback({
      code,
      language,
      testResults,
    });

    const { performanceMetrics, ...rest } = feedback;

    // Optional: average score
    const score =
      performanceMetrics.reduce((sum: number, m: any) => sum + m.score, 0) /
      performanceMetrics.length;

    // Save
    await db
      .update(dsaInterviewTable)
      .set({
        code,
        language,
        timeSpent: timeSpent.toString(),
        testResults,
        feedback: rest,
        score: Math.round(score).toString(),
        performanceMetrics,
        timestamp: new Date(),
      })
      .where(eq(dsaInterviewTable.interview_id, interviewId));

    return NextResponse.json({ success: true, feedback });
  } catch (e: any) {
    console.error("Feedback generation failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
