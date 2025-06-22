import { db } from "@/config/db";
import { usersTable, voiceInterviewTable } from "@/config/schema";
import { generateQuestions } from "@/lib/generateVoiceQues";
import { currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json();
    const user = await currentUser();

    if (!company) {
      return NextResponse.json({ error: "Missing company" }, { status: 400 });
    }

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));
    //@ts-ignore
    if (!dbUser || dbUser.credits > 0) {
      await db
        .update(usersTable)
        .set({ credits: sql`${usersTable.credits} - 1` })
        .where(eq(usersTable.email, userEmail));
    }
    const sessionId = uuidv4();
    const questions = await generateQuestions(company);

    const result = await db
      .insert(voiceInterviewTable)
      .values({
        interview_id: sessionId,
        createdBy: user.primaryEmailAddress.emailAddress,
        company,
        questions,
      })
      .returning();

    return NextResponse.json({ sessionId });
  } catch (e: any) {
    console.error("Interview creation failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  const result = await db
    .select()
    .from(voiceInterviewTable)
    //@ts-ignore
    .where(eq(voiceInterviewTable.interview_id, sessionId));

  if (!result) {
    return NextResponse.json({ error: "No record found" }, { status: 404 });
  }
  return NextResponse.json(result[0]);
}
