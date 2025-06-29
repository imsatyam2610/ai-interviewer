import { generateFromGemini } from "@/config/gemini";

const getRandomCount = () => Math.floor(Math.random() * 4) + 5;

export async function generateQuestions(company: string): Promise<string[]> {
  try {
    const count = getRandomCount();

    const prompt = `
You are an AI mock interviewer for the company "${company}", simulating a realistic fresher-level interview.

Structure the flow like this:
1. Greet the candidate.
2. Ask them to briefly introduce themselves.
3. Ask a mix of 5 to 7 beginner-level questions, covering:
   - Computer Science fundamentals (e.g., OOP, DBMS)
   - Data Structures & Algorithms (e.g., arrays, sorting)
   - Basic behavioral/situational questions
4. Do not ask overly complex or senior-level questions.
5. Keep it conversational and formal — like a real human interviewer would sound.

IMPORTANT RULES:
- Do NOT ask the candidate what type of questions to ask.
- Use natural language. Keep each question short, clear, and on a new line.
- Do NOT number the questions or include symbols.
- Do NOT include explanations or answers. Only questions.

Now simulate the beginning of a mock interview at ${company}.
Output only the greeting and the questions, one per line. No JSON, no bullets, no intro text.
`;

    const output = await generateFromGemini({ prompt: prompt });

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

export async function generateDSAProblem(): Promise<any> {
  const prompt = `
Generate a fresh, beginner-friendly DSA problem for a mock interview.
Structure it like this:

{
  "id": "unique-problem-id",
  "title": "Problem Title",
  "difficulty": "Easy",
  "description": "Problem statement here...",
  "examples": [
    {
      "input": "...",
      "output": "...",
      "explanation": "..."
    }
  ],
  "constraints": ["...", "..."],
  "testCases": [
    { "id": 1, "input": "...", "expectedOutput": "..." }
  ],
  "hints": ["...", "..."],
  "codeTemplates": {
    "javascript": "function solution(param1, param2) { // write code }",
    "python": "def solution(param1, param2): # write code",
    "java": "public class Solution { public static int solution(String param1, String param2) { } }",
    "cpp": "#include<iostream>\nusing namespace std;\nint solution(string param1, string param2) { }"
  }
}

Make sure:
- The function is named \`solution\`
- The parameters match the input structure
- Only return pure JSON. No commentary or markdown.
`;

  const raw = await generateFromGemini({ prompt });
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return parsed;
  } catch (e) {
    console.error("Gemini JSON parsing failed:", e);
    return {
      id: "mock-problem",
      title: "Fallback Problem",
      difficulty: "Easy",
      description: "Mock description",
      examples: [],
      constraints: [],
      testCases: [],
      hints: [],
      codeTemplates: {
        javascript: `function solution(input) {\n  // write code here\n}`,
        python: `def solution(input):\n  # write code here\n  pass`,
        java: `public class Solution {\n  public static void main(String[] args) {\n    // write code here\n  }\n}`,
        cpp: `#include<iostream>\nusing namespace std;\nint main() {\n  // write code here\n  return 0;\n}`,
      },
    };
  }
}

export async function generateDSAFeedback({
  code,
  language,
  testResults,
}: {
  code: string;
  language: string;
  testResults: any[];
}) {
  const prompt = `
You are a senior AI interviewer. A candidate submitted the following code in ${language}:

---CODE START---
${code}
---CODE END---

Here are their test results:
${testResults
  .map(
    (t, i) =>
      `Test ${i + 1}: Input: ${t.input}, Expected: ${
        t.expectedOutput
      }, Actual: ${t.actualOutput}, Passed: ${t.passed}`
  )
  .join("\n")}

✅ Please analyze and return the following JSON structure:

{
  "overall": "Overall performance summary (1-2 lines)",
  "strengths": ["List of strengths"],
  "improvements": ["List of improvement areas"],
  "suggestions": ["Specific suggestions to improve"],
  "complexity": {
    "time": "Big-O",
    "space": "Big-O",
    "optimal": true or false
  },
  "performanceMetrics": [
    { "label": "Code Quality", "score": 0-100, "reason": "short explanation", "color": "bg-green-500 | bg-yellow-500 | bg-red-500" },
    { "label": "Algorithm Efficiency", "score": 0-100, "reason": "short explanation", "color": "bg-green-500 | bg-yellow-500 | bg-red-500" },
    { "label": "Problem Solving", "score": 0-100, "reason": "short explanation", "color": "bg-green-500 | bg-yellow-500 | bg-red-500" },
    { "label": "Code Readability", "score": 0-100, "reason": "short explanation", "color": "bg-green-500 | bg-yellow-500 | bg-red-500" }
  ]
}

Color Logic:
- If score >= 80 → bg-green-500
- If 60 <= score < 80 → bg-yellow-500
- If score < 60 → bg-red-500

⚠️ Important:
- Only return valid JSON. No markdown, backticks, or explanations.
- Do NOT skip any fields.
- All scores should be numbers between 0–100.
`;

  const raw = await generateFromGemini({ prompt });

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error("Failed to parse Gemini feedback JSON:", e);
    return {
      overall: "Unable to analyze code at the moment.",
      strengths: [],
      improvements: [],
      suggestions: [],
      complexity: { time: "-", space: "-", optimal: false },
      performanceMetrics: [
        {
          label: "Code Quality",
          score: 70,
          reason: "Static fallback",
          color: "bg-green-500",
        },
        {
          label: "Algorithm Efficiency",
          score: 60,
          reason: "Static fallback",
          color: "bg-green-500",
        },
        {
          label: "Problem Solving",
          score: 75,
          reason: "Static fallback",
          color: "bg-green-500",
        },
        {
          label: "Code Readability",
          score: 80,
          reason: "Static fallback",
          color: "bg-green-500",
        },
      ],
    };
  }
}
