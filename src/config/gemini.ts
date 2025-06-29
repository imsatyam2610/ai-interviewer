import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

/**
 * Generates content from Gemini API using contentStream
 * @param prompt - The prompt to send to Gemini
 * @returns The final response text
 */
export async function generateFromGemini({
  prompt,
}: {
  prompt: string;
}): Promise<string> {
  try {
    const model = "gemini-2.0-flash";
    const result = await ai.models.generateContentStream({
      model,
      config: {
        responseMimeType: "text/plain",
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let output = "";
    for await (const chunk of result) {
      output += chunk.text;
    }

    return output.trim();
  } catch (err) {
    console.error("Gemini Error:", err);
    return "";
  }
}
