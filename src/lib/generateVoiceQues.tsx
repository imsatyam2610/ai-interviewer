import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

// Random count between 5 to 8
const getRandomCount = () => Math.floor(Math.random() * 4) + 5;

export async function generateQuestions(company: string): Promise<string[]> {
  try {
    const count = getRandomCount();

    const prompt = `
You are an expert HR interviewer bot. 
Generate ${count} interview questions for a candidate applying to "${company}". 
Mix the types of questions: behavioral, technical, and situational.
The goal is to simulate a real interview experience.

Rules:
- Keep the questions concise and professional.
- Avoid numbering or extra symbols.
- Return only the questions as plain text, one per line.

Example:
Tell me about yourself.
How do you manage conflicts in a team?
What is the difference between async and defer in JavaScript?
`;

    const result = await ai.models.generateContentStream({
      model: "gemini-1.5-flash",
      config: {
        responseMimeType: "text/plain",
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    let output = "";
    for await (const chunk of result) {
      output += chunk.text;
    }

    const questions = output
      .trim()
      .split("\n")
      .filter((q) => q.trim() !== "")
      .map((q) => q.replace(/^[-•\d.]+\s*/, "").trim());

    return questions.length > 0
      ? questions
      : [`Welcome to your mock interview at ${company}. Let's get started!`];
  } catch (error) {
    console.error("Gemini API error:", error);
    return [`Welcome to your mock interview at ${company}. Let's get started!`];
  }
}
