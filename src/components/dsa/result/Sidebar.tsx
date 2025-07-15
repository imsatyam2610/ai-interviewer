import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Home,
  Lightbulb,
  RotateCcw,
  Star,
} from "lucide-react";
import Link from "next/link";

interface FeedbackPageProps {
  showFeedback: boolean;
  mockFeedback: any;
  setShowFeedback: any;
  handleInterviewStart: () => void;
}
export default function DSAResultSidebar({
  showFeedback,
  mockFeedback,
  setShowFeedback,
  handleInterviewStart,
}: FeedbackPageProps) {
  return (
    <div className="space-y-6">
      {/* AI Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Feedback
            </div>
            <Button
              onClick={() => setShowFeedback(!showFeedback)}
              variant="ghost"
              size="sm"
            >
              {showFeedback ? "Hide" : "Show"}
            </Button>
          </CardTitle>
        </CardHeader>
        {showFeedback && (
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">{mockFeedback.overall}</p>
              </div>

              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {mockFeedback.strengths.map(
                    (strength: any, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-yellow-700 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {mockFeedback.improvements.map(
                    (improvement: any, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                        {improvement}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Study Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mockFeedback.suggestions.map((suggestion: any, index: number) => (
              <li
                key={index}
                className="text-sm text-gray-700 flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Similar Problems */}
      {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Similar Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {similarProblems.map((problem, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{problem.title}</p>
                          <p className="text-xs text-gray-500">
                            {problem.category}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {problem.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full cursor-pointer"
            variant="outline"
            onClick={handleInterviewStart}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Another Problem
          </Button>
          <Link href="/dashboard">
            <Button className="w-full mt-4">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
