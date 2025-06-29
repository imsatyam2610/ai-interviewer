import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { dsaInterviewTable, voiceInterviewTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const voiceinterviews = await db
    .select()
    .from(voiceInterviewTable)
    .where(eq(voiceInterviewTable.createdBy, email));

  const dsainterviews = await db
    .select()
    .from(dsaInterviewTable)
    .where(eq(dsaInterviewTable.createdBy, email));

  const totalVoiceInterviews = voiceinterviews.length;
  const totalDSAInterviews = dsainterviews.length;
  const totalInterviews = Math.round(totalVoiceInterviews + totalDSAInterviews);

  const averageScore = Math.round(
    dsainterviews.reduce((sum, i) => sum + (parseInt(i.score || "0") || 0), 0) /
      (totalInterviews || 1)
  );
  const bestCategory = "DSA Interview"; // hardcoded unless you track types
  const streak = 3; // optional logic, e.g. interviews in last X days

  return NextResponse.json({
    totalInterviews,
    averageScore,
    bestCategory,
    streak,
  });
}
