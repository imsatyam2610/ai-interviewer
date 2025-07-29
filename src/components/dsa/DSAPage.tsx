"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Vapi from "@vapi-ai/web";
import DSAHeader from "./Header";
import ProblemPart from "./ProblemPart";
import CodePart from "./CodePart";

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  executionTime?: string;
  memory?: string;
  status?: string;
}

interface DSAProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  testCases: TestCase[];
  hints: string[];
}

interface AIFeedback {
  overall: string;
  correctness: {
    score: number;
    feedback: string;
    issues: string[];
  };
  complexity: {
    time: string;
    space: string;
    optimal: boolean;
    analysis: string;
  };
  edgeCases: {
    handled: string[];
    missed: string[];
    suggestions: string[];
  };
  codeQuality: {
    score: number;
    strengths: string[];
    improvements: string[];
  };
  suggestions: string[];
}

interface DSAPageProps {
  data: any;
}

const DSAPage: React.FC<DSAPageProps> = ({ data }) => {
  const router = useRouter();
  const mockProblem: DSAProblem = data.problem;
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [code, setCode] = useState(data?.codeTemplates.javascript);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [executionOutput, setExecutionOutput] = useState("");
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Voice interaction states
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);

  const vapiClient = useRef<Vapi | null>(null);

  // Initialize Vapi client
  useEffect(() => {
    const publicKey =
      process.env.NEXT_PUBLIC_VAPI_API_KEY || "your-vapi-public-key";
    vapiClient.current = new Vapi(publicKey);

    vapiClient.current.on("call-start", () => {
      setIsVoiceActive(true);
      setIsMicOn(true);
    });

    vapiClient.current.on("call-end", () => {
      setIsVoiceActive(false);
      setIsMicOn(false);
      setIsInterviewerSpeaking(false);
    });

    vapiClient.current.on("speech-start", () => {
      setIsInterviewerSpeaking(false);
    });

    vapiClient.current.on("speech-end", () => {
      setIsInterviewerSpeaking(false);
    });

    vapiClient.current.on("message", (message) => {
      if (message.type === "function-call") {
        setIsInterviewerSpeaking(true);
      }
      if (message.type === "final") {
        setVoiceTranscript((prev) => prev + " " + message.transcript);
      }
    });

    return () => {
      if (vapiClient.current) {
        vapiClient.current.stop();
      }
    };
  }, [router]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Language change effect
  useEffect(() => {
    setCode(
      data?.codeTemplates[selectedLanguage as keyof typeof data.codeTemplates]
    );
  }, [selectedLanguage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const startVoiceInterview = async () => {
    try {
      if (!vapiClient.current) return;

      const assistant = {
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You're a technical interviewer evaluating a candidate for problem-solving skills.

The candidate is working on the ${mockProblem.title} problem. This is the actual question that this interview include ${mockProblem}. Wait for the candidate to explain their brute-force approach.

Then ask:
- What is the time complexity?
- What is the space complexity?

Only if the candidate's explanation is over or inaccurate, give a brief suggestion.

Do not solve the problem or provide the optimal solution unless explicitly asked.              
              `,
            },
          ],
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer",
        },
        firstMessage: !hasAskedQuestion
          ? `Hello! I see you're working on the ${mockProblem.title} problem. Can you walk me through your approach to solving this problem?`
          : "I'm here to help with your coding interview. What would you like to discuss about your solution?",
      };
      //@ts-ignore
      await vapiClient.current.start(assistant);
      setHasAskedQuestion(true);
    } catch (error) {
      console.error("Failed to start voice interview:", error);
    }
  };

  const stopVoiceInterview = async () => {
    try {
      if (vapiClient.current) {
        await vapiClient.current.stop();
      }
    } catch (error) {
      console.error("Failed to stop voice interview:", error);
    }
  };

  const toggleMic = async () => {
    try {
      if (!vapiClient.current || !isVoiceActive) return;

      if (isMicOn) {
        await vapiClient.current.setMuted(true);
        setIsMicOn(false);
      } else {
        await vapiClient.current.setMuted(false);
        setIsMicOn(true);
      }
    } catch (error) {
      console.error("Failed to toggle microphone:", error);
    }
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setExecutionOutput("Executing code...");

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          testCases: mockProblem.testCases,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTestResults(data.results);
        const passedCount = data.results.filter(
          (t: TestCase) => t.passed
        ).length;
        setExecutionOutput(
          `Executed ${data.results.length} test cases. ${passedCount} passed, ${
            data.results.length - passedCount
          } failed.`
        );
      } else {
        setExecutionOutput(`Execution failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Code execution error:", error);
      setExecutionOutput("Failed to execute code. Please try again.");
    } finally {
      setIsExecuting(false);
    }
  };

  const generateAIFeedback = async () => {
    setIsGeneratingFeedback(true);
    try {
      const response = await fetch("/api/dsa-interview/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //@ts-ignore
          interviewId: data.interview_id,
          code,
          language: selectedLanguage,
          timeSpent: 45 * 60 - timeLeft,
          problemDescription: mockProblem.description,
          testResults,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAiFeedback(result.feedback);
      } else {
        console.error("Failed to generate AI feedback:", result.error);
      }
    } catch (error) {
      console.error("AI feedback error:", error);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (testResults.length < 1) {
      alert("Run Code before submitting");
      setIsSubmitting(false);
      return;
    }
    // Generate AI feedback before submitting
    if (testResults.length > 0) {
      await generateAIFeedback();
    }

    setTimeout(() => {
      const results = {
        problemId: mockProblem.id,
        code,
        language: selectedLanguage,
        timeSpent: 45 * 60 - timeLeft,
        testResults,
        aiFeedback,
        score: Math.floor(Math.random() * 40) + 60,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("dsaResults", JSON.stringify(results));
      router.push("/dsa/" + data.interview_id + "/result");
    }, 1500);
  };

  const handleReset = () => {
    setCode(
      data?.codeTemplates[selectedLanguage as keyof typeof data.codeTemplates]
    );
    setTestResults([]);
    setExecutionOutput("");
    setAiFeedback(null);
    setCurrentHint(0);
    setShowHints(false);
    setVoiceTranscript("");
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const showNextHint = () => {
    if (currentHint < mockProblem.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DSAHeader
        mockProblem={mockProblem}
        getDifficultyColor={getDifficultyColor}
        isVoiceActive={isVoiceActive}
        startVoiceInterview={startVoiceInterview}
        toggleMic={toggleMic}
        isMicOn={isMicOn}
        stopVoiceInterview={stopVoiceInterview}
        isInterviewerSpeaking={isInterviewerSpeaking}
        timeLeft={timeLeft}
        formatTime={formatTime}
        isRunning={isRunning}
        startTimer={startTimer}
        pauseTimer={pauseTimer}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <ProblemPart
            mockProblem={mockProblem}
            showHints={showHints}
            setShowHints={setShowHints}
            currentHint={currentHint}
            voiceTranscript={voiceTranscript}
            showNextHint={showNextHint}
          />

          {/* Code Editor and Results */}
          <CodePart
            testResults={testResults}
            executionOutput={executionOutput}
            isExecuting={isExecuting}
            setCode={setCode}
            setSelectedLanguage={setSelectedLanguage}
            code={code}
            selectedLanguage={selectedLanguage}
            handleReset={handleReset}
            handleRunCode={handleRunCode}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
};
export default DSAPage;
