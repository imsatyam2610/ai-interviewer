import { NextRequest, NextResponse } from "next/server";

interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

const LANGUAGE_MAP: { [key: string]: number } = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  csharp: 51,
  go: 60,
  rust: 73,
};

const JUDGE0_API_URL =
  process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "your-rapidapi-key";

function wrapCode(
  userCode: string,
  testInput: any,
  language: string,
  functionName = "solution"
): string {
  const lang = language.toLowerCase();
  let inputStr = "";

  if (typeof testInput === "object") {
    inputStr = JSON.stringify(testInput);
  } else {
    inputStr = JSON.stringify(String(testInput));
  }

  // JavaScript (Node.js)
  if (lang === "javascript") {
    return `${userCode}
    
console.log(${functionName}(${inputStr}));
`;
  }

  // Python
  if (lang === "python") {
    return `${userCode}

print(${functionName}(${inputStr}))
`;
  }

  // C++
  if (lang === "cpp") {
    return `
#include <iostream>
#include <string>
using namespace std;

${userCode}

int main() {
    string input = ${JSON.stringify(testInput)};
    cout << ${functionName}(input) << endl;
    return 0;
}
`;
  }

  // Java
  if (lang === "java") {
    return `
import java.util.*;

public class Main {
    public static int ${functionName}(String str) {
        ${userCode}
    }

    public static void main(String[] args) {
        System.out.println(${functionName}(${JSON.stringify(testInput)}));
    }
}
`;
  }

  return userCode;
}

function normalizeOutput(output: string): any {
  try {
    // Try parsing JavaScript object syntax to JSON format
    const jsonLike = output
      .replace(/([a-zA-Z0-9_]+):/g, '"$1":') // unquoted keys to quoted
      .replace(/'/g, '"'); // single quotes to double

    return JSON.parse(jsonLike);
  } catch {
    return output.trim().replace(/\s+/g, "");
  }
}

function compareOutputs(expected: string, actual: string): boolean {
  try {
    const expectedNorm = normalizeOutput(expected);
    const actualNorm = normalizeOutput(actual);

    if (typeof expectedNorm === "object" && typeof actualNorm === "object") {
      return JSON.stringify(expectedNorm) === JSON.stringify(actualNorm);
    }

    return expectedNorm === actualNorm;
  } catch {
    return (
      expected?.toString().trim().replace(/\s+/g, "") ===
      actual?.toString().trim().replace(/\s+/g, "")
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, testCases } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    const languageId = LANGUAGE_MAP[language.toLowerCase()];
    if (!languageId) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    const results = [];

    for (const testCase of testCases || []) {
      try {
        const wrappedCode = wrapCode(code, testCase.input, language);

        const submission: Judge0Submission = {
          source_code: wrappedCode,
          language_id: languageId,
        };

        const response = await fetch(
          `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Key": JUDGE0_API_KEY,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            body: JSON.stringify(submission),
          }
        );

        const result: Judge0Result = await response.json();
        const rawOutput =
          result.stdout?.trim() ||
          result.stderr?.trim() ||
          result.compile_output?.trim() ||
          "No output";

        let passed = false;
        if (result.status.id === 3) {
          passed = compareOutputs(testCase.expectedOutput, rawOutput);
        }

        results.push({
          id: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: rawOutput,
          passed,
          executionTime: result.time + "s",
          memory: result.memory + "KB",
          status: result.status.description,
          compileOutput: result.compile_output,
        });
      } catch (err) {
        console.error("Test case execution error:", err);
        results.push({
          id: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: "Execution Error",
          passed: false,
          executionTime: "0s",
          memory: "0KB",
          status: "Runtime Error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      language,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Handler error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to execute code" },
      { status: 500 }
    );
  }
}
