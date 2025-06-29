import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Code, Target, TrendingUp, XCircle } from "lucide-react";
interface FeedbackPageProps {
  data: any;
  performanceMetrics: any;
  showCode: boolean;
  setShowCode: any;
  mockFeedback: any;
}
export default function DSAResultMain({
  data,
  performanceMetrics,
  showCode,
  setShowCode,
  mockFeedback,
}: FeedbackPageProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Performance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics.map((metric: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {metric.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {metric.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${metric.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Case Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.testResults.map((testCase: any) => (
              <div
                key={testCase.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm">
                    Test Case {testCase.id}
                  </span>
                  <div className="flex items-center gap-2">
                    {testCase.passed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        testCase.passed ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {testCase.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Input:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                      {testCase.input}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Expected:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                      {testCase.expectedOutput}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">
                      Your Output:
                    </span>
                    <code
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        testCase.passed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {testCase.actualOutput}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Your Solution
            </div>
            <Button
              onClick={() => setShowCode(!showCode)}
              variant="outline"
              size="sm"
            >
              {showCode ? "Hide" : "Show"} Code
            </Button>
          </CardTitle>
        </CardHeader>
        {showCode && (
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {data.code}
              </pre>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Complexity Analysis
                </span>
              </div>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Time Complexity:</strong>{" "}
                  {mockFeedback.complexity.time}
                </p>
                <p>
                  <strong>Space Complexity:</strong>{" "}
                  {mockFeedback.complexity.space}
                </p>
                <p>
                  <strong>Optimal:</strong>{" "}
                  {mockFeedback.complexity.optimal ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
