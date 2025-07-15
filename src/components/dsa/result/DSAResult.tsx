import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import ScoreOverview from "./ScoreOverview";
import DSAResultHeader from "./Header";
import DSAResultMain from "./MainContent";
import DSAResultSidebar from "./Sidebar";
import { useRouter } from "next/navigation";

interface TestResult {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

interface DSAResults {
  problemId: string;
  code: string;
  language: string;
  timeSpent: number;
  testResults: TestResult[];
  score: number;
  timestamp: string;
}

interface Feedback {
  overall: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  complexity: {
    time: string;
    space: string;
    optimal: boolean;
  };
}

const similarProblems = [
  { title: "Three Sum", difficulty: "Medium", category: "Array" },
  { title: "Two Sum II", difficulty: "Easy", category: "Array" },
  { title: "Four Sum", difficulty: "Medium", category: "Array" },
  { title: "Valid Palindrome", difficulty: "Easy", category: "Two Pointers" },
];

interface FeedbackPageProps {
  data: any;
}
export default function DSAResultPage({ data }: FeedbackPageProps) {
  const router = useRouter();
  const mockFeedback: Feedback = data?.feedback;
  const performanceMetrics = data.performanceMetrics || [];
  const [results, setResults] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);

  useEffect(() => {
    // Load results from localStorage
    const storedResults = data.score;
    if (storedResults) {
      setResults(true);
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-4">
              Complete a DSA challenge to see your results here.
            </p>
            <Link href="/dsa">
              <Button>Start DSA Challenge</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const passedTests = data.testResults.filter((t: any) => t.passed).length;
  const totalTests = data.testResults.length;

  const handleInterviewStart = async () => {
    try {
      const res = await fetch("/api/dsa-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data?.interviewId) {
        router.push(`/dsa/${data.interviewId}`);
      } else {
        alert("Failed to create interview session.");
      }
    } catch (error) {
      console.error("Failed to start DSA Interview:", error);
    }
  };

  const handleDownload = () => {
    const content = `📊 DSA Interview Result\nProblem: ${
      data.problem.title
    }\nScore: ${data.score}%\nTime Taken: ${formatTime(
      data.timeSpent
    )}\nThanks for using AI Interviewer!`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${data.problem.title}-result.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DSAResultHeader
        mockProblem={data.problem.title}
        handleDownload={handleDownload}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Overview */}
        <ScoreOverview
          getScoreColor={getScoreColor}
          formatTime={formatTime}
          results={data}
          getScoreBadgeColor={getScoreBadgeColor}
          passedTests={passedTests}
          totalTests={totalTests}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <DSAResultMain
            data={data}
            performanceMetrics={performanceMetrics}
            showCode={showCode}
            setShowCode={setShowCode}
            mockFeedback={mockFeedback}
          />
          {/* Sidebar */}
          <DSAResultSidebar
            showFeedback={showFeedback}
            mockFeedback={mockFeedback}
            setShowFeedback={setShowFeedback}
            handleInterviewStart={handleInterviewStart}
          />
        </div>
      </div>
    </div>
  );
}
