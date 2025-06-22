import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

export default async function getCompanyIntro(
  company: string
): Promise<string> {
  try {
    const prompt = `Generate a short, engaging, and professional welcome message for a mock interview at ${company}. Describe intro about Company ${company}.
Mention what kind of questions the candidate might expect, such as coding, system design, leadership principles, etc. 
Keep it concise and friendly in 2-3 sentences.`;

    const model = "gemini-2.0-flash";

    const result = await ai.models.generateContentStream({
      model,
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

    return output.trim() || `Welcome to your mock interview at ${company}.`;
  } catch (error) {
    console.error("Gemini API error:", error);
    return `Welcome to your mock interview at ${company}.`;
  }
}

// export default async function getCompanyIntro(
//   company: string
// ): Promise<string> {
//   const prompt = `Give a short, engaging, and professional welcome message for a mock interview with ${company}. Include what kind of questions a candidate can expect in one paragraph.`;

//   try {
//     const response = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "deepseek/deepseek-chat-v3-0324:free",
//           messages: [
//             {
//               role: "system",
//               content:
//                 "You are a helpful assistant specialized in mock interview preparation.",
//             },
//             { role: "user", content: prompt },
//           ],
//           temperature: 0.7,
//         }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("OpenRouter error:", data);
//       return `Welcome to your mock interview with ${company}.`;
//     }

//     return (
//       data.choices?.[0]?.message?.content?.trim() ||
//       `Welcome to your mock interview with ${company}.`
//     );
//   } catch (err) {
//     console.error("Fetch error:", err);
//     return `Welcome to your mock interview with ${company}.`;
//   }
// }
