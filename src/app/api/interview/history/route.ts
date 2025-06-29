import { db } from "@/config/db";
import { dsaInterviewTable, voiceInterviewTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const offset = (page - 1) * limit;

  // Fetch voice interviews
  const voice = await db
    .select()
    .from(voiceInterviewTable)
    .where(eq(voiceInterviewTable.createdBy, email));

  // Fetch DSA interviews
  const dsa = await db
    .select()
    .from(dsaInterviewTable)
    .where(eq(dsaInterviewTable.createdBy, email));

  const combined = [
    ...voice.map((v) => ({
      id: v.company + " Interview",
      type: "Voice Interview",
      score: parseInt("0"),
      date: new Date(v.createdAt).toISOString(),
      duration: 180, // You can store real values if needed
    })),
    ...dsa.map((d) => ({
      //@ts-ignore
      id: d.problem?.title || "DSA Interview",
      type: "DSA Interview",
      score: parseInt(d.score || "0"),
      date: new Date(d.timestamp || d.createdAt).toISOString(),
      duration: d.timeSpent,
    })),
  ];

  // Sort by date desc
  combined.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const total = combined.length;
  const paginated = combined.slice(offset, offset + limit);
  const totalPages = Math.ceil(total / limit);
  return NextResponse.json({
    data: paginated,
    total,
    page,
    totalPages,
  });
}
