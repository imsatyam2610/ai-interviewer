import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { dsaInterviewTable } from "@/config/schema";
import { generateDSAProblem } from "@/lib/generateVoiceQues";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const problem = await generateDSAProblem(); // 🧠 from Gemini
    const interviewId = uuidv4();

    const { codeTemplates, ...rest } = problem;
    await db.insert(dsaInterviewTable).values({
      interview_id: interviewId,
      createdBy: user.primaryEmailAddress.emailAddress,
      problem: rest,
      codeTemplates,
    });

    return NextResponse.json({ interviewId });
  } catch (e: any) {
    console.error("Error creating DSA interview:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  const result = await db
    .select()
    .from(dsaInterviewTable)
    //@ts-ignore
    .where(eq(dsaInterviewTable.interview_id, sessionId));

  if (!result) {
    return NextResponse.json({ error: "No record found" }, { status: 404 });
  }
  return NextResponse.json(result[0]);
}
